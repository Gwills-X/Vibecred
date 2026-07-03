export async function uploadMedia(file) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  );

  // 1. Determine the correct endpoint based on the file type
  // PDFs and docs must use 'raw', images use 'image'
  const isDocument =
    file.type === "application/pdf" ||
    file.type.includes("wordprocessingml") ||
    file.type.includes("msword");

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
      throw new Error("Upload failed");
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      fileType: resourceType, // This will now correctly be 'raw' or 'image'
      format: data.format,
    };
  } catch (error) {
    console.error("Upload process failed:", error);
    throw error;
  }
}
