import express from "express";
import chatsController from "./controller";
import { authMiddleware } from "../auth/controller";
import { messageModel } from "../messages/model";
import { chatModel } from "./model";
export const chatsRouter = express.Router();

/**
 * @swagger
 * /chats:
 *   get:
 *     summary: Get all chats
 *     tags:
 *       - Chats
 *     responses:
 *       200:
 *         description: A list of chats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 */
chatsRouter.get(
  "/",
  authMiddleware,
  chatsController.getAll.bind(chatsController)
);

/**
 * @swagger
 * /chats/{id}:
 *   get:
 *     summary: Get a chat by ID
 *     tags:
 *       - Chats
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The chat ID
 *     responses:
 *       200:
 *         description: The chat details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       404:
 *         description: Chat not found
 */
chatsRouter.get(
  "/:id",
  authMiddleware,
  chatsController.getById.bind(chatsController)
);

/**
 * @swagger
 * /chats:
 *   post:
 *     summary: Create a new chat
 *     tags:
 *       - Chats
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChat'
 *     responses:
 *       201:
 *         description: Chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 */
chatsRouter.post(
  "/",
  authMiddleware,
  chatsController.create.bind(chatsController)
);

/**
 * @swagger
 * /chats/{chatId}/messages:
 *   get:
 *     summary: Get all messages for a chat
 *     tags:
 *       - Chats
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: The chat ID
 *     responses:
 *       200:
 *         description: A list of messages for the chat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
chatsRouter.get("/:chatId/messages", authMiddleware, async (req, res) => {
  const { chatId } = req.params;
  const chat = await chatModel.findById(chatId);
  if (!chat) {
    res.status(404).json({ error: "Chat not found" });
  } else {
    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  }
});
