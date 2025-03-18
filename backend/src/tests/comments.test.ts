import request from "supertest";
import express, { Express } from "express";
import mongoose from "mongoose";
import { postModel } from "../posts/model";
import commentsRouter from "../comments/route";
import { commentModel } from "../comments/model";

// Mock the models
jest.mock("../posts/model");
jest.mock("../comments/model");
// Mock the authentication middleware
jest.mock("../auth/controller", () => {
  return {
    authMiddleware: jest.fn((req, res, next) => {
      req.user = {
        _id: new mongoose.Types.ObjectId().toString(),
        accessToken: "mockAccessToken",
      };
      next();
    }),
  };
});
let app: Express;

beforeAll(() => {
  app = express();
  app.use(express.json()); // Middleware to parse JSON
  app.use("/comments", commentsRouter); // Mount the comments router
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("CommentsController.create Tests", () => {
  const mockPostId = new mongoose.Types.ObjectId().toString();
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const mockComment = {
    content: "This is a test comment",
  };

  test("Success - Create a comment", async () => {
    // Mock postModel.findById to return a valid post
    (postModel.findById as jest.Mock).mockResolvedValue({ _id: mockPostId });

    // Mock commentModel.create to return the created comment
    (commentModel.create as jest.Mock).mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      ...mockComment,
      sender: mockUserId,
    });

    // Mock postModel.updateOne to simulate successful update
    (postModel.updateOne as jest.Mock).mockResolvedValue({});

    const response = await request(app)
      .post("/comments")
      .send({ postId: mockPostId, comment: mockComment })
      .set("userId", mockUserId); // Assuming userId is passed in headers

    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe(mockComment.content);
    expect(response.body.sender).toBe(mockUserId);
  });

  test("Fail - Post not found", async () => {
    // Mock postModel.findById to return null
    (postModel.findById as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post("/comments")
      .send({ postId: mockPostId, comment: mockComment })
      .set("userId", mockUserId);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Post not found");
  });

  test("Fail - ValidationError when creating comment", async () => {
    // Mock postModel.findById to return a valid post
    (postModel.findById as jest.Mock).mockResolvedValue({ _id: mockPostId });

    // Mock commentModel.create to throw a ValidationError
    (commentModel.create as jest.Mock).mockRejectedValue({
      name: "ValidationError",
      message: "Invalid comment data",
    });

    const response = await request(app)
      .post("/comments")
      .send({ postId: mockPostId, comment: mockComment })
      .set("userId", mockUserId);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Bad Request");
    expect(response.body.details).toBe("Invalid comment data");
  });

  test("Fail - MongoServerSelectionError", async () => {
    // Mock postModel.findById to return a valid post
    (postModel.findById as jest.Mock).mockResolvedValue({ _id: mockPostId });

    // Mock commentModel.create to throw a MongoServerSelectionError
    (commentModel.create as jest.Mock).mockRejectedValue({
      name: "MongoServerSelectionError",
    });

    const response = await request(app)
      .post("/comments")
      .send({ postId: mockPostId, comment: mockComment })
      .set("userId", mockUserId);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
    expect(response.body.details).toBe("Database connection error");
  });

  test("Fail - Generic error", async () => {
    // Mock postModel.findById to return a valid post
    (postModel.findById as jest.Mock).mockResolvedValue({ _id: mockPostId });

    // Mock commentModel.create to throw a generic error
    (commentModel.create as jest.Mock).mockRejectedValue(
      new Error("Unknown error")
    );

    const response = await request(app)
      .post("/comments")
      .send({ postId: mockPostId, comment: mockComment })
      .set("userId", mockUserId);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
    expect(response.body.details).toBe("Unknown error");
  });
});
