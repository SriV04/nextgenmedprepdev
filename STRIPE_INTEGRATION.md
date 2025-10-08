# Stripe Integration Guide

This guide explains how to set up and use the new Stripe payment system that replaces the previous Fondy integration.

## Overview

The Stripe service provides:
- One-time payments via Checkout Sessions
- Subscription payments with recurring billing
- Webhook handling for payment events
- Refunds and payment management
- Customer management

## Environment Variables

Add these variables to your `.env` file in the project root:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...     # Your Stripe secret key (test mode)
STRIPE_WEBHOOK_SECRET=whsec_...   # Stripe webhook endpoint secret
BACKEND_URL=http://localhost:5001 # Backend URL for webhook callbacks
```

For the frontend, add this to `apps/frontend/.env.local`:

```bash
# Stripe Publishable Key (for frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## API Endpoints

### Payment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payments/create` | Create one-time payment checkout session |
| POST | `/api/v1/payments/subscription` | Create subscription checkout session |
| GET | `/api/v1/payments/status/:session_id` | Get payment status by session ID |
| POST | `/api/v1/payments/refund/:payment_intent_id` | Refund a payment |
| POST | `/api/v1/payments/capture/:payment_intent_id` | Capture a payment (for manual capture) |

### Subscription Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/payments/subscription/:subscription_id` | Get subscription details |
| POST | `/api/v1/payments/subscription/:subscription_id/cancel` | Cancel a subscription |

### Webhook Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payments/stripe/webhook` | Stripe webhook handler |

## Usage Examples

### Creating a One-time Payment

```javascript
const response = await fetch('/api/v1/payments/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 29.99,
    currency: 'USD',
    description: 'UCAT Preparation Course',
    customer_email: 'student@example.com',
    product_id: 'ucat-course',
    return_url: 'https://yoursite.com/payment/success'
  })
});

const data = await response.json();
if (data.success) {
  // Redirect user to Stripe Checkout
  window.location.href = data.data.checkout_url;
}
```

### Creating a Subscription

```javascript
const response = await fetch('/api/v1/payments/subscription', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 19.99,
    currency: 'USD',
    description: 'Monthly Premium Subscription',
    customer_email: 'student@example.com',
    recurring: {
      every: 1,
      period: 'month'
    },
    return_url: 'https://yoursite.com/payment/success'
  })
});

const data = await response.json();
if (data.success) {
  // Redirect user to Stripe Checkout
  window.location.href = data.data.checkout_url;
}
```

### Checking Payment Status

```javascript
const sessionId = 'cs_test_...'; // From Stripe Checkout success redirect
const response = await fetch(`/api/v1/payments/status/${sessionId}`);
const data = await response.json();

if (data.success && data.data.status === 'approved') {
  console.log('Payment successful!');
}
```

## Webhook Configuration

1. **Create a webhook endpoint in Stripe Dashboard:**
   - Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - URL: `https://yourdomain.com/api/v1/payments/stripe/webhook`

2. **Select events to listen for:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

3. **Copy the webhook secret:**
   - After creating the webhook, copy the "Signing secret"
   - Add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`

## Migration from Fondy

### Database Changes Needed

Update your database schema to replace Fondy fields with Stripe equivalents:

```sql
-- Update users table
ALTER TABLE users RENAME COLUMN fondy_customer_id TO stripe_customer_id;

-- Update subscriptions table  
ALTER TABLE subscriptions RENAME COLUMN fondy_subscription_id TO stripe_subscription_id;
ALTER TABLE subscriptions ADD COLUMN stripe_customer_id VARCHAR;
ALTER TABLE subscriptions RENAME COLUMN fondy_subscription_status TO stripe_subscription_status;
```

### Key Differences

| Aspect | Fondy | Stripe |
|--------|-------|--------|
| Payment ID | `order_id` | `session_id` (checkout) or `payment_intent_id` |
| Refunds | Uses `order_id` | Uses `payment_intent_id` |
| Webhooks | Single callback URL | Multiple event types |
| Status Check | `order_id` | `session_id` or `payment_intent_id` |
| Subscriptions | Custom recurring setup | Native subscription billing |

## Testing

### Test Cards

Use these test card numbers in Stripe's test mode:

- **Success:** `4242424242424242`
- **Declined:** `4000000000000002`
- **3D Secure:** `4000000000003220`

### Webhook Testing

Use Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5001/api/v1/payments/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
```

## Error Handling

The Stripe service includes comprehensive error handling:

- Invalid API keys throw `AppError` with 500 status
- Validation errors throw `AppError` with 400 status  
- Network errors are caught and wrapped
- Webhook signature verification failures return 400

## Security Notes

1. **Never expose secret keys:** Only use `STRIPE_SECRET_KEY` on the server
2. **Webhook security:** Always verify webhook signatures
3. **Raw body parsing:** Webhooks require raw body, configured in `app.ts`
4. **CORS:** Ensure proper CORS configuration for checkout redirects

## Support

For issues with the Stripe integration:

1. Check Stripe Dashboard logs
2. Verify webhook signatures
3. Test with Stripe CLI
4. Review server logs for detailed error messages

## Links

- [Stripe Checkout Documentation](https://docs.stripe.com/payments/checkout)
- [Stripe Webhooks Guide](https://docs.stripe.com/webhooks)
- [Stripe Testing Guide](https://docs.stripe.com/testing)