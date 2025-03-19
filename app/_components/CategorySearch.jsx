"use client";
import React, { useState } from "react";
import Image from "next/image";

const CategorySearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!image) return alert("⚠ Please select an image to upload!");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "your_upload_preset");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();
      alert("✅ Image Uploaded Successfully!\nURL: " + data.secure_url);
      setPreview(null);
      setImage(null);
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      alert("Upload failed. Please try again!");
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    // Release object URL to prevent memory leaks
    if (preview) URL.revokeObjectURL(preview);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6 p-4 border rounded-lg shadow-md">
      {/* Search Input */}
      <div className="w-full">
        <input 
          type="text" 
          placeholder="Search categories..." 
          value={searchTerm} 
          onChange={handleSearchChange} 
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* File Upload */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label className="flex-1">
            <div className="bg-blue-500 text-white p-2 rounded-md text-center cursor-pointer hover:bg-blue-600 transition-colors">
              {image ? "Change Image" : "Select Image"}
            </div>
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </label>
          
          {image && (
            <button
              onClick={clearImage}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Clear
            </button>
          )}
          
          {image && (
            <button
              onClick={uploadImageToCloudinary}
              disabled={uploading}
              className={`bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          )}
        </div>
        
        {/* Image Preview */}
        {preview && (
          <div className="flex flex-col items-center justify-center mt-2">
            <Image 
              src={preview} 
              alt="Preview" 
              width={100} 
              height={100} 
              className="rounded-md object-cover"
            />
            <span className="text-sm text-gray-500 mt-1">
              {image?.name || "Selected image"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySearch;