const express = require("express");
const categoryController = require("../Controller/categoryController");
const { verifyToken, verifyAdmin } = require("./../middleware/verifyToken");

const router = express.Router();

router
  .route("/")
  .post(verifyToken, verifyAdmin, categoryController.createCategory)
  .get(categoryController.getAllCategorys)
  .delete(verifyToken, verifyAdmin, categoryController.deleteCategory);

router
  .route("/:id")
  .delete(verifyToken, verifyAdmin, categoryController.deleteCategory);

module.exports = router;
