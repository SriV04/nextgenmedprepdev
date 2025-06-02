import { Request, Response } from 'express';
import supabaseService from '@/services/supabaseService';
import emailService from '@/services/emailService';
import { AppError, ApiResponse, Subscription, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '@nextgenmedprep/common-types';

export class SubscriptionController {
  // Create a new subscription
  async createSubscription(req: Request, res: Response): Promise<void> {
    const { email, subscription_tier, opt_in_newsletter }: CreateSubscriptionRequest = req.body;

    // Check if subscription already exists
    const existingSubscription = await supabaseService.getSubscriptionByEmail(email);
    if (existingSubscription) {
      throw new AppError('Email is already subscribed', 409);
    }

    // Check if user exists and link if they do
    const existingUser = await supabaseService.getUserByEmail(email);

    const subscriptionData: Omit<Subscription, 'subscribed_at' | 'updated_at'> = {
      email,
      subscription_tier: subscription_tier || 'free',
      opt_in_newsletter: opt_in_newsletter !== undefined ? opt_in_newsletter : true,
      user_id: existingUser?.id,
    };

    const subscription = await supabaseService.createSubscription(subscriptionData);

    // Send welcome email if opted in
    if (subscription.opt_in_newsletter) {
      try {
        await emailService.sendWelcomeEmail(email, subscription.subscription_tier);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the subscription creation if email fails
      }
    }

    const response: ApiResponse<Subscription> = {
      success: true,
      data: subscription,
      message: 'Subscription created successfully',
    };

    res.status(201).json(response);
  }

  // Get subscription by email
  async getSubscription(req: Request, res: Response): Promise<void> {
    const { email } = req.params;

    const subscription = await supabaseService.getSubscriptionByEmail(email);
    if (!subscription) {
      throw new AppError('Subscription not found', 404);
    }

    const response: ApiResponse<Subscription> = {
      success: true,
      data: subscription,
    };

    res.json(response);
  }

  // Update subscription
  async updateSubscription(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const updates: UpdateSubscriptionRequest = req.body;

    // Check if subscription exists
    const existingSubscription = await supabaseService.getSubscriptionByEmail(email);
    if (!existingSubscription) {
      throw new AppError('Subscription not found', 404);
    }

    const subscription = await supabaseService.updateSubscription(email, updates);

    // Send upgrade email if tier was upgraded
    if (updates.subscription_tier && updates.subscription_tier !== existingSubscription.subscription_tier) {
      try {
        await emailService.sendSubscriptionUpgradeEmail(email, updates.subscription_tier);
      } catch (emailError) {
        console.error('Failed to send upgrade email:', emailError);
      }
    }

    const response: ApiResponse<Subscription> = {
      success: true,
      data: subscription,
      message: 'Subscription updated successfully',
    };

    res.json(response);
  }

  // Delete subscription
  async deleteSubscription(req: Request, res: Response): Promise<void> {
    const { email } = req.params;

    // Check if subscription exists
    const existingSubscription = await supabaseService.getSubscriptionByEmail(email);
    if (!existingSubscription) {
      throw new AppError('Subscription not found', 404);
    }

    await supabaseService.deleteSubscription(email);

    const response: ApiResponse = {
      success: true,
      message: 'Subscription deleted successfully',
    };

    res.json(response);
  }

  // Unsubscribe (soft delete - sets unsubscribed_at)
  async unsubscribe(req: Request, res: Response): Promise<void> {
    const { email } = req.params;

    // Check if subscription exists
    const existingSubscription = await supabaseService.getSubscriptionByEmail(email);
    if (!existingSubscription) {
      throw new AppError('Subscription not found', 404);
    }

    if (existingSubscription.unsubscribed_at) {
      throw new AppError('Email is already unsubscribed', 400);
    }

    const subscription = await supabaseService.unsubscribeEmail(email);

    // Send unsubscribe confirmation email
    try {
      await emailService.sendUnsubscribeConfirmation(email);
    } catch (emailError) {
      console.error('Failed to send unsubscribe confirmation:', emailError);
    }

    const response: ApiResponse<Subscription> = {
      success: true,
      data: subscription,
      message: 'Successfully unsubscribed',
    };

    res.json(response);
  }

  // Resubscribe (remove unsubscribed_at)
  async resubscribe(req: Request, res: Response): Promise<void> {
    const { email } = req.params;

    // Check if subscription exists
    const existingSubscription = await supabaseService.getSubscriptionByEmail(email);
    if (!existingSubscription) {
      throw new AppError('Subscription not found', 404);
    }

    if (!existingSubscription.unsubscribed_at) {
      throw new AppError('Email is not unsubscribed', 400);
    }

    const subscription = await supabaseService.updateSubscription(email, {
      unsubscribed_at: null,
      opt_in_newsletter: true,
    });

    const response: ApiResponse<Subscription> = {
      success: true,
      data: subscription,
      message: 'Successfully resubscribed',
    };

    res.json(response);
  }

  // Get all subscriptions (admin only)
  async getSubscriptions(req: Request, res: Response): Promise<void> {
    const filters = req.query as any;
    const pagination = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
    };

    const result = await supabaseService.getSubscriptions(filters, pagination);

    const response: ApiResponse<{ subscriptions: Subscription[]; pagination: any }> = {
      success: true,
      data: {
        subscriptions: result.subscriptions,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / pagination.limit),
        },
      },
    };

    res.json(response);
  }

  // Check subscription status for content access
  async checkAccess(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const { resource_type } = req.query;

    const subscription = await supabaseService.getSubscriptionByEmail(email);
    
    if (!subscription || subscription.unsubscribed_at) {
    const response: ApiResponse<{ hasAccess: boolean }> = {
      success: true,
      data: { hasAccess: false },
      message: 'No active subscription found',
    };
    res.json(response);
    return;
    }

    // Define access levels
    const accessLevels = {
      free: ['basic_resources'],
      newsletter_only: ['basic_resources', 'newsletters'],
      premium_basic: ['basic_resources', 'newsletters', 'premium_content', 'mock_interviews'],
      premium_plus: ['basic_resources', 'newsletters', 'premium_content', 'mock_interviews', 'tutoring', 'unlimited_tests'],
    };

    const userAccess = accessLevels[subscription.subscription_tier as keyof typeof accessLevels] || [];
    const hasAccess = !resource_type || userAccess.includes(resource_type as string);

    const response: ApiResponse<{ hasAccess: boolean; subscription_tier: string; access_levels: string[] }> = {
      success: true,
      data: {
        hasAccess,
        subscription_tier: subscription.subscription_tier,
        access_levels: userAccess,
      },
    };

    res.json(response);
  }
}
