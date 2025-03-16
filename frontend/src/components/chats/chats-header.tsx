"use client"

import { Plus } from "lucide-react"
import { Button } from "../ui/button"

interface ChatsHeaderProps {
  onNewChat: () => void
}

export function ChatsHeader({ onNewChat }: ChatsHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h1 className="text-xl font-semibold">Chats</h1>
      <Button size="icon" variant="ghost" onClick={onNewChat} aria-label="New chat">
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  )
}

