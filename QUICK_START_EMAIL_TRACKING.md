# Quick Start: Email Tracking & Hotmail/Outlook Fix

## 🚀 Quick Setup (5 minutes)

### 1. Apply Database Migration

```bash
# Option A: Via Supabase Dashboard
# 1. Go to https://app.supabase.com
# 2. Select your project
# 3. Go to SQL Editor
# 4. Copy contents of: apps/backend/supabase/migrations/20241212_create_email_logs_table.sql
# 5. Run the SQL

# Option B: Via CLI (if you have Supabase CLI)
cd apps/backend
supabase db push
```

### 2. Test Email Delivery

```bash
cd apps/backend

# Test with your Hotmail/Outlook address
npx ts-node test-email-delivery.ts your-email@hotmail.com

# Or test with Outlook
npx ts-node test-email-delivery.ts your-email@outlook.com
```

### 3. Check Results

**If successful** (✅):
- Check your inbox (and spam folder)
- Email tracking is working!

**If failed** (❌):
- Note the error code/message
- Proceed to "Fix Delivery Issues" below

### 4. View Email Statistics

```bash
cd apps/backend
npx ts-node src/utils/emailAnalytics.ts
```

This shows:
- Overall delivery stats
- Success rate by domain
- Hotmail/Outlook specific status
- Recommendations

---

## 🔧 Fix Delivery Issues (15 minutes)

### Issue: Emails not reaching Hotmail/Outlook

**Most Common Cause**: Missing SPF/DKIM/DMARC DNS records

#### Step 1: Check Current DNS Records

```bash
# Check SPF
dig TXT nextgenmedprep.com +short | grep spf

# Check DKIM
dig TXT default._domainkey.nextgenmedprep.com +short

# Check DMARC  
dig TXT _dmarc.nextgenmedprep.com +short
```

**Expected results:**
```
SPF:   "v=spf1 include:_spf.spacemail.com ~all"
DKIM:  "v=DKIM1; k=rsa; p=..."
DMARC: "v=DMARC1; p=quarantine; rua=mailto:dmarc@nextgenmedprep.com"
```

#### Step 2: Contact Spacemail Support

If records are missing, email Spacemail:

```
To: support@spacemail.com
Subject: DNS Configuration for Hotmail/Outlook Delivery

Hi Spacemail Team,

We're experiencing delivery issues to Hotmail and Outlook addresses.

Could you please provide:
1. SPF record include directive for our domain
2. DKIM selector and public key
3. Recommended DMARC policy
4. Any other DNS records needed for Microsoft deliverability

Our domain: nextgenmedprep.com
Sending email: [your FROM email]

Error we're seeing: [paste error from test-email-delivery.ts]

Thank you!
```

#### Step 3: Add DNS Records

Once Spacemail provides the information, add these records to your DNS (Cloudflare, Namecheap, etc.):

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.spacemail.com ~all
TTL: 3600
```

**DKIM Record:**
```
Type: TXT  
Name: [selector]._domainkey    # Spacemail will provide selector
Value: v=DKIM1; k=rsa; p=[key]  # Spacemail will provide key
TTL: 3600
```

**DMARC Record:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@nextgenmedprep.com; pct=100
TTL: 3600
```

#### Step 4: Wait & Verify

```bash
# Wait 5-10 minutes for DNS propagation
# Then verify:
dig TXT nextgenmedprep.com +short

# Test again:
cd apps/backend
npx ts-node test-email-delivery.ts your-email@hotmail.com
```

---

## 📊 Monitoring Commands

```bash
# View all email stats
npx ts-node src/utils/emailAnalytics.ts

# Test delivery
npx ts-node test-email-delivery.ts recipient@example.com

# Query failed emails
# (in Supabase SQL Editor)
SELECT * FROM email_logs 
WHERE status = 'failed' 
  AND recipient_domain IN ('hotmail.com', 'outlook.com')
ORDER BY created_at DESC
LIMIT 20;

# Check success rate
SELECT 
  recipient_domain,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
  ROUND(SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as success_rate
FROM email_logs
WHERE recipient_domain IN ('hotmail.com', 'outlook.com', 'live.com')
GROUP BY recipient_domain;
```

---

## 🆘 Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 550 5.7.1 | Rejected by spam filter | Add SPF/DKIM/DMARC, check content |
| 554 5.7.1 | Authentication failed | Configure DKIM properly |
| 535 | SMTP auth failed | Check EMAIL_USER/EMAIL_PASS |
| Timeout | Connection issue | Check firewall, port 587/465 |
| EENVELOPE | Envelope rejected | SPF/DKIM issue |

---

## 🎯 Quick Checklist

- [ ] Applied database migration (`email_logs` table exists)
- [ ] Ran test email to Hotmail/Outlook address
- [ ] Checked DNS records (SPF, DKIM, DMARC)
- [ ] Contacted Spacemail for DNS configuration (if needed)
- [ ] Added DNS records (if provided by Spacemail)
- [ ] Waited for DNS propagation (10+ minutes)
- [ ] Re-tested email delivery
- [ ] Verified email_logs table has entries
- [ ] Checked spam folder

---

## 🔄 Alternative: Switch to SendGrid

If Spacemail continues having issues:

```bash
# 1. Sign up for SendGrid
# Get API key from: https://app.sendgrid.com

# 2. Install package
cd apps/backend
npm install @sendgrid/mail

# 3. Add to .env
echo "SENDGRID_API_KEY=SG.your_key_here" >> ../../.env

# 4. Update emailService.ts to use SendGrid
# (See docs/EMAIL_TRACKING_AND_DELIVERY.md for code)
```

**Benefits:**
- Better Microsoft deliverability
- Built-in analytics dashboard
- Automatic SPF/DKIM configuration
- Free tier: 100 emails/day

---

## 📚 Full Documentation

For detailed information, see:
- `docs/EMAIL_TRACKING_AND_DELIVERY.md` - Complete guide
- `EMAIL_TRACKING_README.md` - Implementation summary

---

## 💡 Pro Tips

1. **Always check spam folder first** - Even with correct setup, first emails often land in spam
2. **DNS takes time** - Wait 10-30 minutes after adding records
3. **Test incrementally** - Test one email at a time, not bulk
4. **Monitor logs** - Run analytics daily during initial setup
5. **Use test addresses** - Test with your own Hotmail/Outlook account first
