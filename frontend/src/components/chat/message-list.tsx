import type { RefObject } from "react"
import { Message } from "./message"

interface MessageListProps {
  messages: {
    _id?: string
    chat: string;
    sender: string;
    content: string;
    createdAt: Date;
  }[]
  currentUserId: string
  messagesEndRef: RefObject<HTMLDivElement>
}

export function MessageList({ messages, currentUserId, messagesEndRef }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <Message key={message._id} message={message} isOwn={message.sender === currentUserId} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

