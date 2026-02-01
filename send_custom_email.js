#!/usr/bin/env node

/**
 * Custom Email Sender Script for NextGen MedPrep
 * 
 * This script sends custom emails with attachments using the backend email service.
 * 
 * Usage:
 *   node send_custom_email.js
 * 
 * Configuration:
 *   - Edit the EMAIL_CONFIG object below with your email details
 *   - Specify recipients, subject, HTML content, and attachments
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// ============================================================================
// EMAIL CONFIGURATION - EDIT THIS SECTION
// ============================================================================

const EMAIL_CONFIG = {
  // Sending method: 'direct' or 'api'
  // 'direct' - Send emails directly using nodemailer (default)
  // 'api' - Send emails through the backend API route
  sendingMethod: 'direct', // Change to 'api' to use the backend API
  
  // API Configuration (only used if sendingMethod is 'api')
  apiConfig: {
    backendUrl: 'http://localhost:5001',
    packageType: "event_Interview_Background_Knowledge_Conference_2025_11_02", // Set to 'ucat_conference', 'interview_package', etc. to send to users who booked that package
    // If packageType is set, recipients array will be ignored and emails will be sent to all users who booked that package
  },
  
  // Recipients - can be a single email or array of emails
  // This is used for 'direct' method or 'api' method when packageType is null
  recipients: [
    "contact@nextgenmedprep.com"
  ],
  
  // Email subject
  subject: 'Background Knowledge Conference - Tomorrow',
  
  // HTML content of the email
  htmlContent: `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Background Knowledge Conference - Tomorrow</title>
  <style>
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .email-body {
        background: #0a0f1e !important;
      }
      .email-container {
        background: #1e293b !important;
      }
      .content-text {
        color: #e2e8f0 !important;
      }
      .content-text-secondary {
        color: #cbd5e1 !important;
      }
      .section-bg {
        background: #0f172a !important;
        border-color: #334155 !important;
      }
      .footer-bg {
        background: #0f172a !important;
      }
      .footer-text {
        color: #94a3b8 !important;
      }
    }
  </style>
</head>
<body class="email-body" style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0f1e;">
  <!-- Outer wrapper -->
  <div style="padding:40px 20px;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 24px 48px rgba(99,102,241,0.12);" class="email-container">
      
      <!-- Animated gradient header -->
      <tr>
        <td style="padding:0;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%);position:relative;">
          <div style="padding:48px 40px;text-align:center;position:relative;overflow:hidden;">
            <!-- Decorative circles -->
            <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:rgba(255,255,255,0.1);border-radius:50%;"></div>
            <div style="position:absolute;bottom:-60px;left:-60px;width:200px;height:200px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
            
            <div style="position:relative;z-index:1;">
              <!-- Logo -->
              <div style="margin:0 0 24px;">
                <span style="font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-1px;text-shadow:0 2px 8px rgba(0,0,0,0.1);">NextGen MedPrep</span>
              </div>
              
              <!-- Title -->
              <h1 style="margin:0 0 12px;font-size:36px;font-weight:800;color:#ffffff;line-height:1.2;text-shadow:0 2px 8px rgba(0,0,0,0.1);">You're In! 🎉</h1>
              <p style="margin:0;font-size:18px;color:rgba(255,255,255,0.95);font-weight:500;">Background Knowledge Conference</p>
              
              <!-- Date badge -->
              <div style="margin:24px 0 0;display:inline-block;">
                <div style="background:rgba(255,255,255,0.2);backdrop-filter:blur(10px);padding:16px 32px;border-radius:16px;border:2px solid rgba(255,255,255,0.3);">
                  <div style="color:#ffffff;font-size:15px;font-weight:700;margin-bottom:4px;">TOMORROW</div>
                  <div style="color:rgba(255,255,255,0.95);font-size:20px;font-weight:800;">2nd November • 10:00 - 11:00 AM</div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
      
      <!-- Main content -->
      <tr>
        <td style="padding:48px 40px;">
          
          <!-- Welcome message -->
          <div style="margin:0 0 32px;">
            <p class="content-text" style="margin:0 0 20px;font-size:17px;color:#1e293b;line-height:1.7;">
              Hi there! 👋
            </p>
            <p class="content-text-secondary" style="margin:0;font-size:17px;color:#475569;line-height:1.7;">
              Everything is ready for tomorrow's conference. We've prepared some excellent content and can't wait to share it with you!
            </p>
          </div>
          
          <!-- Join button -->
          <div style="margin:0 0 48px;text-align:center;">
            <a href="https://us06web.zoom.us/j/81823665298?pwd=AR3ks5fyyyRHxXbdfZLiLdeucdWfPF.1" style="display:inline-block;padding:20px 48px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;font-size:18px;font-weight:700;border-radius:16px;box-shadow:0 12px 24px rgba(99,102,241,0.25),0 4px 8px rgba(99,102,241,0.15);transition:transform 0.2s;">
              🎥 Join Conference Tomorrow
            </a>
            <p class="footer-text" style="margin:12px 0 0;font-size:14px;color:#94a3b8;">Click at 10:00 AM to enter the session</p>
          </div>
          
          <!-- Special offer card -->
          <div style="margin:0 0 40px;padding:32px;background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);border-radius:20px;border:3px solid #86efac;position:relative;overflow:hidden;">
            <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:rgba(34,197,94,0.1);border-radius:50%;"></div>
            
            <div style="position:relative;z-index:1;">
              <div style="margin:0 0 8px;">
                <span style="display:inline-block;background:#22c55e;color:#ffffff;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Special Offer</span>
              </div>
              
              <h2 style="margin:0 0 16px;font-size:28px;font-weight:800;color:#15803d;">£10 Off Resource Bundles</h2>
              
              <p style="margin:0 0 24px;font-size:16px;color:#166534;line-height:1.6;">
                Exclusive conference attendee benefit - save £10 on any of our comprehensive resource bundles.
              </p>
              
              <!-- Discount code -->
              <div style="background:#ffffff;border:3px dashed #22c55e;border-radius:16px;padding:20px;text-align:center;margin:0 0 16px;">
                <div style="font-size:13px;color:#16a34a;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Your Discount Code</div>
                <div style="font-family:'Courier New',monospace;font-size:32px;font-weight:900;color:#15803d;letter-spacing:3px;margin:0 0 8px;">CONFERENCE10</div>
                <div style="font-size:14px;color:#16a34a;font-weight:600;">Valid for 2025 & 2026 </div>
              </div>
              
              <p style="margin:0;font-size:14px;color:#166534;text-align:center;">
                💎 Copy this code and use it at checkout
              </p>
            </div>
          </div>
          
          <!-- Resources section -->
          <div style="margin:0 0 40px;">
            <h3 class="content-text" style="margin:0 0 20px;font-size:22px;font-weight:700;color:#0f172a;">📚 Session Resources</h3>
            
            <div class="section-bg" style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:16px;padding:28px;">
              <p class="content-text-secondary" style="margin:0 0 20px;font-size:16px;color:#475569;line-height:1.6;">
                Download the resource pack with the condensed notes for tomorrow's session. (Adding your own notes boosts memory!)
              </p>
              
              <div style="text-align:center;">
                <p style="margin:0 0 16px;font-size:15px;color:#64748b;font-weight:600;">📄 NGMP Conference Notes.pdf</p>
                <p style="margin:0 0 20px;font-size:14px;color:#94a3b8;">The PDF is attached to this email</p>
              </div>
              
              <div style="background:rgba(99,102,241,0.05);border-radius:12px;padding:16px;text-align:center;">
                <p style="margin:0;font-size:14px;color:#6366f1;font-weight:600;">
                  💡 Tip: Print the notes or open them on a second screen during the conference
                </p>
              </div>
            </div>
          </div>
          
          <!-- Preparation tips -->
          <div style="margin:0 0 40px;">
            <h3 class="content-text" style="margin:0 0 20px;font-size:22px;font-weight:700;color:#0f172a;">✨ Preparation Checklist</h3>
            
            <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);border-radius:16px;padding:4px;margin:0 0 12px;">
              <div style="background:#ffffff;border-radius:13px;padding:20px;display:flex;align-items:start;">
                <div style="flex-shrink:0;width:32px;height:32px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-right:16px;">
                  <span style="color:#ffffff;font-size:18px;font-weight:700;">1</span>
                </div>
                <div>
                  <div style="font-weight:700;color:#0f172a;font-size:16px;margin-bottom:4px;">Join Early</div>
                  <div style="color:#64748b;font-size:15px;line-height:1.5;">Log in 5 minutes before 10:00 AM to test your setup</div>
                </div>
              </div>
            </div>
            
            <div style="background:linear-gradient(135deg,#ddd6fe 0%,#c4b5fd 100%);border-radius:16px;padding:4px;margin:0 0 12px;">
              <div style="background:#ffffff;border-radius:13px;padding:20px;display:flex;align-items:start;">
                <div style="flex-shrink:0;width:32px;height:32px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-right:16px;">
                  <span style="color:#ffffff;font-size:18px;font-weight:700;">2</span>
                </div>
                <div>
                  <div style="font-weight:700;color:#0f172a;font-size:16px;margin-bottom:4px;">Review Your Notes</div>
                  <div style="color:#64748b;font-size:15px;line-height:1.5;">Check the attached PDF before the session starts</div>
                </div>
              </div>
            </div>
            
            <div style="background:linear-gradient(135deg,#bfdbfe 0%,#93c5fd 100%);border-radius:16px;padding:4px;">
              <div style="background:#ffffff;border-radius:13px;padding:20px;display:flex;align-items:start;">
                <div style="flex-shrink:0;width:32px;height:32px;background:linear-gradient(135deg,#3b82f6,#2563eb);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-right:16px;">
                  <span style="color:#ffffff;font-size:18px;font-weight:700;">3</span>
                </div>
                <div>
                  <div style="font-weight:700;color:#0f172a;font-size:16px;margin-bottom:4px;">Prepare to Take Notes</div>
                  <div style="color:#64748b;font-size:15px;line-height:1.5;">Have your notebook or note-taking app ready</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Sign off -->
          <div style="padding:32px 0;border-top:2px solid #e2e8f0;">
            <p class="content-text-secondary" style="margin:0 0 8px;font-size:16px;color:#475569;line-height:1.6;">
              Looking forward to seeing you tomorrow! 🚀
            </p>
            <p class="content-text" style="margin:0;font-size:16px;font-weight:700;color:#0f172a;">
              The NextGen MedPrep Team
            </p>
          </div>
          
        </td>
      </tr>
      
      <!-- Footer -->
      <tr>
        <td style="padding:0;">
          <div style="height:6px;background:linear-gradient(90deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%);"></div>
          <div class="footer-bg" style="padding:32px 40px;background:#f8fafc;text-align:center;">
            <p class="footer-text" style="margin:0 0 12px;font-size:14px;color:#64748b;line-height:1.6;">
              Questions? We're here to help!<br>
              Email us at <a href="mailto:contact@nextgenmedprep.com" style="color:#6366f1;text-decoration:none;font-weight:600;">contact@nextgenmedprep.com</a>
            </p>
            <p class="footer-text" style="margin:0;font-size:13px;color:#94a3b8;">
              © 2025 NextGen MedPrep. All rights reserved.
            </p>
          </div>
        </td>
      </tr>
      
    </table>
  </div>
</body>
</html>`,
  
  // Plain text version (fallback for email clients that don't support HTML)
  textContent: `
Hi there!

Everything is ready for tomorrow's Background Knowledge Conference. We've prepared some excellent content and can't wait to share it with you!

Conference Details:
- Date: Tomorrow, 2nd November
- Time: 10:00 - 11:00 AM
- Join Link: https://us06web.zoom.us/j/81823665298?pwd=AR3ks5fyyyRHxXbdfZLiLdeucdWfPF.1

Special Offer:
Get £10 off resource bundles with code: CONFERENCE10
Valid for 2025 & 2026

Session Resources:
The NGMP Conference Notes PDF is attached to this email. Download it before the session and print it or have it open on a second screen.

Preparation Checklist:
1. Join Early - Log in 5 minutes before 10:00 AM to test your setup
2. Review Your Notes - Check the attached PDF before the session starts
3. Prepare to Take Notes - Have your notebook or note-taking app ready

Looking forward to seeing you tomorrow! 🚀

The NextGen MedPrep Team

Questions? Email us at contact@nextgenmedprep.com
© 2025 NextGen MedPrep. All rights reserved.
  `,
  
  // Attachments - add file paths here
  attachments: [
    {
      filename: 'NGMP Conference Notes.pdf',
      path: '/Users/sriharshavitta/NGMP Docs/NGMP Conference Notes.pdf',
    },
    // Add more attachments if needed
    // {
    //   filename: 'Another-File.pdf',
    //   path: '/path/to/another-file.pdf',
    // },
  ],
};

// ============================================================================
// SCRIPT EXECUTION - DO NOT EDIT BELOW THIS LINE
// ============================================================================

async function sendViaAPI() {
  console.log('🚀 NextGen MedPrep Custom Email Sender (API Mode)\n');
  
  const { backendUrl, packageType } = EMAIL_CONFIG.apiConfig;
  
  // Prepare request body
  const requestBody = {
    subject: EMAIL_CONFIG.subject,
    content: EMAIL_CONFIG.htmlContent,
  };
  
  let endpoint = `${backendUrl}/api/emails/custom`;
  
  if (packageType) {
    // Send to users who booked a specific package
    endpoint = `${backendUrl}/api/v1/emails/event-update`;
    requestBody.package_type = packageType;
    console.log(`📦 Sending to all users who booked: ${packageType}\n`);
  } else {
    // Send to specific recipients
    requestBody.emails = EMAIL_CONFIG.recipients;
    console.log(`📧 Sending to ${EMAIL_CONFIG.recipients.length} recipient(s)\n`);
  }
  
  console.log('📬 Email Details:');
  console.log(`   Subject: ${EMAIL_CONFIG.subject}`);
  console.log(`   Endpoint: ${endpoint}`);
  console.log('');
  
  try {
    console.log('📤 Sending request to backend API...\n');
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`API request failed: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Display summary
    console.log('='.repeat(60));
    console.log('📊 Email Sending Summary:');
    console.log('='.repeat(60));
    console.log(`   Total Recipients: ${data.data.total || 0}`);
    console.log(`   ✅ Successfully Sent: ${data.data.sent || 0}`);
    console.log(`   ❌ Failed: ${data.data.failed || 0}`);
    if (packageType) {
      console.log(`   📦 Package Type: ${data.data.package_type || packageType}`);
    }
    console.log('');
    console.log(`✅ ${data.message}`);
    console.log('\n✨ Email sending complete!\n');
    
  } catch (error) {
    console.error('\n❌ API request failed:');
    console.error(`   Error: ${error.message}`);
    console.error('\nPlease check:');
    console.error('   - Backend server is running');
    console.error('   - BACKEND_URL is correct in .env file');
    console.error('   - API endpoint is accessible\n');
    process.exit(1);
  }
}

async function sendCustomEmail() {
  console.log('🚀 NextGen MedPrep Custom Email Sender\n');
  
  // Validate environment variables
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Error: Missing email configuration in .env file');
    console.error('   Required: EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_FROM\n');
    process.exit(1);
  }
  
  // Validate recipients
  if (!EMAIL_CONFIG.recipients || EMAIL_CONFIG.recipients.length === 0) {
    console.error('❌ Error: No recipients specified');
    console.error('   Please add recipient emails to the EMAIL_CONFIG.recipients array\n');
    process.exit(1);
  }
  
  // Validate attachments exist
  for (const attachment of EMAIL_CONFIG.attachments) {
    if (!fs.existsSync(attachment.path)) {
      console.error(`❌ Error: Attachment file not found: ${attachment.path}\n`);
      process.exit(1);
    }
  }
  
  // Create transporter
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
  
  // Verify connection
  console.log('📧 Verifying email configuration...');
  try {
    await transporter.verify();
    console.log('✅ Email configuration verified\n');
  } catch (error) {
    console.error('❌ Email configuration verification failed:');
    console.error(error.message);
    console.error('\nPlease check your .env file and email credentials\n');
    process.exit(1);
  }
  
  // Display email details
  console.log('📬 Email Details:');
  console.log(`   From: ${process.env.EMAIL_FROM}`);
  console.log(`   To: ${EMAIL_CONFIG.recipients.join(', ')}`);
  console.log(`   Subject: ${EMAIL_CONFIG.subject}`);
  console.log(`   Attachments: ${EMAIL_CONFIG.attachments.map(a => a.filename).join(', ')}`);
  console.log('');
  
  // Send emails
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  console.log(`📤 Sending emails to ${EMAIL_CONFIG.recipients.length} recipient(s)...\n`);
  
  for (const recipient of EMAIL_CONFIG.recipients) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject: EMAIL_CONFIG.subject,
        text: EMAIL_CONFIG.textContent,
        html: EMAIL_CONFIG.htmlContent,
        attachments: EMAIL_CONFIG.attachments,
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`   ✅ Sent to: ${recipient}`);
      successCount++;
      
      // Add a small delay between emails to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`   ❌ Failed to send to: ${recipient}`);
      console.log(`      Error: ${error.message}`);
      errorCount++;
      errors.push({ recipient, error: error.message });
    }
  }
  
  // Display summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Email Sending Summary:');
  console.log('='.repeat(60));
  console.log(`   Total Recipients: ${EMAIL_CONFIG.recipients.length}`);
  console.log(`   ✅ Successfully Sent: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(({ recipient, error }) => {
      console.log(`   ${recipient}: ${error}`);
    });
  }
  
  console.log('\n✨ Email sending complete!\n');
}

// Run the script
async function main() {
  if (EMAIL_CONFIG.sendingMethod === 'api') {
    await sendViaAPI();
  } else {
    await sendCustomEmail();
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:');
  console.error(error);
  process.exit(1);
});
