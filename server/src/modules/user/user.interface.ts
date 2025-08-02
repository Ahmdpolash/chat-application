// user interface

import { Model } from "mongoose";

export interface IUser {
  userName: string;
  email: string;
  password: string;
  avatar?: string;
  socketId?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
