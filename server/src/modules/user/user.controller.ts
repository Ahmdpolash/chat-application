// user controller
import httpStatus from "http-status";

import { RequestHandler, Request, Response } from "express";
import { userService } from "./user.service";

// register user
const createUser: RequestHandler = async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User created successfully",
    data: result,
  });
};

// login user
const loginUser: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await userService.loginUser({ email, password });

  // set the token on the cookie
  const { accessToken, user } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set to true in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      user,
    },
  });
};

// get user profile

const myProfile = async (req: Request, res: Response) => {
  const { userId } = req.user;

  const result = await userService.myProfile(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
};

// get all users
const getAllUsers: RequestHandler = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await userService.getAllUsers(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
};

//get single user
const getSingleUser: RequestHandler = async (req: Request, res: Response) => {
  const result = await userService.getSingleUser(req.params.userId);
  res.status(httpStatus.OK).json({
    success: true,
    message: "User fetched successfully",
    data: result,
  });
};

export const userControllers = {
  createUser,
  loginUser,
  myProfile,
  getAllUsers,
  getSingleUser,
};
