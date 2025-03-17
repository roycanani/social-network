import express from "express";
import commentsController from "./controller";
import { authMiddleware } from "../auth/controller";
export const commentsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment
 *         sender:
 *           type: string
 *           description: The sender id of the comment
 *       example:
 *         content: This is a comment
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input
 *     security:
 *       - bearerAuth: []
 */
commentsRouter.post(
  "/",
  authMiddleware,
  commentsController.create.bind(commentsController)
);

export default commentsRouter;
