import { Home, LogOut, Plus, User, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../auth.context";

export function Navbar() {
  const { user } = useAuth();

  console.log(user?.image);
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <Link to={{ pathname: "/feed" }} className="flex items-center gap-2">
          <img src="/logo512.png" className="w-16 text-primary" alt="petbook" />
        </Link>

        <div className="flex items-center md:gap-6 ml-6">
          <Link
            to="/feed"
            className="items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hidden md:flex"
          >
            <Home className="h-4 w-4" />
            Pet Feed
          </Link>
          <Link
            to="/chats"
            className="items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hidden md:flex"
          >
            <MessageCircle className="h-4 w-4" />
            Chats
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="gap-1 hidden sm:flex">
            <Plus className="h-4 w-4" />
            New Pet Post
          </Button>

          <Button size="icon" variant="ghost" className="sm:hidden">
            <Plus className="h-5 w-5" />
            <span className="sr-only">New Post</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image} alt="User" />
                  <AvatarFallback>
                    {user?.userName?.slice(0, 2).toUpperCase() ?? "GU"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  to={{ pathname: "/profile" }}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to={{ pathname: "/logout" }}
                  className="flex cursor-pointer items-center gap-2 text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
