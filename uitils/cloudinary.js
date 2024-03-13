const { config } = require("rxjs");

const cloudinary = require("cloudinary").v2;

require("dotenv").config();
cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

// upload image to cloudinary
const cloudinaryUploadImage = async (fileUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (err) {
    return err;
  }
};

// remove image from cloudinary
const cloudinaryRemoveImage = async (publicId) => {
  try {
    const removed = await cloudinary.uploader.destroy(publicId);
    return removed;
  } catch (err) {
    return err;
  }
};

const cloudinaryRemoveMultipleImage = async (publicIds) => {
  try {
    const removed = await cloudinary.V2.api.delete_resources(publicIds);
    return removed;
  } catch (err) {
    return err;
  }
};

module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
};
