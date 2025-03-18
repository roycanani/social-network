"use client";

import type React from "react";

import { useState } from "react";
import {
  Heart,
  MoreHorizontal,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Post } from "../model/post";
import { useAuth } from "../auth.context";
import { IMAGES_URL } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface PostProps {
  post: Post;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, comment: string) => void;
  onDeletePost: (postId: string) => void;
  onUpdatePost: (post: Post) => void;
}

export function PostCard({
  post,
  onLike,
  onAddComment,
  onDeletePost,
  onUpdatePost,
}: PostProps) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const { user } = useAuth();
  const isLiked = post.likedBy?.some((likeUser) => likeUser._id === user!._id);
  const isOwnPost = post.sender?._id === user?._id;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment(post._id, commentText);
    setCommentText("");
    setShowComments(true);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <Card className="overflow-hidden border border-border">
      <CardHeader className="flex flex-row items-center py-2 px-3 space-x-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={post.sender?.image} alt={post.sender?.userName} />
          <AvatarFallback>{post.sender?.userName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-xs font-medium">{post.sender?.userName}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {isOwnPost && (
              <>
                <DropdownMenuItem onClick={() => onUpdatePost(post)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDeletePost(post._id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete post
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
          <img
            src={IMAGES_URL + post.photoSrc || "/placeholder.svg"}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col p-0">
        <div className="flex items-center w-full py-1 px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onLike(post._id)}
            className="h-6 w-6 rounded-full p-0"
          >
            <Heart
              className={`h-4 w-4 ${
                isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full p-0"
            onClick={toggleComments}
          >
            <MessageCircle
              className={`h-4 w-4 ${
                showComments ? "fill-black text-black" : ""
              }`}
            />
          </Button>
        </div>

        {post && post.likedBy && post.likedBy!.length > 0 && (
          <div className="px-2 pb-1">
            <p className="text-xs font-medium">
              {post.likedBy!.length}{" "}
              {post.likedBy!.length === 1 ? "like" : "likes"}
            </p>
          </div>
        )}
        {post.title && (
          <div className="px-2 w-full">
            <div className="text-mm bg-muted/30 rounded-md px-2 py-1.5">
              <p className="leading-relaxed font-bold">{post.title}</p>
            </div>
          </div>
        )}
        {post.content && (
          <div className="px-2 pb-3 w-full">
            <div className="text-sm bg-muted/30 rounded-md px-2 py-1.5">
              <p className="leading-relaxed">{post.content}</p>
            </div>
          </div>
        )}

        {post.comments.length > 0 && (
          <div className="px-2 pt-3 pb-1">
            <button
              onClick={toggleComments}
              className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>
                View {post.comments.length}{" "}
                {post.comments.length === 1 ? "comment" : "comments"}
              </span>
              {showComments ? (
                <ChevronUp className="h-3 w-3 ml-1" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </button>

            {/* Only show comments when expanded */}
            {showComments && (
              <div className="flex flex-col gap-2 mt-2">
                {post.comments?.map((comment, index) => (
                  <div key={index} className="flex items-start gap-1.5">
                    <Avatar className="h-4 w-4 mt-0.5">
                      <AvatarImage
                        src={comment.sender.image}
                        alt={comment.sender.userName}
                      />
                      <AvatarFallback className="text-[8px]">
                        {comment.sender.userName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-xs">
                        <span className="text-muted-foreground/80 font-medium mr-1.5">
                          {comment.sender.userName}
                        </span>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmitComment}
          className="flex items-center py-1 px-2 border-t border-border"
        >
          <Input
            type="text"
            placeholder="Add a comment..."
            className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 h-6 text-xs"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className={`font-semibold text-xs h-6 px-2 ${
              !commentText.trim() ? "text-muted-foreground" : "text-primary"
            }`}
            disabled={!commentText.trim()}
          >
            Post
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
