const { default: mongoose } = require("mongoose");
const mogoose = require("mongoose");
const url =
  "mongodb://127.0.0.1:27017/Mostafa?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.5";

module.exports = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URL);
    console.log("Connect To MongoDB");
  } catch (err) {
    console.log("Error to connections", err);
  }
};
