// user controller
import httpStatus from "http-status";

import { RequestHandler, Request, Response } from "express";
import { userService } from "./user.service";

const createUser: RequestHandler = async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "User created successfully",
    data: result,
  });
};

const loginUser: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await userService.loginUser({ email, password });

  // set the token on the cookie
  const { accessToken, user } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set to true in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
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

export const userControllers = { createUser, loginUser };
