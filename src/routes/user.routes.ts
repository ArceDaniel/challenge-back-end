import { Router } from "express";
import  {UserController}  from "../controllers/index";
import UserRepository from "../repositories/user.respository";

const userRoutes = Router();
const controller = new UserController(
    new UserRepository()
  );


userRoutes.post("/register", controller.register.bind(controller));
userRoutes.post("/login", controller.login.bind(controller));

export default userRoutes;
