const cloudinaryService = require('./src/services/cloudinary.service');
require('dotenv').config();

// Debug script to test Cloudinary configuration and upload
async function debugCloudinary() {
  console.log('=== Cloudinary Debug Script ===\n');
  
  // 1. Check environment variables
  console.log('1. Environment Variables:');
  console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');
  console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
  console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');
  console.log('');
  
  // 2. Test Cloudinary configuration
  console.log('2. Testing Cloudinary Configuration:');
  try {
    const { v2: cloudinary } = require('cloudinary');
    console.log('Cloudinary config status:', cloudinary.config().cloud_name ? '✓ Configured' : '✗ Not configured');
    console.log('Cloud name:', cloudinary.config().cloud_name || 'Not set');
    console.log('');
  } catch (error) {
    console.log('✗ Error loading cloudinary:', error.message);
    console.log('');
  }
  
  // 3. Test with a sample base64 image
  console.log('3. Testing Upload with Sample Image:');
  try {
    // Small 1x1 pixel PNG in base64
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    console.log('Uploading test image...');
    const result = await cloudinaryService.uploadImageFromBase64(sampleBase64, 'debug-test', 'test-image');
    console.log('✓ Upload successful!');
    console.log('Image URL:', result);
    console.log('');
    
    // 4. Test deletion
    console.log('4. Testing Image Deletion:');
    await cloudinaryService.deleteImage(result);
    console.log('✓ Deletion successful');
    
  } catch (error) {
    console.log('✗ Upload failed:');
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('');
    
    // Additional debugging for common issues
    if (error.message.includes('undefined')) {
      console.log('Possible causes for "undefined" error:');
      console.log('- Missing or invalid Cloudinary credentials');
      console.log('- Network connectivity issues');
      console.log('- Invalid base64 image format');
      console.log('- Cloudinary service unavailable');
    }
  }
  
  console.log('\n=== Debug Complete ===');
}

// Run the debug script
debugCloudinary().catch(console.error);
