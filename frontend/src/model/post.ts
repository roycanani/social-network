import { Comment } from "./comment";
import { User } from "./user";

export interface Post {
  _id: string;
  title: string;
  content: string;
  comments: Comment[];
  sender: User;
  photoSrc: string;
  likedBy: User[];
}
