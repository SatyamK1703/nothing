// Test authService import
console.log('Testing authService import...');

try {
  // Test TypeScript transpilation
  const path = require('path');
  const servicesPath = path.join(__dirname, 'DashStream_Apk', 'src', 'services');
  console.log('Services path:', servicesPath);
  
  // Try importing the services
  const authServiceModule = require(path.join(servicesPath, 'authService.ts'));
  console.log('authService module:', typeof authServiceModule);
  console.log('authService export:', typeof authServiceModule.authService);
  
  const indexModule = require(path.join(servicesPath, 'index.ts'));
  console.log('index module:', typeof indexModule);
  console.log('index authService:', typeof indexModule.authService);
  
} catch (error) {
  console.error('Import test failed:', error.message);
  console.error('Stack:', error.stack);
}