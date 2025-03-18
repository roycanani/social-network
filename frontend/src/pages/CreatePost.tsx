"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Upload, X, Send, Loader2, Sparkles } from "lucide-react";
import axios from "axios";
import { Post } from "../model/post";
import { IMAGES_URL } from "../lib/utils";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { post: editingPost, isEditing } = (location.state || {}) as {
    post?: Post;
    isEditing?: boolean;
  };

  // If editing, populate the form with the post data
  useEffect(() => {
    if (isEditing && editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content || "");
      setImagePreview(IMAGES_URL + editingPost.photoSrc);
    }
  }, [isEditing, editingPost]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Optional: Generate a preview for the UI
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      "post",
      JSON.stringify({
        content,
        title,
      })
    );
    if (imageFile) {
      formData.append("file", imageFile); // Attach the image file
    } else if (!imagePreview) {
      alert("Please upload an image.");
      return;
    }
    try {
      if (isEditing && editingPost)
        await axios.put(`/posts/${editingPost._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      else
        await axios.post("/posts", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      navigate("/feed"); // Redirect to posts list
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleGenerateContent = async () => {
    if (!title.trim()) {
      alert("Please enter a title first to generate content");
      return;
    }

    setIsGeneratingContent(true);
    try {
      const generatedContent = await axios.post("/ai/generateContent", {
        postTitle: title,
      });
      setContent(generatedContent.data);
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGeneratingContent(false);
    }
  };
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Post</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs flex items-center gap-1"
                  onClick={handleGenerateContent}
                  disabled={isGeneratingContent || !title.trim()}
                >
                  {isGeneratingContent ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content or generate one with AI..."
                rows={3}
                required
              />
              {title.trim() && !content.trim() && !isGeneratingContent && (
                <p className="text-xs text-muted-foreground mt-1">
                  Tip: Click "Generate with AI" to create a caption based on
                  your title
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
                <Label
                  htmlFor="photo"
                  className="after:content-['*'] after:ml-0.5 after:text-red-500"
                >
                  Photo
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("photo")?.click()}
                    className={`w-full ${
                      !imagePreview ? "border-dashed border-2" : ""
                    }`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {imagePreview ? "Change Photo" : "Upload Photo (Required)"}
                  </Button>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {imagePreview ? (
                <div className="mt-2 relative">
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="mt-2 border border-dashed rounded-md p-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    No photo selected. Please upload an image.
                  </p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <p className="text-sm text-muted-foreground">
                Comments will be available after creating the post.
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" />{" "}
              {isEditing ? "Update Post" : "Create Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
