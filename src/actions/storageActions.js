"use server";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your secret keys
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteFromCloudinary(publicId) {
  if (!publicId) return { success: false, error: "No Public ID provided" };

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
    return { success: true, result };
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
    return { success: false, error: error.message };
  }
}
