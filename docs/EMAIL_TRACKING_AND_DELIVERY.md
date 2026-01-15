# Email Tracking & Hotmail/Outlook Delivery Guide

## Overview

This guide explains how to track email delivery and resolve issues with Hotmail/Outlook email delivery when using Spacemail (or any SMTP service).

## Email Tracking System

### Database Schema

All email delivery attempts are logged to the `email_logs` table:

```sql
- id: UUID (Primary key)
- recipient: Email address
- recipient_domain: Domain (e.g., hotmail.com, outlook.com, gmail.com)
- subject: Email subject
- email_type: Type of email (welcome, booking_confirmation, etc.)
- status: sent | failed | pending | bounced
- message_id: SMTP message ID
- response: SMTP server response
- error_message: Error details if failed
- sent_at: Timestamp
- created_at: Created timestamp
```

### How Tracking Works

Every email sent through the `emailService` is automatically tracked:

1. **Before sending**: Logs the attempt
2. **After sending**: Records SMTP response, message ID, and status
3. **On failure**: Captures error details and marks as failed

### Monitoring Email Delivery

#### 1. Run Email Analytics Script

```bash
cd apps/backend
npx ts-node src/utils/emailAnalytics.ts
```

This will show:
- Overall delivery statistics
- Success rates by domain
- Specific Hotmail/Outlook delivery status
- Recommendations for improvement

#### 2. Query Database Directly

```sql
-- Check overall delivery stats
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM email_logs
GROUP BY status;

-- Check delivery by domain
SELECT 
  recipient_domain,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
  ROUND(SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as success_rate
FROM email_logs
GROUP BY recipient_domain
ORDER BY total DESC;

-- Check failed emails for Hotmail/Outlook
SELECT 
  recipient,
  subject,
  error_message,
  response,
  created_at
FROM email_logs
WHERE recipient_domain IN ('hotmail.com', 'outlook.com', 'live.com')
  AND status = 'failed'
ORDER BY created_at DESC
LIMIT 20;
```

#### 3. Check Logs in Real-Time

The emailService now logs detailed information:

```
📧 Attempting to send welcome email to: user@hotmail.com (hotmail.com)
✅ Email sent successfully to user@hotmail.com
📨 Message ID: <abc123@spacemail.com>
📬 Response: 250 2.0.0 OK
✉️ Accepted: user@hotmail.com
⚠️ Rejected: None
```

Or if it fails:
```
❌ Failed to send welcome email to user@hotmail.com
🔍 Error details: {
  message: "550 5.7.1 Service unavailable",
  code: "EENVELOPE",
  response: "550 5.7.1 Service unavailable"
}
```

## Common Hotmail/Outlook Delivery Issues

### Why Emails Fail to Hotmail/Outlook

1. **No SPF/DKIM/DMARC Records**: Microsoft is strict about email authentication
2. **IP/Domain Reputation**: New domains or IPs are often blocked
3. **Content Filtering**: Certain keywords or patterns trigger spam filters
4. **Rate Limiting**: Sending too many emails too quickly
5. **Reverse DNS**: Missing or incorrect PTR records

### Solutions

#### 1. Verify Email Authentication (CRITICAL)

Check if your domain has proper DNS records:

```bash
# Check SPF record
dig TXT nextgenmedprep.com +short | grep spf

# Check DKIM record
dig TXT default._domainkey.nextgenmedprep.com +short

# Check DMARC record
dig TXT _dmarc.nextgenmedprep.com +short
```

**What they should look like:**

```
SPF:   v=spf1 include:_spf.spacemail.com ~all
DKIM:  v=DKIM1; k=rsa; p=<public_key>
DMARC: v=DMARC1; p=quarantine; rua=mailto:dmarc@nextgenmedprep.com
```

#### 2. Configure DNS Records (Spacemail Specific)

Contact Spacemail support to get:
- SPF include directive
- DKIM selector and public key
- Recommended DMARC policy

Add these to your DNS:

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.spacemail.com ~all

Type: TXT
Name: spacemail._domainkey
Value: v=DKIM1; k=rsa; p=<your_public_key_from_spacemail>

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@nextgenmedprep.com; pct=100
```

#### 3. Request Deliverability Check from Spacemail

Contact Spacemail support:

```
Subject: Hotmail/Outlook Delivery Issues

Hi Spacemail Team,

We're experiencing delivery issues to Hotmail and Outlook addresses. 
Could you please:

1. Verify our SPF, DKIM, and DMARC configurations
2. Check if our sending IP is on any blocklists
3. Review our domain reputation score
4. Provide recommendations for improving deliverability to Microsoft domains

Our domain: nextgenmedprep.com
Sending email: noreply@nextgenmedprep.com

Thank you!
```

#### 4. Test Email Authentication

Use these tools to verify your setup:

- **MxToolbox**: https://mxtoolbox.com/SuperTool.aspx
- **Mail-Tester**: https://www.mail-tester.com/
- **Google Postmaster**: https://postmaster.google.com/
- **Microsoft SNDS**: https://sendersupport.olc.protection.outlook.com/snds/

#### 5. Improve Email Content

Microsoft filters aggressively. Avoid:
- All caps subject lines
- Too many links
- Suspicious keywords (free, urgent, click here)
- Large images without text
- No unsubscribe link

**Good practices:**
- Balanced text-to-image ratio
- Clear unsubscribe link
- Personalised content
- Professional formatting
- Valid reply-to address

#### 6. Monitor Sending Reputation

Track your reputation:

```bash
# Check if IP is blacklisted
curl -s http://multirbl.valli.org/lookup/YOUR_IP.html

# Or use MxToolbox
open "https://mxtoolbox.com/blacklists.aspx"
```

### Alternative Solutions

If Spacemail continues to have issues with Hotmail/Outlook:

#### Option A: Use Microsoft-Friendly ESP

Switch to an Email Service Provider with better Microsoft relationships:

1. **SendGrid** (Recommended)
   - Excellent Microsoft deliverability
   - Built-in tracking
   - Free tier: 100 emails/day
   - Paid: $19.95/mo for 50k emails

2. **Mailgun**
   - Good deliverability
   - Developer-friendly API
   - Free tier: 5,000 emails/month

3. **Amazon SES**
   - Best for high volume
   - Very low cost ($0.10 per 1,000 emails)
   - Requires AWS account

4. **Postmark**
   - Focus on transactional emails
   - Excellent deliverability
   - $15/mo for 10k emails

#### Option B: Use Microsoft 365 SMTP

If you have a Microsoft 365 account:

```typescript
{
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@nextgenmedprep.com',
    pass: 'your-password'
  }
}
```

Limitations:
- 10,000 emails per day limit
- Must use company domain email
- May require app password

## Migration Guide: Spacemail → SendGrid

If you decide to switch to SendGrid:

### 1. Install SendGrid Package

```bash
cd apps/backend
npm install @sendgrid/mail
```

### 2. Update emailService.ts

```typescript
import sgMail from '@sendgrid/mail';

class EmailService {
  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      // Use SendGrid
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    } else {
      // Fall back to SMTP
      this.transporter = nodemailer.createTransport({...});
    }
  }

  private async sendMailWithTracking(mailOptions, emailType) {
    if (process.env.SENDGRID_API_KEY) {
      return this.sendViaSendGrid(mailOptions, emailType);
    } else {
      return this.sendViaSMTP(mailOptions, emailType);
    }
  }

  private async sendViaSendGrid(mailOptions, emailType) {
    try {
      const msg = {
        to: mailOptions.to,
        from: mailOptions.from,
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: mailOptions.html,
      };

      const response = await sgMail.send(msg);
      // Log to database...
    } catch (error) {
      // Handle error and log...
    }
  }
}
```

### 3. Add Environment Variable

```bash
# .env
SENDGRID_API_KEY=SG.your_api_key_here
```

## Best Practices

### 1. Warm Up Your Email Domain

Don't send high volume immediately:

- **Week 1**: 50 emails/day
- **Week 2**: 200 emails/day
- **Week 3**: 500 emails/day
- **Week 4**: 1,000+ emails/day

### 2. Monitor Metrics

Track these key metrics:

- **Delivery Rate**: Should be > 95%
- **Bounce Rate**: Should be < 5%
- **Spam Complaint Rate**: Should be < 0.1%
- **Open Rate**: Should be > 15% (if tracking)

### 3. Maintain Clean Email List

- Remove bounced emails after 3 attempts
- Honor unsubscribe requests immediately
- Don't buy email lists
- Validate email addresses before sending

### 4. Implement Feedback Loops

Sign up for feedback loops with major ESPs:
- Microsoft JMRP: https://postmaster.live.com/
- Gmail Postmaster: https://postmaster.google.com/

### 5. Test Before Production

Send test emails to:
- Gmail account
- Outlook/Hotmail account
- Yahoo account
- Your custom domain

Check:
- Delivery time
- Spam folder placement
- Formatting on mobile/desktop
- Authentication headers

## Troubleshooting Commands

```bash
# Run email analytics
npx ts-node src/utils/emailAnalytics.ts

# Test email sending (create a test script)
npx ts-node test-email-delivery.ts user@hotmail.com

# Check SMTP connection
npx ts-node -e "
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify().then(console.log).catch(console.error);
"

# View recent logs
tail -f logs/email.log
```

## Need Help?

1. Run the analytics script first
2. Check the email_logs table for specific errors
3. Verify DNS records are configured
4. Contact Spacemail support with specific error messages
5. Consider migration to SendGrid/Mailgun if issues persist

## Summary

✅ **Email tracking is now enabled** - All emails are logged to `email_logs` table
✅ **Detailed logging** - Console logs show real-time delivery status  
✅ **Analytics tool** - Run `emailAnalytics.ts` to see delivery stats
⚠️ **Hotmail/Outlook issues** - Likely due to missing SPF/DKIM/DMARC
💡 **Next steps**: Configure DNS records and contact Spacemail support
