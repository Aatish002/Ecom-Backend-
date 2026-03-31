import { cloudinary } from "../src/configs/cloudinary.configs.js";

export const uploadToCloudinary = (fileBuffer, folder = "profilePic") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder,
        quality: "auto",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    uploadStream.on("error", (streamError) => {
      reject(new Error(`upload stream failed: ${streamError.message}`));
    });
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`error deleting image ${error.message}`);
  }
};
