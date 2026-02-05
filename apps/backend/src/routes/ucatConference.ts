import { Router, Request, Response } from 'express';
import { createSupabaseClient } from '../../supabase/config';
import emailService from '../services/emailService';

const router = Router();

/**
 * POST /api/v1/ucat-conference/signup
 * Sign up for the free UCAT introduction conference
 */
router.post('/ucat-conference/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({
        success: false,
        message: 'Valid email is required',
      });
      return;
    }

    const supabase = createSupabaseClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    let userId: string;

    if (existingUser) {
      // User already exists
      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: email.toLowerCase(),
          name: email.split('@')[0], // Use email prefix as initial name
          role: 'student',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError || !newUser) {
        console.error('Error creating user:', userError);
        res.status(500).json({
          success: false,
          message: 'Failed to create user',
        });
        return;
      }

      userId = newUser.id;
    }

    // Check if user already has a subscription for this conference
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('subscription_tier', 'ucat_conf')
      .single();

    if (existingSubscription) {
      res.status(200).json({
        success: true,
        message: 'You are already signed up for the UCAT conference',
        userId,
      });
      return;
    }

    // Create subscription with tier 'ucat_conf'
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        email: email.toLowerCase(),
        user_id: userId,
        subscription_tier: 'ucat_conf',
        subscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (subscriptionError || !subscription) {
      console.error('Error creating subscription:', subscriptionError);
      res.status(500).json({
        success: false,
        message: 'Failed to create subscription',
      });
      return;
    }

    // Send confirmation email
    try {
      await emailService.sendUcatConferenceConfirmationEmail(email.toLowerCase());
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the signup if email fails, just log it
    }

    res.status(201).json({
      success: true,
      message: 'Successfully signed up for the UCAT conference',
      userId,
      subscriptionId: subscription.id,
    });
  } catch (error) {
    console.error('Error in UCAT conference signup:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
