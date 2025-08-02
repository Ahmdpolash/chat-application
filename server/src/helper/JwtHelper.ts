import jwt, { Secret } from "jsonwebtoken";
import config from "../config";

const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn } as any);
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

export const jwtHelper = { generateToken, verifyToken };
