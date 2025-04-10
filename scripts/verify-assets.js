const fs = require('fs');
const path = require('path');

const requiredAssets = [
  { path: 'config/level1.json', minSize: 20 }, // At least 20 bytes
  { path: 'sprites/kitchen/counter.png', minSize: 100 }, // At least 100 bytes
  { path: 'sprites/kitchen/ingredient_chicken.png', minSize: 100 },
  { path: 'audio/sfx/bell.mp3', minSize: 1000 } // At least 1KB
];

console.log('=== Verifying Assets ===');

let allAssetsValid = true;
const assetsBase = path.join(__dirname, '../src/assets');

requiredAssets.forEach(({path: assetPath, minSize}) => {
  const fullPath = path.join(assetsBase, assetPath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing asset: ${assetPath}`);
    allAssetsValid = false;
    return;
  }

  const stats = fs.statSync(fullPath);
  if (stats.size < minSize) {
    console.error(`❌ Asset too small (${stats.size} bytes): ${assetPath}`);
    console.error(`   Expected at least ${minSize} bytes`);
    allAssetsValid = false;
  } else {
    console.log(`✓ Valid: ${assetPath} (${stats.size} bytes)`);
  }
});

if (!allAssetsValid) {
  console.error('❌ Some assets are invalid or missing!');
  process.exit(1);
}

console.log('✓ All assets verified');
