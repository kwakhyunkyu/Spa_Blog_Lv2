const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/spa_blog")
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error", err);
    });
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error", err);
});

module.exports = connect;
