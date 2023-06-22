const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const commentsRouter = require("./routes/comments.js");
const postsRouter = require("./routes/posts.js");
const usersRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");

const connect = require("./schemas");
connect();

app.use(express.json());
app.use(cookieParser());
app.use("/api", [postsRouter, commentsRouter, usersRouter, authRouter]);

// 서버 실행
app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
