require("dotenv").config();
const express = require("express");

const middleware = require("./utils/middleware");
const { connectToDatabase } = require("./utils/db");
const blogController = require("./controllers/blogs");
const { PORT } = require("./utils/config");

const app = express();

app.use(express.json());

app.use("/api/blogs", blogController);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log("Server running on port 3000");
  });
};

app.use(middleware.errorHandler);

start();
