"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"

interface ChatHeaderProps {
  user: {
    id: string
    name: string
    avatar: string
    status: "online" | "offline" | "away"
  }
}

export function ChatHeader({ user }: ChatHeaderProps) {
  const navigate = useNavigate()

  // Get initials for avatar fallback
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <Button
        variant="ghost"
        size="icon"
        className="mr-1"
        onClick={() => navigate("/chats")}
        aria-label="Back to chats"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <Avatar className="h-9 w-9">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <h2 className="text-sm font-medium">{user.name}</h2>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              user.status === "online" ? "bg-green-500" : user.status === "away" ? "bg-yellow-500" : "bg-gray-400"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {user.status === "online" ? "Online" : user.status === "away" ? "Away" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  )
}

