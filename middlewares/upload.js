const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

require('dotenv').config();

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'TaskPro-avatars',
  allowedFormats: ['jpg', 'png'],
  filename: (req, file, cb) => {
    const fileName = `avatar_${req.user.userId}`;
    cb(null, fileName);
  },
  transformation: [{ width: 68, height: 68, crop: 'scale' }],
});

const upload = multer({ storage });

module.exports = upload;
