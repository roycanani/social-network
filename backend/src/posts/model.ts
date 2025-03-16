import mongoose from "mongoose";

export interface Post {
  title: string;
  content: string;
  sender: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  likedBy: mongoose.Types.ObjectId[];
  photoSrc: string;
}

const postSchema = new mongoose.Schema<Post>({
  title: { type: String, required: true },
  content: { type: String },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likedBy: {
    type: [mongoose.Types.ObjectId],
    ref: "User",
    default: [],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  photoSrc: { type: String },
});

export const postModel = mongoose.model<Post>("Post", postSchema);
