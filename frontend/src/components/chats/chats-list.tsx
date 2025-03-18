import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket"; // Import the custom hook
import { ChatRow } from "./chat-row";
import { useAuth } from "../../auth.context";
import axios from "axios";

// Define the chat type
// interface Chat {
//   id: string;
//   userName: string;
//   avatar: string;
//   lastMessage: string;
//   timestamp: string;
//   unread: boolean;
// }

interface Chat {
  _id?: string;
  users: string[]; // List of user IDs
  lastMessage?: string; // Latest message reference
  updatedAt: Date;
}

export function ChatsList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const currentUser = useAuth();

  useEffect(() => {
    // Fetch initial chats from API using axios
    const fetchChats = async () => {
      try {
        const { data } = await axios.get("/chats");
        setChats(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();

    // Listen for real-time chat updates
    if (socket && currentUser) {
      socket.onmessage = (event) => {
        const updatedChat = JSON.parse(event.data);
        if (
          updatedChat.type === "createChat" ||
          updatedChat.type === "updateChat"
        ) {
          const { type, ...rest } = updatedChat;
          setChats((prevChats) => {
            const existingChatIndex = prevChats.findIndex(
              (chat) => chat._id === rest._id
            );
            if (existingChatIndex !== -1) {
              // Update existing chat
              const updatedChats = [...prevChats];
              updatedChats[existingChatIndex] = {
                ...prevChats[existingChatIndex],
                ...rest,
              };
              return updatedChats;
            } else {
              // Add new chat
              return [rest, ...prevChats];
            }
          });
        }
      };
    }

    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket, currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  // UI rendering
  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground mb-2">No chats yet</p>
        <p className="text-sm text-muted-foreground">
          Start a new conversation by clicking the + button
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats
        .filter((chat) => chat?.users?.includes(currentUser.user?._id!))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .map((chat, index) => (
          <ChatRow key={chat._id} chat={chat} />
        ))}
    </div>
  );
}
