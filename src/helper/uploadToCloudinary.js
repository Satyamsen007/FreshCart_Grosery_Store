// utils/uploadToCloudinary.ts

export const uploadToCloudinary = async (file, folder) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "FreshCartOnlineGroseryStorePresets"); // replace with your preset
    formData.append("cloud_name", "dw0kaofhj"); // replace with your cloud name
    formData.append("folder", folder);

    const res = await fetch("https://api.cloudinary.com/v1_1/dw0kaofhj/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error("Upload failed:", data);
      return null;
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};
