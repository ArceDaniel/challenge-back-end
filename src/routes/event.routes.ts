import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import EventRepository from "../repositories/event.repository";
import UserRepository from "../repositories/user.repository";
import { authMiddleware } from "../middleware/auth.middleware";


const eventRoutes = Router();

const controller = new EventController(
    new UserRepository(),
    new EventRepository()
);

eventRoutes.post("/create", authMiddleware ,controller.createEvent.bind(controller));
eventRoutes.get("/list", authMiddleware ,controller.list.bind(controller));
eventRoutes.get("/list-all",controller.listAll.bind(controller));

export default eventRoutes;