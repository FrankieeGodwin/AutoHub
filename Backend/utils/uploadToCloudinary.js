import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "AutoHubCars" }, (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url); // return only the link
      })
      .end(fileBuffer);
  });
};
