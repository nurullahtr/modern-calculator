const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToIco() {
  const sizes = [16, 32, 48, 64, 256];
  const pngBuffers = [];

  for (const size of sizes) {
    const buffer = await sharp('build/icon.svg')
      .resize(size, size)
      .png()
      .toBuffer();
    pngBuffers.push(buffer);
  }

  // Create ICO file
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(pngBuffers.length, 4); // Number of images

  let offset = 6 + (pngBuffers.length * 16); // Header size + (number of images * ICONDIRENTRY size)
  const entries = [];
  const images = [];

  for (let i = 0; i < pngBuffers.length; i++) {
    const size = sizes[i];
    const buffer = pngBuffers[i];
    const entry = Buffer.alloc(16);
    
    entry.writeUInt8(size === 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size === 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Image size
    entry.writeUInt32LE(offset, 12); // Image offset

    offset += buffer.length;
    entries.push(entry);
    images.push(buffer);
  }

  const ico = Buffer.concat([header, ...entries, ...images]);
  fs.writeFileSync('build/icon.ico', ico);
  console.log('Icon created successfully!');
}

convertToIco().catch(console.error); 