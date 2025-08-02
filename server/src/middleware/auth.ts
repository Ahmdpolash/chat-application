import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import { jwtHelper } from "../helper/JwtHelper";
import config from "../config";
import { User } from "../modules/user/user.model";
import { JwtPayload } from "jsonwebtoken";

export const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // get  token from cookies
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(
        new AppError(
          "You are not Authorized!! Please login First",
          httpStatus.UNAUTHORIZED
        )
      );
    }

    try {
      const decoded = jwtHelper.verifyToken(
        token,
        config.jwt.secret as string
      ) as JwtPayload;

      if (!decoded) {
        return next(
          new AppError("Access token is not valid", httpStatus.UNAUTHORIZED)
        );
      }

      const user = await User.findOne({ email: decoded?.email });

      if (!user) {
        return next(new AppError("User not found", httpStatus.NOT_FOUND));
      }

      req.user = decoded;
      next();
    } catch (error) {
      return next(new AppError("Invalid token", httpStatus.UNAUTHORIZED));
    }
  };
};
