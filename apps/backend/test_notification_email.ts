/**
 * Test notification email with availability
 * Run from apps/backend directory:
 *   npx ts-node -r tsconfig-paths/register test_notification_email.ts
 */

import emailService from './src/services/emailService';

const testBookingDetails = {
  bookingId: 'test-booking-' + Date.now(),
  customerEmail: 'sriharsha.vitta@outlook.com',
  customerName: 'Test Student',
  packageType: 'essentials', // One interview package
  serviceType: 'live',
  universities: ['oxford'],
  amount: 75,
  notes: 'This is a test booking to verify availability display in tutor notification emails.',
  availability: [
    {
      date: '2025-11-27',
      timeSlot: '09:00 - 10:00'
    }, 
    {
        date: '2025-11-27',
        timeSlot: '14:00 - 15:00'
    }
  ]
};

async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║  Testing Notification Email with Availability        ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  
  console.log('Test Data:');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`Customer Email: ${testBookingDetails.customerEmail}`);
  console.log(`Customer Name: ${testBookingDetails.customerName}`);
  console.log(`Package Type: ${testBookingDetails.packageType}`);
  console.log(`Service Type: ${testBookingDetails.serviceType}`);
  console.log(`Universities: ${testBookingDetails.universities.join(', ')}`);
  console.log(`Amount: £${testBookingDetails.amount}`);
  console.log(`Availability:`);
  testBookingDetails.availability.forEach(slot => {
    console.log(`  • ${slot.date} at ${slot.timeSlot}`);
  });
  console.log('─────────────────────────────────────────────────────────\n');
  
  try {
    console.log('Sending notification email to admin/tutor...');
    console.log(`(Email will be sent to configured admin email)\n`);
    
    await emailService.sendInterviewBookingNotificationEmail({
      bookingId: testBookingDetails.bookingId,
      customerEmail: testBookingDetails.customerEmail,
      customerName: testBookingDetails.customerName,
      packageType: testBookingDetails.packageType,
      serviceType: testBookingDetails.serviceType,
      universities: testBookingDetails.universities,
      amount: testBookingDetails.amount,
      notes: testBookingDetails.notes,
      availability: testBookingDetails.availability
    });
    
    console.log('✓ Notification email sent successfully!');

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║  ✓ TEST COMPLETED SUCCESSFULLY                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    
    console.log('Please check the admin email inbox for the notification.');
    console.log('The email should include a "Student Availability" section');
    console.log('showing: 2025-11-27 at 09:00 - 10:00\n');
    
  } catch (error: any) {
    console.error('\n╔═══════════════════════════════════════════════════════╗');
    console.error('║  ✗ TEST FAILED                                       ║');
    console.error('╚═══════════════════════════════════════════════════════╝\n');
    console.error('Error:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch(console.error);
