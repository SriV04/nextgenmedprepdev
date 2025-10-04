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

