import { IPost } from "../../Entities/Userentities";
import { Tocken } from "../../Types/Usertoc";



export interface IuserServices {
  verifyLoging(email: string, password: string): Promise<Tocken | undefined>;
  gettheIddetail(postId: string | any): Promise<void>;
  getAllthepost(search:string | any,limit:number|any,page:number|any):  Promise<{ posts: IPost[]; totalPages: number } | undefined>
  getpostForEdit(title: string,description: string,postimage: string | undefined,saveID:string):Promise<void>
  SendPostinfo(title: string,description: string,postimage: string | undefined):Promise<void> 
  VerifyRegister(name: string, email: string,password: string,profileImage: string | undefined):Promise<void>
  viewDetailPage(postid: string | any):Promise<IPost | null> 
}