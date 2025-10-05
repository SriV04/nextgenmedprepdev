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

  async sendNewsletterEmail(emails: string[], subject: string, content: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      bcc: emails, // Use BCC to hide other recipients
      subject: subject,
      html: this.getNewsletterTemplate(content),
    };

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
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1>NextGen MedPrep Newsletter</h1>
        </header>
        <main style="padding: 20px;">
          ${content}
        </main>
        <footer style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>You're receiving this because you subscribed to NextGen MedPrep newsletters.</p>
          <p><a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #2563eb;">Unsubscribe</a></p>
        </footer>
      </div>
    `;
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
      text: `New tutor application received!\n\nApplicant Details:\nName: ${newJoiner.full_name}\nEmail: ${newJoiner.email}\nPhone: ${newJoiner.phone_number || 'Not provided'}\nUniversity Year: ${newJoiner.university_year}\nSubjects: ${subjectsStr}\nAvailability: ${availabilityStr}\n\nPlease review the full application in the admin dashboard.`,
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
            <p style="margin: 5px 0 0 0;">Please review the full application in the admin dashboard and contact the applicant for next steps.</p>
          </div>
          <p>Application ID: ${newJoiner.id}</p>
        </div>
      `
    };
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

