import { Router } from "express";
import userRoutes from "./user.routes";
import eventRoutes from "./event.routes";

const rootRoutes = Router();

rootRoutes.use("/user", userRoutes);
rootRoutes.use("/event", eventRoutes);

export default rootRoutes;

