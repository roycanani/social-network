"use client"

import { useState, type FormEvent, type KeyboardEvent } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Send } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (text: string) => void
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 flex items-center gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={!message.trim()} aria-label="Send message">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}

