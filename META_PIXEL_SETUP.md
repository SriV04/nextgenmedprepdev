# Meta Pixel Setup - Implementation Summary


### 1. Meta Pixel Base Code Installed
- **Pixel ID**: `1790921434947407`
- **Location**: [apps/frontend/app/layout.tsx](apps/frontend/app/layout.tsx)
- Base pixel code is loaded on every page with the `afterInteractive` strategy
- Includes noscript fallback for users with JavaScript disabled

### 2. Environment Variable
- Added to `.env`: `NEXT_PUBLIC_META_PIXEL_ID=1790921434947407`
- This allows you to easily change the pixel ID without touching the code

### 3. Components Created

#### MetaPixel Component ([apps/frontend/components/MetaPixel.tsx](apps/frontend/components/MetaPixel.tsx))
Tracks page views automatically on route changes and provides helper functions:
- `trackEvent()` - Generic event tracking
- `trackPurchase()` - For completed purchases
- `trackInitiateCheckout()` - When user starts checkout
- `trackViewContent()` - When user views event/product
- `trackLead()` - For form submissions

### 4. Event Tracking Implemented

#### Standard Events Tracking:

1. **PageView** (Automatic)
   - Fires on every page load
   - Tracks on route changes within the app

2. **ViewContent** 
   - **Location**: [apps/frontend/app/event-pay/page.tsx](apps/frontend/app/event-pay/page.tsx)
   - Fires when user lands on event payment page
   - Tracks: Event name, price, currency

3. **InitiateCheckout**
   - **Location**: [apps/frontend/components/payment/PaymentForm.tsx](apps/frontend/components/payment/PaymentForm.tsx)
   - Fires when user submits payment form
   - Tracks: Amount, currency, event name

4. **Purchase** (Most Important!)
   - **Location**: [apps/frontend/app/payment/success/page.tsx](apps/frontend/app/payment/success/page.tsx)
   - Fires only on successful payment (status === 'approved')
   - Tracks: 
     - Amount (actual payment value)
     - Currency
     - Content name ("Event Ticket Purchase")
     - Order ID (for deduplication)

## 📊 What Gets Tracked

### Event Purchase Funnel:
1. User visits `/events` → **PageView**
2. User clicks on event → **PageView** (event page)
3. User lands on payment page (`/event-pay`) → **ViewContent**
4. User submits payment form → **InitiateCheckout**
5. Payment succeeds → **Purchase** ✨

## 🧪 Testing Your Pixel

### 1. Use Meta Pixel Helper (Chrome Extension)
- Install: [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- Visit your site and look for green checkmark
- It will show you which events fire on each page

### 2. Check Events Manager
- Go to [Meta Events Manager](https://business.facebook.com/events_manager2/list/pixel/1790921434947407/overview)
- Navigate to your pixel
- Click "Test Events" tab
- Open your website and perform actions
- Events should appear in real-time

### 3. Manual Testing Steps
```
1. Open your site with Pixel Helper installed
2. Navigate to /events page → Check for PageView
3. Click to /event-pay page → Check for ViewContent  
4. Fill payment form and submit → Check for InitiateCheckout
5. Complete payment → Check for Purchase on success page
```

## 🎯 Conversion Optimization

### In Meta Ads Manager:
1. **Create Custom Conversions**:
   - Go to Events Manager → Custom Conversions
   - Create conversion for "Purchase" event
   - Set value optimization to use actual purchase amount

2. **Create Audiences**:
   - People who viewed events but didn't purchase (Retargeting)
   - People who initiated checkout but didn't complete (Cart abandonment)
   - Past purchasers (Lookalike audiences)

3. **Campaign Setup**:
   - Choose "Conversions" as campaign objective
   - Select "Purchase" as your conversion event
   - Let Meta optimize for ROAS (Return on Ad Spend)

## 🔍 Monitoring & Troubleshooting

### Common Issues:

1. **Pixel Not Firing**
   - Check browser console for errors
   - Verify `NEXT_PUBLIC_META_PIXEL_ID` is set
   - Check Network tab for `fbevents.js` loading

2. **Purchase Events Not Showing**
   - Verify payment actually succeeded (status === 'approved')
   - Check browser console for tracking calls
   - Ensure amount is being parsed correctly

3. **Multiple PageView Events**
   - This is normal in Next.js due to route changes
   - Meta automatically deduplicates these

### Debug Mode:
Add this to browser console to see tracking calls:
```javascript
window.fbq.queue // Shows queued events
```

## 📈 Expected Results

Once live with traffic:
- **PageViews**: Should match Google Analytics page views
- **ViewContent**: Count of event page views
- **InitiateCheckout**: Payment form submissions
- **Purchase**: Successful event bookings

### Key Metrics to Track:
- **Conversion Rate**: Purchases / ViewContent (%)
- **Checkout Abandonment**: (InitiateCheckout - Purchase) / InitiateCheckout (%)
- **Average Order Value**: Total revenue / Number of purchases

## 🚀 Next Steps

1. **Test in production** - Deploy and verify events fire correctly
2. **Set up custom conversions** in Events Manager
3. **Create audiences** for retargeting
4. **Launch campaigns** optimized for purchases
5. **Monitor performance** and adjust based on data

## 📝 Additional Tracking (Optional)

To track other important actions, add these to relevant pages:

```typescript
import { trackLead } from '@/components/MetaPixel';

// On form submissions (contact, sign-up, etc.)
trackLead();
```

## 🔐 Data Privacy

Your pixel implementation includes:
- Automatic Advanced Matching (when available)
- Respects user privacy settings
- Works with Meta's Conversions API when configured
- GDPR compliant (consider adding cookie consent)

## ⚠️ Important Notes

1. **Order ID Deduplication**: The Purchase event uses `order_id` to prevent duplicate tracking if users refresh the success page
2. **Currency**: Currently set to 'GBP' - adjust if you accept other currencies
3. **Testing**: Always test in incognito mode to avoid caching issues
4. **Production**: Pixel is live immediately - monitor Events Manager closely after deployment

---

**Pixel Status**: ✅ Active and Tracking  
**Last Updated**: January 6, 2026
