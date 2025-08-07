// user routes

import { Router } from "express";
import { userControllers } from "./user.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/register", userControllers.createUser);
router.post("/login", userControllers.loginUser);
router.get("/me", auth(), userControllers.myProfile);
router.get("/users", userControllers.getAllUsers);

export const userRoutes = router;
