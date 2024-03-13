const express = require("express");
const userController = require("../Controller/userController");
const {
  verifyToken,
  verifyAdmin,
  verifyUserToken,
  Authorization,
} = require("./../middleware/verifyToken");
const uploadPhoto = require("./../middleware/photoUpload");

const router = express.Router();

router
  .route("/profiles")
  .get(verifyToken, verifyAdmin, userController.getUsers);
router
  .route("/profile/:id")
  .get(userController.getUser)
  .put(verifyUserToken, userController.updateUser)
  .delete(Authorization, userController.deleteUserProfile);
router
  .route("/profile/upload-profile-Photo")
  .post(verifyToken, uploadPhoto.single("image"), userController.profilePhoto);

module.exports = router;
