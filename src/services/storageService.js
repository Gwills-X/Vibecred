/**
 * Uploads media to Cloudinary, forcing 'raw' resource type for all documents
 * to ensure they are downloadable as-is.
 */
export async function uploadMedia(file) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, // Ensure this points to your preset
  );

  // 1. Expand document detection to catch PDFs, Word, Excel, and Text files
  const isDocument =
    file.type === "application/pdf" ||
    file.type.includes("wordprocessingml") || // .docx
    file.type.includes("msword") || // .doc
    file.type.includes("spreadsheetml") || // .xlsx
    file.type.includes("ms-excel") || // .xls
    file.type.includes("text/") || // .txt, .csv, etc.
    file.type.includes("application/zip"); // .zip archives

  const resourceType = isDocument ? "raw" : "image";

  try {
    // 2. Use the correct resourceType in the URL
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error("Upload failed: No secure_url returned");
    }

    console.log(`File uploaded as ${resourceType}:`, data.secure_url);

    return {
      url: data.secure_url,
      publicId: data.public_id,
      fileType: resourceType, // Always 'raw' for docs, 'image' for images
      format: data.format,
    };
  } catch (error) {
    console.error("Upload process failed:", error);
    throw error;
  }
}
