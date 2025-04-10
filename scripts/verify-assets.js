const fs = require('fs');
const path = require('path');

const assetsStructure = {
  'config/level1.json': JSON.stringify({
    width: 800,
    height: 600,
    tileSize: 64,
    playerStart: {x: 100, y: 100}
  }, null, 2),
  'sprites/kitchen/counter.png': '',
  'sprites/kitchen/ingredient_chicken.png': '',
  'audio/sfx/bell.mp3': '',
  'audio/sfx/sizzle.mp3': ''
};

console.log('Setting up asset structure...');

try {
  // Create all directories first
  Object.keys(assetsStructure).forEach(filePath => {
    const dir = path.dirname(`src/assets/${filePath}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Create all files
  Object.entries(assetsStructure).forEach(([filePath, content]) => {
    const fullPath = `src/assets/${filePath}`;
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, content);
      console.log(`Created: ${fullPath}`);
    } else {
      console.log(`Exists: ${fullPath}`);
    }
  });

  console.log('✓ Asset structure ready');
} catch (error) {
  console.error('❌ Error setting up assets:', error.message);
  process.exit(1);
}
