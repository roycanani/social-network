"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getUsers } from "../../users/users"
import { User } from "../../model"
import { useUsers } from "../../hooks/useUsers"
import { useSocket } from "../../hooks/useSocket"
import { useAuth } from "../../auth.context"

interface SearchUsersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchUsersDialog({ open, onOpenChange }: SearchUsersDialogProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const { allUsers, loading, error } = useUsers();
  const user = useAuth();
  const currentUser = useAuth()
  const socket = useSocket();


  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.trim() === "") {
      setSearchResults([])
      return
    }

    // Filter users based on search query
    const filteredUsers = allUsers.filter(
      (user) =>
        user.userName!.toLowerCase().includes(query.toLowerCase()) &&
        user._id !== currentUser.user?._id,
    )

    setSearchResults(filteredUsers)
  }

  const startChat = (searchResultUserId: string) => {
    // send ws message to start chat
    const newMessage = {
      users: [user.user?._id, searchResultUserId],
    }

    // Send the message via WebSocket
    if (socket) {
      socket.send(JSON.stringify({ type: "createChat", ...newMessage }))
    }
    
    // Navigate to the chat with this user
    navigate(`/chat/${searchResultUserId}`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a user..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="mt-2 max-h-72 overflow-y-auto">
        {loading ? (
            <p className="text-center py-4 text-sm text-muted-foreground">Loading users...</p>
          ) : error ? (
            <p className="text-center py-4 text-sm text-muted-foreground">Error: {error}</p>
          ) : searchResults.length === 0 && searchQuery !== "" ? (
            <p className="text-center py-4 text-sm text-muted-foreground">No users found</p>
          ) : (
            searchResults.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 hover:bg-muted rounded-md cursor-pointer"
                onClick={() => {
                  console.log(user._id!)
                  startChat(user._id!)
                }}
              >
                <Avatar className="h-9 w-9">
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback>
                    {user.userName!
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.userName!}</p>
                  <p className="text-xs text-muted-foreground">{user.userName!}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

