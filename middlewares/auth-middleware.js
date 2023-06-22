const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;

  // authorization 쿠키가 존재하지 않았을 때를 대비
  if (!Authorization) {
    res.status(400).json({
      errorMessage: "로그인 후에 이용할 수 있는 기능입니다.",
    });
    return;
  }

  // authToken 검증
  const authToken = Authorization.split(" ")[1];
  if (!authToken) {
    res.status(400).json({
      errorMessage: "로그인 후에 이용할 수 있는 기능입니다.",
    });
    return;
  }

  try {
    // jwt 검증
    const { userId } = jwt.verify(authToken, "customize-secret-key");

    // authToken에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        errorMessage: "로그인 후에 이용할 수 있는 기능입니다.",
      });
      return;
    }

    res.locals.user = user;

    next(); // 이 미들웨어 다음으로 보낸다.
  } catch (error) {
    console.error(error);
    res.status(400).json({
      errorMessage: "로그인 후에 이용할 수 있는 기능입니다.",
    });
    return;
  }
};
