"use client"

import { useState, useRef, useEffect } from "react"
import { ChatHeader } from "./chat-header"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"

// Mock data for demonstration
const MOCK_USERS = {
  "1": {
    id: "1",
    name: "Jane Cooper",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  "2": {
    id: "2",
    name: "Alex Morgan",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
  },
  "3": {
    id: "3",
    name: "Michael Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  "4": {
    id: "4",
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
  },
  "5": {
    id: "5",
    name: "Leslie Alexander",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  "6": {
    id: "6",
    name: "Dries Vincent",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
  },
  "7": {
    id: "7",
    name: "Lindsay Walton",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  "8": {
    id: "8",
    name: "Courtney Henry",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
  },
}

// Mock messages for demonstration
const MOCK_MESSAGES = {
  "1": [
    {
      id: "1",
      senderId: "1",
      text: "Hey there! How's it going?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "2",
      senderId: "currentUser",
      text: "Hi Jane! I'm doing well, thanks for asking. How about you?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    },
    {
      id: "3",
      senderId: "1",
      text: "I'm great! Just working on some new projects. Have you seen the latest updates to the platform?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "4",
      senderId: "currentUser",
      text: "Not yet, I'll check them out soon. Anything exciting?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "5",
      senderId: "1",
      text: "Yes! They've added some really cool new features. I think you'll like them.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ],
  "2": [
    {
      id: "1",
      senderId: "2",
      text: "Did you see the latest update?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: "2",
      senderId: "currentUser",
      text: "Yes, it looks great!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ],
}

interface ChatInterfaceProps {
  userId: string
}

export function ChatInterface({ userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real app, you would fetch user and messages from an API
    setUser(MOCK_USERS[userId as keyof typeof MOCK_USERS] || null)
    setMessages(MOCK_MESSAGES[userId as keyof typeof MOCK_MESSAGES] || [])
  }, [userId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const newMessage = {
      id: `${messages.length + 1}`,
      senderId: "currentUser",
      text,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, newMessage])
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading chat...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader user={user} />
      <MessageList messages={messages} currentUserId="currentUser" messagesEndRef={messagesEndRef as any} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}

