"use client";

import type React from "react";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { User } from "../model";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Post } from "../model/post";
import { useAuth } from "../auth.context";
import { IMAGES_URL } from "../lib/utils";

interface PostProps {
  post: Post;
  currentUser: User;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, comment: string) => void;
}

export function PostCard({ post, onLike, onAddComment }: PostProps) {
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();
  const isLiked = post.likedBy?.some(
    (currUser) => currUser.userName === user!.userName
  );

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment(post._id, commentText);
    setCommentText("");
  };

  return (
    <Card className="overflow-hidden border border-border">
      <CardHeader className="flex flex-row items-center py-2 px-3 space-x-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={post.sender.image} alt={post.sender.userName} />
          <AvatarFallback>{post.sender.userName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-xs font-medium">{post.sender.userName}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
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
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full p-0"
          >
            <Bookmark className="h-4 w-4" />
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

        {post.content && (
          <div className="px-2 pb-1">
            <p className="text-xs">
              <span className="font-medium">{post.sender.userName}</span>{" "}
              {post.content.length > 60
                ? `${post.content.substring(0, 60)}...`
                : post.content}
            </p>
          </div>
        )}

        {post.comments && post.comments.length > 0 && (
          <div className="px-2 pb-1">
            {post.comments.length > 1 && (
              <p className="text-xs text-muted-foreground">
                View all {post.comments.length} comments
              </p>
            )}
            <div className="flex items-start mb-0.5">
              <p className="text-xs">
                <span className="font-medium">
                  {post.comments[post.comments.length - 1].sender.userName}
                </span>{" "}
                {post.comments[post.comments.length - 1].content!.length > 40
                  ? `${post.comments[
                      post.comments.length - 1
                    ].content!.substring(0, 40)}...`
                  : post.comments[post.comments.length - 1].content}
              </p>
            </div>
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
