#!/usr/bin/env node
/**
 * Test Script for Interview Scheduling
 * Tests sending confirmation email to hv222@ic.ac.uk and sri@nextgenmedprep.com
 */

const BASE_URL = 'http://localhost:5001/api/v1';

// Test data
const tutorEmail = 'sriharsha.vitta@gmail.com'; // Review team email as tutor
const studentEmail = 'sri@nextgenmedprep.com'; // Student email

console.log('\n🧪 Interview Scheduling Test\n');
console.log('Student Email:', studentEmail);
console.log('Tutor Email:', tutorEmail);
console.log('Backend URL:', BASE_URL);
console.log('\n' + '='.repeat(60) + '\n');

async function runTest() {
  try {
    // Step 1: Create a test tutor (or check if exists)
    console.log('📝 Step 1: Creating/Getting test tutor...');
    const interviewid = "7d8a3426-b433-483a-bd08-9db1150f3952";
    const tutorid = "d1c37878-2120-47ff-b494-747f415766b0";
    const scheduled_at = new Date();
    scheduled_at.setDate(scheduled_at.getDate() + 2);
    scheduled_at.setHours(15, 0, 0, 0); // Set to 3 PM two days from now
    
    const assignResponse = await fetch(`${BASE_URL}/interviews/${interviewid}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutor_id: tutorid,
        scheduled_at: scheduled_at.toISOString()
      })
    });

    if (!assignResponse.ok) {
      const error = await assignResponse.text();
      throw new Error(`Failed to assign tutor: ${error}`);
    }

    const assignResult = await assignResponse.json();
    console.log('✅ Tutor assigned to interview');
    
    if (assignResult.data.zoom_meeting_id) {
      console.log('✅ Zoom meeting created:', assignResult.data.zoom_meeting_id);
      console.log('   Join URL:', assignResult.data.zoom_join_url);
    } else {
      console.log('⚠️  No Zoom meeting created (credentials not configured)');
    }

    // Step 4: Send confirmation emails
    console.log('\n📝 Step 4: Sending confirmation emails...');
    
    const confirmResponse = await fetch(`${BASE_URL}/interviews/${interviewid}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutor_id: tutorid,
        tutor_name: "sriharsha vitta",
        scheduled_at: scheduled_at.toISOString(),
        student_email: studentEmail,
        student_name: 'test' // Name extracted from email
      })
    });

    if (!confirmResponse.ok) {
      const error = await confirmResponse.text();
      throw new Error(`Failed to send confirmation: ${error}`);
    }

    const confirmResult = await confirmResponse.json();
    console.log('✅ Confirmation emails sent successfully!');
    console.log('   Tutor email sent to:', tutorEmail);
    console.log('   Student email sent to:', studentEmail);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📧 Check these inboxes for confirmation emails:');
    console.log('   1.', tutorEmail, '(tutor confirmation)');
    console.log('   2.', studentEmail, '(student confirmation)');
    console.log('\n📊 Interview Details:');
    console.log('   Interview ID:', interviewData.id);
    console.log('   Tutor:', tutorData.name, `(${tutorData.email})`);
    console.log('   Student:', studentEmail);
    console.log('   Scheduled:', scheduledAt.toLocaleString());
    
    if (assignResult.data.zoom_join_url) {
      console.log('   Zoom Link:', assignResult.data.zoom_join_url);
    }
    console.log('\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the test
runTest();
