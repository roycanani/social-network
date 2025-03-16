"use client"

import { useState } from "react"
import { ChatsHeader } from "./chats-header"
import { ChatsList } from "./chats-list"
import { SearchUsersDialog } from "./search-users-dialog"

export function ChatsScreen() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatsHeader onNewChat={() => setSearchOpen(true)} />
      <ChatsList />
      <SearchUsersDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}

