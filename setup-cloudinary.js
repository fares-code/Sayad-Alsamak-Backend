const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Cloudinary Setup Script ===\n');

async function setupCloudinary() {
  // Check current .env content
  let envContent = '';
  if (fs.existsSync('.env')) {
    envContent = fs.readFileSync('.env', 'utf8');
    console.log('Current .env file found.');
  } else {
    console.log('Creating new .env file...');
    envContent = '';
  }

  console.log('\nPlease enter your Cloudinary credentials:');
  console.log('(You can get these from your Cloudinary dashboard)\n');

  const cloudName = await question('Cloudinary Cloud Name: ');
  const apiKey = await question('Cloudinary API Key: ');
  const apiSecret = await question('Cloudinary API Secret: ');

  // Add Cloudinary variables to .env
  const cloudinaryVars = `
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=${cloudName}
CLOUDINARY_API_KEY=${apiKey}
CLOUDINARY_API_SECRET=${apiSecret}
`;

  // Check if Cloudinary vars already exist
  if (envContent.includes('CLOUDINARY_CLOUD_NAME')) {
    console.log('\nCloudinary variables already exist in .env file.');
    const replace = await question('Replace existing variables? (y/n): ');
    
    if (replace.toLowerCase() === 'y') {
      // Remove existing Cloudinary vars
      envContent = envContent.replace(/# Cloudinary Configuration[\s\S]*?(?=\n#|\n$|$)/g, '').trim();
      envContent += cloudinaryVars;
      console.log('✓ Cloudinary variables replaced');
    } else {
      console.log('✗ Setup cancelled');
      rl.close();
      return;
    }
  } else {
    envContent += cloudinaryVars;
    console.log('✓ Cloudinary variables added');
  }

  // Write to .env file
  fs.writeFileSync('.env', envContent.trim() + '\n');
  
  console.log('\n✓ .env file updated successfully!');
  console.log('\nNow run: node debug-cloudinary.js');
  console.log('To test your Cloudinary configuration.');
  
  rl.close();
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

setupCloudinary().catch(console.error);
