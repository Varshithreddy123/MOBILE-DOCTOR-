import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar'; // For real-time file watching

dotenv.config(); // Load environment variables

// Validate Cloudinary credentials
const requiredEnvVars = ['CLOUDINARY_NAME', 'CLOUDINARY_KEY', 'CLOUDINARY_SECRET'];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Folder to monitor
const folderPath = path.resolve('public'); // Watches 'public/' folder
const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
const cloudinaryFolder = 'v1741007986/'; // Cloudinary path
const deleteAfterUpload = true; // Set to true to delete files after upload

// Function to upload an image
async function uploadImage(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: cloudinaryFolder, // Target Cloudinary folder
      resource_type: 'auto',
      access_mode: 'public',
    });

    console.log(`✅ Uploaded: ${path.basename(filePath)} → ${result.secure_url}`);

    // Delete file after upload (optional)
    if (deleteAfterUpload) {
      await fs.unlink(filePath);
      console.log(`🗑 Deleted: ${filePath}`);
    }

    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload ${path.basename(filePath)}:`, error.message);
    return null;
  }
}

// Watch the folder for new images
console.log(`👀 Watching for new images in "${folderPath}"...`);

chokidar
  .watch(folderPath, { persistent: true, ignoreInitial: true }) // Ignore existing files
  .on('add', async (filePath) => {
    if (allowedExtensions.test(filePath)) {
      console.log(`📂 New image detected: ${filePath}`);
      await uploadImage(filePath);
    }
  })
  .on('error', (error) => console.error(`❌ Watcher error: ${error.message}`));
