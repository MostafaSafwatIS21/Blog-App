const path = require("path");
const multer = require("multer");

const photoStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function(req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

// upload photo

const uploadPhoto = multer({
  storage: photoStorage,
  fileFilter: function(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "Unsupported File Formate" }, false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 3 }, //3 megabite
});
module.exports = uploadPhoto;
