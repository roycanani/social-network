"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface SearchUsersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    name: "Leslie Alexander",
    avatar: "/placeholder.svg?height=40&width=40",
    username: "@leslie",
  },
  {
    id: "2",
    name: "Dries Vincent",
    avatar: "/placeholder.svg?height=40&width=40",
    username: "@dries",
  },
  {
    id: "3",
    name: "Lindsay Walton",
    avatar: "/placeholder.svg?height=40&width=40",
    username: "@lindsay",
  },
  {
    id: "4",
    name: "Courtney Henry",
    avatar: "/placeholder.svg?height=40&width=40",
    username: "@courtney",
  },
]

export function SearchUsersDialog({ open, onOpenChange }: SearchUsersDialogProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof MOCK_USERS>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    // In a real app, you would search users from an API
    if (query.trim() === "") {
      setSearchResults([])
      return
    }

    // Filter mock users based on search query
    const filteredUsers = MOCK_USERS.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults(filteredUsers)
  }

  const startChat = (userId: string) => {
    // Navigate to the chat with this user
    navigate(`/chat/${userId}`)
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
          {searchResults.length === 0 && searchQuery !== "" ? (
            <p className="text-center py-4 text-sm text-muted-foreground">No users found</p>
          ) : (
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 hover:bg-muted rounded-md cursor-pointer"
                onClick={() => startChat(user.id)}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

