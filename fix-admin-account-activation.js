/**
 * Admin Account Activation Fix
 * 
 * This script adds a temporary admin activation route to the backend
 * to resolve the "user account deactivated" issue.
 */

const fs = require('fs');
const path = require('path');

const BACKEND_PATH = 'c:\\Users\\hp\\OneDrive\\Desktop\\nothing\\DashStream_Apk_backend';

function addActivationRoute() {
  const routeContent = `
// Temporary Admin Activation Route (FOR DEVELOPMENT ONLY)
router.post('/activate-admin', async (req, res) => {
  try {
    const { phone, activationKey } = req.body;
    
    // Simple security check - in production, use a stronger method
    if (activationKey !== process.env.ADMIN_ACTIVATION_KEY && activationKey !== 'DEV_ACTIVATE_2024') {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid activation key'
      });
    }
    
    // Find and activate the admin user
    const User = require('../models/User');
    const user = await User.findOneAndUpdate(
      { 
        phone: phone.replace(/^\\+91/, '').replace(/^91/, ''),
        role: 'admin'
      },
      { 
        status: 'active',
        isPhoneVerified: true
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin user not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Admin account activated successfully',
      data: {
        userId: user._id,
        name: user.name,
        phone: user.phone,
        status: user.status,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Admin activation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to activate admin account'
    });
  }
});

`;

  // Add route to auth routes
  const authRoutesPath = path.join(BACKEND_PATH, 'src', 'routes', 'authRoutes.js');
  
  try {
    let content = fs.readFileSync(authRoutesPath, 'utf8');
    
    // Check if route already exists
    if (content.includes('activate-admin')) {
      console.log('✅ Admin activation route already exists');
      return true;
    }
    
    // Find the export statement and add route before it
    const exportIndex = content.lastIndexOf('export default router');
    if (exportIndex === -1) {
      console.log('❌ Could not find export statement in authRoutes.js');
      return false;
    }
    
    // Insert the new route
    const beforeExport = content.substring(0, exportIndex);
    const afterExport = content.substring(exportIndex);
    const newContent = beforeExport + routeContent + '\n' + afterExport;
    
    fs.writeFileSync(authRoutesPath, newContent);
    console.log('✅ Added admin activation route to authRoutes.js');
    return true;
    
  } catch (error) {
    console.log('❌ Error adding activation route:', error.message);
    return false;
  }
}

function addActivationTest() {
  const testContent = `/**
 * Test Admin Account Activation
 */

const axios = require('axios');

const API_URL = 'https://dash-stream-apk-backend.vercel.app/api';

async function activateAdminAccount() {
  try {
    console.log('🔧 Activating admin account...');
    
    const response = await axios.post(\`\${API_URL}/auth/activate-admin\`, {
      phone: '9341526497',
      activationKey: 'DEV_ACTIVATE_2024'
    });
    
    if (response.data.status === 'success') {
      console.log('✅ Admin account activated successfully!');
      console.log(\`   User ID: \${response.data.data.userId}\`);
      console.log(\`   Name: \${response.data.data.name}\`);
      console.log(\`   Phone: \${response.data.data.phone}\`);
      console.log(\`   Status: \${response.data.data.status}\`);
      console.log(\`   Role: \${response.data.data.role}\`);
      return true;
    } else {
      console.log('❌ Failed to activate admin account:', response.data);
      return false;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('❌ Admin user not found - may need to create admin account first');
    } else if (error.response?.status === 403) {
      console.log('❌ Invalid activation key');
    } else {
      console.log('❌ Error activating admin account:', error.response?.data || error.message);
    }
    return false;
  }
}

activateAdminAccount().catch(console.error);
`;

  const testPath = path.join(__dirname, 'test-activate-admin.js');
  fs.writeFileSync(testPath, testContent);
  console.log('✅ Created admin activation test script');
  return testPath;
}

function addEnvironmentVariable() {
  const envPath = path.join(BACKEND_PATH, '.env');
  const envProdPath = path.join(BACKEND_PATH, '.env.production');
  
  const envLine = '\\nADMIN_ACTIVATION_KEY=DEV_ACTIVATE_2024\\n';
  
  try {
    // Add to .env
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (!envContent.includes('ADMIN_ACTIVATION_KEY')) {
        fs.appendFileSync(envPath, envLine);
        console.log('✅ Added ADMIN_ACTIVATION_KEY to .env');
      } else {
        console.log('✅ ADMIN_ACTIVATION_KEY already exists in .env');
      }
    }
    
    // Add to .env.production
    if (fs.existsSync(envProdPath)) {
      const envProdContent = fs.readFileSync(envProdPath, 'utf8');
      if (!envProdContent.includes('ADMIN_ACTIVATION_KEY')) {
        fs.appendFileSync(envProdPath, envLine);
        console.log('✅ Added ADMIN_ACTIVATION_KEY to .env.production');
      } else {
        console.log('✅ ADMIN_ACTIVATION_KEY already exists in .env.production');
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ Error adding environment variable:', error.message);
    return false;
  }
}

async function runActivationFix() {
  console.log('🚀 Applying Admin Account Activation Fix');
  console.log('='.repeat(50));
  
  const routeAdded = addActivationRoute();
  const envAdded = addEnvironmentVariable();
  const testPath = addActivationTest();
  
  console.log('\\n='.repeat(50));
  console.log('📊 FIX RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  if (routeAdded) {
    console.log('✅ Admin activation route added to backend');
  } else {
    console.log('❌ Failed to add admin activation route');
  }
  
  if (envAdded) {
    console.log('✅ Environment variable added');
  } else {
    console.log('❌ Failed to add environment variable');
  }
  
  console.log(\`✅ Test script created: \${testPath}\`);
  
  console.log('\\n🔧 NEXT STEPS:');
  console.log('1. Deploy/restart the backend server');
  console.log('2. Run the activation test script');
  console.log('3. Test admin dashboard access');
  
  console.log('\\n⚠️  SECURITY NOTE:');
  console.log('This is a temporary development fix. In production:');
  console.log('- Remove the activation route');
  console.log('- Use proper admin management tools');
  console.log('- Implement secure account activation flows');
  
  return routeAdded && envAdded;
}

// Run the fix
runActivationFix().catch(console.error);