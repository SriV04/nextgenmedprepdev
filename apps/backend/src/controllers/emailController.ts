import { Request, Response } from 'express';
import emailService from '@/services/emailService';
import supabaseService from '@/services/supabaseService';
import { AppError, ApiResponse } from '@nextgenmedprep/common-types';

export class EmailController {
  // Send newsletter to all subscribed users
  async sendNewsletter(req: Request, res: Response): Promise<void> {
    const { subject, content, target_tiers } = req.body;

    if (!subject || !content) {
      throw new AppError('Subject and content are required', 400);
    }

    // Get subscribed emails based on target tiers
    const filters: any = {
      opt_in_newsletter: true,
    };

    if (target_tiers && target_tiers.length > 0) {
      // This would need to be implemented in supabaseService to handle array filters
      // For now, we'll get all and filter in memory
    }

    const { subscriptions } = await supabaseService.getSubscriptions(filters, { limit: 1000 });

    // Filter out unsubscribed emails
    const activeSubscriptions = subscriptions.filter(sub => !sub.unsubscribed_at);

    // Filter by target tiers if specified
    const targetEmails = target_tiers && target_tiers.length > 0
      ? activeSubscriptions.filter(sub => target_tiers.includes(sub.subscription_tier))
      : activeSubscriptions;

    if (targetEmails.length === 0) {
      throw new AppError('No subscribers found for the specified criteria', 400);
    }

    const emails = targetEmails.map(sub => sub.email);

    // Send newsletter in batches to avoid rate limits
    const batchSize = 50;
    const batches = [];
    for (let i = 0; i < emails.length; i += batchSize) {
      batches.push(emails.slice(i, i + batchSize));
    }

    let successCount = 0;
    let errorCount = 0;

    for (const batch of batches) {
      try {
        await emailService.sendNewsletterEmail(batch, subject, content);
        successCount += batch.length;
      } catch (error) {
        console.error('Failed to send newsletter batch:', error);
        errorCount += batch.length;
      }
    }

    const response: ApiResponse<{ sent: number; failed: number; total: number }> = {
      success: true,
      data: {
        sent: successCount,
        failed: errorCount,
        total: emails.length,
      },
      message: `Newsletter sent to ${successCount} subscribers`,
    };

    res.json(response);
  }

  // Send welcome email manually
  async sendWelcomeEmail(req: Request, res: Response): Promise<void> {
    const { email, subscription_tier } = req.body;

    console.log('Sending welcome email:', { email, subscription_tier });

    if (!email || !subscription_tier) {
      throw new AppError('Email and subscription_tier are required', 400);
    }

    // Verify subscription exists
    const subscription = await supabaseService.getSubscriptionByEmail(email);
    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    await emailService.sendWelcomeEmail(email, subscription_tier);

    const response: ApiResponse = {
      success: true,
      message: 'Welcome email sent successfully',
    };

    res.json(response);
  }

  // Test email configuration
  async testEmailConfig(req: Request, res: Response): Promise<void> {
    const isConfigValid = await emailService.verifyConnection();

    const response: ApiResponse<{ isValid: boolean }> = {
      success: true,
      data: { isValid: isConfigValid },
      message: isConfigValid ? 'Email configuration is valid' : 'Email configuration failed',
    };

    res.json(response);
  }

  // Send custom email to specific subscribers
  async sendCustomEmail(req: Request, res: Response): Promise<void> {
    const { emails, subject, content, subscription_tiers } = req.body;

    if (!subject || !content) {
      throw new AppError('Subject and content are required', 400);
    }

    let targetEmails: string[] = [];

    if (emails && emails.length > 0) {
      // Use specific emails provided
      targetEmails = emails;
    } else if (subscription_tiers && subscription_tiers.length > 0) {
      // Get emails by subscription tiers
      const { subscriptions } = await supabaseService.getSubscriptions({}, { limit: 1000 });
      targetEmails = subscriptions
        .filter(sub => 
          subscription_tiers.includes(sub.subscription_tier) && 
          sub.opt_in_newsletter && 
          !sub.unsubscribed_at
        )
        .map(sub => sub.email);
    } else {
      throw new AppError('Either specific emails or subscription_tiers must be provided', 400);
    }

    if (targetEmails.length === 0) {
      throw new AppError('No valid email addresses found', 400);
    }

    // Send emails in batches
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < targetEmails.length; i += batchSize) {
      const batch = targetEmails.slice(i, i + batchSize);
      try {
        await emailService.sendNewsletterEmail(batch, subject, content);
        successCount += batch.length;
      } catch (error) {
        console.error('Failed to send email batch:', error);
        errorCount += batch.length;
      }
    }

    const response: ApiResponse<{ sent: number; failed: number; total: number }> = {
      success: true,
      data: {
        sent: successCount,
        failed: errorCount,
        total: targetEmails.length,
      },
      message: `Email sent to ${successCount} recipients`,
    };

    res.json(response);
  }

  // Send custom email to users who booked a specific package
  async sendEmailByPackage(req: Request, res: Response): Promise<void> {
    const { package_type, subject, content } = req.body;

    if (!package_type || !subject || !content) {
      throw new AppError('package_type, subject, and content are required', 400);
    }

    // Get all bookings for the specified package
    const bookings = await supabaseService.getBookingsByPackage(package_type);

    if (bookings.length === 0) {
      throw new AppError(`No bookings found for package: ${package_type}`, 404);
    }

    // Extract unique emails from bookings
    const uniqueEmails = [...new Set(bookings.map(booking => booking.email).filter(Boolean))];
    
    // Add contact@nextgenmedprep.com for visibility
    uniqueEmails.push('contact@nextgenmedprep.com');
    uniqueEmails.push('sri@nextgenmedprep.com');

    if (uniqueEmails.length === 0) {
      throw new AppError('No email addresses found in bookings', 400);
    }

    console.log(`Found ${uniqueEmails.length} unique emails for package: ${package_type}`);

    // Send emails in batches
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < uniqueEmails.length; i += batchSize) {
      const batch = uniqueEmails.slice(i, i + batchSize);
      try {
        await emailService.sendNewsletterEmail(batch, subject, content);
        successCount += batch.length;
      } catch (error) {
        console.error('Failed to send email batch:', error);
        errorCount += batch.length;
      }
    }

    const response: ApiResponse<{ sent: number; failed: number; total: number; package_type: string }> = {
      success: true,
      data: {
        sent: successCount,
        failed: errorCount,
        total: uniqueEmails.length,
        package_type: package_type,
      },
      message: `Email sent to ${successCount} recipients who booked ${package_type}`,
    };

    res.json(response);
  }

  // Get email statistics
  async getEmailStats(req: Request, res: Response): Promise<void> {
    const { subscriptions, total } = await supabaseService.getSubscriptions({}, { limit: 10000 });

    const stats = {
      total_subscriptions: total,
      active_subscriptions: subscriptions.filter(sub => !sub.unsubscribed_at).length,
      newsletter_subscribers: subscriptions.filter(sub => sub.opt_in_newsletter && !sub.unsubscribed_at).length,
      by_tier: {
        free: subscriptions.filter(sub => sub.subscription_tier === 'free' && !sub.unsubscribed_at).length,
        medical_free: subscriptions.filter(sub => sub.subscription_tier === 'medical_free' && !sub.unsubscribed_at).length,
        dentist_free: subscriptions.filter(sub => sub.subscription_tier === 'dentist_free' && !sub.unsubscribed_at).length,
      },
      unsubscribed: subscriptions.filter(sub => sub.unsubscribed_at).length,
    };

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
    };

    res.json(response);
  }
}
