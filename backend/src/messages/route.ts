import express from "express";
import messagesController from "./controller";
import { authMiddleware } from "../auth/controller";
export const messagesRouter = express.Router();

messagesRouter.get(
    "/",
    // authMiddleware,
    messagesController.getAll.bind(messagesController)
);

messagesRouter.get(
    "/:id",
    // authMiddleware,
    messagesController.getById.bind(messagesController)
);

messagesRouter.post(
    "/",
    // authMiddleware,
    messagesController.create.bind(messagesController)
);