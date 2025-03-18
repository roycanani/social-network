import BaseController from "../common/base_controller";
import { Chat, chatModel } from "./model";
import { Request, Response } from "express";

class ChatsController extends BaseController<Chat> {
    constructor() {
        super(chatModel);
    }

    // Override the create method
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { users } = req.body;

            // Validate required fields
            if (!users || !Array.isArray(users) || users.length < 2) {
                res.status(400)
                    .json({ error: "Invalid request: 'users' field is required and must contain at least two user IDs." });
            } else {
                // Call the base create functionality if validation passes
                const newChat = await this.model.create({ users });
                res.status(201).json(newChat);
            }
        } catch (error) {
            console.error("Error creating chat:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

const chatsController = new ChatsController();
export default chatsController;