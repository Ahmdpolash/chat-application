// user routes

import { Router } from "express";
import { userControllers } from "./user.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/register", userControllers.createUser);
router.post("/login", userControllers.loginUser);
router.get("/me", auth(), userControllers.myProfile);
router.get("/users", auth(), userControllers.getAllUsers);
router.get("/users/:userId", userControllers.getSingleUser);
router.post("/logout", userControllers.logOut);

export const userRoutes = router;
