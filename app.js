const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const commentsRouter = require("./routes/comments.js");
const postsRouter = require("./routes/posts.js");
const connect = require("./schemas");
connect();

app.use(express.json());
app.use("/comments", commentsRouter);
app.use("/posts", postsRouter);

// 서버 실행
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
