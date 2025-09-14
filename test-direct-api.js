/**
 * Direct API test to check if auth endpoints are working
 */
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testSyncUser() {
  try {
    console.log('🧪 Testing /api/auth/sync-user endpoint...');
    
    const response = await axios.post(`${API_URL}/auth/sync-user`, {
      phone: '+919341526497'
    });
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Response:`, response.data);
    
    return response.status === 200;
  } catch (error) {
    console.error('❌ API Test Error:', error.response?.data || error.message);
    console.log(`📊 Status: ${error.response?.status || 'Network Error'}`);
    return false;
  }
}

async function testFirebaseVerification() {
  try {
    console.log('🧪 Testing /api/auth/firebase/send-verification endpoint...');
    
    const response = await axios.post(`${API_URL}/auth/firebase/send-verification`, {
      phone: '+919341526497'
    });
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📋 Response:`, response.data);
    
    return response.status === 200;
  } catch (error) {
    console.error('❌ API Test Error:', error.response?.data || error.message);
    console.log(`📊 Status: ${error.response?.status || 'Network Error'}`);
    return false;
  }
}

async function main() {
  console.log('🔧 Direct API Endpoint Test\n');
  
  const results = {
    syncUser: await testSyncUser(),
    firebaseVerification: await testFirebaseVerification()
  };
  
  console.log('\n📊 Results:');
  console.log(`✅ Sync User: ${results.syncUser ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Firebase Verification: ${results.firebaseVerification ? 'PASS' : 'FAIL'}`);
}

main().catch(console.error);