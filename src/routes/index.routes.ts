import { Router } from "express";
import userRoutes from "./user.routes";

const rootRoutes = Router();

rootRoutes.use("/user", userRoutes);

export default rootRoutes;

