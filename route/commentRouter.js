const express = require("express");
const commentController = require("../Controller/commentController");
const {
  verifyToken,
  verifyAdmin,
  verifyUserToken,
} = require("./../middleware/verifyToken");

const router = express.Router();

router
  .route("/")
  .post(verifyToken, commentController.createComment)
  .get(verifyToken, verifyAdmin, commentController.getAllComment);
router
  .route("/:id")
  .delete(verifyToken, commentController.deleteComment)
  .put(verifyToken, commentController.updateComment);
// router.post("/update", authController.login);

module.exports = router;
