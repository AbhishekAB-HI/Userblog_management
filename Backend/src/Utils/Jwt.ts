import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userPayload } from "../Types/Usertoc";

dotenv.config()

const accessTokenSecret = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_PRIVATE_KEY as string;

export const generateAccessToken = (user: userPayload) => {
  return jwt.sign(user, accessTokenSecret, { expiresIn: "12h" });
};

export const generateRefreshToken = (user: userPayload) => {
  return jwt.sign(user, refreshTokenSecret, { expiresIn: "15min" });
};



