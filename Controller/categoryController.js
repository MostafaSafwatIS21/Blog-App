const { Category, validateCreateCategory } = require("../models/categoryModel");
const catchHandler = require("../uitils/catchHandler");

/**
 * @descrie create  category
 * @route /api/category
 * @method post
 * @access private only admin
 */
module.exports.createCategory = catchHandler(async (req, res, next) => {
  const { error } = validateCreateCategory(req.body);
  if (error) {
    return res.status(400).json({
      message: error,
    });
  }
  const category = await Category.create({
    title: req.body.title,
    user: req.user,
  });
  res.status(200).json({
    category,
  });
});

/**
 * @descrie GET All categorys
 * @route /api/category
 * @method get
 * @access public
 */
module.exports.getAllCategorys = catchHandler(async (req, res, next) => {
  const categorys = await Category.find();
  res.status(200).json({
    categorys,
  });
});

/**
 * @descrie Delete  category
 * @route /api/category
 * @method delete
 * @access only admin
 */
module.exports.deleteCategory = catchHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    Mesaage: "Category Deleted",
    categoryId: category._id,
  });
});
