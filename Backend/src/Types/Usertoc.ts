import { ObjectId } from "mongoose";

export interface userPayload {
  id: ObjectId;
}

export interface adminPayload {
  id: ObjectId;
}


export interface Tocken {
  accesstocken: string;
  refreshtocken: string;
}