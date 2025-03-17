import express from "express";
import messagesController from "./controller";
import { authMiddleware } from "../auth/controller";
export const messagesRouter = express.Router();

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Get all messages
 *     tags:
 *       - Messages
 *     responses:
 *       200:
 *         description: A list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
messagesRouter.get(
  "/",
  authMiddleware,
  messagesController.getAll.bind(messagesController)
);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Get a message by ID
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The message ID
 *     responses:
 *       200:
 *         description: The message details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message not found
 */
messagesRouter.get(
  "/:id",
  authMiddleware,
  messagesController.getById.bind(messagesController)
);