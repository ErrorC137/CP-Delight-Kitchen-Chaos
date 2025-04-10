const fs = require('fs');
const path = require('path');

const requiredAssets = [
  'config/level1.json',
  'sprites/kitchen/counter.png',
  'sprites/kitchen/ingredient_chicken.png'
];

console.log('=== Verifying Assets ===');

// Check if assets directory exists
const assetsBase = path.join(__dirname, '../src/assets');
if (!fs.existsSync(assetsBase)) {
  console.error('❌ src/assets directory is missing!');
  console.info('💡 Run: npm run setup-assets');
  process.exit(1);
}

// Verify each required asset
let allAssetsValid = true;
requiredAssets.forEach(asset => {
  const fullPath = path.join(assetsBase, asset);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing: ${asset}`);
    allAssetsValid = false;
  } else if (fs.statSync(fullPath).size === 0) {
    console.error(`❌ Empty file: ${asset}`);
    allAssetsValid = false;
  } else {
    console.log(`✓ Found: ${asset}`);
  }
});

if (!allAssetsValid) {
  console.error('❌ Some assets are missing or empty!');
  console.info('💡 Run: npm run setup-assets');
  process.exit(1);
}

console.log('✓ All assets verified');
