"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { cn } from "../../lib/utils"
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router-dom"

interface Chat {
  id: string
  userName: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

interface ChatRowProps {
  chat: Chat
}

export function ChatRow({ chat }: ChatRowProps) {
  const navigate = useNavigate()
  const timeAgo = formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })

  // Get initials for avatar fallback
  const initials = chat.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const handleClick = () => {
    navigate(`/chat/${chat.id}`)
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors",
        chat.unread && "bg-muted/30",
      )}
      onClick={handleClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={chat.avatar} alt={chat.userName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className={cn("text-sm font-medium truncate", chat.unread && "font-semibold")}>{chat.userName}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{timeAgo}</span>
        </div>
        <p className={cn("text-xs text-muted-foreground truncate", chat.unread && "text-foreground font-medium")}>
          {chat.lastMessage}
        </p>
      </div>
      {chat.unread && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
    </div>
  )
}

