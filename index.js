require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandleMiddleWare");
const path = require("path");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log("Server started on port " + PORT));
  } catch (err) {
    console.log(err);
  }
};

start();
