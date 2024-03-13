const express = require("express");
const connectToDB = require("./configDB/connectDB");
const authRoute = require("./route/authRouter.js");
const userRoute = require("./route/userRouter.js");
const postRoute = require("./route/postRouter.js");
const categoryRouter = require("./route/categoryRouter.js");
const commentRoute = require("./route/commentRouter.js");
const {
  globalErrorHandler,
  notFound,
} = require("./middleware/globalErrorHandler.js");

require("dotenv").config();

//connection to database
connectToDB();

const app = express();

//meddileware to handel json files
app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);
app.use("/api/category", categoryRouter);

/**@Error Controller */
app.use(notFound);
app.use(globalErrorHandler);
//Running server

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Connect S erver Successfully");
});
