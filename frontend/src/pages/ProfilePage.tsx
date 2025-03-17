import { Camera, Edit, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { useAuth, useAuthDispatch } from "../auth.context";
import { postAuthRefresh } from "../auth/auth";
import axios from "axios";
import MyPosts from "./MyPosts";

export default function ProfilePage() {
  const { user } = useAuth();
  const { setUser, setToken } = useAuthDispatch();

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.userName);
  const [profilePictureURL, setProfilePictureURL] = useState(user?.image);
  const [image, setImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfilePictureURL(user?.image);
  }, [user?.image]);

  useEffect(() => {
    setNewUsername(user?.userName);
  }, [user?.userName]);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureURL(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append(
      "user",
      JSON.stringify({
        userName: newUsername,
        image: profilePictureURL!,
        _id: user!._id,
        email: user!.email,
      })
    );
    if (profilePictureURL !== user?.image && image) {
      formData.append("file", image);
    }
    await axios.put(`http://localhost:3000/users/${user!._id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setUser({
      ...user!,
      userName: newUsername,
      image: profilePictureURL!,
    });
    const { accessToken, refreshToken } = (
      await postAuthRefresh({
        refreshToken: localStorage.getItem("refreshToken")!,
      })
    ).data;
    localStorage.setItem("accessToken", accessToken ?? "");
    localStorage.setItem("refreshToken", refreshToken ?? "");
    setToken(accessToken!);
    setIsEditingUsername(false);
    setIsSaving(false);
  };

  const handleCancelChanges = () => {
    setNewUsername(user?.userName);
    setProfilePictureURL(user?.image);
    setIsEditingUsername(false);
  };

  const hasChanges =
    newUsername !== user?.userName || profilePictureURL != user?.image;

  return (
    <div className="flex-col">
      <main className="container w-full flex-col">
        <div className="mb-8 space-y-6 flex-col">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                <AvatarImage
                  src={profilePictureURL || user?.image}
                  alt={user?.userName}
                />
                <AvatarFallback>
                  {user?.userName?.slice(0, 2).toUpperCase() ?? "GU"}
                </AvatarFallback>
              </Avatar>

              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change profile picture</span>
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </div>

            <div className="flex flex-1 flex-col items-center space-y-4 text-center sm:items-start sm:text-left">
              <div className="flex items-center gap-2">
                {isEditingUsername ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="max-w-[200px]"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditingUsername(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{user?.userName}</h1>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditingUsername(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p>{user?.email}</p>
              </div>

              {hasChanges && (
                <div className="flex gap-2">
                  <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelChanges}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Separator />
          <MyPosts />
        </div>
      </main>
    </div>
  );
}
