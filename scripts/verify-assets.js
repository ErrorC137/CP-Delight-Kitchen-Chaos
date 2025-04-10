const fs = require('fs');
const path = require('path');

const requiredAssets = [
  'config/level1.json',
  'sprites/kitchen/counter.png',
  'sprites/kitchen/ingredient_chicken.png'
];

console.log('=== Verifying Assets ===');

let missingAssets = false;
const assetsBase = path.join(__dirname, '../src/assets');

// Check if assets directory exists
if (!fs.existsSync(assetsBase)) {
  console.error('❌ src/assets directory is missing!');
  console.info('💡 Run: npm run setup-assets to create it');
  process.exit(1);
}

// Check required files
requiredAssets.forEach(asset => {
  const fullPath = path.join(assetsBase, asset);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing: ${asset}`);
    missingAssets = true;
  } else if (fs.statSync(fullPath).size === 0) {
    console.error(`❌ Empty file: ${asset}`);
    missingAssets = true;
  }
});

if (missingAssets) {
  console.error('❌ Some assets are missing or empty!');
  console.info('💡 Run: npm run setup-assets to create placeholder files');
  process.exit(1);
}

console.log('✓ All assets verified');
