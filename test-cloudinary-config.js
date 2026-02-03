// Quick test to verify Cloudinary credentials are working
require('dotenv').config();

console.log('=== Quick Cloudinary Config Test ===\n');

// Check if .env file exists and is being loaded
const fs = require('fs');
const envPath = '.env';

if (fs.existsSync(envPath)) {
  console.log('✓ .env file exists');
  
  // Read and display (without showing secrets)
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasCloudinaryVars = 
    envContent.includes('CLOUDINARY_CLOUD_NAME') &&
    envContent.includes('CLOUDINARY_API_KEY') &&
    envContent.includes('CLOUDINARY_API_SECRET');
  
  console.log('Cloudinary vars in .env:', hasCloudinaryVars ? '✓ Present' : '✗ Missing');
} else {
  console.log('✗ .env file not found');
}

console.log('\nEnvironment Variables (status only):');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUDINARY_CLOUD_NAME ? '✓ Loaded' : '✗ Not loaded');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Loaded' : '✗ Not loaded');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Loaded' : '✗ Not loaded');

// Test Cloudinary import
try {
  const { v2: cloudinary } = require('cloudinary');
  console.log('\n✓ Cloudinary package imported successfully');
  
  // Test configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  console.log('Configuration status:', cloudinary.config().cloud_name ? '✓ Configured' : '✗ Not configured');
  
} catch (error) {
  console.log('\n✗ Error with Cloudinary:', error.message);
}

console.log('\n=== Test Complete ===');
