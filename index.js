require("dotenv").config();
const express = require("express");

const middleware = require("./util/middleware");
const { connectToDatabase } = require("./util/db");
const blogController = require("./controllers/blogsController");
const userController = require("./controllers/usersController");
const loginController = require("./controllers/loginController");
const readingListController = require("./controllers/readingListController");
const { PORT } = require("./util/config");

const app = express();

app.use(express.json());

app.use("/api/blogs", blogController);
app.use("/api/users", userController);
app.use("/api/login", loginController);
app.use("/api/readinglists", readingListController);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log("Server running on port 3000");
  });
};

app.use(middleware.errorHandler);

start();
