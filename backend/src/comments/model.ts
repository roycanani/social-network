import mongoose, { Schema, Document } from "mongoose";

export interface Comment {
  _id: string;
  content: string;
  sender: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema = new Schema<Comment>({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const commentModel = mongoose.model<Comment>("comments", CommentSchema);
