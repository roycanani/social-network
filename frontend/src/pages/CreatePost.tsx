"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { Camera, Upload, X, Send } from "lucide-react";
import axios from "axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigte = useNavigate();

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "photo.png", { type: "image/png" });
          setImageFile(file);

          // Optional: Generate a preview for the UI
          const imageDataUrl = URL.createObjectURL(blob);
          setImagePreview(imageDataUrl);
        }
      });

      // Stop camera stream
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());

      setIsCapturing(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const stopCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsCapturing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    // formData.append("title", title);
    // formData.append("content", content);
    formData.append(
      "post",
      JSON.stringify({
        content,
        title,
      })
    );
    if (imageFile) {
      formData.append("file", imageFile); // Attach the image file
    }
    try {
      await axios.post("http://localhost:3000/posts", formData);
      alert("Post created successfully!");
      navigte("/feed"); // Redirect to posts list
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
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
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={startCamera}
                  disabled={isCapturing}
                >
                  <Camera className="mr-2 h-4 w-4" /> Take Photo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {isCapturing && (
                <div className="mt-4 space-y-2">
                  <div className="relative border rounded-md overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" onClick={capturePhoto}>
                      Capture
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={stopCamera}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {imagePreview && (
                <div className="mt-4 relative">
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-auto"
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
              <Send className="mr-2 h-4 w-4" /> Create Post
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
