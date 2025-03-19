import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Upload an image to Cloudinary with a category-based folder.
 * @param {string} filePath - The local file path of the image.
 * @param {string} category - The category name to store the image under.
 * @returns {Promise<string>} - The uploaded image URL.
 */
export const uploadImage = async (filePath, category = "uncategorized") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `uploads/${category}`,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
