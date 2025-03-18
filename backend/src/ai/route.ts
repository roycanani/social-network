import * as express from "express";
import { generateContent } from "./controller";

export const aiRouter = express.Router();

aiRouter.post("/generate-content", generateContent);

export default aiRouter;
