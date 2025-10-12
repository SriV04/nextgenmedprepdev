import Stripe from 'stripe';
import { 
  CreatePaymentRequest,
  PaymentStatus,
  AppError 
} from '../types';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      throw new AppError('Stripe secret key not configured', 500);
    }

    console.log(`StripeService initialized`);
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Create a checkout session for one-time payment
   */
  async createCheckoutPayment(paymentData: CreatePaymentRequest): Promise<StripePaymentResponse> {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      const sessionData: Stripe.Checkout.SessionCreateParams = {
        line_items: [
          {
            price_data: {
              currency: paymentData.currency.toLowerCase(),
              product_data: {
                name: paymentData.description,
              },
              unit_amount: Math.round(paymentData.amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/payment/canceled`,
        customer_email: paymentData.customer_email,
        metadata: {
          product_id: paymentData.product_id || '',
          type: 'one_time_payment',
          ...(paymentData as any).metadata // Allow additional metadata to be passed through
        }
      };

      const session = await this.stripe.checkout.sessions.create(sessionData);
      
      return {
        success: true,
        checkout_url: session.url!,
        session_id: session.id,
        payment_intent_id: session.payment_intent as string
      };
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      throw new AppError(error.message || 'Payment processing failed', 500);
    }
  }

  /**
   * Create a checkout session for subscription
   */
  async createSubscription(
    paymentData: CreatePaymentRequest & { 
      recurring: { 
        every: number; 
        period: 'day' | 'week' | 'month' | 'year'; 
        start_time?: string;
      } 
    }
  ): Promise<StripePaymentResponse> {
    try {
      // Convert period to Stripe interval
      let interval: Stripe.Price.Recurring.Interval;
      let interval_count = paymentData.recurring.every;
      
      switch (paymentData.recurring.period) {
        case 'day':
          interval = 'day';
          break;
        case 'week':
          interval = 'week';
          break;
        case 'month':
          interval = 'month';
          break;
        case 'year':
          interval = 'year';
          break;
        default:
          throw new AppError('Invalid recurring period', 400);
      }

      // Create or get existing product
      const product = await this.stripe.products.create({
        name: paymentData.description,
      });

      // Create a recurring price
      const price = await this.stripe.prices.create({
        currency: paymentData.currency.toLowerCase(),
        unit_amount: Math.round(paymentData.amount * 100), // Convert to cents
        recurring: {
          interval,
          interval_count,
        },
        product: product.id,
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      const sessionData: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/payment/canceled`,
        customer_email: paymentData.customer_email,
        metadata: {
          product_id: paymentData.product_id || '',
          type: 'subscription',
          recurring_period: paymentData.recurring.period,
          recurring_every: paymentData.recurring.every.toString()
        }
      };

      // Add trial period if start_time is in the future
      if (paymentData.recurring.start_time) {
        const startDate = new Date(paymentData.recurring.start_time);
        const now = new Date();
        if (startDate > now) {
          const trialDays = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          sessionData.subscription_data = {
            trial_period_days: trialDays
          };
        }
      }

      const session = await this.stripe.checkout.sessions.create(sessionData);
      
      return {
        success: true,
        checkout_url: session.url!,
        session_id: session.id,
        subscription_id: session.subscription as string
      };
    } catch (error: any) {
      console.error('Stripe subscription error:', error);
      throw new AppError(error.message || 'Subscription processing failed', 500);
    }
  }

  /**
   * Get payment status by session ID
   */
  async getPaymentStatus(sessionId: string): Promise<PaymentStatus> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      
      let status: PaymentStatus['status'] = 'processing';
      
      if (session.payment_status === 'paid') {
        status = 'approved';
      } else if (session.payment_status === 'unpaid') {
        status = 'declined';
      }

      return {
        order_id: session.id,
        status,
        amount: session.amount_total?.toString() || '0',
        currency: session.currency || '',
        payment_system: 'stripe',
        masked_card: undefined // Stripe doesn't provide this in session
      };
    } catch (error: any) {
      console.error('Stripe status error:', error);
      throw new AppError(error.message || 'Failed to get payment status', 500);
    }
  }

  /**
   * Get payment status by payment intent ID
   */
  async getPaymentIntentStatus(paymentIntentId: string): Promise<PaymentStatus> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      let status: PaymentStatus['status'] = 'processing';
      
      switch (paymentIntent.status) {
        case 'succeeded':
          status = 'approved';
          break;
        case 'canceled':
          status = 'declined';
          break;
        case 'requires_payment_method':
        case 'requires_confirmation':
        case 'requires_action':
        case 'processing':
          status = 'processing';
          break;
      }

      return {
        order_id: paymentIntent.id,
        status,
        amount: paymentIntent.amount.toString(),
        currency: paymentIntent.currency,
        payment_system: 'stripe',
        masked_card: undefined
      };
    } catch (error: any) {
      console.error('Stripe payment intent status error:', error);
      throw new AppError(error.message || 'Failed to get payment intent status', 500);
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentIntentId: string, amount?: number): Promise<any> {
    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await this.stripe.refunds.create(refundData);
      return refund;
    } catch (error: any) {
      console.error('Stripe refund error:', error);
      throw new AppError(error.message || 'Refund processing failed', 500);
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string | Buffer, signature: string): Stripe.Event {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!endpointSecret) {
        throw new AppError('Stripe webhook secret not configured', 500);
      }

      return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (error: any) {
      console.error('Webhook signature verification error:', error);
      throw new AppError('Invalid webhook signature', 400);
    }
  }

  /**
   * Process webhook from Stripe
   */
  async processWebhook(event: Stripe.Event): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`=== Processing Stripe webhook event: ${event.type} ===`);
      console.log('Event ID:', event.id);
      console.log('Event data:', JSON.stringify(event.data.object, null, 2));
      
      switch (event.type) {
        case 'checkout.session.completed':
          console.log('Handling checkout session completed');
          await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        case 'payment_intent.succeeded':
          console.log('Handling payment intent succeeded');
          await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          console.log('Handling payment intent failed');
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          console.log('Handling subscription change');
          await this.handleSubscriptionChange(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          console.log('Handling subscription deleted');
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        case 'invoice.payment_succeeded':
          console.log('Handling invoice payment succeeded');
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        case 'invoice.payment_failed':
          console.log('Handling invoice payment failed');
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      console.log(`=== Successfully processed webhook event: ${event.type} ===`);
      return { success: true, message: 'Webhook processed successfully' };
    } catch (error: any) {
      console.error('=== Webhook processing error ===');
      console.error('Error:', error);
      console.error('Error stack:', error.stack);
      throw new AppError(error.message || 'Webhook processing failed', 500);
    }
  }

  /**
   * Handle successful checkout session
   */
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    console.log(`=== Checkout session completed: ${session.id} ===`);
    console.log('Session mode:', session.mode);
    console.log('Session metadata:', session.metadata);
    console.log('Customer details:', session.customer_details);
    console.log('Payment intent:', session.payment_intent);
    
    try {
      if (session.mode === 'subscription') {
        console.log(`Subscription created: ${session.subscription}`);
        // Handle subscription activation - this is handled separately in subscription webhooks
      } else {
        console.log(`One-time payment completed: ${session.payment_intent}`);
        
        // For bookings (interview, UCAT, personal statement, career consultation, or event), get the payment intent and handle it
        if (session.payment_intent && (
          session.metadata?.type === 'interview_booking' || 
          session.metadata?.type === 'ucat_tutoring' ||
          session.metadata?.type === 'personal_statement_review' ||
          session.metadata?.type === 'career_consultation' ||
          session.metadata?.type === 'event_booking'
        )) {
          console.log('Processing payment for type:', session.metadata?.type);
          
          const paymentIntent = await this.stripe.paymentIntents.retrieve(session.payment_intent as string);
          console.log('Retrieved payment intent:', paymentIntent.id);
          console.log('Payment intent metadata:', paymentIntent.metadata);
          
          // Ensure metadata is properly set on payment intent
          if (!paymentIntent.metadata.customer_email && session.customer_details?.email) {
            console.log('Updating payment intent metadata with customer details');
            await this.stripe.paymentIntents.update(paymentIntent.id, {
              metadata: {
                ...paymentIntent.metadata,
                ...session.metadata, // Include all session metadata
                customer_email: session.customer_details.email,
                customer_name: session.customer_details.name || '',
              }
            });
            
            // Retrieve updated payment intent
            const updatedPaymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntent.id);
            console.log('Updated payment intent metadata:', updatedPaymentIntent.metadata);
            await this.handlePaymentSucceeded(updatedPaymentIntent);
          } else {
            console.log('Payment intent already has customer email, proceeding with existing metadata');
            await this.handlePaymentSucceeded(paymentIntent);
          }
        } else {
          console.log('Skipping payment processing - no matching type or payment intent:', {
            hasPaymentIntent: !!session.payment_intent,
            type: session.metadata?.type,
            allMetadata: session.metadata
          });
        }
      }
    } catch (error) {
      console.error('=== Error handling checkout session completion ===');
      console.error('Error:', error);
      console.error('Error stack:', (error as Error).stack);
      // Don't throw error to avoid webhook retry loops
    }
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log(`Payment succeeded: ${paymentIntent.id}`);
    
    try {
      const metadata = paymentIntent.metadata;
      const bookingType = metadata.type;
      
      console.log('Processing payment with type:', bookingType, metadata);
      
      // Route to appropriate handler based on booking type
      switch (bookingType) {
        case 'interview_booking':
          await this.handleInterviewBookingPayment(paymentIntent);
          break;
        case 'ucat_tutoring':
          await this.handleUCATTutoringPayment(paymentIntent);
          break;
        case 'personal_statement_review':
          await this.handlePersonalStatementPayment(paymentIntent);
          break;
        case 'career_consultation':
          await this.handleCareerConsultationPayment(paymentIntent);
          break;
        case 'event_booking':
          await this.handleEventBookingPayment(paymentIntent);
          break;
        default:
          console.log('Unknown booking type, using default interview booking handler');
          await this.handleInterviewBookingPayment(paymentIntent);
          break;
      }
      
    } catch (error) {
      console.error('Error handling payment success:', error);
      // Don't throw error to avoid webhook retry loops
    }
  }

  private async handleInterviewBookingPayment(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Import services here to avoid circular dependencies
    const supabaseService = (await import('./supabaseService')).default;
    const emailService = (await import('./emailService')).default;
    
    // Get payment metadata
    const metadata = paymentIntent.metadata;
    const customerEmail = metadata.customer_email;
    const customerName = metadata.customer_name;
    const packageType = metadata.package_type || 'single';
    const serviceType = metadata.service_type || 'generated';
    const universities = metadata.universities ? metadata.universities.split(',') : [];
    const preferredDate = metadata.preferred_date;
    const amount = paymentIntent.amount / 100; // Convert from cents
    
    if (!customerEmail) {
      console.error('No customer email found in payment metadata');
      return;
    }
    
    console.log('Processing interview booking payment for:', { customerEmail, customerName, packageType, serviceType, universities, amount });
    
    // 1. Check if user exists, create if not
    let user = await supabaseService.getUserByEmail(customerEmail);
    
    if (!user) {
      console.log('Creating new user for email:', customerEmail);
      user = await supabaseService.createUser({
        email: customerEmail,
        full_name: customerName || '',
        role: 'student',
        stripe_customer_id: paymentIntent.customer as string || undefined
      });
      console.log('Created user:', user.id);
    } else {
      console.log('Found existing user:', user.id);
    }
    
    // 2. Check for subscription, create free subscription if not exists
    let subscription = await supabaseService.getSubscriptionByEmail(customerEmail);
    
    if (!subscription) {
      console.log('Creating free subscription for email:', customerEmail);
      subscription = await supabaseService.createSubscription({
        email: customerEmail,
        user_id: user.id,
        subscription_tier: 'free',
        opt_in_newsletter: true
      });
      console.log('Created subscription for user:', user.id);
    } else {
      // Link subscription to user if not already linked
      if (!subscription.user_id) {
        await supabaseService.linkSubscriptionToUser(customerEmail, user.id);
        console.log('Linked subscription to user:', user.id);
      }
    }
    
    // 3. Create booking entry
    const now = new Date();
    const startTime = preferredDate ? new Date(preferredDate) : new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to tomorrow
    const endTime = new Date(startTime.getTime() + 90 * 60 * 1000); // 90 minutes duration
    
    const booking = await supabaseService.createBooking({
      user_id: user.id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      package: `${packageType}_${serviceType}_${universities.join('_')}`,
      amount: amount,
      preferred_time: preferredDate || undefined,
      email: customerEmail,
      payment_status: 'paid'
    });
    
    console.log('Created interview booking:', booking.id);
    
    // 4. Send confirmation email
    await emailService.sendBookingConfirmationEmail(customerEmail, {
      id: booking.id,
      packageType,
      serviceType,
      universities,
      amount,
      startTime: startTime.toISOString(),
      preferredDate,
      userName: customerName
    });
    
    console.log('Sent interview booking confirmation email to:', customerEmail);
  }

  private async handleUCATTutoringPayment(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Import services here to avoid circular dependencies
    const supabaseService = (await import('./supabaseService')).default;
    const emailService = (await import('./emailService')).default;
    
    // Get payment metadata
    const metadata = paymentIntent.metadata;
    const customerEmail = metadata.customer_email;
    const customerName = metadata.customer_name;
    const packageId = metadata.package_id;
    const packageName = metadata.package_name;
    const amount = paymentIntent.amount / 100; // Convert from cents
    
    if (!customerEmail) {
      console.error('No customer email found in payment metadata');
      return;
    }
    
    console.log('Processing UCAT tutoring payment for:', { customerEmail, customerName, packageId, packageName, amount });
    
    // 1. Check if user exists, create if not
    let user = await supabaseService.getUserByEmail(customerEmail);
    
    if (!user) {
      console.log('Creating new user for email:', customerEmail);
      user = await supabaseService.createUser({
        email: customerEmail,
        full_name: customerName || '',
        role: 'student',
        stripe_customer_id: paymentIntent.customer as string || undefined
      });
      console.log('Created user:', user.id);
    } else {
      console.log('Found existing user:', user.id);
    }
    
    // 2. Check for subscription, create free subscription if not exists
    let subscription = await supabaseService.getSubscriptionByEmail(customerEmail);
    
    if (!subscription) {
      console.log('Creating free subscription for email:', customerEmail);
      subscription = await supabaseService.createSubscription({
        email: customerEmail,
        user_id: user.id,
        subscription_tier: 'free',
        opt_in_newsletter: true
      });
      console.log('Created subscription for user:', user.id);
    } else {
      // Link subscription to user if not already linked
      if (!subscription.user_id) {
        await supabaseService.linkSubscriptionToUser(customerEmail, user.id);
        console.log('Linked subscription to user:', user.id);
      }
    }
    
    // 3. Create UCAT tutoring booking entry
    const now = new Date();
    // UCAT tutoring doesn't have specific timing like interviews, so we set a generic future date
    const startTime = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 2 days from now
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const booking = await supabaseService.createBooking({
      user_id: user.id,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      package: `ucat_${packageId}`,
      amount: amount,
      email: customerEmail,
      payment_status: 'paid'
    });
    
    console.log('Created UCAT tutoring booking:', booking.id);
    
    // 4. Send UCAT confirmation email
    await emailService.sendUCATConfirmationEmail(customerEmail, {
      id: booking.id,
      packageId: packageId || '',
      packageName: packageName || '',
      amount,
      userName: customerName
    });
    
    console.log('Sent UCAT tutoring confirmation email to:', customerEmail);
  }

  private async handlePersonalStatementPayment(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log('=== Personal Statement Payment Handler Started ===');
    console.log('Payment Intent ID:', paymentIntent.id);
    console.log('Payment Intent Metadata:', paymentIntent.metadata);
    
    try {
      // Import services here to avoid circular dependencies
      const supabaseService = (await import('./supabaseService')).default;
      const emailService = (await import('./emailService')).default;
      const fileUploadService = (await import('./fileUploadService')).default;
      
      // Get payment metadata
      const metadata = paymentIntent.metadata;
      const customerEmail = metadata.customer_email;
      const customerName = metadata.customer_name;
      const firstName = metadata.first_name;
      const lastName = metadata.last_name;
      const statementType = metadata.statement_type || 'medicine';
      const personalStatementFilePath = metadata.personal_statement_file_path;
      const amount = paymentIntent.amount / 100; // Convert from cents
      
      console.log('Extracted metadata:', {
        customerEmail,
        customerName,
        firstName,
        lastName,
        statementType,
        personalStatementFilePath,
        amount
      });
      
      if (!customerEmail) {
        console.error('No customer email found in payment metadata');
        return;
      }

      if (!personalStatementFilePath) {
        console.error('No personal statement file path found in payment metadata');
        return;
      }
      
      console.log('Processing personal statement payment for:', { 
        customerEmail, 
        customerName, 
        firstName, 
        lastName, 
        statementType, 
        personalStatementFilePath,
        amount 
      });
      
      // 1. Check if user exists, create if not
      console.log('Step 1: Checking if user exists...');
      let user = await supabaseService.getUserByEmail(customerEmail);
      
      if (!user) {
        console.log('Creating new user for email:', customerEmail);
        user = await supabaseService.createUser({
          email: customerEmail,
          full_name: customerName || `${firstName} ${lastName}` || '',
          role: 'student',
          stripe_customer_id: paymentIntent.customer as string || undefined
        });
        console.log('Created user:', user.id);
      } else {
        console.log('Found existing user:', user.id);
      }
      
      // 2. Check for subscription, create free subscription if not exists
      console.log('Step 2: Checking subscription...');
      let subscription = await supabaseService.getSubscriptionByEmail(customerEmail);
      
      if (!subscription) {
        console.log('Creating free subscription for email:', customerEmail);
        subscription = await supabaseService.createSubscription({
          email: customerEmail,
          user_id: user.id,
          subscription_tier: 'free',
          opt_in_newsletter: true
        });
        console.log('Created subscription for user:', user.id);
      } else {
        console.log('Found existing subscription:', subscription);
        // Link subscription to user if not already linked
        if (!subscription.user_id) {
          console.log('Linking subscription to user...');
          await supabaseService.linkSubscriptionToUser(customerEmail, user.id);
          console.log('Linked subscription to user:', user.id);
        }
      }
      
      // 3. Create personal statement review entry
      console.log('Step 3: Creating personal statement review entry...');
      const personalStatementData = {
        email: customerEmail,
        personal_statement_file_path: personalStatementFilePath,
        notes: `${statementType} personal statement - ${firstName} ${lastName}`
      };
      console.log('Personal statement data to create:', personalStatementData);
      
      const personalStatement = await supabaseService.createPersonalStatement(personalStatementData);
      
      console.log('Created personal statement review:', personalStatement);
      
      // 4. Create booking entry for tracking
      console.log('Step 4: Creating booking entry...');
      const now = new Date();
      const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day from now
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration
      
      const bookingData = {
        user_id: user.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        package: 'personal_statement_review',
        amount: amount,
        email: customerEmail,
        payment_status: 'paid' as const
      };
      console.log('Booking data to create:', bookingData);
      
      const booking = await supabaseService.createBooking(bookingData);
      
      console.log('Created personal statement booking:', booking);
      
      // 5. Send confirmation email to customer
      console.log('Step 5: Sending confirmation email...');
      try {
        await emailService.sendPersonalStatementConfirmationEmail(customerEmail, {
          id: personalStatement.id,
          bookingId: booking.id,
          amount,
          userName: customerName || `${firstName} ${lastName}`,
          statementType
        });
        console.log('Sent personal statement confirmation email to:', customerEmail);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
      
      // 6. Send notification email to review team
      console.log('Step 6: Sending notification email to review team...');
      try {
        await emailService.sendPersonalStatementReviewNotificationEmail({
          personalStatementId: personalStatement.id,
          customerEmail,
          customerName: customerName || `${firstName} ${lastName}`,
          statementType,
          filePath: personalStatementFilePath
        });
        console.log('Sent personal statement review notification to review team');
      } catch (emailError) {
        console.error('Failed to send review notification email:', emailError);
      }
      
      console.log('=== Personal Statement Payment Handler Completed Successfully ===');
    } catch (error) {
      console.error('=== Personal Statement Payment Handler Error ===');
      console.error('Error:', error);
      console.error('Error stack:', (error as Error).stack);
      throw error; // Re-throw to be handled by caller
    }
  }
  
  private async handleCareerConsultationPayment(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log('=== Career Consultation Payment Handler Started ===');
    console.log('Payment Intent ID:', paymentIntent.id);
    console.log('Payment Intent Metadata:', paymentIntent.metadata);
    
    try {
      // Import services here to avoid circular dependencies
      const supabaseService = (await import('./supabaseService')).default;
      const emailService = (await import('./emailService')).default;
      
      // Get payment metadata
      const metadata = paymentIntent.metadata;
      const customerEmail = metadata.customer_email;
      const customerName = metadata.customer_name;
      const preferredDate = metadata.preferred_date;
      const message = metadata.message;
      const amount = paymentIntent.amount / 100; // Convert from cents
      
      console.log('Extracted metadata:', {
        customerEmail,
        customerName,
        preferredDate,
        message,
        amount
      });
      
      if (!customerEmail) {
        console.error('No customer email found in payment metadata');
        return;
      }
      
      console.log('Processing career consultation payment for:', {
        customerEmail,
        customerName,
        preferredDate,
        amount
      });
      
      // 1. Check if user exists, create if not
      console.log('Step 1: Checking if user exists...');
      let user = await supabaseService.getUserByEmail(customerEmail);
      
      if (!user) {
        console.log('Creating new user for email:', customerEmail);
        user = await supabaseService.createUser({
          email: customerEmail,
          full_name: customerName || '',
          role: 'student',
          stripe_customer_id: paymentIntent.customer as string || undefined
        });
        console.log('Created user:', user.id);
      } else {
        console.log('Found existing user:', user.id);
      }
      
      // 2. Check for subscription, create free subscription if not exists
      console.log('Step 2: Checking subscription...');
      let subscription = await supabaseService.getSubscriptionByEmail(customerEmail);
      
      if (!subscription) {
        console.log('Creating free subscription for email:', customerEmail);
        subscription = await supabaseService.createSubscription({
          email: customerEmail,
          user_id: user.id,
          subscription_tier: 'free',
          opt_in_newsletter: true
        });
        console.log('Created subscription for user:', user.id);
      } else {
        console.log('Found existing subscription:', subscription);
        // Link subscription to user if not already linked
        if (!subscription.user_id) {
          console.log('Linking subscription to user...');
          await supabaseService.linkSubscriptionToUser(customerEmail, user.id);
          console.log('Linked subscription to user:', user.id);
        }
      }
      
      // 3. Create booking entry
      console.log('Step 3: Creating booking entry...');
      const now = new Date();
      // If preferred date is provided, use it; otherwise set to 3 days from now
      let startTime;
      if (preferredDate) {
        startTime = new Date(preferredDate);
      } else {
        startTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
      }
      const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes duration
      
      const bookingData = {
        user_id: user.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        package: 'career_consultation_30min',
        amount: amount,
        email: customerEmail,
        preferred_time: preferredDate,
        payment_status: 'paid' as const
      };
      console.log('Booking data to create:', bookingData);
      
      const booking = await supabaseService.createBooking(bookingData);
      
      console.log('Created career consultation booking:', booking);
      
      // 4. Send confirmation email to customer
      console.log('Step 4: Sending confirmation email...');
      try {
        // Use specialized career consultation email template
        await emailService.sendCareerConsultationConfirmationEmail(customerEmail, {
          id: booking.id,
          amount,
          userName: customerName || 'there',
          preferredDate: preferredDate || undefined,
          startTime: startTime.toISOString()
        });
        console.log('Sent career consultation confirmation email to:', customerEmail);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
      
      // 5. Send notification email to admin team
      console.log('Step 5: Sending notification email to admin team...');
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'contact@nextgenmedprep.com';
        await this.sendAdminNotificationEmail(adminEmail, {
          id: booking.id,
          customerEmail,
          customerName,
          bookingType: 'Career Consultation (30 min)',
          amount,
          preferredDate: preferredDate || 'Not specified',
          message: message || 'No additional message'
        });
        console.log('Sent career consultation notification to admin team');
      } catch (emailError) {
        console.error('Failed to send admin notification email:', emailError);
      }
      
      console.log('=== Career Consultation Payment Handler Completed Successfully ===');
    } catch (error) {
      console.error('=== Career Consultation Payment Handler Error ===');
      console.error('Error:', error);
      console.error('Error stack:', (error as Error).stack);
      // Don't throw error to avoid webhook retry loops
    }
  }
  
  private async handleEventBookingPayment(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log('=== Event Booking Payment Handler Started ===');
    console.log('Payment Intent ID:', paymentIntent.id);
    console.log('Payment Intent Metadata:', paymentIntent.metadata);
    
    try {
      // Import services here to avoid circular dependencies
      const supabaseService = (await import('./supabaseService')).default;
      const emailService = (await import('./emailService')).default;
      
      // Get payment metadata
      const metadata = paymentIntent.metadata;
      const customerEmail = metadata.customer_email;
      const customerName = metadata.customer_name;
      const eventId = metadata.event_id;
      const eventName = metadata.event_name || 'Medical Conference';
      const numberOfTickets = parseInt(metadata.number_of_tickets || '1', 10);
      const amount = paymentIntent.amount / 100; // Convert from cents
      
      console.log('Extracted metadata:', {
        customerEmail,
        customerName,
        eventId,
        eventName,
        numberOfTickets,
        amount
      });
      
      if (!customerEmail) {
        console.error('No customer email found in payment metadata');
        return;
      }
      
      console.log('Processing event booking payment for:', {
        customerEmail,
        customerName,
        eventName,
        numberOfTickets,
        amount
      });
      
      // 1. Check if user exists, create if not
      console.log('Step 1: Checking if user exists...');
      let user = await supabaseService.getUserByEmail(customerEmail);
      
      if (!user) {
        console.log('Creating new user for email:', customerEmail);
        user = await supabaseService.createUser({
          email: customerEmail,
          full_name: customerName || '',
          role: 'student',
          stripe_customer_id: paymentIntent.customer as string || undefined
        });
        console.log('Created user:', user.id);
      } else {
        console.log('Found existing user:', user.id);
      }
      
      // 2. Check for subscription, create free subscription if not exists
      console.log('Step 2: Checking subscription...');
      let subscription = await supabaseService.getSubscriptionByEmail(customerEmail);
      
      if (!subscription) {
        console.log('Creating free subscription for email:', customerEmail);
        subscription = await supabaseService.createSubscription({
          email: customerEmail,
          user_id: user.id,
          subscription_tier: 'free',
          opt_in_newsletter: true
        });
        console.log('Created subscription for user:', user.id);
      } else {
        console.log('Found existing subscription:', subscription);
        // Link subscription to user if not already linked
        if (!subscription.user_id) {
          console.log('Linking subscription to user...');
          await supabaseService.linkSubscriptionToUser(customerEmail, user.id);
          console.log('Linked subscription to user:', user.id);
        }
      }
      
      // 3. Create booking entry
      console.log('Step 3: Creating booking entry...');
      const now = new Date();
      // Event bookings typically don't have a specific time slot assignment at booking time
      // We'll use a future date as a placeholder
      const eventDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
      const eventEndDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours duration
      
      const bookingData = {
        user_id: user.id,
        start_time: eventDate.toISOString(),
        end_time: eventEndDate.toISOString(),
        package: `event_${eventId || 'conference'}`,
        amount: amount,
        email: customerEmail,
        payment_status: 'paid' as const
      };
      console.log('Booking data to create:', bookingData);
      
      const booking = await supabaseService.createBooking(bookingData);
      
      console.log('Created event booking:', booking);
      
      // 4. Send confirmation email to customer
      console.log('Step 4: Sending confirmation email...');
      try {
        // Use specialized event booking confirmation email
        await emailService.sendEventBookingConfirmationEmail(customerEmail, {
          id: booking.id,
          amount,
          userName: customerName || 'there',
          eventName: eventName,
          numberOfTickets
        });
        console.log('Sent event booking confirmation email to:', customerEmail);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
      
      // 5. Send notification email to admin team
      console.log('Step 5: Sending notification email to admin team...');
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'contact@nextgenmedprep.com';
        await this.sendAdminNotificationEmail(adminEmail, {
          id: booking.id,
          customerEmail,
          customerName,
          bookingType: `Event: ${eventName}`,
          numberOfTickets,
          amount,
          message: `Number of tickets: ${numberOfTickets}`
        });
        console.log('Sent event booking notification to admin team');
      } catch (emailError) {
        console.error('Failed to send admin notification email:', emailError);
      }
      
      console.log('=== Event Booking Payment Handler Completed Successfully ===');
    } catch (error) {
      console.error('=== Event Booking Payment Handler Error ===');
      console.error('Error:', error);
      console.error('Error stack:', (error as Error).stack);
      // Don't throw error to avoid webhook retry loops
    }
  }
  
  // Helper method to send admin notifications
  private async sendAdminNotificationEmail(adminEmail: string, data: {
    id: string;
    customerEmail: string;
    customerName: string;
    bookingType: string;
    amount: number;
    preferredDate?: string;
    numberOfTickets?: number;
    message?: string;
  }): Promise<void> {
    const subject = `New ${data.bookingType} Booking - £${data.amount}`;
    
    const text = `
New ${data.bookingType} Booking

Booking Details:
- Booking ID: ${data.id}
- Customer: ${data.customerName} (${data.customerEmail})
- Amount: £${data.amount}
${data.preferredDate ? `- Preferred Date: ${data.preferredDate}` : ''}
${data.numberOfTickets ? `- Number of Tickets: ${data.numberOfTickets}` : ''}
${data.message ? `- Message: ${data.message}` : ''}

Please check the admin dashboard for more details.
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">New ${data.bookingType} Booking</h1>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h3 style="margin-top: 0; color: #1e40af;">Booking Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Booking ID:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${data.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Customer:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.customerName} (${data.customerEmail})</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Amount:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 16px; font-weight: bold; color: #059669;">£${data.amount}</td>
            </tr>
            ${data.preferredDate ? `
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Preferred Date:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.preferredDate}</td>
            </tr>
            ` : ''}
            ${data.numberOfTickets ? `
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Number of Tickets:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.numberOfTickets}</td>
            </tr>
            ` : ''}
            ${data.message ? `
            <tr>
              <td style="padding: 8px; font-weight: bold;">Message:</td>
              <td style="padding: 8px;">${data.message}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0; font-weight: bold;">Action Required:</p>
          <p style="margin: 5px 0 0 0;">Please check the admin dashboard for more details and to process this booking.</p>
        </div>
      </div>
    `;

    // Using nodemailer directly here to avoid circular imports
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: parseInt(process.env.EMAIL_PORT || '587') === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: subject,
      text: text,
      html: html,
    });
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log(`Payment failed: ${paymentIntent.id}`);
    
    // TODO: Handle failed payment
    // Example: Send failure notification, log for retry, etc.
  }

  /**
   * Handle subscription changes
   */
  private async handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
    console.log(`Subscription ${subscription.status}: ${subscription.id}`);
    
    // TODO: Update subscription status in database
  }

  /**
   * Handle subscription deletion
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    console.log(`Subscription canceled: ${subscription.id}`);
    
    // TODO: Handle subscription cancellation
    // Example: Revoke access, update subscription status, etc.
  }

  /**
   * Handle successful invoice payment (for subscriptions)
   */
  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    console.log(`Invoice payment succeeded: ${invoice.id}`);
    
    // TODO: Handle subscription renewal
  }

  /**
   * Handle failed invoice payment (for subscriptions)
   */
  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    console.log(`Invoice payment failed: ${invoice.id}`);
    
    // TODO: Handle subscription payment failure
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.cancel(subscriptionId);
    } catch (error: any) {
      console.error('Stripe subscription cancellation error:', error);
      throw new AppError(error.message || 'Subscription cancellation failed', 500);
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error: any) {
      console.error('Stripe get subscription error:', error);
      throw new AppError(error.message || 'Failed to get subscription', 500);
    }
  }

  /**
   * List customer subscriptions
   */
  async getCustomerSubscriptions(customerId: string): Promise<Stripe.ApiList<Stripe.Subscription>> {
    try {
      return await this.stripe.subscriptions.list({
        customer: customerId,
      });
    } catch (error: any) {
      console.error('Stripe list subscriptions error:', error);
      throw new AppError(error.message || 'Failed to list subscriptions', 500);
    }
  }

  /**
   * Create a customer
   */
  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    try {
      return await this.stripe.customers.create({
        email,
        name,
      });
    } catch (error: any) {
      console.error('Stripe create customer error:', error);
      throw new AppError(error.message || 'Failed to create customer', 500);
    }
  }

  /**
   * Get customer by email
   */
  async getCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
    try {
      const customers = await this.stripe.customers.list({
        email,
        limit: 1,
      });
      
      return customers.data.length > 0 ? customers.data[0] : null;
    } catch (error: any) {
      console.error('Stripe get customer error:', error);
      throw new AppError(error.message || 'Failed to get customer', 500);
    }
  }

  /**
   * Capture a payment intent (for manual capture)
   */
  async capturePayment(paymentIntentId: string, amount?: number): Promise<Stripe.PaymentIntent> {
    try {
      const captureData: Stripe.PaymentIntentCaptureParams = {};
      
      if (amount) {
        captureData.amount_to_capture = Math.round(amount * 100); // Convert to cents
      }

      return await this.stripe.paymentIntents.capture(paymentIntentId, captureData);
    } catch (error: any) {
      console.error('Stripe capture error:', error);
      throw new AppError(error.message || 'Capture processing failed', 500);
    }
  }
}

export interface StripePaymentResponse {
  success: boolean;
  checkout_url: string;
  session_id: string;
  payment_intent_id?: string;
  subscription_id?: string;
  error_message?: string;
}

export const stripeService = new StripeService();