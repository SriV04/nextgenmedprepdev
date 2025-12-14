#!/usr/bin/env ts-node

import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const testEmail = process.argv[2];

if (!testEmail) {
  console.error('❌ Please provide an email address to test');
  console.log('Usage: npx ts-node test-email-delivery.ts user@example.com');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(testEmail)) {
  console.error('❌ Invalid email format');
  process.exit(1);
}

const domain = testEmail.split('@')[1];
const isHotmailOutlook = ['hotmail.com', 'outlook.com', 'live.com', 'msn.com'].includes(domain);

console.log('\n📧 Email Delivery Test');
console.log('='.repeat(60));
console.log(`Recipient: ${testEmail}`);
console.log(`Domain: ${domain}`);
console.log(`Is Hotmail/Outlook: ${isHotmailOutlook ? '✅ Yes' : '❌ No'}`);
console.log('='.repeat(60));

async function testEmailDelivery() {
  console.log('\n🔧 Configuration Check:');
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST || '❌ NOT SET'}`);
  console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT || '❌ NOT SET'}`);
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ NOT SET'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Set' : '❌ NOT SET'}`);
  console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || '❌ NOT SET'}`);

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('\n❌ Missing required email configuration');
    process.exit(1);
  }

  const port = parseInt(process.env.EMAIL_PORT || '587');
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    requireTLS: port !== 465,
    tls: {
      rejectUnauthorized: false
    }
  });

  console.log('\n🔌 Testing SMTP connection...');
  
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful');
  } catch (error: any) {
    console.error('❌ SMTP connection failed:', error.message);
    process.exit(1);
  }

  console.log('\n📤 Sending test email...');
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: testEmail,
    subject: 'Test Email - NextGen MedPrep Delivery Check',
    text: `This is a test email to verify delivery to ${domain}.\n\nIf you received this, email delivery is working correctly!\n\nTimestamp: ${new Date().toISOString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">✅ Test Email Delivery</h2>
        <p>This is a test email to verify delivery to <strong>${domain}</strong>.</p>
        <p>If you received this, email delivery is working correctly!</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Recipient:</strong> ${testEmail}</p>
          <p style="margin: 0;"><strong>Domain:</strong> ${domain}</p>
          <p style="margin: 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
        <p style="font-size: 12px; color: #6b7280;">This is an automated test email from NextGen MedPrep.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    console.log('\n✅ Email sent successfully!');
    console.log('='.repeat(60));
    console.log(`📨 Message ID: ${info.messageId}`);
    console.log(`📬 Response: ${info.response}`);
    console.log(`✉️ Accepted: ${info.accepted?.join(', ') || 'N/A'}`);
    console.log(`⚠️ Rejected: ${info.rejected?.join(', ') || 'None'}`);
    
    if (info.rejected && info.rejected.length > 0) {
      console.log('\n❌ Email was rejected by the server');
      console.log('This usually means:');
      console.log('  - Invalid recipient address');
      console.log('  - Domain has strict spam filters');
      console.log('  - Missing SPF/DKIM/DMARC records');
      console.log('  - Sender IP is blacklisted');
    } else {
      console.log('\n🎉 Success! Check the inbox (and spam folder) of:');
      console.log(`   ${testEmail}`);
      
      if (isHotmailOutlook) {
        console.log('\n💡 Tips for Hotmail/Outlook:');
        console.log('  - Check spam/junk folder');
        console.log('  - Add sender to safe list');
        console.log('  - Verify SPF/DKIM/DMARC records');
        console.log('  - Allow a few minutes for delivery');
      }
    }
    
    console.log('='.repeat(60));
    console.log('\n📊 To track this email, check the email_logs table:');
    console.log(`   SELECT * FROM email_logs WHERE recipient = '${testEmail}' ORDER BY created_at DESC LIMIT 1;`);
    
  } catch (error: any) {
    console.error('\n❌ Failed to send email');
    console.error('='.repeat(60));
    console.error(`Error: ${error.message}`);
    
    if (error.code) {
      console.error(`Code: ${error.code}`);
    }
    
    if (error.response) {
      console.error(`Response: ${error.response}`);
    }
    
    if (error.responseCode) {
      console.error(`Response Code: ${error.responseCode}`);
    }
    
    console.error('\n🔍 Common Issues:');
    console.error('  - 550 errors: Recipient rejected (spam filter, invalid address)');
    console.error('  - 554 errors: Message rejected (content/authentication issues)');
    console.error('  - 535 errors: Authentication failed (wrong credentials)');
    console.error('  - Connection timeout: Firewall or network issue');
    
    console.error('\n💡 Solutions:');
    console.error('  1. Verify DNS records (SPF, DKIM, DMARC)');
    console.error('  2. Check if sending IP is blacklisted');
    console.error('  3. Contact Spacemail support');
    console.error('  4. Consider switching to SendGrid/Mailgun');
    
    process.exit(1);
  }
}

testEmailDelivery().catch(error => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
