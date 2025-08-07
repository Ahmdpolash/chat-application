import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { messageRoutes } from "../modules/message/message.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: userRoutes,
  },
  {
    path: "/message",
    route: messageRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
