import { useEffect, useState } from "react";
import { PostCard } from "./postCard";
import { useAuth } from "../auth.context";
import axios from "axios";
import { Post } from "../model/post";
import { User } from "../model";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface PostsListProps {
  getOnlyPostsOfUser: boolean;
}
export function PostsList({ getOnlyPostsOfUser }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const postsPerPage = 5;
  const fetchPosts = async (offset: number) => {
    try {
      let url = `/posts/?offset=${offset}`;
      if (getOnlyPostsOfUser) url += `&sender=${user?._id}`;
      const postsResponse = (await axios.get(url)).data;
      if (postsResponse.length < 5) setHasMore(false);
      setPosts([...posts, ...postsResponse]);
    } catch (error) {
      console.error("Error getting post:", error);
    }
  };

  useEffect(() => {
    if (user) fetchPosts(0);
  }, [user]);

  const handleLike = async (postId: string) => {
    let updatedLikedBy: User[] = [];

    const updatedPosts = posts?.map((post) => {
      if (post._id === postId) {
        const isLiked = post.likedBy?.some(
          (currUser) => currUser.userName === user!.userName
        );

        if (isLiked) {
          updatedLikedBy =
            post.likedBy?.filter(
              (currUser) => currUser.userName !== user!.userName
            ) || [];
          return {
            ...post,
            likedBy: updatedLikedBy,
          };
        } else {
          updatedLikedBy = [...(post.likedBy || []), user!];
          return {
            ...post,
            likedBy: updatedLikedBy,
          };
        }
      }
      return post;
    });

    setPosts(updatedPosts); // Update the state with the new posts array

    try {
      const formData = new FormData();
      formData.append(
        "post",
        JSON.stringify({
          likedBy: updatedLikedBy.map((like) => like._id),
        })
      );
      await axios.put(`/posts/${postId}`, formData);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleAddComment = async (postId: string, commentContent: string) => {
    if (!commentContent.trim()) return;

    setPosts((prevPosts) =>
      prevPosts?.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [
              ...(post.comments || []),
              {
                content: commentContent,
                sender: user!,
                post: post,
              },
            ],
          };
        }
        return post;
      })
    );

    try {
      await axios.post(`/comments/`, {
        postId,
        comment: { content: commentContent },
      });
    } catch (error) {
      console.error("Error updating comments:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await axios.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdatePost = async (post: Post) => {
    try {
      navigate("/create-post", { state: { post, isEditing: true } });
      setPosts(posts.map((p) => (p._id === post._id ? post : p)));
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const loadMorePosts = async () => {
    setIsLoading(true);
    setCurrentPage(currentPage + 1);
    await fetchPosts(currentPage * postsPerPage);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      {posts.length !== 0 &&
        posts.map((post, index) => (
          <PostCard
            key={index}
            post={post}
            onLike={handleLike}
            onAddComment={handleAddComment}
            onDeletePost={handleDeletePost}
            onUpdatePost={handleUpdatePost}
          />
        ))}

      {hasMore ? (
        <div className="flex justify-center py-4">
          <Button
            onClick={loadMorePosts}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-muted-foreground">
          No more posts to load
        </div>
      )}
    </div>
  );
}
