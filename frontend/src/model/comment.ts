import { Post } from "./post";
import { User } from "./user";

export interface Comment {
  post: Post;
  content?: string;
  sender: User;
}
