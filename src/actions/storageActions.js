// src/actions/storageActions.js
"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteMediaAction(publicId, fileType) {
  if (!publicId) return { success: false, error: "No public ID provided" };

  try {
    // Standardize the resource_type
    const resourceType = fileType === "raw" ? "raw" : "image";

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return { success: result.result === "ok" };
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
    return { success: false, error: error.message };
  }
}
