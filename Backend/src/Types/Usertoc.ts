import { ObjectId } from "mongoose";

export interface userPayload {
  id: ObjectId;
}

export interface adminPayload {
  id: ObjectId;
}


export interface Tockens {
  accesstocken: string;
  refreshtocken: string;
}