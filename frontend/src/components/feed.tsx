import { useEffect, useState } from "react";
import { PostCard } from "./postCard";
import { Comment } from "../model/comment";
import { useAuth } from "../auth.context";
import axios from "axios";
import { Post } from "../model/post";

export function Feed() {
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsResponse = (await axios.get("http://localhost:3000/posts"))
          .data;
        setPosts(postsResponse);
      } catch (error) {
        console.error("Error getting post:", error);
        alert("Failed to get posts.");
      }
    };
    fetchPosts();
  }, []);

  const { user } = useAuth();

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts?.map((post) => {
        if (post._id === postId) {
          const isLiked = post.likedBy?.some(
            (currUser) => currUser.userName === user!.userName
          );

          if (isLiked) {
            // Unlike
            return {
              ...post,
              likedBy: post.likedBy?.filter(
                (currUser) => currUser.userName !== user!.userName
              ),
            };
          } else {
            // Like
            return {
              ...post,
              likedBy: [...post.likedBy!, user!],
            };
          }
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, commentContent: string) => {
    if (!commentContent.trim()) return;

    setPosts((prevPosts) =>
      prevPosts?.map((post) => {
        if (post._id === postId) {
          const newComment: Comment = {
            content: commentContent,
            sender: user!,
            post: post,
          };

          return {
            ...post,
            comments: [...(post.comments || []), newComment],
          };
        }
        return post;
      })
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      {posts?.map((post, index) => (
        <PostCard
          key={index}
          post={post}
          currentUser={user!}
          onLike={handleLike}
          onAddComment={handleAddComment}
        />
      ))}
    </div>
  );
}
