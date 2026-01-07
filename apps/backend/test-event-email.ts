/**
 * Test script to send event booking confirmation email
 * Run from apps/backend directory:
 *   npx ts-node -r tsconfig-paths/register test-event-email.ts
 */

import emailService from './src/services/emailService';

async function sendTestEventEmail() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║  Sending Event Booking Confirmation Email            ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  
  const testData = {
    id: 'test-booking-' + Date.now(),
    amount: 25,
    userName: 'Sriharsha',
    eventName: 'Pathways To Medicine Conference',
    numberOfTickets: 1
  };

  try {
    console.log('Sending to: sriharsha.vitta@gmail.com');
    console.log('Event:', testData.eventName);
    console.log('Amount: £' + testData.amount);
    console.log('Tickets:', testData.numberOfTickets);
    console.log('\nSending email...\n');
    
    await emailService.sendEventBookingConfirmationEmail(
      'sriharsha.vitta@gmail.com',
      testData
    );
    
    console.log('✓ Event booking confirmation email sent successfully!\n');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║  ✓ EMAIL SENT SUCCESSFULLY                           ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
  } catch (error) {
    console.error('✗ Failed to send email:', error);
    process.exit(1);
  }
}

sendTestEventEmail().catch(console.error);
