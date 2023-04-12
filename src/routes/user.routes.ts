import { Router } from "express";
import  {UserController}  from "../controllers/index";
import UserRepository from "../repositories/user.repository";
import { authMiddleware } from "../middleware/auth.middleware";

const userRoutes = Router();
const controller = new UserController(
    new UserRepository()
  );


userRoutes.post("/register", controller.register.bind(controller));
userRoutes.post("/login", controller.login.bind(controller));
userRoutes.get("/", controller.list.bind(controller));
userRoutes.get("/auth", authMiddleware ,controller.listOne.bind(controller));
userRoutes.delete("/:id", controller.remove.bind(controller));

export default userRoutes;
