// message routes

import { Router } from "express";

import { auth } from "../../middleware/auth";
import { messageControllers } from "./message.controller";

const router = Router();

router.post("/send", auth(), messageControllers.sendMessage);
router.get("/:userId", auth(), messageControllers.getMessagesWithUser);

export const messageRoutes = router;
