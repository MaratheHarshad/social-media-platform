require("dotenv").config();
const jwt = require("jsonwebtoken");

const createToken = async (user) => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

  //   default algorithm is (HMAC SHA256)

  const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY);

  return token;
};

module.exports = { createToken };
