import mongoose from "mongoose";

export interface Chat {
    users: string[]; // List of user IDs
    lastMessage?: string; // Latest message reference
    updatedAt: Date;
}

const ChatSchema = new mongoose.Schema<Chat>({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

export const chatModel = mongoose.model<Chat>("Chats", ChatSchema);
