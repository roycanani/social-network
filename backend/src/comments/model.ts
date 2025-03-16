import mongoose from "mongoose";

export interface Comment {
  post: mongoose.Schema.Types.ObjectId;
  content: string;
  sender: mongoose.Schema.Types.ObjectId;
}

const CommentSchema = new mongoose.Schema<Comment>({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const commentModel = mongoose.model<Comment>("Comment", CommentSchema);
