import nodemailer from 'nodemailer';
import { EmailTemplate } from '@nextgenmedprep/common-types';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const port = parseInt(process.env.EMAIL_PORT || '587');
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: port,
      secure: port === 465,  // SSL for port 465 or 587 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // additional options for better compatibility
      requireTLS: port !== 465,
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates (adjust for production)
      }
    });
  }

  async sendWelcomeEmail(email: string, subscriptionTier: string): Promise<void> {
    console.log("environment variables:", {
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT,
      EMAIL_USER: !!process.env.EMAIL_USER, // Log if the user is set
      EMAIL_PASS: !!process.env.EMAIL_PASS, // Log if the password is set
      EMAIL_FROM: process.env.EMAIL_FROM,
    });

    const template = this.getWelcomeEmailTemplate(subscriptionTier);

    console.log("Sending welcome email to:", email, "with template:", template);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
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

    await this.transporter.sendMail(mailOptions);
  }

  async sendUnsubscribeConfirmation(email: string): Promise<void> {
    const template = this.getUnsubscribeTemplate();
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  async sendSubscriptionUpgradeEmail(email: string, newTier: string): Promise<void> {
    const template = this.getUpgradeEmailTemplate(newTier);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  async sendNewJoinerConfirmationEmail(email: string, fullName: string): Promise<void> {
    const template = this.getNewJoinerConfirmationTemplate(fullName);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  async sendNewJoinerNotificationEmail(newJoiner: any): Promise<void> {
    const template = this.getNewJoinerNotificationTemplate(newJoiner);
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
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
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
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
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
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
    console.log('Sending personal statement confirmation email to:', email);

    const template = this.getPersonalStatementConfirmationTemplate(data);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  async sendPersonalStatementReviewNotificationEmail(data: {
    personalStatementId: string;
    customerEmail: string;
    customerName: string;
    statementType: string;
    filePath: string;
  }): Promise<void> {
    const reviewEmail = process.env.REVIEW_TEAM_EMAIL || 'contact@nextgenmedprep.com';
    console.log('Sending personal statement review notification to:', reviewEmail);

    const template = this.getPersonalStatementReviewNotificationTemplate(data);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: reviewEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
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
    console.log('Sending career consultation confirmation email to:', email);

    const template = this.getCareerConsultationConfirmationTemplate(data);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }
  
  async sendEventBookingConfirmationEmail(email: string, data: {
    id: string;
    amount: number;
    userName: string;
    eventName: string;
    numberOfTickets?: number;
  }): Promise<void> {
    console.log('Sending event booking confirmation email to:', email);

    const template = this.getEventBookingConfirmationTemplate(data);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
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
- Event: ${data.eventName}
- Number of Tickets: ${ticketCount}
- Amount: £${data.amount}
- Booking ID: ${data.id}

What happens next:
• You'll receive a confirmation email with event details closer to the Event within 48 hours
• Your will be able to join the event via zoom 
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
              <li><strong>Event:</strong> ${data.eventName}</li>
              <li><strong>Number of Tickets:</strong> ${ticketCount}</li>
              <li><strong>Amount:</strong> £${data.amount}</li>
              <li><strong>Booking ID:</strong> ${data.id}</li>
            </ul>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">What happens next?</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li>You'll receive a confirmation email with event details within <strong>48 hours</strong></li>
              <li>Your ticket(s) will be emailed to you <strong>1 week</strong> before the event</li>
              <li>Please arrive <strong>15 minutes</strong> before the event starts for registration</li>
              <li>Bring your ticket (digital or printed) for entry</li>
            </ul>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>📝 Have questions?</strong> Contact us at contact@nextgenmedprep.com for any event-related inquiries.
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
  }): Promise<void> {
    console.log('Sending interview booking confirmation email to:', email);

    const template = this.getInterviewBookingConfirmationTemplate(data);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  async sendInterviewBookingNotificationEmail(data: {
    bookingId: string;
    customerEmail: string;
    customerName: string;
    packageType: string;
    serviceType: string;
    universities: string[];
    amount: number;
    filePath: string;
    downloadUrl?: string;
    notes?: string;
    preferredDate?: string;
  }): Promise<void> {
    const adminEmail = process.env.REVIEW_TEAM_EMAIL || 'contact@nextgenmedprep.com';
    console.log('Sending interview booking notification to:', adminEmail);

    const template = this.getInterviewBookingNotificationTemplate(data);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
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
  }): EmailTemplate {
    const packageLabel = data.packageType === 'single' ? 'Single Session' : 'Package Deal';
    const serviceLabel = data.serviceType === 'generated' ? 'AI-Generated Mock Questions' : 'Live Tutor Session';
    const universitiesStr = data.universities.join(', ');
    
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

What happens next:
• Our team will review your personal statement and university choices
• We'll contact you within 24 hours to schedule your session
• You'll receive preparation materials tailored to your universities
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

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #065f46;">What happens next?</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li>Our team will review your personal statement and university choices</li>
              <li>We'll contact you within <strong>24 hours</strong> to schedule your session</li>
              <li>You'll receive preparation materials tailored to your universities</li>
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
    filePath: string;
    downloadUrl?: string;
    notes?: string;
    preferredDate?: string;
  }): EmailTemplate {
    const packageLabel = data.packageType === 'single' ? 'Single Session' : 'Package Deal';
    const serviceLabel = data.serviceType === 'generated' ? 'AI-Generated Mock Questions' : 'Live Tutor Session';
    const universitiesStr = data.universities.join(', ');
    
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
- Universities: ${universitiesStr}
- Amount: £${data.amount}
${data.preferredDate ? `- Preferred Date: ${data.preferredDate}` : ''}
${data.notes ? `- Notes: ${data.notes}` : ''}

Personal Statement:
- File Path: ${data.filePath}
${data.downloadUrl ? `- Download Link: ${data.downloadUrl} (valid for 7 days)` : ''}

Action Required:
1. Download the personal statement using the link above or from Supabase storage
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
            <h4 style="margin-top: 0; color: #92400e;">Student Notes:</h4>
            <p style="margin: 0; color: #78350f;">${data.notes}</p>
          </div>
          ` : ''}

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

          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #991b1b;">Action Required</h3>
            <ol style="color: #374151; margin: 0; padding-left: 20px;">
              <li>Download the personal statement from Supabase storage</li>
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
}

export default new EmailService();

