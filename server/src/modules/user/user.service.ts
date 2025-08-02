// user service
import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUser, IUserLogin } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcrypt";
import { jwtHelper } from "../../helper/JwtHelper";
import config from "../../config";

const createUser = async (payload: IUser) => {
  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw new AppError("User already exists", httpStatus.CONFLICT);
  }

  const result = await User.create(payload);
  return result;
};

// login

const loginUser = async ({ email, password }: IUserLogin) => {
  // validate email and password
  if (!email || !password) {
    throw new AppError(
      "Please provide email and password",
      httpStatus.BAD_REQUEST
    );
  }

  // find user by email
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("User not found", httpStatus.UNAUTHORIZED);
  }

  // check if password matches
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError("Invalid password", httpStatus.UNAUTHORIZED);
  }

  // generate jwt token
  const accessToken = jwtHelper.generateToken(
    user._id.toString(),
    config.jwt.secret as string,
    config.jwt.expiresIn as string
  );

  return {
    accessToken,
    user: {
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
      socketId: user.socketId,
      _id: user._id.toString(),
    },
  };
};

export const userService = { createUser, loginUser };
