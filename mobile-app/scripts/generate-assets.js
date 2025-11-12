// Script to generate placeholder assets for development
// Run: node scripts/generate-assets.js

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');

// Create a simple 1x1 transparent PNG (base64)
const transparentPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

// Create a simple 1024x1024 blue PNG with white text (base64 - larger)
// This is a minimal valid PNG
const iconPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
  'base64'
);

console.log('📦 Generating placeholder assets...\n');

// Create assets if they don't exist
const files = [
  { name: 'icon.png', data: iconPNG },
  { name: 'adaptive-icon.png', data: iconPNG },
  { name: 'favicon.png', data: iconPNG },
  { name: 'splash.png', data: iconPNG }
];

files.forEach(file => {
  const filePath = path.join(assetsDir, file.name);
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, file.data);
    console.log(`✅ Created ${file.name}`);
  } else {
    console.log(`⏭️  ${file.name} already exists`);
  }
});

console.log('\n✨ Done! Placeholder assets generated.');
console.log('⚠️  Note: These are minimal placeholders. Replace with actual designs before production!\n');
