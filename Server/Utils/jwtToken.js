import jwt from "jsonwebtoken";
import Errorhandler from "./errorHandle.js";
import userModal from "../Modals/usermodal.js";

export const sendJwtToken = async (res, next, user) => {
  const jwt = await user.generateJwtToken();

  if (user.password) user.password = undefined;

  res.status(200).json({
    success: true,
    user,
    jwtToken: jwt,
  });
};

// verify jwt token
export const verifyJwtToken = async (req, res, next) => {
  // getting the token from auth header
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new Errorhandler("No jwt token found", 404));

  const token = authHeader.split(" ")[1];
  // if there is no token
  if (!token) return next(new Errorhandler("No jwt token found", 404));

  // verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, res) => {
    if (err) return next(new Errorhandler("Invalid Jwt Token", 403));

    // getting user from the req token and sendting it to the next middleware
    const user = await userModal.findById(res.id);
    if (!user) return next(new Errorhandler("User not found", 404));

    req.user = user;
    next();
  });
};
