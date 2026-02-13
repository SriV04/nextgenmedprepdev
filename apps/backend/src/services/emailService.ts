import nodemailer from 'nodemailer';
import { EmailTemplate } from '@nextgenmedprep/common-types';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

interface EmailLog {
  id?: string;
  recipient: string;
  subject: string;
  email_type: string;
  status: 'sent' | 'failed' | 'pending' | 'bounced';
  message_id?: string;
  response?: string;
  error_message?: string;
  sent_at?: string;
  recipient_domain?: string;
  created_at?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private supabase;

  constructor() {
    const port = parseInt(process.env.EMAIL_PORT || '587');
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || '',
      port: port,
      secure: port === 465,  // SSL for port 465 or 587 
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
      // additional options for better compatibility
      requireTLS: port !== 465,
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates (adjust for production)
      },
      // Request delivery status notifications
      dsn: {
        id: process.env.EMAIL_USER || 'no-reply@nextgenmedprep.com',
        return: 'headers',
        notify: ['failure', 'delay'],
        recipient: process.env.EMAIL_USER || process.env.EMAIL_FROM
      }
    } as nodemailer.TransportOptions);

    // Initialize Supabase client for logging
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_KEY || ''
    );

    // Setup event listeners for email transporter
    this.setupTransporterEvents();
  }

  private setupTransporterEvents(): void {
    // This will be called for each email sent
    this.transporter.on('idle', () => {
      console.log('Email transporter is idle and ready to send emails');
    });
  }

  private async logEmailDelivery(log: EmailLog): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('email_logs')
        .insert({
          recipient: log.recipient,
          subject: log.subject,
          email_type: log.email_type,
          status: log.status,
          message_id: log.message_id,
          response: log.response,
          error_message: log.error_message,
          sent_at: log.sent_at || new Date().toISOString(),
          recipient_domain: log.recipient_domain || log.recipient.split('@')[1],
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log email delivery:', error);
      }
    } catch (error) {
      console.error('Error logging email to database:', error);
    }
  }

  private extractDomain(email: string): string {
    return email.split('@')[1] || 'unknown';
  }

  private async sendMailWithTracking(
    mailOptions: nodemailer.SendMailOptions,
    emailType: string
  ): Promise<void> {
    let recipient = 'unknown';
    if (typeof mailOptions.to === 'string') {
      recipient = mailOptions.to;
    } else if (Array.isArray(mailOptions.to) && mailOptions.to.length > 0) {
      const firstRecipient = mailOptions.to[0];
      recipient = typeof firstRecipient === 'string' ? firstRecipient : (firstRecipient as any).address || 'unknown';
    }
    const recipientDomain = this.extractDomain(recipient);
    
    console.log(`📧 Attempting to send ${emailType} email to: ${recipient} (${recipientDomain})`);
    
    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log(`✅ Email sent successfully to ${recipient}`);
      console.log(`📨 Message ID: ${info.messageId}`);
      console.log(`📬 Response: ${info.response}`);
      console.log(`✉️ Accepted: ${info.accepted?.join(', ') || 'N/A'}`);
      console.log(`⚠️ Rejected: ${info.rejected?.join(', ') || 'None'}`);
      
      // Check if email was rejected
      if (info.rejected && info.rejected.length > 0) {
        await this.logEmailDelivery({
          recipient,
          subject: mailOptions.subject || 'No subject',
          email_type: emailType,
          status: 'failed',
          message_id: info.messageId,
          response: `Rejected by server: ${info.rejected.join(', ')}`,
          error_message: 'Email rejected by recipient server',
          recipient_domain: recipientDomain
        });
      } else {
        await this.logEmailDelivery({
          recipient,
          subject: mailOptions.subject || 'No subject',
          email_type: emailType,
          status: 'sent',
          message_id: info.messageId,
          response: info.response,
          recipient_domain: recipientDomain
        });
      }
    } catch (error: any) {
      console.error(`❌ Failed to send ${emailType} email to ${recipient}:`, error);
      console.error(`🔍 Error details:`, {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      });
      
      await this.logEmailDelivery({
        recipient,
        subject: mailOptions.subject || 'No subject',
        email_type: emailType,
        status: 'failed',
        error_message: error.message,
        response: error.response || error.code,
        recipient_domain: recipientDomain
      });
      
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, subscriptionTier: string): Promise<void> {
    const template = this.getWelcomeEmailTemplate(subscriptionTier);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'welcome');
  }

  async sendNewsletterEmail(
    emails: string[], 
    subject: string, 
    content: string, 
    attachments?: Array<{ filename: string; path?: string; content?: Buffer | string; contentType?: string }>
  ): Promise<void> {
    const mailOptions: any = {
      from: process.env.EMAIL_FROM,
      bcc: emails, // Use BCC to hide other recipients
      subject: subject,
      html: this.getNewsletterTemplate(content),
    };

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    await this.sendMailWithTracking(mailOptions, 'newsletter');
  }

  async sendUnsubscribeConfirmation(email: string): Promise<void> {
    const template = this.getUnsubscribeTemplate();
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'unsubscribe_confirmation');
  }

  async sendSubscriptionUpgradeEmail(email: string, newTier: string): Promise<void> {
    const template = this.getUpgradeEmailTemplate(newTier);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'subscription_upgrade');
  }

  async sendNewJoinerConfirmationEmail(email: string, fullName: string): Promise<void> {
    const template = this.getNewJoinerConfirmationTemplate(fullName);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'new_joiner_confirmation');
  }

  async sendUcatConferenceConfirmationEmail(email: string): Promise<void> {
    const template = this.getUcatConferenceConfirmationTemplate();
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'ucat_conference_signup');
  }

  async sendNewJoinerNotificationEmail(newJoiner: any): Promise<void> {
    const template = this.getNewJoinerNotificationTemplate(newJoiner);
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'new_joiner_notification');
  }

  async sendBookingConfirmationEmail(
    email: string, 
    bookingDetails: {
      id: string;
      packageType: string;
      serviceType: string;
      universities: string[];
      amount: number;
      startTime?: string;
      preferredDate?: string;
      userName?: string;
    }
  ): Promise<void> {
    const template = this.getBookingConfirmationTemplate(bookingDetails);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'booking_confirmation');
  }

  async sendUCATConfirmationEmail(
    email: string, 
    ucatDetails: {
      id: string;
      packageId: string;
      packageName: string;
      amount: number;
      userName?: string;
    }
  ): Promise<void> {
    const template = this.getUCATConfirmationTemplate(ucatDetails);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'ucat_confirmation');
  }

  private getWelcomeEmailTemplate(subscriptionTier: string): EmailTemplate {
    const tierBenefits = {
      free: 'access to our basic study materials and weekly tips',
      newsletter_only: 'weekly newsletters with the latest medical school insights',
      premium_basic: 'premium study materials, mock interviews, and priority support',
      premium_plus: 'all premium features plus 1-on-1 tutoring sessions and unlimited practice tests'
    };

    const benefits = tierBenefits[subscriptionTier as keyof typeof tierBenefits] || 'access to our resources';

    return {
      subject: 'Welcome to NextGen MedPrep! 🎉',
      text: `Welcome to NextGen MedPrep!\n\nThank you for subscribing to our ${subscriptionTier} plan. You now have ${benefits}.\n\nWe're excited to help you on your medical school journey!\n\nBest regards,\nThe NextGen MedPrep Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to NextGen MedPrep! 🎉</h1>
          <p>Thank you for subscribing to our <strong>${subscriptionTier}</strong> plan.</p>
          <p>You now have ${benefits}.</p>
          <p>We're excited to help you on your medical school journey!</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What's next?</h3>
            <ul>
              <li>Explore our resource library</li>
              <li>Join our community discussions</li>
              <li>Check out our study guides</li>
            </ul>
          </div>
          <p>Best regards,<br>The NextGen MedPrep Team</p>
        </div>
      `
    };
  }

  private getUnsubscribeTemplate(): EmailTemplate {
    return {
      subject: 'You\'ve been unsubscribed from NextGen MedPrep',
      text: 'You have been successfully unsubscribed from all NextGen MedPrep communications.\n\nIf this was a mistake, you can resubscribe at any time by visiting our website.\n\nWe\'re sorry to see you go!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Unsubscribed Successfully</h1>
          <p>You have been successfully unsubscribed from all NextGen MedPrep communications.</p>
          <p>If this was a mistake, you can resubscribe at any time by visiting our website.</p>
          <p>We're sorry to see you go!</p>
        </div>
      `
    };
  }

  private getUpgradeEmailTemplate(newTier: string): EmailTemplate {
    return {
      subject: `Welcome to ${newTier} - Your NextGen MedPrep upgrade is complete!`,
      text: `Congratulations! Your subscription has been upgraded to ${newTier}.\n\nYou now have access to enhanced features and premium content.\n\nThank you for choosing NextGen MedPrep!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669;">Upgrade Complete! 🚀</h1>
          <p>Congratulations! Your subscription has been upgraded to <strong>${newTier}</strong>.</p>
          <p>You now have access to enhanced features and premium content.</p>
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your new benefits include:</h3>
            <ul>
              <li>Advanced study materials</li>
              <li>Priority customer support</li>
              <li>Exclusive webinars and content</li>
            </ul>
          </div>
          <p>Thank you for choosing NextGen MedPrep!</p>
        </div>
      `
    };
  }

  private getNewsletterTemplate(content: string): string {
    return `${content}`;
  }

  private getNewJoinerConfirmationTemplate(fullName: string): EmailTemplate {
    return {
      subject: 'Application Received - NextGen MedPrep Tutor Program',
      text: `Hi ${fullName},\n\nThank you for your interest in joining the NextGen MedPrep tutoring team!\n\nWe have successfully received your application and our team will review it within the next 5-7 business days.\n\nWhat happens next:\n1. Our team will review your application\n2. If shortlisted, we'll contact you for an interview\n3. Upon successful completion, you'll be onboarded as a tutor\n\nWe appreciate your interest in helping future medical and dental students achieve their dreams.\n\nBest regards,\nThe NextGen MedPrep Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Application Received! 📋</h1>
          <p>Hi ${fullName},</p>
          <p>Thank you for your interest in joining the <strong>NextGen MedPrep tutoring team</strong>!</p>
          <p>We have successfully received your application and our team will review it within the next <strong>5-7 business days</strong>.</p>
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #1e40af;">What happens next:</h3>
            <ol style="color: #374151;">
              <li>Our team will review your application</li>
              <li>If shortlisted, we'll contact you for an interview</li>
              <li>Upon successful completion, you'll be onboarded as a tutor</li>
            </ol>
          </div>
          <p>We appreciate your interest in helping future medical and dental students achieve their dreams.</p>
          <p style="margin-top: 30px;">Best regards,<br><strong>The NextGen MedPrep Team</strong></p>
        </div>
      `
    };
  }

  private getUcatConferenceConfirmationTemplate(): EmailTemplate {
    return {
      subject: '✨ You\'re Registered for the Free UCAT Introduction Conference - 8th March!',
      text: `Thank you for signing up!\n\nWe're excited to have you join us for the Free Introduction to UCAT conference.\n\nConference Details:\n📅 Date: 8th March 2026\nDetails coming soon! We'll send you the conference link and login information shortly.\n\nWhat to expect:\n- Expert-led introduction to UCAT format and structure\n- Proven timing strategies for each section\n- Core problem-solving techniques\n- Q&A session with top scorers\n- Comprehensive study resources\n\n🎁 BONUS: You'll receive a £10 UCAT Package Voucher after attendance!\n\nKeep an eye on your inbox for the full conference details. If you have any questions, feel free to reach out to us.\n\nBest of luck with your UCAT preparation!\n\nBest regards,\nThe NextGen MedPrep Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #374151;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">✨ Registration Confirmed!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">You're all set for the Free UCAT Introduction Conference</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for signing up! We're thrilled to have you join us for the <strong>Free Introduction to UCAT</strong> conference.
            </p>

            <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #059669; font-size: 18px;">📅 Conference Date</h3>
              <p style="margin: 10px 0; line-height: 1.6; font-size: 18px; color: #059669;">
                <strong>8th March 2026</strong>
              </p>
              <p style="margin: 10px 0; line-height: 1.6;">
                <strong style="color: #059669;">Details coming soon!</strong> We'll send you the conference link and login information shortly. Keep an eye on your inbox.
              </p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="margin-top: 0; color: #1f2937; font-size: 18px;">🎓 What to Expect:</h3>
              <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
                <li>Expert-led introduction to UCAT format and structure</li>
                <li>Proven timing strategies for each section</li>
                <li>Core problem-solving techniques</li>
                <li>Q&A session with top scorers</li>
              </ul>
            </div>

            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #d97706; margin: 20px 0; border: 2px solid #d97706;">
              <p style="margin: 0; font-size: 16px; color: #92400e;">
                🎁 <strong style="color: #b45309; font-size: 18px;">BONUS: £10 UCAT Package Voucher Included!</strong>
              </p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #92400e;">
                You'll receive this voucher after attending the conference. It's our way of thanking you for joining us!
              </p>
            </div>

            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #166534;">
                💡 <strong>Tip:</strong> If you have any questions, feel free to reach out to us. We're here to help!
              </p>
            </div>

            <p style="text-align: center; margin: 30px 0 0 0; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              Best of luck with your UCAT preparation!<br>
              <strong style="color: #059669;">The NextGen MedPrep Team</strong>
            </p>
          </div>
        </div>
      `
    };
  }

  private getNewJoinerNotificationTemplate(newJoiner: any): EmailTemplate {
    const subjectsStr = Array.isArray(newJoiner.subjects_can_tutor) ? newJoiner.subjects_can_tutor.join(', ') : 'N/A';
    const availabilityStr = Array.isArray(newJoiner.availability) ? newJoiner.availability.join(', ') : 'N/A';

    return {
      subject: `New Tutor Application: ${newJoiner.full_name}`,
      text: `New tutor application received!\n\nApplicant Details:\nName: ${newJoiner.full_name}\nEmail: ${newJoiner.email}\nPhone: ${newJoiner.phone_number || 'Not provided'}\nUniversity Year: ${newJoiner.university_year}\nSubjects: ${subjectsStr}\nAvailability: ${availabilityStr}\n\nPlease review the full application in the tutor dashboard.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">New Tutor Application Received! 🎓</h1>
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0;">Applicant Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${newJoiner.full_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${newJoiner.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Phone:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${newJoiner.phone_number || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">University Year:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${newJoiner.university_year}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Subjects:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${subjectsStr}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Availability:</td>
                <td style="padding: 8px;">${availabilityStr}</td>
              </tr>
            </table>
          </div>
          <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">Action Required:</p>
            <p style="margin: 5px 0 0 0;">Please review the full application in the tutor dashboard and contact the applicant for next steps.</p>
          </div>
          <p>Application ID: ${newJoiner.id}</p>
        </div>
      `
    };
  }

  private getBookingConfirmationTemplate(bookingDetails: {
    id: string;
    packageType: string;
    serviceType: string;
    universities: string[];
    amount: number;
    startTime?: string;
    preferredDate?: string;
    userName?: string;
  }): EmailTemplate {
    const universitiesStr = bookingDetails.universities.join(', ');
    const serviceTypeLabel = bookingDetails.serviceType === 'generated' ? 'AI-Generated Mock Questions' : 'Live Tutor Session';
    const packageTypeLabel = bookingDetails.packageType;
    const userName = bookingDetails.userName || 'there';
    
    return {
      subject: 'Interview Preparation Booking Confirmed - NextGen MedPrep',
      text: `Hi ${userName},\n\nYour interview preparation booking has been confirmed!\n\nBooking Details:\nBooking ID: ${bookingDetails.id}\nPackage: ${packageTypeLabel}\nService: ${serviceTypeLabel}\nUniversities: ${universitiesStr}\nAmount: £${bookingDetails.amount}\n\nWe'll be in touch within 24 hours to schedule your session${bookingDetails.preferredDate ? ` (preferred date: ${bookingDetails.preferredDate})` : ''}.\n\nThank you for choosing NextGen MedPrep!\n\nBest regards,\nThe NextGen MedPrep Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Booking Confirmed! 🎉</h1>
          <p>Hi ${userName},</p>
          <p>Your <strong>interview preparation booking</strong> has been confirmed!</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #1e40af;">Booking Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Booking ID:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${bookingDetails.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Package:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${packageTypeLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Service:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${serviceTypeLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Universities:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${universitiesStr}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Amount:</td>
                <td style="padding: 8px; font-size: 18px; font-weight: bold; color: #059669;">£${bookingDetails.amount}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">What happens next?</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li>We'll contact you within <strong>24 hours</strong> to schedule your session</li>
              ${bookingDetails.preferredDate ? `<li>We'll prioritize your preferred date: <strong>${bookingDetails.preferredDate}</strong></li>` : ''}
              <li>You'll receive session materials and preparation instructions</li>
              <li>Our team will match you with the perfect tutor (if applicable)</li>
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>📞 Need help?</strong> Contact us at contact@nextgenmedprep.com or call our support line.
            </p>
          </div>

          <p style="margin-top: 30px;">Thank you for choosing NextGen MedPrep!</p>
          <p>Best regards,<br><strong>The NextGen MedPrep Team</strong></p>
        </div>
      `
    };
  }

  private getUCATConfirmationTemplate(ucatDetails: {
    id: string;
    packageId: string;
    packageName: string;
    amount: number;
    userName?: string;
  }): EmailTemplate {
    const userName = ucatDetails.userName || 'there';
    
    // Package descriptions for different UCAT packages
    const packageDescriptions: { [key: string]: string } = {
      'ucat_kickstart': 'UCAT Kickstart - Build strong foundations with 4 hours of essential background knowledge',
      'ucat_advance': 'UCAT Advance - Refine and target performance with 8 hours of targeted question-specific sessions',
      'ucat_mastery': 'UCAT Mastery - Achieve top 10% scores with 12 hours of high-intensity preparation'
    };

    const packageDescription = packageDescriptions[ucatDetails.packageId] || ucatDetails.packageName;

    return {
      subject: 'UCAT Tutoring Package Confirmed - NextGen MedPrep',
      text: `Hi ${userName},\n\nYour UCAT tutoring package has been confirmed!\n\nPackage Details:\nBooking ID: ${ucatDetails.id}\nPackage: ${packageDescription}\nAmount: £${ucatDetails.amount}\n\nYour package includes:\n- Top 1% internationally scoring tutors\n- 24/7 Business Line access for questions\n- Tracked quantitative performance analytics\n- Personalised content plan with weekly guidance\n- Continuous updated question bank with worked examples\n- Free cheat sheets for each UCAT section\n- Personalised 10-week action plan\n\nWe'll contact you within 24 hours to get started with your UCAT preparation journey.\n\nThank you for choosing NextGen MedPrep!\n\nBest regards,\nThe NextGen MedPrep Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">UCAT Package Confirmed! 🎯</h1>
          <p>Hi ${userName},</p>
          <p>Your <strong>UCAT tutoring package</strong> has been confirmed!</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #1e40af;">Package Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Booking ID:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${ucatDetails.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Package:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${packageDescription}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Amount:</td>
                <td style="padding: 8px; font-size: 18px; font-weight: bold; color: #059669;">£${ucatDetails.amount}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your Package Includes:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li><strong>Expert Tutors:</strong> All scored in top 1% internationally</li>
              <li><strong>24/7 Business Line:</strong> Ask questions anytime, get step-by-step video solutions</li>
              <li><strong>Performance Tracking:</strong> Every question feeds into our analytics system</li>
              <li><strong>Personalised Plan:</strong> Weekly text messages guide your revision using data</li>
              <li><strong>Question Bank:</strong> Continuously updated with worked examples</li>
              <li><strong>Cheat Sheets:</strong> Free for each UCAT section with best approaches</li>
              <li><strong>10-Week Action Plan:</strong> Tailored to your strengths and weaknesses</li>
            </ul>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">What happens next?</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li>We'll contact you within <strong>24 hours</strong> to begin your UCAT journey</li>
              <li>You'll receive your personalised study materials and access details</li>
              <li>Our team will set up your performance tracking system</li>
              <li>You'll get matched with your expert UCAT tutor</li>
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>🎯 Ready to excel?</strong> Contact us at contact@nextgenmedprep.com for any questions about your UCAT preparation.
            </p>
          </div>

          <p style="margin-top: 30px;">Thank you for choosing NextGen MedPrep!</p>
          <p>Best regards,<br><strong>The NextGen MedPrep Team</strong></p>
        </div>
      `
    };
  }

  async sendPersonalStatementConfirmationEmail(email: string, data: {
    id: string;
    bookingId: string;
    amount: number;
    userName: string;
    statementType: string;
  }): Promise<void> {
    const template = this.getPersonalStatementConfirmationTemplate(data);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'personal_statement_confirmation');
  }

  async sendPersonalStatementReviewNotificationEmail(data: {
    personalStatementId: string;
    customerEmail: string;
    customerName: string;
    statementType: string;
    filePath: string;
  }): Promise<void> {
    const reviewEmail = process.env.REVIEW_TEAM_EMAIL || 'contact@nextgenmedprep.com';

    const template = this.getPersonalStatementReviewNotificationTemplate(data);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: reviewEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'personal_statement_review_notification');
  }

  private getPersonalStatementConfirmationTemplate(data: {
    id: string;
    bookingId: string;
    amount: number;
    userName: string;
    statementType: string;
  }): EmailTemplate {
    const subject = `Personal Statement Review Confirmed - £${data.amount}`;
    
    const text = `
Hi ${data.userName},

Thank you for purchasing our Personal Statement Review service!

Your personal statement review has been confirmed and our expert reviewers will begin working on it shortly.

Review Details:
- Service: ${data.statementType.charAt(0).toUpperCase() + data.statementType.slice(1)} Personal Statement Review
- Amount: £${data.amount}
- Review ID: ${data.id}
- Booking ID: ${data.bookingId}

What happens next:
• Your personal statement will be reviewed by our expert team within 48 hours
• You'll receive detailed feedback via email including line-by-line comments
• The feedback will cover structure, content, grammar, and admissions criteria alignment
• You can ask follow-up questions about the feedback

Our reviewers are current medical students and admissions tutors who have successfully gained places at top UK medical schools.

If you have any questions, please reply to this email or contact us at contact@nextgenmedprep.com.

Thank you for choosing NextGen MedPrep!

Best regards,
The NextGen MedPrep Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Personal Statement Review Confirmed</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your expert review is on the way!</p>
        </div>
        
        <div style="padding: 30px; color: #374151;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${data.userName}</strong>,</p>
          
          <p>Thank you for purchasing our Personal Statement Review service! 🎉</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Review Details</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li><strong>Service:</strong> ${data.statementType.charAt(0).toUpperCase() + data.statementType.slice(1)} Personal Statement Review</li>
              <li><strong>Amount:</strong> £${data.amount}</li>
              <li><strong>Review ID:</strong> ${data.id}</li>
              <li><strong>Booking ID:</strong> ${data.bookingId}</li>
            </ul>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">What happens next?</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li>Your personal statement will be reviewed by our expert team within <strong>48 hours</strong></li>
              <li>You'll receive detailed feedback via email including line-by-line comments</li>
              <li>The feedback will cover structure, content, grammar, and admissions criteria alignment</li>
              <li>You can ask follow-up questions about the feedback</li>
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>👨‍⚕️ Expert Reviewers:</strong> Our reviewers are current medical students and admissions tutors who have successfully gained places at top UK medical schools.
            </p>
          </div>

          <p style="margin-top: 30px;">If you have any questions, please reply to this email or contact us at contact@nextgenmedprep.com.</p>
          <p>Thank you for choosing NextGen MedPrep!</p>
          <p>Best regards,<br><strong>The NextGen MedPrep Team</strong></p>
        </div>
      </div>
    `;

    return { subject, text, html };
  }

  private getPersonalStatementReviewNotificationTemplate(data: {
    personalStatementId: string;
    customerEmail: string;
    customerName: string;
    statementType: string;
    filePath: string;
  }): EmailTemplate {
    const subject = `New Personal Statement Review - ${data.customerName} (${data.statementType})`;
    
    const text = `
  New Personal Statement Review Submitted

  Customer Details:
  - Name: ${data.customerName}
  - Email: ${data.customerEmail}
  - Statement Type: ${data.statementType}
  - Review ID: ${data.personalStatementId}
  - File Path: ${data.filePath}

  Action Required:
  1. Download the personal statement from Supabase: https://supabase.com/
  2. Assign a reviewer
  3. Complete the review within 48 hours
  4. Upload feedback and notify the customer - For now you can email the feedback directly to the customer.

  Tutor Dashboard: ${process.env.FRONTEND_URL}/admin/personal-statements/${data.personalStatementId}
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">New Personal Statement Review</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Action Required - Review Within 48 Hours</p>
        </div>
        
        <div style="padding: 30px; color: #374151;">
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Customer Details</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li><strong>Name:</strong> ${data.customerName}</li>
              <li><strong>Email:</strong> ${data.customerEmail}</li>
              <li><strong>Statement Type:</strong> ${data.statementType.charAt(0).toUpperCase() + data.statementType.slice(1)}</li>
              <li><strong>Review ID:</strong> ${data.personalStatementId}</li>
              <li><strong>File Path:</strong> ${data.filePath}</li>
            </ul>
          </div>

          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #991b1b;">Action Required</h3>
            <ol style="color: #374151; margin: 0; padding-left: 20px;">
              <li>Download the personal statement from the Tutor Dashboard</li>
              <li>Assign a reviewer</li>
              <li>Complete the review within <strong>48 hours</strong></li>
              <li>Upload feedback and notify the customer</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/admin/personal-statements/${data.personalStatementId}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View in Admin Dashboard - to be created 
            </a>
          </div>
        </div>
      </div>
    `;

    return { subject, text, html };
  }

  // Add specialized methods for career consultations and event bookings
  
  async sendCareerConsultationConfirmationEmail(email: string, data: {
    id: string;
    amount: number;
    userName: string;
    preferredDate?: string;
    startTime?: string;
  }): Promise<void> {
    const template = this.getCareerConsultationConfirmationTemplate(data);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'career_consultation_confirmation');
  }
  
  async sendEventBookingConfirmationEmail(email: string, data: {
    id: string;
    amount: number;
    userName: string;
    eventName: string;
    numberOfTickets?: number;
  }): Promise<void> {
    const template = this.getEventBookingConfirmationTemplate(data);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'event_booking_confirmation');
  }
  
  private getCareerConsultationConfirmationTemplate(data: {
    id: string;
    amount: number;
    userName: string;
    preferredDate?: string;
    startTime?: string;
  }): EmailTemplate {
    const subject = 'Career Consultation Booking Confirmed - NextGen MedPrep';
    
    const text = `
Hi ${data.userName},

Thank you for booking a 30-minute Career Consultation with NextGen MedPrep!

Booking Details:
- Service: 30-minute Career Consultation
- Amount: £${data.amount}
- Booking ID: ${data.id}
${data.preferredDate ? `- Preferred Date: ${data.preferredDate}` : ''}

What happens next:
• Our team will reach out within 24 hours to confirm your consultation time
• If you provided a preferred date, we'll do our best to accommodate it
• You'll receive a calendar invite with a meeting link once confirmed
• Please prepare any specific questions or topics you'd like to discuss

Our career advisors are medical professionals with extensive experience in medical school admissions and career pathways.

If you have any questions before your consultation, please contact us at contact@nextgenmedprep.com.

Thank you for choosing NextGen MedPrep!

Best regards,
The NextGen MedPrep Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Career Consultation Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your expert consultation is booked</p>
        </div>
        
        <div style="padding: 30px; color: #374151;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${data.userName}</strong>,</p>
          
          <p>Thank you for booking a 30-minute Career Consultation with NextGen MedPrep! 🎉</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Booking Details</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li><strong>Service:</strong> 30-minute Career Consultation</li>
              <li><strong>Amount:</strong> £${data.amount}</li>
              <li><strong>Booking ID:</strong> ${data.id}</li>
              ${data.preferredDate ? `<li><strong>Preferred Date:</strong> ${data.preferredDate}</li>` : ''}
            </ul>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">What happens next?</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li>Our team will reach out within <strong>24 hours</strong> to confirm your consultation time</li>
              ${data.preferredDate ? `<li>We'll do our best to accommodate your preferred date: <strong>${data.preferredDate}</strong></li>` : ''}
              <li>You'll receive a calendar invite with a meeting link once confirmed</li>
              <li>Please prepare any specific questions or topics you'd like to discuss</li>
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>👨‍⚕️ Expert Advisors:</strong> Our career advisors are medical professionals with extensive experience in medical school admissions and career pathways.
            </p>
          </div>

          <p style="margin-top: 30px;">If you have any questions before your consultation, please contact us at contact@nextgenmedprep.com.</p>
          <p>Thank you for choosing NextGen MedPrep!</p>
          <p>Best regards,<br><strong>The NextGen MedPrep Team</strong></p>
        </div>
      </div>
    `;

    return { subject, text, html };
  }
  
  private getEventBookingConfirmationTemplate(data: {
    id: string;
    amount: number;
    userName: string;
    eventName: string;
    numberOfTickets?: number;
  }): EmailTemplate {
    const ticketCount = data.numberOfTickets || 1;
    const subject = `Event Booking Confirmed: ${data.eventName} - NextGen MedPrep`;
    
    const text = `
Hi ${data.userName},

Thank you for booking ${ticketCount > 1 ? ticketCount + ' tickets' : 'a ticket'} for ${data.eventName}!

Booking Details:
- Event: Pathways To Medicine Conference: The guide to achieving medical school
- Number of Tickets: ${ticketCount}
- Amount: £${data.amount}
- Booking ID: ${data.id}

Event Details:
- Date & Time: Feb 15, 2026 10:00 AM London
- Duration: Full day conference
- Format: Virtual (Zoom)

Join Zoom Meeting:
https://us06web.zoom.us/j/81834671171?pwd=OnpWWm7Cb19nFbl46KHPyUFczqVNSb.1

Meeting ID: 818 3467 1171
Passcode: 437299

What to Expect:
• Comprehensive guide to achieving medical school admission
• Expert insights on the application process
• Interactive Q&A sessions
• Networking opportunities with aspiring medical students
• Bring your questions and energy!

If you have any questions about the event, please contact us at contact@nextgenmedprep.com.

Thank you for choosing NextGen MedPrep!

Best regards,
The NextGen MedPrep Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Event Booking Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${data.eventName}</p>
        </div>
        
        <div style="padding: 30px; color: #374151;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${data.userName}</strong>,</p>
          
          <p>Thank you for booking ${ticketCount > 1 ? ticketCount + ' tickets' : 'a ticket'} for <strong>${data.eventName}</strong>! 🎉</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Booking Details</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li><strong>Event:</strong> Pathways To Medicine Conference: The guide to achieving medical school</li>
              <li><strong>Number of Tickets:</strong> ${ticketCount}</li>
              <li><strong>Amount:</strong> £${data.amount}</li>
              <li><strong>Booking ID:</strong> ${data.id}</li>
            </ul>
          </div>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #1e40af;">📅 Event Information</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li><strong>Date & Time:</strong> Feb 15, 2026 10:00 AM London</li>
              <li><strong>Duration:</strong> Full day conference</li>
              <li><strong>Format:</strong> Virtual (Zoom)</li>
            </ul>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">🎥 Join the Conference</h3>
            <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 10px 0;">
              <p style="margin: 0 0 10px 0; color: #374151;"><strong>Zoom Meeting Link:</strong></p>
              <a href="https://us06web.zoom.us/j/81834671171?pwd=OnpWWm7Cb19nFbl46KHPyUFczqVNSb.1" 
                 style="color: #2563eb; text-decoration: none; word-break: break-all; font-size: 14px;">
                https://us06web.zoom.us/j/81834671171?pwd=OnpWWm7Cb19nFbl46KHPyUFczqVNSb.1
              </a>
              <p style="margin: 15px 0 5px 0; color: #374151;"><strong>Meeting ID:</strong> 818 3467 1171</p>
              <p style="margin: 5px 0 0 0; color: #374151;"><strong>Passcode:</strong> 437299</p>
            </div>
            <p style="margin: 15px 0 0 0; color: #374151; font-size: 14px;">
              💡 <strong>Tip:</strong> We recommend joining 10 minutes early to test your audio and video.
            </p>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">What to Expect</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li>Comprehensive guide to achieving medical school admission</li>
              <li>Expert insights on the application process</li>
              <li>Interactive Q&A sessions</li>
              <li>Networking opportunities with aspiring medical students</li>
              <li>Bring your questions and energy!</li>
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>📝 Questions?</strong> Contact us at contact@nextgenmedprep.com for any event-related inquiries.
            </p>
          </div>

          <p style="margin-top: 30px;">Thank you for choosing NextGen MedPrep!</p>
          <p>Best regards,<br><strong>The NextGen MedPrep Team</strong></p>
        </div>
      </div>
    `;

    return { subject, text, html };
  }

  // Interview Booking Email Methods
  
  async sendInterviewBookingConfirmationEmail(email: string, data: {
    bookingId: string;
    userName: string;
    packageType: string;
    serviceType: string;
    universities: string[];
    amount: number;
    preferredDate?: string;
    notes?: string;
    studentId?: string; // Added for dashboard link
  }): Promise<void> {
    const template = this.getInterviewBookingConfirmationTemplate(data);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'interview_booking_confirmation');
  }

  async sendInterviewBookingNotificationEmail(data: {
    bookingId: string;
    customerEmail: string;
    customerName: string;
    packageType: string;
    serviceType: string;
    universities: string[];
    amount: number;
    field?: 'medicine' | 'dentistry';
    filePath?: string;
    downloadUrl?: string;
    notes?: string;
    preferredDate?: string;
    availability?: Array<{ date: string; timeSlot: string }>;
  }): Promise<void> {
    const adminEmail = process.env.REVIEW_TEAM_EMAIL || 'contact@nextgenmedprep.com';

    const template = this.getInterviewBookingNotificationTemplate(data);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'interview_booking_notification');
  }

  private getInterviewBookingConfirmationTemplate(data: {
    bookingId: string;
    userName: string;
    packageType: string;
    serviceType: string;
    universities: string[];
    amount: number;
    preferredDate?: string;
    notes?: string;
    studentId?: string;
  }): EmailTemplate {
    const packageLabel = data.packageType === 'single' ? 'Single Session' : 'Package Deal';
    const serviceLabel = data.serviceType === 'generated' ? 'AI-Generated Mock Questions' : 'Live Tutor Session';
    const universitiesStr = data.universities.join(', ');
    
    // Generate dashboard link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const dashboardLink = `${frontendUrl}/student-dashboard`;

    
    const subject = 'Interview Preparation Booking Confirmed - NextGen MedPrep';
    
    const text = `
Hi ${data.userName},

Thank you for booking Interview Preparation with NextGen MedPrep!

Your interview preparation booking has been confirmed and our team will contact you shortly.

Booking Details:
- Booking ID: ${data.bookingId}
- Package: ${packageLabel}
- Service: ${serviceLabel}
- Universities: ${universitiesStr}
- Amount: £${data.amount}
${data.preferredDate ? `- Preferred Date: ${data.preferredDate}` : ''}
${data.notes ? `- Notes: ${data.notes}` : ''}

🎓 YOUR STUDENT DASHBOARD:
We've created a personal dashboard for you to:
• Schedule and manage your interview preparation sessions
• View your upcoming and past sessions
• Access session materials and Zoom links
• Track your progress

Access your dashboard here: ${dashboardLink}

What happens next:
• Our team will review your personal statement and university choices
• We'll contact you within 24 hours to schedule your session
• Our expert tutors will help you excel in your interviews

Our interview tutors are current medical students who have successfully gained places at top UK medical schools.

If you have any questions, please contact us at contact@nextgenmedprep.com.

Thank you for choosing NextGen MedPrep!

Best regards,
The NextGen MedPrep Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Interview Booking Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your expert interview preparation is booked</p>
        </div>
        
        <div style="padding: 30px; color: #374151;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${data.userName}</strong>,</p>
          
          <p>Thank you for booking Interview Preparation with NextGen MedPrep! 🎉</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Booking ID:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${data.bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Package:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${packageLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Service:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${serviceLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Universities:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${universitiesStr}</td>
              </tr>
              ${data.preferredDate ? `
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Preferred Date:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.preferredDate}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px; font-weight: bold;">Amount:</td>
                <td style="padding: 8px; font-size: 18px; font-weight: bold; color: #059669;">£${data.amount}</td>
              </tr>
            </table>
          </div>

          ${data.notes ? `
          <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h4 style="margin-top: 0; color: #92400e;">Your Notes:</h4>
            <p style="margin: 0; color: #78350f;">${data.notes}</p>
          </div>
          ` : ''}


          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; text-align: center;">
            <h3 style="margin-top: 0; color: #1e40af;">🎓 Your Student Dashboard</h3>
            <p style="color: #374151; margin-bottom: 15px;">We've created a personal dashboard for you to manage your interview preparation:</p>
            <ul style="color: #374151; text-align: left; margin: 15px 0; padding-left: 20px;">
              <li>Schedule and manage your interview preparation sessions</li>
              <li>View your upcoming and past sessions</li>
              <li>Access session materials and Zoom links</li>
              <li>Track your preparation progress</li>
            </ul>
            <a href="${dashboardLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
              Access Your Dashboard →
            </a>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">⚠️ Important: Email Account</h3>
            <p style="margin: 10px 0 0 0; color: #78350f; font-size: 14px; line-height: 1.6;">
              Please make sure you sign up for your student dashboard using the same email address you're receiving this confirmation to (<strong>${data.userName ? 'your email' : 'this email'}</strong>). This ensures you'll see all your sessions and interview materials on your dashboard.
            </p>
            <p style="margin: 10px 0 0 0; color: #78350f; font-size: 14px; line-height: 1.6;">
              If you need to use a different email address, please contact us at <a href="mailto:contact@nextgenmedprep.com" style="color: #92400e; font-weight: bold; text-decoration: none;">contact@nextgenmedprep.com</a> and we'll help you set this up.
            </p>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">What happens next?</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li>Our team will review your personal statement and university choices</li>
              <li>We'll contact you within <strong>24 hours</strong> to schedule your session</li>
              <li>Our expert tutors will help you excel in your interviews</li>
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>👨‍⚕️ Expert Tutors:</strong> Our interview tutors are current medical students who have successfully gained places at top UK medical schools.
            </p>
          </div>

          <p style="margin-top: 30px;">If you have any questions, please contact us at contact@nextgenmedprep.com.</p>
          <p>Thank you for choosing NextGen MedPrep!</p>
          <p>Best regards,<br><strong>The NextGen MedPrep Team</strong></p>
        </div>
      </div>
    `;

    return { subject, text, html };
  }

  private getInterviewBookingNotificationTemplate(data: {
    bookingId: string;
    customerEmail: string;
    customerName: string;
    packageType: string;
    serviceType: string;
    universities: string[];
    amount: number;
    field?: 'medicine' | 'dentistry';
    filePath?: string;
    downloadUrl?: string;
    notes?: string;
    preferredDate?: string;
    availability?: Array<{ date: string; timeSlot: string }>;
  }): EmailTemplate {
    // Format package type: essentials -> Essentials, core -> Core, premium -> Premium
    const packageLabel = data.packageType.charAt(0).toUpperCase() + data.packageType.slice(1);
    const serviceLabel = data.serviceType === 'generated' ? 'AI-Generated Mock Questions' : 'Live Tutor Session';
    const universitiesStr = data.universities.join(', ');
    const fieldLabel = data.field ? data.field.charAt(0).toUpperCase() + data.field.slice(1) : 'Not specified';
    
    const subject = `New Interview Booking: ${data.customerName} - ${packageLabel}`;
    
    const text = `
New Interview Preparation Booking Received!

Customer Details:
- Name: ${data.customerName}
- Email: ${data.customerEmail}
- Booking ID: ${data.bookingId}

Booking Details:
- Package: ${packageLabel}
- Service: ${serviceLabel}
- Field: ${fieldLabel}
- Universities: ${universitiesStr}
- Amount: £${data.amount}
${data.preferredDate ? `- Preferred Date: ${data.preferredDate}` : ''}
${data.availability && data.availability.length > 0 ? `
Student Availability:
${data.availability.map((slot) => `  • ${slot.date} at ${slot.timeSlot}`).join('\n')}` : ''}
${data.notes ? `- Notes: ${data.notes}` : ''}
${data.filePath ? `
Personal Statement:
- File Path: ${data.filePath}
${data.downloadUrl ? `- Download Link: ${data.downloadUrl} (valid for 7 days)` : ''}` : `
Note: No personal statement was provided with this booking.`}

Action Required:
1. Download the personal statement (if provided)
2. Review the universities and student preferences
3. Assign a suitable tutor (if live session)
4. Contact the student within 24 hours to schedule the session
5. Send preparation materials tailored to their universities

Booking ID: ${data.bookingId}
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">New Interview Booking!</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Action Required - Contact Within 24 Hours</p>
        </div>
        
        <div style="padding: 30px; color: #374151;">
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Customer Details</h3>
            <ul style="margin: 0; padding-left: 20px; color: #374151;">
              <li><strong>Name:</strong> ${data.customerName}</li>
              <li><strong>Email:</strong> ${data.customerEmail}</li>
              <li><strong>Booking ID:</strong> ${data.bookingId}</li>
            </ul>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #1e40af;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Package:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${packageLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Service:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${serviceLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Field:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${fieldLabel}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Universities:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${universitiesStr}</td>
              </tr>
              ${data.preferredDate ? `
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Preferred Date:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.preferredDate}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px; font-weight: bold;">Amount:</td>
                <td style="padding: 8px; font-size: 18px; font-weight: bold; color: #059669;">£${data.amount}</td>
              </tr>
            </table>
          </div>

          ${data.availability && data.availability.length > 0 ? `
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">📅 Student Availability</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              ${data.availability.map((slot) => `<li><strong>${slot.date}</strong> at ${slot.timeSlot}</li>`).join('\n              ')}
            </ul>
          </div>
          ` : ''}

          ${data.notes ? `
          <div style="background-color: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h4 style="margin-top: 0; color: #92400e;">Student Notes:</h4>
            <p style="margin: 0; color: #78350f;">${data.notes}</p>
          </div>
          ` : ''}

          ${data.filePath ? `
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #991b1b;">Personal Statement</h3>
            <p style="margin: 0; color: #374151;"><strong>File Path:</strong> <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${data.filePath}</code></p>
            ${data.downloadUrl ? `
            <div style="text-align: center; margin: 20px 0;">
              <a href="${data.downloadUrl}" 
                 style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                📄 Download Personal Statement
              </a>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">Link expires in 7 days</p>
            </div>
            ` : `
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">Download from Supabase "Personal Statements" bucket</p>
            `}
          </div>
          ` : `
          <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;"><strong>Note:</strong> No personal statement was provided with this booking.</p>
          </div>
          `}

          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #991b1b;">Action Required</h3>
            <ol style="color: #374151; margin: 0; padding-left: 20px;">
              <li>Download the personal statement from Supabase storage (if provided)</li>
              <li>Review the universities and student preferences</li>
              <li>Assign a suitable tutor (if live session)</li>
              <li>Contact the student within <strong>24 hours</strong> to schedule the session</li>
              <li>Send preparation materials tailored to their universities</li>
            </ol>
          </div>

          <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">Booking ID: <strong>${data.bookingId}</strong></p>
          </div>
        </div>
      </div>
    `;

    return { subject, text, html };
  }

  // Test email configuration
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }

  /**
   * Send interview cancellation emails to tutor and student
   * @param tutorEmail - Email of the tutor (can be undefined if no tutor assigned)
   * @param tutorName - Name of the tutor (can be undefined if no tutor assigned)
   * @param studentEmail - Email of the student
   * @param studentName - Name of the student
   * @param scheduledAt - ISO date string of the scheduled interview (can be undefined)
   * @param universities - University name(s) for the interview
   */
  async sendInterviewCancellationEmail(
    tutorEmail: string | undefined,
    tutorName: string | undefined,
    studentEmail: string,
    studentName: string,
    scheduledAt: string | undefined,
    universities: string,
    cancellationNotes?: string
  ): Promise<void> {
    let dateStr = 'Not yet scheduled';
    let timeStr = '';
    
    if (scheduledAt) {
      const interviewDate = new Date(scheduledAt);
      dateStr = interviewDate.toLocaleDateString('en-GB', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      timeStr = interviewDate.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }

    // Email to student (always send)
    const studentTemplate = this.getInterviewCancellationTemplateStudent(
      studentName,
      tutorName || 'your tutor',
      dateStr,
      timeStr,
      universities,
      cancellationNotes
    );

    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: studentEmail,
      subject: studentTemplate.subject,
      text: studentTemplate.text,
      html: studentTemplate.html,
    }, 'interview_cancellation_student');

    // Email to tutor (only if tutor was assigned)
    if (tutorEmail && tutorName) {
      const tutorTemplate = this.getInterviewCancellationTemplateTutor(
        tutorName,
        studentName,
        dateStr,
        timeStr,
        universities
      );

      await this.sendMailWithTracking({
        from: process.env.EMAIL_FROM,
        to: tutorEmail,
        subject: tutorTemplate.subject,
        text: tutorTemplate.text,
        html: tutorTemplate.html,
      }, 'interview_cancellation_tutor');
    }
  }

  /**
   * Send interview confirmation emails with Zoom meeting link
   * @param tutorEmail - Email of the tutor
   * @param tutorName - Name of the tutor
   * @param studentEmail - Email of the student
   * @param studentName - Name of the student
   * @param scheduledAt - ISO date string of the scheduled interview
   * @param interviewId - ID of the interview
   * @param zoomJoinUrl - Zoom meeting join URL (required)
   */
  async sendInterviewConfirmationEmail(
    tutorEmail: string,
    tutorName: string,
    studentEmail: string,
    studentName: string,
    scheduledAt: string,
    interviewId: string,
    zoomJoinUrl: string,
    zoomHostEmail: string,
    universities: string
  ): Promise<void> {
    const zoomLink = zoomJoinUrl;
    const interviewDate = new Date(scheduledAt);
    const dateStr = interviewDate.toLocaleDateString('en-GB', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const timeStr = interviewDate.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    // Email to tutor
    const tutorTemplate = this.getInterviewConfirmationTemplateTutor(
      tutorName,
      studentName,
      dateStr,
      timeStr,
      zoomLink,
      zoomHostEmail,
      universities
    );

    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: tutorEmail,
      subject: tutorTemplate.subject,
      text: tutorTemplate.text,
      html: tutorTemplate.html,
    }, 'interview_confirmation_tutor');

    // Email to student
    const studentTemplate = this.getInterviewConfirmationTemplateStudent(
      studentName,
      tutorName,
      dateStr,
      timeStr,
      zoomLink,
      universities
    );

    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: studentEmail,
      subject: studentTemplate.subject,
      text: studentTemplate.text,
      html: studentTemplate.html,
    }, 'interview_confirmation_student');
  }

  private getInterviewCancellationTemplateStudent(
    studentName: string,
    tutorName: string,
    dateStr: string,
    timeStr: string,
    universities: string,
    cancellationNotes?: string
  ): EmailTemplate {
    const notesSection = cancellationNotes ? `\n\nCancellation Reason:\n${cancellationNotes}\n` : '';
    
    return {
      subject: `📅 Interview Rescheduling - NextGen MedPrep`,
      text: `Hi ${studentName},\n\nWe're writing to inform you that your scheduled interview has been cancelled and will be rescheduled.\n\n${tutorName !== 'your tutor' ? `Tutor: ${tutorName}\n` : ''}${dateStr !== 'Not yet scheduled' ? `Original Date: ${dateStr}\n` : ''}${timeStr ? `Original Time: ${timeStr}\n` : ''}University: ${universities}${notesSection}\n\nWhat happens next:\n• Our team will reach out within 24 hours to reschedule your interview\n• We'll work with you to find a new time that suits your schedule\n• All your preparation materials remain valid\n\nWe apologize for any inconvenience caused. If you have any urgent questions, please contact us at contact@nextgenmedprep.com.\n\nBest regards,\nThe NextGen MedPrep Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                      <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                        📅
                      </div>
                      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Interview Rescheduling
                      </h1>
                      <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                        We'll find a new time that works for you
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                        Hi ${studentName},
                      </p>
                      <p style="margin: 0 0 30px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                        We need to reschedule your upcoming interview. Don't worry - we'll work with you to find a new time that suits your schedule.
                      </p>

                      <!-- Original Interview Details -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 12px; border-left: 4px solid #64748b; margin: 0 0 30px 0;">
                        <tr>
                          <td style="padding: 25px;">
                            <h2 style="margin: 0 0 20px 0; color: #475569; font-size: 18px; font-weight: 600;">
                              📋 Original Interview Details
                            </h2>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              ${tutorName !== 'your tutor' ? `
                              <tr>
                                <td style="padding: 8px 0; color: #64748b; font-weight: 500; font-size: 14px; width: 100px;">
                                  Tutor:
                                </td>
                                <td style="padding: 8px 0; color: #334155; font-size: 15px;">
                                  ${tutorName}
                                </td>
                              </tr>
                              ` : ''}
                              ${dateStr !== 'Not yet scheduled' ? `
                              <tr>
                                <td style="padding: 8px 0; color: #64748b; font-weight: 500; font-size: 14px;">
                                  Date:
                                </td>
                                <td style="padding: 8px 0; color: #334155; font-size: 15px;">
                                  📆 ${dateStr}
                                </td>
                              </tr>
                              ` : ''}
                              ${timeStr ? `
                              <tr>
                                <td style="padding: 8px 0; color: #64748b; font-weight: 500; font-size: 14px;">
                                  Time:
                                </td>
                                <td style="padding: 8px 0; color: #334155; font-size: 15px;">
                                  ⏰ ${timeStr}
                                </td>
                              </tr>
                              ` : ''}
                              <tr>
                                <td style="padding: 8px 0; color: #64748b; font-weight: 500; font-size: 14px;">
                                  University:
                                </td>
                                <td style="padding: 8px 0; color: #334155; font-size: 15px;">
                                  🎓 ${universities}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      ${cancellationNotes ? `
                      <!-- Cancellation Reason -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 0 0 30px 0;">
                        <tr>
                          <td style="padding: 25px;">
                            <h2 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">
                              📝 Cancellation Reason
                            </h2>
                            <p style="margin: 0; color: #78350f; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
                              ${cancellationNotes}
                            </p>
                          </td>
                        </tr>
                      </table>
                      ` : ''}

                      <!-- What's Next -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 8px; margin: 0 0 25px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                              📅 What happens next?
                            </h3>
                            <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.7;">
                              • Our team will reach out within <strong>24 hours</strong> to reschedule your interview<br>
                              • We'll work with you to find a new time that suits your schedule<br>
                              • All your preparation materials remain valid<br>
                              • Your booking remains active - no need to repay
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Reassurance Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 8px; margin: 0 0 25px 0;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <p style="margin: 0 0 5px 0; font-size: 24px;">✨</p>
                            <p style="margin: 0; color: #1e40af; font-size: 15px; font-weight: 600;">
                              We're still committed to your success!
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px; line-height: 1.6;">
                        We apologize for any inconvenience. If you have any questions, please contact us at <a href="mailto:contact@nextgenmedprep.com" style="color: #3b82f6; text-decoration: none;">contact@nextgenmedprep.com</a>.
                      </p>
                      
                      <p style="margin: 20px 0 0 0; color: #334155; font-size: 15px; line-height: 1.6;">
                        Best regards,<br>
                        <strong style="color: #3b82f6;">The NextGen MedPrep Team</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px; font-weight: 600;">
                        NextGen MedPrep | We're Here to Support You
                      </p>
                      <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                        © ${new Date().getFullYear()} NextGen MedPrep. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };
  }

  private getInterviewCancellationTemplateTutor(
    tutorName: string,
    studentName: string,
    dateStr: string,
    timeStr: string,
    universities: string
  ): EmailTemplate {
    return {
      subject: `❌ Interview Cancelled - ${studentName}`,
      text: `Hi ${tutorName},\n\nThe following interview has been cancelled:\n\nStudent: ${studentName}\n${dateStr !== 'Not yet scheduled' ? `Date: ${dateStr}\n` : ''}${timeStr ? `Time: ${timeStr}\n` : ''}University: ${universities}\n\nThis time slot has been released and is now available for other bookings. You don't need to take any action.\n\nIf you have any questions, please contact us.\n\nBest regards,\nThe NextGen MedPrep Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #fef2f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        ❌ Interview Cancelled
                      </h1>
                      <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                        Time slot released
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                        Hi <strong style="color: #0f172a;">${tutorName}</strong>,
                      </p>
                      <p style="margin: 0 0 30px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                        The following interview has been cancelled:
                      </p>

                      <!-- Interview Details -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%); border-radius: 12px; border: 2px solid #f59e0b; margin: 0 0 30px 0;">
                        <tr>
                          <td style="padding: 25px;">
                            <h2 style="margin: 0 0 20px 0; color: #92400e; font-size: 18px; font-weight: 600;">
                              📋 Cancelled Interview
                            </h2>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 8px 0; color: #92400e; font-weight: 600; font-size: 14px; width: 100px;">
                                  Student:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 500;">
                                  ${studentName}
                                </td>
                              </tr>
                              ${dateStr !== 'Not yet scheduled' ? `
                              <tr>
                                <td style="padding: 8px 0; color: #92400e; font-weight: 600; font-size: 14px;">
                                  Date:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">
                                  📆 ${dateStr}
                                </td>
                              </tr>
                              ` : ''}
                              ${timeStr ? `
                              <tr>
                                <td style="padding: 8px 0; color: #92400e; font-weight: 600; font-size: 14px;">
                                  Time:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">
                                  ⏰ ${timeStr}
                                </td>
                              </tr>
                              ` : ''}
                              <tr>
                                <td style="padding: 8px 0; color: #92400e; font-weight: 600; font-size: 14px;">
                                  University:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">
                                  🎓 ${universities}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Info Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #dbeafe; border-left: 4px solid #3b82f6; border-radius: 8px; margin: 0 0 25px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.7;">
                              ✓ This time slot has been released and is now available for other bookings<br>
                              ✓ No action needed from you<br>
                              ✓ Your calendar will be updated automatically
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px; line-height: 1.6;">
                        If you have any questions, please contact us at <a href="mailto:contact@nextgenmedprep.com" style="color: #3b82f6; text-decoration: none;">contact@nextgenmedprep.com</a>.
                      </p>
                      
                      <p style="margin: 20px 0 0 0; color: #334155; font-size: 15px; line-height: 1.6;">
                        Best regards,<br>
                        <strong style="color: #f59e0b;">The NextGen MedPrep Team</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #fef2f2; padding: 30px; text-align: center; border-top: 1px solid #fecaca;">
                      <p style="margin: 0 0 10px 0; color: #92400e; font-size: 13px; font-weight: 600;">
                        NextGen MedPrep | Thank you for your flexibility
                      </p>
                      <p style="margin: 0; color: #6b7280; font-size: 12px;">
                        © ${new Date().getFullYear()} NextGen MedPrep. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };
  }

  private getInterviewConfirmationTemplateTutor(
    tutorName: string,
    studentName: string,
    dateStr: string,
    timeStr: string,
    zoomLink: string,
    zoomHostEmail: string,
    universities: string
  ): EmailTemplate {
    return {
      subject: `🎓 New Interview Scheduled - ${studentName}`,
      text: `Hi ${tutorName},\n\nYou have a new interview scheduled!\n\nStudent: ${studentName}\nDate: ${dateStr}\nTime: ${timeStr}\n\nZoom Link: ${zoomLink}\n\nPlease join the meeting on time and prepare accordingly.\n\nBest regards,\nThe NextGen MedPrep Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header with gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        📅 New Interview Scheduled
                      </h1>
                      <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                        Your next tutoring session is confirmed
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                        Hi <strong style="color: #0f172a;">${tutorName}</strong>,
                      </p>
                      <p style="margin: 0 0 30px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                        You have a new interview session scheduled. Please review the details below and join the meeting on time.
                      </p>

                      <!-- Interview Details Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border: 2px solid #0ea5e9; margin: 0 0 30px 0;">
                        <tr>
                          <td style="padding: 25px;">
                            <h2 style="margin: 0 0 20px 0; color: #0c4a6e; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                              🎯 Interview Details
                            </h2>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 8px 0; color: #0c4a6e; font-weight: 600; font-size: 14px; width: 80px;">
                                  Student:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 500;">
                                  ${studentName}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #0c4a6e; font-weight: 600; font-size: 14px;">
                                  Date:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">
                                  📆 ${dateStr}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #0c4a6e; font-weight: 600; font-size: 14px;">
                                  Time:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">
                                  ⏰ ${timeStr}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #0c4a6e; font-weight: 600; font-size: 14px;">
                                  University:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">
                                  🎓 ${universities}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Zoom Host Account Info -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; border: 2px solid #f59e0b; margin: 0 0 30px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">
                              🔐 Zoom Host Account
                            </h3>
                            <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
                              <strong>Important:</strong> This meeting is hosted on the <strong>${zoomHostEmail}</strong> account. Please ensure you have access to this account to start the meeting.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Zoom Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 25px 0;">
                        <tr>
                          <td align="center" style="padding: 30px 20px; background-color: #f8fafc; border-radius: 12px;">
                            <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                              Ready to Join?
                            </p>
                            <a href="${zoomLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4); transition: all 0.3s;">
                              🎥 Join Zoom Meeting
                            </a>
                            <p style="margin: 15px 0 0 0; color: #94a3b8; font-size: 12px;">
                              Or copy this link: <a href="${zoomLink}" style="color: #667eea; word-break: break-all;">${zoomLink}</a>
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Tips Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; margin: 0 0 25px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                              <strong>💡 Quick Tips:</strong><br>
                              • Review the student's application materials beforehand<br>
                              • Join the meeting 2-3 minutes early to test your setup<br>
                              • Keep structured feedback notes during the session
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px; line-height: 1.6;">
                        If you have any questions or need to reschedule, please contact us immediately.
                      </p>
                      
                      <p style="margin: 20px 0 0 0; color: #334155; font-size: 15px; line-height: 1.6;">
                        Best regards,<br>
                        <strong style="color: #667eea;">The NextGen MedPrep Team</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                        NextGen MedPrep | Empowering Future Medical Professionals
                      </p>
                      <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                        © ${new Date().getFullYear()} NextGen MedPrep. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };
  }

  private getInterviewConfirmationTemplateStudent(
    studentName: string,
    tutorName: string,
    dateStr: string,
    timeStr: string,
    zoomLink: string,
    universities: string
  ): EmailTemplate {
    return {
      subject: `✅ Interview Confirmed with ${tutorName}`,
      text: `Hi ${studentName},\n\nYour interview has been confirmed!\n\nTutor: ${tutorName}\nDate: ${dateStr}\nTime: ${timeStr}\n\nZoom Link: ${zoomLink}\n\nPlease join the meeting on time. We recommend logging in 5 minutes early to test your audio and video.\n\nGood luck!\n\nBest regards,\nThe NextGen MedPrep Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f0fdf4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf4; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header with gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                      <div style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                        ✅
                      </div>
                      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Interview Confirmed!
                      </h1>
                      <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                        You're all set for your mock interview
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 10px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                        Hi <strong style="color: #0f172a;">${studentName}</strong>,
                      </p>
                      <p style="margin: 0 0 30px 0; color: #334155; font-size: 16px; line-height: 1.6;">
                        Great news! Your mock interview has been confirmed. We're excited to help you prepare for your medical school journey. 🎓
                      </p>

                      <!-- Interview Details Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; border: 2px solid #10b981; margin: 0 0 30px 0;">
                        <tr>
                          <td style="padding: 25px;">
                            <h2 style="margin: 0 0 20px 0; color: #065f46; font-size: 18px; font-weight: 600;">
                              📋 Your Interview Details
                            </h2>
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 8px 0; color: #065f46; font-weight: 600; font-size: 14px; width: 80px;">
                                  Tutor:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px; font-weight: 500;">
                                  👨‍🏫 ${tutorName}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #065f46; font-weight: 600; font-size: 14px;">
                                  Date:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">
                                  📆 ${dateStr}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #065f46; font-weight: 600; font-size: 14px;">
                                  Time:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">
                                  ⏰ ${timeStr}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #065f46; font-weight: 600; font-size: 14px;">
                                  University:
                                </td>
                                <td style="padding: 8px 0; color: #0f172a; font-size: 15px;">
                                  🎓 ${universities}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Zoom Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 25px 0;">
                        <tr>
                          <td align="center" style="padding: 30px 20px; background-color: #f8fafc; border-radius: 12px;">
                            <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                              Join Your Interview
                            </p>
                            <a href="${zoomLink}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.4);">
                              🎥 Join Zoom Meeting
                            </a>
                            <p style="margin: 15px 0 0 0; color: #94a3b8; font-size: 12px;">
                              Or copy this link: <a href="${zoomLink}" style="color: #10b981; word-break: break-all;">${zoomLink}</a>
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Preparation Tips -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; margin: 0 0 25px 0;">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0 0 10px 0; color: #92400e; font-size: 15px; font-weight: 600;">
                              💡 Interview Preparation Tips
                            </p>
                            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.7;">
                              <strong>Before the Interview:</strong><br>
                              • Test your camera and microphone<br>
                              • Find a quiet, well-lit space<br>
                              • Review your personal statement & application<br>
                              • Prepare questions about the university<br>
                              • Join 5 minutes early to check your setup
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Confidence Boost -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); border-radius: 8px; margin: 0 0 25px 0;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <p style="margin: 0 0 5px 0; font-size: 24px;">🌟</p>
                            <p style="margin: 0; color: #5b21b6; font-size: 15px; font-weight: 600; font-style: italic;">
                              "You've got this! Remember, preparation meets opportunity."
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px; line-height: 1.6;">
                        If you need to reschedule or have any questions, please contact us as soon as possible.
                      </p>
                      
                      <p style="margin: 20px 0 0 0; color: #334155; font-size: 15px; line-height: 1.6;">
                        Best of luck! <br>
u                        <strong style="color: #10b981;">The NextGen MedPrep Team</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f0fdf4; padding: 30px; text-align: center; border-top: 1px solid #d1fae5;">
                      <p style="margin: 0 0 10px 0; color: #064e3b; font-size: 13px; font-weight: 600;">
                        NextGen MedPrep | Your Path to Medical School Success
                      </p>
                      <p style="margin: 0; color: #6b7280; font-size: 12px;">
                        © ${new Date().getFullYear()} NextGen MedPrep. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };
  }

  async sendRevisionPlanConfirmationEmail(email: string, data: {
    id: string;
    amount: number;
    userName?: string;
    weeks: number;
    intensity: string;
    platform: string;
  }): Promise<void> {
    const template = this.getRevisionPlanConfirmationTemplate(data);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'revision_plan_confirmation');
  }

  async sendRevisionPlanTutorNotificationEmail(tutorEmail: string, data: {
    bookingId: string;
    customerEmail: string;
    customerName: string;
    weeks: number;
    intensity: string;
    platform: string;
    amount: number;
  }): Promise<void> {
    const template = this.getRevisionPlanTutorNotificationTemplate(data);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: tutorEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'revision_plan_tutor_notification');
  }

  private getRevisionPlanConfirmationTemplate(data: {
    id: string;
    amount: number;
    userName?: string;
    weeks: number;
    intensity: string;
    platform: string;
  }): EmailTemplate {
    const userName = data.userName || 'there';
    
    const intensityDescriptions: { [key: string]: string } = {
      'low': '1-2 hours per day - Perfect for balancing with other commitments',
      'medium': '2-3 hours per day - Our most popular and balanced approach',
      'high': '4-5 hours per day - Intensive preparation for maximum results'
    };

    const intensityDescription = intensityDescriptions[data.intensity] || data.intensity;

    return {
      subject: 'Your Personalised UCAT Revision Plan - NextGen MedPrep',
      text: `Hi ${userName},\n\nThank you for purchasing your Personalised UCAT Revision Plan!\n\nYour Plan Details:\nBooking ID: ${data.id}\nDuration: ${data.weeks} weeks\nIntensity: ${intensityDescription}\nPlatform: ${data.platform.charAt(0).toUpperCase() + data.platform.slice(1)}\nAmount: £${data.amount}\n\nWhat happens next:\n• Your personalised revision plan will be created by our UCAT experts\n• You'll receive your complete plan within 24 hours via email\n• The plan will include daily study targets, practice schedules, and mock exam timings\n• All resources will be tailored to ${data.platform} platform\n\nYour plan will include:\n- Week-by-week breakdown of all UCAT sections\n- Daily practice targets customised to your ${data.intensity} intensity level\n- Mock exam schedule and timing strategies\n- Progress tracking milestones\n- ${data.platform}-specific resource recommendations\n- Rest and recovery periods to prevent burnout\n\nIf you have any questions while waiting for your plan, feel free to reach out to us at contact@nextgenmedprep.com.\n\nThank you for choosing NextGen MedPrep!\n\nBest regards,\nThe NextGen MedPrep Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Your Personalised UCAT Plan is On Its Way! 📚</h1>
          <p>Hi ${userName},</p>
          <p>Thank you for purchasing your <strong>Personalised UCAT Revision Plan</strong>!</p>
          
          <div style="background-color: #f5f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
            <h3 style="margin-top: 0; color: #5b21b6;">Your Plan Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Booking ID:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${data.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Duration:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>${data.weeks} weeks</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Intensity:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-transform: capitalize;"><strong>${data.intensity}</strong><br><span style="font-size: 12px; color: #6b7280;">${intensityDescription}</span></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Platform:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-transform: capitalize;"><strong>${data.platform}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Amount:</td>
                <td style="padding: 8px; font-size: 18px; font-weight: bold; color: #059669;">£${data.amount}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">What happens next?</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Your <strong>personalised revision plan</strong> will be created by our UCAT experts who scored 3000+</li>
              <li>You'll receive your <strong>complete plan within 24 hours</strong> via email</li>
              <li>The plan will include <strong>daily study targets</strong>, practice schedules, and mock exam timings</li>
              <li>All resources will be <strong>tailored to ${data.platform}</strong> platform</li>
            </ul>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your Plan Will Include:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li><strong>Week-by-week breakdown</strong> of all UCAT sections (VR, DM, QR, AR, SJT)</li>
              <li><strong>Daily practice targets</strong> customised to your ${data.intensity} intensity level</li>
              <li><strong>Mock exam schedule</strong> and timing strategies</li>
              <li><strong>Progress tracking milestones</strong> for each week</li>
              <li><strong>${data.platform}-specific</strong> resource recommendations and question allocations</li>
              <li><strong>Rest and recovery</strong> periods to prevent burnout</li>
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>✨ Questions while waiting?</strong> Feel free to reach out at contact@nextgenmedprep.com
            </p>
          </div>

          <div style="background-color: #ddd6fe; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 20px;">🎯</p>
            <p style="margin: 5px 0 0 0; color: #5b21b6; font-size: 15px; font-weight: 600; font-style: italic;">
              "Success is where preparation and opportunity meet. Let's get you prepared!"
            </p>
          </div>

          <p style="margin-top: 30px;">Thank you for choosing NextGen MedPrep!</p>
          <p>Best regards,<br><strong>The NextGen MedPrep Team</strong></p>
        </div>
      `
    };
  }

  private getRevisionPlanTutorNotificationTemplate(data: {
    bookingId: string;
    customerEmail: string;
    customerName: string;
    weeks: number;
    intensity: string;
    platform: string;
    amount: number;
  }): EmailTemplate {
    return {
      subject: `New Personalised Revision Plan Order - ${data.customerName}`,
      text: `New Personalised UCAT Revision Plan Order\n\nStudent Details:\nName: ${data.customerName}\nEmail: ${data.customerEmail}\n\nPlan Details:\nBooking ID: ${data.bookingId}\nDuration: ${data.weeks} weeks\nIntensity: ${data.intensity}\nPlatform: ${data.platform}\nAmount: £${data.amount}\n\nAction Required:\nPlease create the personalised revision plan based on these specifications and send it to the student within 24 hours.\n\nPlan Requirements:\n- Customise for ${data.weeks}-week timeline\n- Adjust daily targets for ${data.intensity} intensity level\n- Include ${data.platform}-specific resource recommendations\n- Provide week-by-week breakdown for all UCAT sections\n- Include mock exam schedule\n- Add progress tracking milestones\n\nStudent contact: ${data.customerEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">New Personalised Revision Plan Order 📋</h1>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-size: 15px; color: #92400e; font-weight: bold;">
              ⚠️ Action Required: Create and send plan within 24 hours
            </p>
          </div>

          <div style="background-color: #f5f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
            <h3 style="margin-top: 0; color: #5b21b6;">Student Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.customerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${data.customerEmail}" style="color: #7c3aed;">${data.customerEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Booking ID:</td>
                <td style="padding: 8px; font-family: monospace;">${data.bookingId}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #1e40af;">Plan Specifications:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Duration:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>${data.weeks} weeks</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Intensity:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-transform: capitalize;"><strong>${data.intensity}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Platform:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-transform: capitalize;"><strong>${data.platform}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Amount Paid:</td>
                <td style="padding: 8px; font-size: 16px; font-weight: bold; color: #059669;">£${data.amount}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Plan Requirements:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Customise for <strong>${data.weeks}-week timeline</strong></li>
              <li>Adjust daily targets for <strong>${data.intensity} intensity</strong> level</li>
              <li>Include <strong>${data.platform}-specific</strong> resource recommendations</li>
              <li>Provide <strong>week-by-week breakdown</strong> for all UCAT sections (VR, DM, QR, AR, SJT)</li>
              <li>Include <strong>mock exam schedule</strong> and timing strategies</li>
              <li>Add <strong>progress tracking milestones</strong> for each week</li>
              <li>Include <strong>rest days</strong> to prevent burnout</li>
            </ul>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">Delivery Instructions:</h3>
            <p style="margin: 0; color: #374151; line-height: 1.6;">
              1. Create the personalised plan as a <strong>PDF document</strong><br>
              2. Ensure all sections are clearly labeled and formatted<br>
              3. Send the plan to <a href="mailto:${data.customerEmail}" style="color: #059669; font-weight: bold;">${data.customerEmail}</a> within 24 hours<br>
              4. CC contact@nextgenmedprep.com for record keeping
            </p>
          </div>

          <p style="margin-top: 30px;">Best regards,<br><strong>NextGen MedPrep System</strong></p>
        </div>
      `
    };
  }

  // UCAT Add-on Email Methods
  async sendUCATAddonConfirmationEmail(email: string, data: {
    id: string;
    packageName: string;
    packageType: string;
    amount: number;
    userName?: string;
  }): Promise<void> {
    const template = this.getUCATAddonConfirmationTemplate(data);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'ucat_addon_confirmation');
  }

  async sendUCATAddonAdminNotificationEmail(adminEmail: string, data: {
    bookingId: string;
    customerEmail: string;
    customerName: string;
    packageName: string;
    packageType: string;
    amount: number;
  }): Promise<void> {
    const template = this.getUCATAddonAdminNotificationTemplate(data);
    
    await this.sendMailWithTracking({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
    }, 'ucat_addon_admin_notification');
  }

  private getUCATAddonConfirmationTemplate(data: {
    id: string;
    packageName: string;
    packageType: string;
    amount: number;
    userName?: string;
  }): EmailTemplate {
    const userName = data.userName || 'there';
    
    const packageDescriptions: { [key: string]: { title: string; benefits: string[]; nextSteps: string[] } } = {
      'complete_ucat_conference_pack': {
        title: 'Complete UCAT Conference Pack',
        benefits: [
          'Access to ALL recorded conference sessions',
          'Comprehensive UCAT strategy workshops',
          'Expert tips from 3000+ scorers',
          'Downloadable study materials',
          'Q&A session recordings'
        ],
        nextSteps: [
          'You will receive access links to all conference recordings within 24 hours',
          'Check your email (including spam folder) for the access details',
          'Conference materials will be available for 12 months from purchase'
        ]
      },
      'unlimited_support_package': {
        title: 'Unlimited Support Package',
        benefits: [
          'Unlimited question submissions via email',
          'Expert guidance from 3000+ UCAT scorers',
          'Personalised feedback on your answers',
          'Strategy tips for challenging questions',
          'Support until your UCAT exam date'
        ],
        nextSteps: [
          'You can start submitting questions immediately to contact@nextgenmedprep.com',
          'Include your booking ID in all correspondence for faster responses',
          'Expect responses within 24-48 hours during weekdays'
        ]
      }
    };

    const packageInfo = packageDescriptions[data.packageType] || {
      title: data.packageName,
      benefits: ['Full package access'],
      nextSteps: ['Our team will be in touch within 24 hours']
    };

    return {
      subject: `Your ${packageInfo.title} Purchase Confirmed - NextGen MedPrep`,
      text: `Hi ${userName},\n\nThank you for purchasing the ${packageInfo.title}!\n\nYour Purchase Details:\nBooking ID: ${data.id}\nPackage: ${packageInfo.title}\nAmount: £${data.amount}\n\nWhat's Included:\n${packageInfo.benefits.map(b => `• ${b}`).join('\n')}\n\nNext Steps:\n${packageInfo.nextSteps.map(s => `• ${s}`).join('\n')}\n\nIf you have any questions, feel free to reach out to us at contact@nextgenmedprep.com.\n\nThank you for choosing NextGen MedPrep!\n\nBest regards,\nThe NextGen MedPrep Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Thank You for Your Purchase! 🎉</h1>
          <p>Hi ${userName},</p>
          <p>Thank you for purchasing the <strong>${packageInfo.title}</strong>!</p>
          
          <div style="background-color: #f5f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
            <h3 style="margin-top: 0; color: #5b21b6;">Your Purchase Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Booking ID:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${data.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Package:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>${packageInfo.title}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Amount:</td>
                <td style="padding: 8px; font-size: 18px; font-weight: bold; color: #059669;">£${data.amount}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">What's Included:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
              ${packageInfo.benefits.map(b => `<li>${b}</li>`).join('\n              ')}
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">Next Steps:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
              ${packageInfo.nextSteps.map(s => `<li>${s}</li>`).join('\n              ')}
            </ul>
          </div>

          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              <strong>Questions?</strong> Feel free to reach out at <a href="mailto:contact@nextgenmedprep.com" style="color: #7c3aed;">contact@nextgenmedprep.com</a>
            </p>
          </div>

          <div style="background-color: #ddd6fe; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 16px; color: #5b21b6;">
              <strong>NextGen MedPrep</strong><br>
              <span style="font-size: 14px;">Your pathway to medical school success</span>
            </p>
          </div>

          <p style="margin-top: 30px;">Best regards,<br><strong>The NextGen MedPrep Team</strong></p>
        </div>
      `
    };
  }

  private getUCATAddonAdminNotificationTemplate(data: {
    bookingId: string;
    customerEmail: string;
    customerName: string;
    packageName: string;
    packageType: string;
    amount: number;
  }): EmailTemplate {
    const packageDescriptions: { [key: string]: { title: string; action: string } } = {
      'complete_ucat_conference_pack': {
        title: 'Complete UCAT Conference Pack',
        action: 'Send conference access links and materials to the customer within 24 hours.'
      },
      'unlimited_support_package': {
        title: 'Unlimited Support Package',
        action: 'Customer can now submit unlimited questions to contact@nextgenmedprep.com. Ensure prompt responses.'
      }
    };

    const packageInfo = packageDescriptions[data.packageType] || {
      title: data.packageName,
      action: 'Please process this order and follow up with the customer.'
    };

    return {
      subject: `🎓 New UCAT Add-on Purchase: ${packageInfo.title}`,
      text: `New UCAT Add-on Purchase\n\nA customer has purchased the ${packageInfo.title}.\n\nBooking Details:\nBooking ID: ${data.bookingId}\nCustomer: ${data.customerName}\nEmail: ${data.customerEmail}\nPackage: ${packageInfo.title}\nAmount: £${data.amount}\n\nRequired Action:\n${packageInfo.action}\n\n- NextGen MedPrep System`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">🎓 New UCAT Add-on Purchase</h1>
          <p>A customer has purchased the <strong>${packageInfo.title}</strong>.</p>
          
          <div style="background-color: #f5f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
            <h3 style="margin-top: 0; color: #5b21b6;">Booking Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Booking ID:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${data.bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Customer:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>${data.customerName}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${data.customerEmail}" style="color: #7c3aed;">${data.customerEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Package:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>${packageInfo.title}</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Amount:</td>
                <td style="padding: 8px; font-size: 18px; font-weight: bold; color: #059669;">£${data.amount}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #92400e;">⚡ Required Action:</h3>
            <p style="margin: 0; color: #374151; line-height: 1.6;">
              ${packageInfo.action}
            </p>
          </div>

          <p style="margin-top: 30px;">Best regards,<br><strong>NextGen MedPrep System</strong></p>
        </div>
      `
    };
  }
}

export default new EmailService();

