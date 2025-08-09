const CLOUD_NAME = "deyakp4hp"; // from Cloudinary dashboard
const UPLOAD_PRESET = "unsigned_preset";

export async function uploadImageToCloudinary(uri: string): Promise<string> {
  const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  // Prepare the image data for upload
  const photo = {
    uri,
    type: "image/jpeg",
    name: "upload.jpg",
  };

  const formData = new FormData();
  formData.append("file", photo as any); // cast to any to fix RN FormData typing issues
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(apiUrl, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    return data.secure_url; // the uploaded image URL
  } else {
    throw new Error(data.error?.message || "Cloudinary upload failed");
  }
}
