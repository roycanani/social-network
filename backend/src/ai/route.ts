import * as express from "express";
import { generateContent } from "./controller";

/**
 * @swagger
 * /generate-content:
 *   post:
 *     summary: Generate content based on a post title
 *     description: This endpoint generates content for a social network post based on the provided title.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postTitle:
 *                 type: string
 *                 description: The title of the post
 *                 example: "How to learn TypeScript"
 *     responses:
 *       200:
 *         description: Successfully generated content
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "This is a detailed description based on the post title."
 *       400:
 *         description: Bad request, missing postTitle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "postTitle is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to generate content"
 */

export const aiRouter = express.Router();

aiRouter.post("/generate-content", generateContent);

export default aiRouter;
