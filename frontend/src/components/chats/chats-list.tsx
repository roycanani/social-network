"use client"

import { useEffect, useState } from "react"
import { ChatRow } from "./chat-row"

// Mock data for demonstration
const MOCK_CHATS = [
  {
    id: "1",
    userName: "Jane Cooper",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey, how are you doing?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unread: true,
  },
  {
    id: "2",
    userName: "Alex Morgan",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Did you see the latest update?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    unread: false,
  },
  {
    id: "3",
    userName: "Michael Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Let's meet tomorrow at 2pm",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    unread: false,
  },
  {
    id: "4",
    userName: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for your help!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: false,
  },
]

export function ChatsList() {
  const [chats, setChats] = useState<typeof MOCK_CHATS>([])

  // Simulate loading chats from an API
  useEffect(() => {
    // In a real app, you would fetch chats from an API
    setChats(MOCK_CHATS)
  }, [])

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground mb-2">No chats yet</p>
        <p className="text-sm text-muted-foreground">Start a new conversation by clicking the + button</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <ChatRow key={chat.id} chat={chat} />
      ))}
    </div>
  )
}

