import { Request, Response } from "express";

export interface IUserController {
  userRegister(req: Request, res: Response): Promise<void>;
  AddPost(req: Request, res: Response): Promise<void>;
  findpostandedit(req: Request, res: Response): Promise<void>;
  findAndDeletepost(req: Request, res: Response): Promise<void>;
  findAllPost(req: Request, res: Response): Promise<void>;
  refreshTocken(req: Request, res: Response): Promise<void>;
  userLogin(req: Request, res: Response): Promise<void>;
}
