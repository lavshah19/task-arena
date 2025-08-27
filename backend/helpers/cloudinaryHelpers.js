const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw", // Important for handling any file type
    });
    // console.log("File uploaded to Cloudinary:", result);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log("Error while uploading to Cloudinary:", error);
    throw new Error("Error while uploading to Cloudinary");
  }
};

module.exports = {
  uploadToCloudinary,
};
