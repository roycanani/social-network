"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { User } from "../../model";
import { useUsers } from "../../hooks/useUsers";
import { useSocket } from "../../hooks/useSocket";
import { useAuth } from "../../auth.context";
import axios from "axios";
import config from "../../config";

interface SearchUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchUsersDialog({
  open,
  onOpenChange,
}: SearchUsersDialogProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const currentUser = useAuth();
  const socket = useSocket();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data: usersData } = await axios.get(`${config.apiUrl}/users`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        setAllUsers(usersData);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Filter users based on search query
    const filteredUsers = allUsers.filter(
      (user) =>
        user.userName!.toLowerCase().includes(query.toLowerCase()) &&
        user._id !== currentUser.user?._id
    );

    setSearchResults(filteredUsers);
  };

  const startChat = async (searchResultUserId: string) => {
    const { data: chats } = await axios.get("/chats");
    const isAlreadyChat = chats.find(
      (chat: any) =>
        chat.users.includes(currentUser.user?._id) &&
        chat.users.includes(searchResultUserId)
    );
    if (isAlreadyChat) {
      // Navigate to the chat with this user
      navigate(`/chat/${isAlreadyChat._id}`);
      return;
    }
    // send ws message to start chat
    const newMessage = {
      users: [currentUser.user?._id, searchResultUserId],
    };

    // Send the message via WebSocket
    if (socket) {
      socket.send(JSON.stringify({ type: "createChat", ...newMessage }));
    }

    setTimeout(async () => {
      const { data: chats } = await axios.get("/chats");
      const currentChat = chats.find(
        (chat: any) =>
          chat.users.includes(currentUser.user?._id) &&
          chat.users.includes(searchResultUserId) &&
          new Date(chat.updatedAt).getTime() > Date.now() - 5000
      );
      if (currentChat) {
        // Navigate to the chat with this user
        navigate(`/chat/${currentChat._id}`);
      }
      onOpenChange(false);
    }, 500);
  };

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
            <p className="text-center py-4 text-sm text-muted-foreground">
              Loading users...
            </p>
          ) : error ? (
            <p className="text-center py-4 text-sm text-muted-foreground">
              Error: {error}
            </p>
          ) : searchResults.length === 0 && searchQuery !== "" ? (
            <p className="text-center py-4 text-sm text-muted-foreground">
              No users found
            </p>
          ) : (
            searchResults.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 hover:bg-muted rounded-md cursor-pointer"
                onClick={() => {
                  console.log(user._id!);
                  startChat(user._id!);
                }}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.image} alt={user.userName} />
                  <AvatarFallback>
                    {user?.userName?.slice(0, 2).toUpperCase() ?? "GU"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.userName!}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.userName!}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
