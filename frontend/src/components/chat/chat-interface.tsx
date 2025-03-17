"use client"

import { useState, useRef, useEffect } from "react"
import { ChatHeader } from "./chat-header"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { useUsers } from "../../hooks/useUsers"
import { useSocket } from "../../hooks/useSocket"
import { useAuth } from "../../auth.context"
import axios from "axios"

interface ChatInterfaceProps {
  chatId: string
}

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [otherUser, setOtherUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const { user } = useAuth()
  const socket = useSocket()
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: usersData } = await axios.get("http://localhost:3000/users")
        setAllUsers(usersData)
        setError(null)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to fetch users")
      }
    }

    if (user) {
      fetchUsers()
    }
  }, [user])

  useEffect(() => {
    // Fetch user from the list of all users

    if (user && allUsers && chatId) {
      // Fetch initial messages from an API
      const fetchMessages = async () => {
        try {
          const { data: currentChat } = await axios.get(`http://localhost:3000/chats/${chatId}`)
          const usersInChat = currentChat.users
          const otherUserId = usersInChat.find((id: string) => id !== user?._id)

          const fetchedUser = allUsers.find((u) => u._id === otherUserId)
          setOtherUser(fetchedUser || null)

          const { data: messagesData } = await axios.get(`http://localhost:3000/chats/${chatId}/messages`)
          setMessages(messagesData)
          if (fetchedUser && messagesData) setLoading(false);
        } catch (error) {
          console.error("Error fetching messages:", error)
        }
      }
      fetchMessages()
    }
  }, [chatId, allUsers, user])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const newMessage = JSON.parse(event.data)
        if (newMessage.type === "sendMessage") {
          if (newMessage.chat === chatId) {
            const { type, ...rest } = newMessage
            setMessages((prevMessages) => [...prevMessages, rest])
          }
        }
      }
    }

    return () => {
      if (socket) {
        socket.onmessage = null
      }
    }
  }, [socket, chatId])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    const newMessage = {
      chat: chatId,
      sender: user?._id,
      content: text,
      createdAt: new Date().toISOString(),
    }

    // Send the message via WebSocket
    if (socket) {
      socket.send(JSON.stringify({ type: "sendMessage", ...newMessage }))
    }

    // Optimistically update the UI
    // setMessages([...messages, newMessage])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>User not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-background" style={{ height: "calc(100vh - 65px)" }}>
      <ChatHeader user={otherUser} />
      <div className="flex-1 overflow-auto">
        <MessageList messages={messages} currentUserId={user?._id!} messagesEndRef={messagesEndRef as any} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  )
}