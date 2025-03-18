import mongoose from "mongoose";

export interface Message {
  _id: string;
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const MessageSchema = new mongoose.Schema<Message>({
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const messageModel = mongoose.model<Message>("Messages", MessageSchema);
