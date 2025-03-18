"use client"

import { useState } from "react"
import { ChatsHeader } from "./chats-header"
import { ChatsList } from "./chats-list"
import { SearchUsersDialog } from "./search-users-dialog"

export function ChatsScreen() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="flex flex-col bg-background" style={{ height: "calc(100vh - 65px)" }}>
      <ChatsHeader onNewChat={() => setSearchOpen(true)} />
      <ChatsList />
      <SearchUsersDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}

