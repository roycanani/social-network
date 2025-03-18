"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { use, useEffect, useState } from "react";
import { User } from "../../model";
import { useAuth } from "../../auth.context";
import { getUsersId } from "../../users/users";
import axios from "axios";

interface Chat {
  _id?: string;
  users: string[]; // List of user IDs
  lastMessage?: string; // Latest message reference
  updatedAt: Date;
}

interface ChatRowProps {
  chat: Chat;
}

export function ChatRow({ chat }: ChatRowProps) {
  const navigate = useNavigate();
  const timeAgo = formatDistanceToNow(new Date(chat.updatedAt), {
    addSuffix: true,
  });
  const unread = false;
  const currentUser = useAuth();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [lastMessageContent, setLastMessageContent] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchOtherUser = async () => {
      const otherUserId = chat.users.find((id) => id !== currentUser.user?._id);
      if (!otherUserId) {
        console.error("No other user found in chat", chat);
      } else {
        const otherUserResponse = await getUsersId(otherUserId);
        setOtherUser(otherUserResponse.data);
      }
    };
    const fetchLastMessage = async () => {
      if (chat.lastMessage) {
        const response = await axios.get(`/messages/${chat.lastMessage}`);

        setLastMessageContent(response.data.content);
      }
    };

    fetchLastMessage();
    fetchOtherUser();
  }, []);

  // Get initials for avatar fallback
  const initials = currentUser?.user
    ?.userName!.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleClick = () => {
    navigate(`/chat/${chat._id}`);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors",
        unread && "bg-muted/30"
      )}
      onClick={handleClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={
            otherUser?.image ??
            otherUser?.userName?.slice(0, 2).toUpperCase() ??
            "GU"
          }
          alt={otherUser?.userName}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3
            className={cn(
              "text-sm font-medium truncate",
              unread && "font-semibold"
            )}
          >
            {otherUser?.userName}
          </h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {timeAgo}
          </span>
        </div>
        <p
          className={cn(
            "text-xs text-muted-foreground truncate",
            unread && "text-foreground font-medium"
          )}
        >
          {lastMessageContent}
        </p>
      </div>
      {unread && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
      )}
    </div>
  );
}
