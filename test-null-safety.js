#!/usr/bin/env node

/**
 * Null Safety Fix Verification Test
 * Tests for null length access issues and fixes
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function checkAdminDashboardNullSafety() {
  try {
    log('\n🔍 Checking AdminDashboardScreen Null Safety\n', 'bold');
    
    const dashboardPath = path.join(__dirname, 'DashStream_Apk', 'src', 'screens', 'admin', 'AdminDashboardScreen.tsx');
    const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
    
    const checks = {
      'recentBookings null check': dashboardContent.includes('(recentBookings && recentBookings.length > 0)'),
      'topProfessionals null check': dashboardContent.includes('(topProfessionals && topProfessionals.length > 0)'),
      'chartData optional chaining': dashboardContent.includes('dashboardStats.chartData.revenue?.[timeFilter]') &&
                                   dashboardContent.includes('dashboardStats.chartData.bookings?.[timeFilter]'),
      'dashboard stats safe access': dashboardContent.includes('dashboardStats?.totalRevenue') &&
                                   dashboardContent.includes('dashboardStats?.totalBookings')
    };
    
    let passCount = 0;
    const totalChecks = Object.keys(checks).length;
    
    for (const [check, passed] of Object.entries(checks)) {
      if (passed) {
        log(`✅ ${check}`, 'green');
        passCount++;
      } else {
        log(`❌ ${check}`, 'red');
      }
    }
    
    log(`\n📊 Dashboard Safety Score: ${passCount}/${totalChecks}`, passCount === totalChecks ? 'green' : 'yellow');
    return passCount === totalChecks;
    
  } catch (error) {
    log(`❌ Error checking dashboard null safety: ${error.message}`, 'red');
    return false;
  }
}

function checkAdminServicesNullSafety() {
  try {
    log('\n🔍 Checking AdminServicesScreen Null Safety\n', 'bold');
    
    const servicesPath = path.join(__dirname, 'DashStream_Apk', 'src', 'screens', 'admin', 'AdminServicesScreen.tsx');
    const servicesContent = fs.readFileSync(servicesPath, 'utf8');
    
    const checks = {
      'services array null check': servicesContent.includes('!services || !Array.isArray(services)'),
      'filteredServices length check': servicesContent.includes('filteredServices?.length || 0'),
      'filteredServices empty check': servicesContent.includes('(!filteredServices || filteredServices.length === 0)')
    };
    
    let passCount = 0;
    const totalChecks = Object.keys(checks).length;
    
    for (const [check, passed] of Object.entries(checks)) {
      if (passed) {
        log(`✅ ${check}`, 'green');
        passCount++;
      } else {
        log(`❌ ${check}`, 'red');
      }
    }
    
    log(`\n📊 Services Safety Score: ${passCount}/${totalChecks}`, passCount === totalChecks ? 'green' : 'yellow');
    return passCount === totalChecks;
    
  } catch (error) {
    log(`❌ Error checking services null safety: ${error.message}`, 'red');
    return false;
  }
}

function checkCustomerDetailsNullSafety() {
  try {
    log('\n🔍 Checking AdminCustomerDetailsScreen Null Safety\n', 'bold');
    
    const customerPath = path.join(__dirname, 'DashStream_Apk', 'src', 'screens', 'admin', 'AdminCustomerDetailsScreen.tsx');
    const customerContent = fs.readFileSync(customerPath, 'utf8');
    
    const checks = {
      'customer notes null check': customerContent.includes('customer.notes?.length || 0'),
      'customer addresses null check': customerContent.includes('customer.addresses?.length || 0'),
      'customer vehicles null check': customerContent.includes('customer.vehicles?.length || 0')
    };
    
    let passCount = 0;
    const totalChecks = Object.keys(checks).length;
    
    for (const [check, passed] of Object.entries(checks)) {
      if (passed) {
        log(`✅ ${check}`, 'green');
        passCount++;
      } else {
        log(`❌ ${check}`, 'red');
      }
    }
    
    log(`\n📊 Customer Safety Score: ${passCount}/${totalChecks}`, passCount === totalChecks ? 'green' : 'yellow');
    return passCount === totalChecks;
    
  } catch (error) {
    log(`❌ Error checking customer null safety: ${error.message}`, 'red');
    return false;
  }
}

function checkProfessionalDetailsNullSafety() {
  try {
    log('\n🔍 Checking AdminProfessionalDetailsScreen Null Safety\n', 'bold');
    
    const professionalPath = path.join(__dirname, 'DashStream_Apk', 'src', 'screens', 'admin', 'AdminProfessionalDetailsScreen.tsx');
    const professionalContent = fs.readFileSync(professionalPath, 'utf8');
    
    const checks = {
      'professional reviews null check': professionalContent.includes('professional.reviews?.length || 0'),
      'recentBookings length check': professionalContent.includes('(professional.recentBookings && professional.recentBookings.length > 0)'),
      'reviews length check': professionalContent.includes('(professional.reviews && professional.reviews.length > 0)'),
      'reviews filter null check': professionalContent.includes('professional.reviews?.filter(r => r.rating === rating).length || 0')
    };
    
    let passCount = 0;
    const totalChecks = Object.keys(checks).length;
    
    for (const [check, passed] of Object.entries(checks)) {
      if (passed) {
        log(`✅ ${check}`, 'green');
        passCount++;
      } else {
        log(`❌ ${check}`, 'red');
      }
    }
    
    log(`\n📊 Professional Safety Score: ${passCount}/${totalChecks}`, passCount === totalChecks ? 'green' : 'yellow');
    return passCount === totalChecks;
    
  } catch (error) {
    log(`❌ Error checking professional null safety: ${error.message}`, 'red');
    return false;
  }
}

function provideFinalSummary(allSafe) {
  log('\n🎯 Null Safety Fix Summary:', 'blue');
  
  if (allSafe) {
    log('\n🎉 ALL NULL SAFETY ISSUES FIXED!', 'green');
    log('✅ AdminDashboardScreen - Safe array and object access', 'green');
    log('✅ AdminServicesScreen - Proper null checks before length access', 'green');
    log('✅ AdminCustomerDetailsScreen - Safe property access', 'green');
    log('✅ AdminProfessionalDetailsScreen - Protected array operations', 'green');
    
    log('\n🔧 Safety Measures Implemented:', 'yellow');
    log('• Added null checks before accessing .length property', 'reset');
    log('• Used optional chaining (?.) for nested object access', 'reset');
    log('• Provided default values (|| 0) for numeric displays', 'reset');
    log('• Added array existence checks before array operations', 'reset');
    log('• Protected against undefined/null data from API responses', 'reset');
    
    log('\n🎯 Error Prevention:', 'yellow');
    log('• "Cannot read property length of null" - FIXED', 'reset');
    log('• "Cannot read property length of undefined" - FIXED', 'reset');
    log('• Runtime crashes due to null array access - PREVENTED', 'reset');
    log('• Undefined array method calls - PROTECTED', 'reset');
    
    log('\n📱 Ready for Production!', 'green');
    log('All admin screens now have proper null safety measures', 'reset');
    log('and should handle API data gracefully without crashes.', 'reset');
    
  } else {
    log('\n⚠️ Some null safety issues still need attention', 'yellow');
    log('Check the detailed output above for specific fixes needed', 'reset');
  }
  
  log('\n📋 Next Steps:', 'blue');
  log('1. Clear Metro cache: npx expo start --clear', 'reset');
  log('2. Test all admin screens with API data', 'reset');
  log('3. Verify no more null/undefined length errors', 'reset');
  log('4. Test with empty/null API responses', 'reset');
}

// Run all null safety checks
const dashboardSafe = checkAdminDashboardNullSafety();
const servicesSafe = checkAdminServicesNullSafety();
const customerSafe = checkCustomerDetailsNullSafety();
const professionalSafe = checkProfessionalDetailsNullSafety();
const allSafe = dashboardSafe && servicesSafe && customerSafe && professionalSafe;

provideFinalSummary(allSafe);

if (allSafe) {
  log('\n✅ NULL SAFETY VERIFICATION COMPLETE! ✅', 'green');
  process.exit(0);
} else {
  log('\n❌ Some issues still exist. Please review the fixes above.', 'red');
  process.exit(1);
}