import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userBlogSchema from "../Models/Userblogschema.ts";
import { userPayload } from "../Types/Usertoc";

dotenv.config();

const ACCESS_TOKEN = "key_for_accesst";

const AuthenticationMiddleware: RequestHandler = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized: Token is missing" });
    return;
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_PRIVATE_KEY || ACCESS_TOKEN
    ) as userPayload;

    const userdata = await userBlogSchema.findById(decoded.id);
    if (!userdata) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (userdata.isActive) {
      res.status(403).json({
        code: "ACCOUNT_INACTIVE",
        message: "Forbidden: Account is not active",
      });
      return;
    }

    (req as any).userdata = decoded; // Attach user data to the request object
    next(); // Call next() to proceed to the next middleware or route handler
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(403).json({ message: "Token invalid" });
    }
  }
};

export default AuthenticationMiddleware;
