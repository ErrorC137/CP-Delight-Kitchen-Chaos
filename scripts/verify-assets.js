const fs = require('fs');
const path = require('path');

const requiredAssets = [
  'config/level1.json',
  'sprites/kitchen/counter.png',
  'sprites/kitchen/ingredient_chicken.png',
  'audio/sfx/bell.mp3'
];

console.log('=== Verifying Assets ===');

let allAssetsExist = true;
const assetsBase = path.join(__dirname, '../src/assets');

requiredAssets.forEach(asset => {
  const fullPath = path.join(assetsBase, asset);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing asset: ${asset}`);
    allAssetsExist = false;
  } else {
    console.log(`✓ Found: ${asset}`);
  }
});

if (!allAssetsExist) {
  console.error('❌ Some assets are missing!');
  process.exit(1);
}

console.log('✓ All required assets verified');
