import UserServices from "../Services/Userservices.ts";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateRefreshToken } from "../Utils/Jwt.ts";
import { IuserServices } from "../interface/user/userServices.ts";
class Usercontroller {
  constructor(private userServices: IuserServices) {}
  async userRegister(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const profileImage = req.file?.path;
      const saveuser = await this.userServices.VerifyRegister(
        name,
        email,
        password,
        profileImage
      );

      res.status(200).json({ message: "User Saved Successfull" });
    } catch (error) {
      console.log(error);
    }
  }

  async AddPost(req: Request, res: Response) {
    try {
      const { title, description } = req.body;
      const postimage = req.file?.path;
      const addingthepost = await this.userServices.SendPostinfo(
        title,
        description,
        postimage
      );

      res.status(200).json({ message: "Upload the file" });
    } catch (error) {
      console.log(error);
    }
  }

  async findpostandedit(req: Request, res: Response) {
    try {
      const { title, description, saveID } = req.body;

      console.log(title, "title");
      console.log(description, "description");

      const postimage = req.file?.path;
      const Allpostrecived = await this.userServices.getpostForEdit(
        title,
        description,
        postimage,
        saveID
      );

      res.status(200).json({ message: "Post edited successful" });
    } catch (error) {
      console.log(error);
    }
  }

  async findAndDeletepost(req: Request, res: Response) {
    try {
      const Postid = req.query.id;
      await this.userServices.gettheIddetail(Postid);

      res.status(200).json({ message: "Post deleted successful" });
    } catch (error) {
      console.log(error);
    }
  }

  async findAllPost(req: Request, res: Response) {
    try {
      const Allpostrecived = await this.userServices.getAllthepost();

      res.status(200).json({ message: "All post found", Allpostrecived });
    } catch (error) {
      console.log(error);
    }
  }

  async refreshTocken(req: Request, res: Response) {
    try {
      const REFRESH_TOKEN_PRIVATE_KEY = "key_for_refresht";
      const { refreshToken } = req.body;

      if (!req.body || !req.body.refreshToken) {
        res.status(401).json({ message: "Refresh Token required" });
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_PRIVATE_KEY || REFRESH_TOKEN_PRIVATE_KEY,
        (err: any, user: any) => {
          if (err) {
            return res
              .status(403)
              .json({ message: "Token expired or invalid" });
          }

          const newAccessToken = generateRefreshToken({ id: user.id });
          res.json({ accessToken: newAccessToken });
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async userLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const userlogindata = await this.userServices.verifyLoging(
        email,
        password
      );

      if (userlogindata) {
        const accessToc = userlogindata.accesstocken;
        const refreshToc = userlogindata.refreshtocken;
        res
          .status(200)
          .json({ message: "User Logined Successful", accessToc, refreshToc });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default Usercontroller;
