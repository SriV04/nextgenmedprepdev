/**
 * Send confirmation email for incomplete booking from 20 Nov 2024
 * Run from apps/backend directory:
 *   npx ts-node -r tsconfig-paths/register send_confirmation_email.ts
 */

import emailService from './src/services/emailService';

const BOOKING_ID = '1cc37c33-2681-4ba8-ba5b-512f3bdaf0f6';

const bookingDetails = {
  email: 'sriharsha.vitta@hotmail.com', // Customer email
  name: 'Konstantinos Serafeim Frosynos',
  packageType: 'core',
  serviceType: 'live',
  universities: ['sunderland'],
  amount: 125,
  notes: 'I would also like to share the interview selection tool that I submitted to Sunderland.',
  filePath: 'statements/serafeim_frosynos_gmail_com_1763685990166.pdf'
};

async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║  Sending Confirmation Email                          ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  
  try {
    // Send email to customer
    console.log('Sending confirmation email to customer...');
    console.log(`To: ${bookingDetails.email}\n`);
    
    await emailService.sendInterviewBookingConfirmationEmail(
      bookingDetails.email,
      {
        bookingId: BOOKING_ID,
        userName: bookingDetails.name,
        packageType: bookingDetails.packageType,
        serviceType: bookingDetails.serviceType,
        universities: bookingDetails.universities,
        amount: bookingDetails.amount,
        notes: bookingDetails.notes
      }
    );
    
    console.log(`✓ Confirmation email sent to ${bookingDetails.email}`);

    // Send notification to admin
    // console.log('\nSending notification email to admin...');
    // console.log('To: contact@nextgenmedprep.com\n');
    
    // await emailService.sendInterviewBookingNotificationEmail({
    //   bookingId: BOOKING_ID,
    //   customerEmail: bookingDetails.email,
    //   customerName: bookingDetails.name,
    //   packageType: bookingDetails.packageType,
    //   serviceType: bookingDetails.serviceType,
    //   universities: bookingDetails.universities,
    //   amount: bookingDetails.amount,
    //   filePath: bookingDetails.filePath,
    //   notes: bookingDetails.notes
    // });
    
    // console.log('✓ Notification email sent to contact@nextgenmedprep.com');

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║  ✓ EMAILS SENT SUCCESSFULLY                          ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
  } catch (error: any) {
    console.error('\n╔═══════════════════════════════════════════════════════╗');
    console.error('║  ✗ EMAIL SENDING FAILED                              ║');
    console.error('╚═══════════════════════════════════════════════════════╝\n');
    console.error('Error:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch(console.error);
