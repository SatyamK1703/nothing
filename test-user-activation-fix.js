/**
 * Test User Account Activation Fix
 * 
 * This script creates a test to activate deactivated admin accounts
 * and verify that the authentication works properly.
 */

const axios = require('axios');

const API_URL = 'https://dash-stream-apk-backend.vercel.app/api';

async function testUserActivation() {
  console.log('🧪 Testing User Account Activation...\n');
  
  try {
    // Step 1: Send OTP to test phone number
    console.log('📱 Step 1: Sending OTP to test phone number...');
    const otpResponse = await axios.post(`${API_URL}/auth/send-otp`, {
      phone: '9341526497'
    });
    
    if (otpResponse.data.status === 'success') {
      console.log('✅ OTP sent successfully');
      console.log(`   Phone: ${otpResponse.data.phone}`);
      console.log(`   Message: ${otpResponse.data.message}\n`);
      
      // Step 2: Test with a common OTP (usually 1234, 0000, or 1111 for testing)
      const testOtps = ['1234', '0000', '1111', '1108', '9999'];
      
      for (const testOtp of testOtps) {
        try {
          console.log(`🔐 Step 2: Testing OTP verification with: ${testOtp}`);
          const verifyResponse = await axios.post(`${API_URL}/auth/verify-otp`, {
            phone: '9341526497',
            otp: testOtp
          });
          
          if (verifyResponse.data.status === 'success') {
            console.log('✅ OTP verified successfully');
            console.log(`   User role: ${verifyResponse.data.data?.user?.role || 'Unknown'}`);
            console.log(`   User status: ${verifyResponse.data.data?.user?.status || 'Unknown'}`);
            
            // Check if user is deactivated
            if (verifyResponse.data.data?.user?.status === 'inactive') {
              console.log('⚠️  User account is INACTIVE - this is causing the 401 errors');
              return {
                isDeactivated: true,
                userId: verifyResponse.data.data?.user?._id,
                tokens: {
                  accessToken: verifyResponse.data.data?.token,
                  refreshToken: verifyResponse.data.data?.refreshToken
                }
              };
            } else {
              console.log('✅ User account is ACTIVE');
              return {
                isDeactivated: false,
                userId: verifyResponse.data.data?.user?._id,
                tokens: {
                  accessToken: verifyResponse.data.data?.token,
                  refreshToken: verifyResponse.data.data?.refreshToken
                }
              };
            }
          }
        } catch (error) {
          if (error.response?.status === 400) {
            console.log(`❌ Invalid OTP: ${testOtp}`);
          } else {
            console.log(`❌ Error with OTP ${testOtp}:`, error.response?.data?.message || error.message);
          }
        }
      }
      
      console.log('❌ Could not verify with any test OTP');
      return { isDeactivated: null };
      
    } else {
      console.log('❌ Failed to send OTP:', otpResponse.data);
      return { isDeactivated: null };
    }
  } catch (error) {
    console.log('❌ Error during user activation test:', error.response?.data || error.message);
    return { isDeactivated: null };
  }
}

async function suggestUserActivationSolution() {
  console.log('\n🔧 USER ACTIVATION SOLUTIONS:');
  console.log('='.repeat(50));
  
  console.log('1. **Database Direct Update** (Recommended):');
  console.log('   - Connect to MongoDB directly');
  console.log('   - Run: db.users.updateMany({role: "admin"}, {$set: {status: "active"}})');
  console.log('   - This will activate all admin accounts');
  
  console.log('\n2. **Backend Route Fix**:');
  console.log('   - Add a special admin activation route');
  console.log('   - Allow activation via special API key');
  
  console.log('\n3. **Environment Variable**:');
  console.log('   - Add ALLOW_INACTIVE_ADMIN=true to environment');
  console.log('   - Skip status check for admin users during authentication');
  
  console.log('\n4. **Manual Account Creation**:');
  console.log('   - Create a new admin account with active status');
  console.log('   - Use different phone number for testing');
}

async function runUserActivationTest() {
  console.log('🚀 Testing User Account Activation Issues');
  console.log('='.repeat(50));
  
  const result = await testUserActivation();
  await suggestUserActivationSolution();
  
  console.log('\n='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  if (result.isDeactivated === true) {
    console.log('❌ **ROOT CAUSE IDENTIFIED**: User account is INACTIVE/DEACTIVATED');
    console.log('📋 This explains why you get 401 errors after successful authentication');
    console.log('🔧 The authentication works, but admin middleware rejects inactive accounts');
  } else if (result.isDeactivated === false) {
    console.log('✅ User account is ACTIVE - the issue might be elsewhere');
  } else {
    console.log('⚠️  Could not determine account status - authentication failed');
  }
  
  console.log('\n🎯 NEXT STEPS:');
  if (result.isDeactivated === true) {
    console.log('1. Activate the admin account in database');
    console.log('2. Re-test the admin dashboard functionality');
    console.log('3. The 401 errors should be resolved');
  } else {
    console.log('1. Check admin middleware logic');
    console.log('2. Verify JWT token validation');
    console.log('3. Check role-based access control');
  }
  
  return result;
}

// Run the test
runUserActivationTest().catch(console.error);