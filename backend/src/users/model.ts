import mongoose from "mongoose";

export interface User {
  _id?: string;
  userName: string;
  password: string;
  email: string;
  phone_number?: string | null;
  refreshToken?: string[];
}

const userSchema = new mongoose.Schema<User>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  refreshToken: {
    type: [String],
    default: [],
  },
});

export const userModel = mongoose.model<User>("Users", userSchema);
