# Frontend Stripe Integration

This directory contains the frontend components and pages for Stripe payment integration.

## Pages

### `/payment` - One-time Payments
- Main payment page for one-time purchases
- Package selection with predefined pricing
- Form for custom payment amounts
- Direct integration with Stripe Checkout

### `/payment/subscription` - Subscription Payments  
- Subscription payment page for recurring billing
- Monthly and annual subscription options
- Recurring billing configuration
- Stripe subscription management

### `/payment/success` - Payment Success
- Success page shown after completed payments
- Payment status verification
- Session/payment details display
- Navigation to next steps

### `/payment/canceled` - Payment Canceled
- Shown when users cancel Stripe Checkout
- Option to retry payment
- Return to home or payment pages

## Components

### `components/stripe/StripeUtils.ts`
Utility functions for Stripe integration:
- `getStripe()` - Initialize Stripe with publishable key
- `redirectToCheckout(sessionId)` - Programmatic checkout redirect
- `formatCurrency(amount, currency)` - Format currency for display
- `createCheckoutAndRedirect(paymentData)` - Create session and redirect

### `components/stripe/QuickCheckout.tsx`
Example component for quick checkout buttons:
- One-time payment button
- Subscription button
- Error handling
- Loading states

## Environment Variables

Add to `apps/frontend/.env.local`:

```bash
# Required for Stripe client-side integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Backend API configuration  
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Usage Examples

### Simple Payment Button

```tsx
import { createCheckoutAndRedirect } from '@/components/stripe/StripeUtils';

const handlePayment = async () => {
  try {
    await createCheckoutAndRedirect({
      amount: 29.99,
      currency: 'GBP',
      description: 'UCAT Preparation Course',
      customer_email: 'user@example.com'
    });
  } catch (error) {
    console.error('Payment failed:', error);
  }
};

<button onClick={handlePayment}>
  Pay £29.99
</button>
```

### Subscription Button

```tsx
import { createCheckoutAndRedirect } from '@/components/stripe/StripeUtils';

const handleSubscription = async () => {
  try {
    await createCheckoutAndRedirect(
      {
        amount: 19.99,
        currency: 'GBP', 
        description: 'Monthly Premium Subscription',
        customer_email: 'user@example.com'
      },
      'subscription',
      {
        every: 1,
        period: 'month'
      }
    );
  } catch (error) {
    console.error('Subscription failed:', error);
  }
};

<button onClick={handleSubscription}>
  Subscribe £19.99/month
</button>
```

### Using QuickCheckout Component

```tsx
import QuickCheckout from '@/components/stripe/QuickCheckout';

<QuickCheckout
  amount={29.99}
  currency="GBP"
  description="UCAT Preparation Course"
  productId="ucat-course"
/>
```

## API Endpoints Used

- `POST /api/v1/payments/create` - Create one-time payment
- `POST /api/v1/payments/subscription` - Create subscription  
- `GET /api/v1/payments/status/:session_id` - Get payment status

## Testing

### Test Mode
- Uses Stripe test publishable key (`pk_test_...`)
- Test card numbers work in checkout
- No real charges are made

### Test Cards
- Success: `4242424242424242`
- Declined: `4000000000000002` 
- 3D Secure: `4000000000003220`

### Local Development
1. Start backend: `npm run dev` (from `/apps/backend`)
2. Start frontend: `npm run dev` (from `/apps/frontend`)
3. Visit `http://localhost:3000/payment`

## Payment Flow

1. **User selects package/enters details** → Payment or Subscription page
2. **Form submission** → API call to create Stripe session
3. **Redirect to Stripe** → Secure hosted checkout page
4. **Payment completion** → Redirect to success/cancel page
5. **Status verification** → API call to verify payment status
6. **Webhook processing** → Backend handles payment events

## Security Notes

- Only publishable key is exposed to client
- All sensitive operations happen on backend
- Stripe handles PCI compliance  
- No card details stored in your app
- Session IDs are safe to pass in URLs

## Troubleshooting

### Common Issues

**"Cannot find module '@stripe/stripe-js'"**
```bash
npm install @stripe/stripe-js
```

**"Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"**
- Add publishable key to `.env.local`
- Restart Next.js development server

**"Network error" during payment**
- Check backend is running on correct port
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check browser console for CORS errors

**Checkout session not found**
- Verify backend Stripe service is configured
- Check `STRIPE_SECRET_KEY` environment variable
- Review server logs for errors

### Development Tips

1. **Use Stripe test mode** during development
2. **Check browser console** for client-side errors
3. **Monitor backend logs** for API errors  
4. **Test different browsers** for compatibility
5. **Verify webhooks** are receiving events

## Migration from Fondy

The frontend has been updated to work with Stripe instead of Fondy:

- ✅ Updated API endpoints (`/payments/create` → Stripe session)
- ✅ Changed success page to use `session_id` parameter
- ✅ Added subscription support with recurring billing
- ✅ Updated error handling for Stripe responses
- ✅ Added cancel page for checkout cancellations

No further frontend changes needed for basic Stripe integration.