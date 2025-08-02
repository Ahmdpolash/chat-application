import jwt, { Secret } from "jsonwebtoken";
import config from "../config";

const generateToken = (id: string, secret: Secret, expiresIn: string) => {
  return jwt.sign({ id }, secret, { expiresIn } as any);
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

export const jwtHelper = { generateToken, verifyToken };
