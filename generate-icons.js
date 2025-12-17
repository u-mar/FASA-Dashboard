const fs = require('fs');
const path = require('path');

// Simple PNG generator using canvas (you'll need canvas package)
// For now, let's copy the existing 512x512 icon properly

const sourceIcon = path.join(__dirname, 'public', 'icon-512x512.png');
const maskableIcon = path.join(__dirname, 'public', 'icon512_maskable.png');
const roundedIcon = path.join(__dirname, 'public', 'icon512_rounded.png');

// Check if source exists
if (fs.existsSync(sourceIcon)) {
  // Copy to both new names
  fs.copyFileSync(sourceIcon, maskableIcon);
  fs.copyFileSync(sourceIcon, roundedIcon);
  console.log('Icons created successfully!');
} else {
  console.log('Source icon not found. Using placeholder...');
  
  // If source doesn't exist, try placeholder-logo
  const placeholder = path.join(__dirname, 'public', 'placeholder-logo.png');
  if (fs.existsSync(placeholder)) {
    fs.copyFileSync(placeholder, maskableIcon);
    fs.copyFileSync(placeholder, roundedIcon);
    console.log('Icons created from placeholder!');
  }
}
