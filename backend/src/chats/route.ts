import express from "express";
import chatsController from "./controller";
import { authMiddleware } from "../auth/controller";
import { messageModel } from "../messages/model";
export const chatsRouter = express.Router();

chatsRouter.get(
    "/",
    // authMiddleware,
    chatsController.getAll.bind(chatsController)
);

chatsRouter.get(
    "/:id",
    // authMiddleware,
    chatsController.getById.bind(chatsController)
  );

chatsRouter.post(
    "/",
    // authMiddleware,
    chatsController.create.bind(chatsController)
);

chatsRouter.get(
    "/:chatId/messages",
    // authMiddleware,
    async (req, res) => {
        try {
            const { chatId } = req.params;
            const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ error: "Failed to fetch messages" });
        }
    }
);