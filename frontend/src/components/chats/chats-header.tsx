"use client"

import { Plus } from "lucide-react"
import { Button } from "../ui/button"

interface ChatsHeaderProps {
  onNewChat: () => void
}

export function ChatsHeader({ onNewChat }: ChatsHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background">
      <h1 className="text-xl font-semibold">Chats</h1>
      <Button size="icon" variant="ghost" onClick={onNewChat} aria-label="New chat">
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  )
}

