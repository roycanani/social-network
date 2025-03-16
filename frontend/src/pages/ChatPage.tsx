"use client"

import { useParams } from "react-router-dom"
import { ChatInterface } from "../components/chat/chat-interface"

export default function ChatPage() {
  const { id } = useParams()

  if (!id) {
    return <div>Invalid chat ID</div>
  }

  return <ChatInterface userId={id} />
}