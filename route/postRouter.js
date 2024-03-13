const express = require("express");
const postController = require("../Controller/postController");
const { verifyToken, verifyUserToken } = require("./../middleware/verifyToken");

const router = express.Router();

router
  .route("/")
  .post(verifyToken, postController.createPosts) ////this
  .get(postController.getPosts);
router
  .route("/:id")
  .delete(verifyToken, postController.deletePost)
  .put(verifyToken, postController.updatePost)
  .get(verifyToken, postController.getPost);

router.route("/like/:id").put(verifyToken, postController.toggelLikes);
module.exports = router;
