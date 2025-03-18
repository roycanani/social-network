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

const mockUserId = new mongoose.Types.ObjectId().toString();

describe("Posts Tests", () => {
  test("Test success Update Post", async () => {
    (postModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      ...postsMock[0],
    });
    const response = await request(app)
      .put("/posts/aaa")
      .send({ post: JSON.stringify(postsMock[0]) })
      .set("userId", mockUserId); // Assuming userId is passed in headers
    expect(response.statusCode).toBe(200);
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
