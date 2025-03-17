import mongoose, { Schema } from "mongoose";

export interface Post {
  title: string;
  content: string;
  sender: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  likedBy: mongoose.Types.ObjectId[];
  photoSrc: string;
}

const postSchema = new Schema<Post>({
  title: { type: String, required: true },
  content: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
    default: [],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "comments",
    default: [],
  },
  photoSrc: { type: String },
});

export const postModel = mongoose.model<Post>("posts", postSchema);
