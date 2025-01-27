import { HttpStatusCode } from "../Constants and Enum/HttpStatusCode.ts";
import { ResponseMessages } from "../Constants and Enum/Messages.ts";
import { IuserServices } from "../interface/user/userServices.ts";
import { IUserController } from "../interface/user/userController.ts";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateRefreshToken } from "../Utils/Jwt.ts";
class Usercontroller implements IUserController {
  constructor(private userServices: IuserServices) {
    this.userServices = userServices;
  }

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
      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.USER_REGISTER_SUCCESS });
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.SOMETHING_WENT_WRONG });
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

      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.ADD_POST_SUCCESS });
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.SOMETHING_WENT_WRONG });
    }
  }

  async findAllReviews(req: Request, res: Response) {
    try {

      const postid= req.query.id
      const findtheReviews = await this.userServices.FindallReview(postid);
      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.GET_ALL_REVIEWS, findtheReviews });
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.SOMETHING_WENT_WRONG });
    }
  }

  async findpostandedit(req: Request, res: Response) {
    try {
      const { title, description, saveID } = req.body;
      const postimage = req.file?.path;
      const Allpostrecived = await this.userServices.getpostForEdit(
        title,
        description,
        postimage,
        saveID
      );

      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.POST_EDIT_SUCCESS });
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.SOMETHING_WENT_WRONG });
    }
  }

  async findAndDeletepost(req: Request, res: Response) {
    try {
      const Postid = req.query.id;
      await this.userServices.gettheIddetail(Postid);

      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.POST_DELETE_SUCCESS });
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.SOMETHING_WENT_WRONG });
    }
  }

  async detailPage(req: Request, res: Response) {
    try {
      const { postid } = req.query;
      const Allpostrecived = await this.userServices.viewDetailPage(postid);
      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.ALL_POSTS_FOUND, Allpostrecived });
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.SOMETHING_WENT_WRONG });
    }
  }

  async AddReview(req: Request, res: Response) {
    try {
      const data = req.body;
      const name = data.newReview.name;
      const comment = data.newReview.comment;
      const rating = data.newReview.rating;
      const postId = data.postid;

      const ReviewData = await this.userServices.passReviewData(
        name,
        comment,
        rating,
        postId
      );
      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.REVIEW_ADDED });
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.SOMETHING_WENT_WRONG });
    }
  }

  async findAllPost(req: Request, res: Response) {
    try {
      const { search, limit, page } = req.query;
      const Allpostrecived = await this.userServices.getAllthepost(
        search,
        limit,
        page
      );

      if (!Allpostrecived) {
        throw new Error("No posts found");
      }

      const { posts, totalPages } = Allpostrecived;
      res.status(HttpStatusCode.OK).json({
        message: ResponseMessages.ALL_POSTS_FOUND,
        posts,
        totalPages,
      });
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.SOMETHING_WENT_WRONG });
    }
  }

  async refreshTocken(req: Request, res: Response) {
    try {
      const REFRESH_TOKEN_PRIVATE_KEY = "key_for_refresht";
      const { refreshToken } = req.body;

      if (!req.body || !req.body.refreshToken) {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: ResponseMessages.REFRESH_TOKEN_REQUIRED });
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_PRIVATE_KEY || REFRESH_TOKEN_PRIVATE_KEY,
        (err: any, user: any) => {
          if (err) {
            return res
              .status(HttpStatusCode.FORBIDDEN)
              .json({ message: ResponseMessages.TOKEN_EXPIRED_OR_INVALID });
          }

          const newAccessToken = generateRefreshToken({ id: user.id });
          res.json({ accessToken: newAccessToken });
        }
      );
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.SOMETHING_WENT_WRONG });
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
        res.status(HttpStatusCode.OK).json({
          message: ResponseMessages.USER_LOGIN_SUCCESS,
          accessToc,
          refreshToc,
        });
        return;
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: ResponseMessages.WRONG_PASSWORD });
      } else {
        res
          .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
          .json({ message: ResponseMessages.SOMETHING_WENT_WRONG });
      }
    }
  }
}

export default Usercontroller;
