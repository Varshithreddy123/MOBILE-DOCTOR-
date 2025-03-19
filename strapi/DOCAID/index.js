import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

(async function () {
  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
      {
        public_id: 'shoes',
      }
    );

    console.log('✅ Upload Successful:', uploadResult.secure_url);

    // Optimize image delivery
    const optimizeUrl = cloudinary.url('shoes', {
      fetch_format: 'auto',
      quality: 'auto',
    });
    console.log('🔹 Optimized Image URL:', optimizeUrl);

    // Auto-crop transformation
    const autoCropUrl = cloudinary.url('shoes', {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });
    console.log('🔹 Auto-Cropped Image URL:', autoCropUrl);
  } catch (error) {
    console.error('❌ Upload Failed:', error);
  }
})();
