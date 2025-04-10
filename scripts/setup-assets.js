const fs = require('fs');
const path = require('path');

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

function createFile(filePath, content = '') {
  const dir = path.dirname(filePath);
  createDirectory(dir);
  
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${filePath}`);
  }
}

// Main setup
try {
  console.log('Setting up asset structure...');
  
  // Create required directories
  const baseDir = 'src/assets';
  createDirectory(baseDir);
  
  // Create files
  createFile(
    path.join(baseDir, 'config/level1.json'),
    JSON.stringify({
      width: 800,
      height: 600,
      tileSize: 64,
      playerStart: {x: 100, y: 100}
    }, null, 2)
  );
  
  createFile(path.join(baseDir, 'sprites/kitchen/counter.png'));
  createFile(path.join(baseDir, 'sprites/kitchen/ingredient_chicken.png'));
  createFile(path.join(baseDir, 'audio/sfx/bell.mp3'));
  createFile(path.join(baseDir, 'audio/sfx/sizzle.mp3'));
  
  console.log('✓ Asset structure ready');
} catch (error) {
  console.error('❌ Error setting up assets:', error.message);
  process.exit(1);
}
