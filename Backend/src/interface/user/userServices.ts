import { IPost } from "../../Entities/Userentities";
import { Tockens } from "../../Types/Usertoc";



export interface IuserServices {
  verifyLoging(email: string, password: string): Promise<Tockens | undefined>;
  gettheIddetail(postId: string | any): Promise<void>;
  getAllthepost(): Promise<IPost[] | undefined> 
  getpostForEdit(title: string,description: string,postimage: string | undefined,saveID:string):Promise<void>
  SendPostinfo(title: string,description: string,postimage: string | undefined):Promise<void> 
  VerifyRegister(name: string, email: string,password: string,profileImage: string | undefined):Promise<void>
}