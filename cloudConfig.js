const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

// configure the v2 API
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// multer-storage-cloudinary expects the module that exposes `.v2`
const storage = cloudinaryStorage({
  cloudinary,
  folder: 'DestHub',
  allowedFormats: ['jpeg', 'png', 'jpg']
});

module.exports = {
  cloudinary: cloudinary.v2,
  storage
};
