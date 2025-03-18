import request from "supertest";
import mongoose from "mongoose";
import express, { Express } from "express";
import postsMock from "./postsMock.json";
import { postModel } from "../posts/model";
import { User } from "./common";
import { postsRouter } from "../posts/route";

let app: Express;

const testUser: User = {
  userName: "urishiber",
  email: "test@user.com",
  password: "testpassword",
  _id: "", // Default value for _id
  image: "", // Default value for image
};

// Mock the models
jest.mock("../posts/model");
// Mock the authentication middleware
jest.mock("../auth/controller", () => {
  return {
    authMiddleware: jest.fn((req, res, next) => {
      req.user = {
        _id: new mongoose.Types.ObjectId().toString(),
        accessToken: "mockAccessToken",
      };
      testUser._id = req.user._id;
      next();
    }),
  };
});

beforeAll(() => {
  app = express();
  app.use(express.json()); // Middleware to parse JSON
  app.use("/posts", postsRouter); // Mount the comments router
});

afterAll(() => {
  jest.restoreAllMocks();
});

let postId = "";
const mockUserId = new mongoose.Types.ObjectId().toString();

describe("Posts Tests", () => {
  // test("Test success get all posts", async () => {
  //   jest.spyOn(postModel, "find").mockResolvedValueOnce([
  //     {
  //       title: "First Post",
  //       content: "This is the content of the first post.",
  //       sender: "641a1b2c3d4e5f6789012346",
  //       comments: ["641a1b2c3d4e5f6789012345", "641a1b2c3d4e5f6789012347"],
  //       createdAt: "2025-03-15T10:00:00.000Z",
  //       likedBy: ["641a1b2c3d4e5f6789012348", "641a1b2c3d4e5f6789012350"],
  //       photoSrc: "https://example.com/photos/first-post.jpg",
  //     },
  //   ]);
  //   const response = await request(app).get("/posts").set("userId", mockUserId); // Assuming userId is passed in headers
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.length).toBe(0);
  // });
  // test("Test success get posts with query param", async () => {
  //   jest.spyOn(postModel, "find").mockResolvedValueOnce([]);

  //   const response = await request(app)
  //     .get("/posts?sender=" + testUser._id)
  //     .set({ authorization: "JWT " + testUser.accessToken });
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.length).toBe(0);
  // });
  // test("Test get all posts - Internal Server Error", async () => {
  //   const err = new Error("MongoServerSelectionError");
  //   err.name = "MongoServerSelectionError";
  //   jest.spyOn(postModel, "find").mockRejectedValue(err);

  //   const response = await request(app)
  //     .get("/posts")
  //     .set({ authorization: "JWT " + testUser.accessToken });

  //   expect(response.statusCode).toBe(500);
  //   expect(response.body.details).toBe("Database connection error");
  // });
  test("Test success Update Post", async () => {
    (postModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...postsMock[0],
    });
    const response = await request(app)
      .put("/posts/aaa")
      .send({ post: JSON.stringify(postsMock[0]) })
      .set("userId", mockUserId); // Assuming userId is passed in headers
    expect(response.statusCode).toBe(200);
    postId = response.body._id;
  });
  test("Test fail Update Post bad body", async () => {
    (postModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...postsMock[0],
    });
    const response = await request(app)
      .put("/posts/aaa")
      .send(JSON.stringify(postsMock[0]))
      .set("userId", mockUserId); // Assuming userId is passed in headers
    expect(response.statusCode).toBe(400);
  });
  test("Test Update Post - Internal Server Error", async () => {
    const err = new Error("MongoServerSelectionError");
    err.name = "MongoServerSelectionError";
    (postModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(err);

    const response = await request(app)
      .put("/posts/aaa")
      .send({ post: JSON.stringify(postsMock[0]) })
      .set({ authorization: "JWT " + testUser.accessToken });

    expect(response.statusCode).toBe(500);
    expect(response.body.details).toBe("Database connection error");
  });
  test("Test success Create Post", async () => {
    (postModel.create as jest.Mock).mockResolvedValue({
      ...postsMock[0],
    });
    const response = await request(app)
      .post("/posts")
      .send({ post: JSON.stringify(postsMock[0]) })
      .set("userId", mockUserId); // Assuming userId is passed in headers
    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe(postsMock[0].content);
    expect(response.body.title).toBe(postsMock[0].title);
    expect(response.body.sender).toBe(postsMock[0].sender);
    postId = response.body._id;
  });
  test("Test fail Create Post bad body", async () => {
    (postModel.create as jest.Mock).mockResolvedValue({
      ...postsMock[0],
    });
    const response = await request(app)
      .post("/posts")
      .send(JSON.stringify(postsMock[0]))
      .set("userId", mockUserId); // Assuming userId is passed in headers
    expect(response.statusCode).toBe(400);
  });
  test("Test Create Post - Internal Server Error", async () => {
    const err = new Error("MongoServerSelectionError");
    err.name = "MongoServerSelectionError";
    (postModel.create as jest.Mock).mockRejectedValue(err);

    const response = await request(app)
      .post("/posts")
      .send({ post: JSON.stringify(postsMock[0]) })
      .set({ authorization: "JWT " + testUser.accessToken });

    expect(response.statusCode).toBe(500);
    expect(response.body.details).toBe("Database connection error");
  });
});
