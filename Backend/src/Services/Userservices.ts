import { ObjectId } from "mongoose";
import cloudinary from "../Config/Cloudinary.ts";
import { Tocken, userPayload } from "../Types/Usertoc.ts";
import HashPassword from "../Utils/Hashpassword.ts";
import { generateAccessToken, generateRefreshToken } from "../Utils/Jwt.ts";
import { IPost } from "../Entities/Userentities.ts";
import { Irepository } from "../interface/user/userRepository.ts";
import { IuserServices } from "../interface/user/userServices.ts";

class UserServices implements IuserServices {
  constructor(private userRepository: Irepository) {
    this.userRepository = userRepository;
  }

  async verifyLoging(
    email: string,
    password: string
  ): Promise<Tocken | undefined> {
    try {
      const verifytheEmail = await this.userRepository.verifyEmail(email);
      const userinfo = await this.userRepository.findtheEmail(email, password);
      if (!userinfo?.password) {
        throw new Error("Invalid credentials");
      }
      const hashedpassword = await HashPassword.comparePassword(
        password,
        userinfo?.password
      );

      if (!hashedpassword) {
        throw new Error("Wrong password");
      }

      const userPayload: userPayload = {
        id: userinfo._id as ObjectId,
      };

      const accesstocken = generateAccessToken(userPayload);
      const refreshtocken = generateRefreshToken(userPayload);

      return { accesstocken, refreshtocken };
    } catch (error) {
      throw new Error("Wrong password");
    }
  }

  async gettheIddetail(postId: string | any): Promise<void> {
    try {
      await this.userRepository.findIdAndDelete(postId);
    } catch (error) {
      throw new Error("An Error occured while delete the post");
    }
  }

  async getAllthepost(search: string): Promise<IPost[] | undefined> {
    try {
      const recieveallpost = await this.userRepository.findAllThePost(search);
      return recieveallpost;
    } catch (error) {
      throw new Error("An Error occured during Featch data");
    }
  }

  async viewDetailPage(postid: string | undefined):Promise<IPost | null> {
    try {
      const recieveallpost = await this.userRepository.findTheDetailPage(postid);
      return recieveallpost;
    } catch (error) {
      throw new Error("An Error occured during Featch data");
    }
  }

  async getpostForEdit(
    title: string,
    description: string,
    postimage: string | undefined,
    saveID: string
  ): Promise<void> {
    try {
      let cloudinaryImageUrl = "";
      if (postimage) {
        const result = await cloudinary.uploader.upload(postimage, {
          resource_type: "image",
          folder: "user_profiles",
          use_filename: true,
        });
        cloudinaryImageUrl = result.secure_url;
      }
      await this.userRepository.EditpostandSave(
        title,
        description,
        cloudinaryImageUrl,
        saveID
      );
    } catch (error) {
      throw new Error("An Error occured during edit post");
    }
  }

  async SendPostinfo(
    title: string,
    description: string,
    postimage: string | undefined
  ): Promise<void> {
    try {
      let cloudinaryImageUrl = "";
      if (postimage) {
        const result = await cloudinary.uploader.upload(postimage, {
          resource_type: "image",
          folder: "user_profiles",
          use_filename: true,
        });
        cloudinaryImageUrl = result.secure_url;

        await this.userRepository.savePostinfo(
          title,
          description,
          cloudinaryImageUrl
        );
      } else {
        console.error("Profile image is missing");
      }
    } catch (error) {
      throw new Error("An Error occured during upload post");
    }
  }

  async VerifyRegister(
    name: string,
    email: string,
    password: string,
    profileImage: string | undefined
  ): Promise<void> {
    try {
      let cloudinaryImageUrl = "";
      if (profileImage) {
        const result = await cloudinary.uploader.upload(profileImage, {
          resource_type: "image",
          folder: "user_profiles",
          use_filename: true,
        });
        cloudinaryImageUrl = result.secure_url;
      } else {
        console.error("Profile image is missing");
      }
      console.log(cloudinaryImageUrl, "image url");
      const checkemail = await this.userRepository.checkEmailExist(email);
      const hashedpassword = await HashPassword.hashPassword(password);
      const saveuserhere = await this.userRepository.savetheuser(
        name,
        email,
        hashedpassword,
        cloudinaryImageUrl
      );
    } catch (error) {
      throw new Error("An Error occured during Register");
    }
  }
}

export default UserServices;
