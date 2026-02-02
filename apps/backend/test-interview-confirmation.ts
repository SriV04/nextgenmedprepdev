/**
 * Test script for sending interview confirmation email
 * Run from apps/backend directory:
 *   npx ts-node -r tsconfig-paths/register test-interview-confirmation.ts
 */

import emailService from './src/services/emailService';

async function main() {
  console.log('Testing sendInterviewConfirmationEmail...');

  // addresses from test-interview-scheduling.js
  const tutorEmail = 'contact@nextgenmedprep.com'; 
  const tutorName = 'Sriharsha Tutor';
  const studentEmail = 'contact@nextgenmedprep.com';
  const studentName = 'Sri Student';
  
  const scheduledAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days from now
  const interviewId = 'TEST-INTERVIEW-' + Date.now();
  const zoomJoinUrl = 'https://zoom.us/j/123456789';
  const zoomHostEmail = 'host@nextgenmedprep.com';
  const universities = 'Oxford, Cambridge';

  try {
    console.log(`Sending email to:`);
    console.log(`- Student: ${studentEmail} (${studentName})`);
    console.log(`- Tutor: ${tutorEmail} (${tutorName})`);
    
    console.log('\nPayload:');
    console.log({
      scheduledAt,
      interviewId,
      zoomJoinUrl,
      zoomHostEmail,
      universities
    });

    await emailService.sendInterviewConfirmationEmail(
      tutorEmail,
      tutorName,
      studentEmail,
      studentName,
      scheduledAt,
      interviewId,
      zoomJoinUrl,
      zoomHostEmail,
      universities
    );

    console.log('\n✅ Email sent successfully!');
  } catch (error) {
    console.error('\n❌ Error sending email:', error);
  }
}

main().catch(console.error);
