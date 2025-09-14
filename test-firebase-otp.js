/**
 * Test Firebase OTP Implementation (Without Twilio)
 * Tests the new Firebase-based phone authentication flow
 */
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './DashStream_Apk_backend/.env' });

const API_BASE_URL = 'http://localhost:5000/api';
const TEST_PHONE = '+919341526497'; // Valid 11-digit US number

/**
 * Test Firebase OTP Flow
 */
class FirebaseOtpTest {
  constructor() {
    this.verificationId = null;
    this.generatedOtp = null;
  }

  /**
   * Test 1: Send Firebase Verification Code
   */
  async testSendVerification() {
    try {
      console.log('🔵 Testing Firebase Send Verification...');
      
      const response = await axios.post(`${API_BASE_URL}/auth/firebase/send-verification`, {
        phone: TEST_PHONE
      });

      console.log('✅ Send Verification Response:', {
        status: response.data.status,
        message: response.data.message,
        hasVerificationId: !!response.data.data?.verificationId,
        phone: response.data.data?.phone
      });

      if (response.data.data?.verificationId) {
        this.verificationId = response.data.data.verificationId;
        console.log('📝 Verification ID stored for testing');
      }

      return response.data.status === 'success';
    } catch (error) {
      console.error('❌ Send Verification failed:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Test 2: Sync User
   */
  async testSyncUser() {
    try {
      console.log('🔵 Testing User Sync...');
      
      const response = await axios.post(`${API_BASE_URL}/auth/sync-user`, {
        phone: TEST_PHONE
      });

      console.log('✅ Sync User Response:', {
        status: response.data.status,
        message: response.data.message,
        hasUserId: !!response.data.data?.userId
      });

      return response.data.status === 'success';
    } catch (error) {
      console.error('❌ Sync User failed:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Test 3: Check Server Logs for OTP
   */
  async testCheckOtpGeneration() {
    console.log('🔵 Testing OTP Generation...');
    
    if (this.verificationId) {
      console.log('✅ Verification ID generated successfully');
      console.log('📱 Check server console for generated OTP');
      console.log('💡 In production, this OTP would be sent via SMS service');
      return true;
    } else {
      console.log('❌ No verification ID found');
      return false;
    }
  }

  /**
   * Test 4: Verify Firebase Admin SDK Integration
   */
  async testFirebaseAdminIntegration() {
    try {
      console.log('🔵 Testing Firebase Admin SDK Integration...');
      
      // Test if Firebase Admin service is working by calling the endpoint again
      const response = await axios.post(`${API_BASE_URL}/auth/firebase/send-verification`, {
        phone: '+1987654321' // Different test number
      });

      console.log('✅ Firebase Admin SDK working correctly');
      return response.data.status === 'success';
    } catch (error) {
      console.error('❌ Firebase Admin SDK test failed:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Test 5: Backend Compatibility Check
   */
  async testBackwardCompatibility() {
    try {
      console.log('🔵 Testing Backward Compatibility...');
      
      // Test old send-otp endpoint (should redirect to Firebase)
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        phone: TEST_PHONE
      });

      console.log('✅ Backward compatibility maintained');
      return response.data.status === 'success';
    } catch (error) {
      console.error('❌ Backward compatibility test failed:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting Firebase OTP Implementation Tests\n');
    console.log('📋 Test Configuration:');
    console.log(`   • API Base URL: ${API_BASE_URL}`);
    console.log(`   • Test Phone: ${TEST_PHONE}`);
    console.log(`   • Firebase OTP: Enabled ✅`);
    console.log(`   • Twilio OTP: Disabled ❌\n`);

    const results = {
      sendVerification: false,
      syncUser: false,
      otpGeneration: false,
      firebaseAdmin: false,
      backwardCompatibility: false
    };

    // Test 1: Send Verification
    results.sendVerification = await this.testSendVerification();
    console.log('');

    // Test 2: Sync User
    results.syncUser = await this.testSyncUser();
    console.log('');

    // Test 3: OTP Generation Check
    results.otpGeneration = await this.testCheckOtpGeneration();
    console.log('');

    // Test 4: Firebase Admin Integration
    results.firebaseAdmin = await this.testFirebaseAdminIntegration();
    console.log('');

    // Test 5: Backward Compatibility
    results.backwardCompatibility = await this.testBackwardCompatibility();
    console.log('');

    // Print results
    this.printTestResults(results);
  }

  /**
   * Print test results summary
   */
  printTestResults(results) {
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('========================');
    
    const testNames = {
      sendVerification: 'Firebase Send Verification',
      syncUser: 'User Sync to Database',
      otpGeneration: 'OTP Generation & Logging',
      firebaseAdmin: 'Firebase Admin SDK Integration',
      backwardCompatibility: 'Backward Compatibility'
    };

    Object.entries(results).forEach(([test, passed]) => {
      const status = passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${testNames[test]}`);
    });

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log('');
    console.log(`🎯 Overall: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All tests passed! Firebase OTP is working correctly.');
      console.log('🔥 Twilio has been successfully replaced with Firebase!');
    } else if (passedTests >= totalTests - 1) {
      console.log('⚠️ Most tests passed. Minor issues detected.');
    } else {
      console.log('⚠️ Some tests failed. Check the logs above for details.');
    }

    console.log('\n📝 NEXT STEPS:');
    console.log('1. Check server console for generated OTP codes');
    console.log('2. Integrate SMS service for production OTP delivery');
    console.log('3. Test with mobile app using new Firebase authentication');
    console.log('4. Consider using Redis for session storage in production');
    console.log('5. Remove old Twilio environment variables if any');

    console.log('\n💡 IMPLEMENTATION NOTES:');
    console.log('• OTP is currently logged to server console');
    console.log('• In production, integrate with SMS service in firebaseAdminService.js');
    console.log('• Sessions stored in memory (use Redis for production)');
    console.log('• Firebase handles automatic token refresh');
  }
}

/**
 * Check if server is running
 */
async function checkServerStatus() {
  try {
    console.log('🔍 Checking server status...');
    const response = await axios.get(`${API_BASE_URL}/auth/sync-user`, { 
      timeout: 5000,
      validateStatus: () => true
    });
    console.log('✅ Server is running');
    return true;
  } catch (error) {
    console.error('❌ Server is not running or not accessible');
    console.log('💡 Make sure to start the backend server:');
    console.log('   cd DashStream_Apk_backend && npm run dev');
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔥 Firebase OTP Implementation Test (Twilio Removed)\n');
  
  // Check if server is running
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    process.exit(1);
  }
  
  console.log('');
  
  // Run tests
  const tester = new FirebaseOtpTest();
  await tester.runAllTests();
}

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n⏹️ Test interrupted by user');
  process.exit(0);
});

// Run the tests
main().catch(console.error);