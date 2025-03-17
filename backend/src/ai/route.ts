import * as express from "express";
import { generateContent } from "./controller";

export const aiRouter = express.Router();

aiRouter.post("/generateContent", generateContent);

export default aiRouter;
