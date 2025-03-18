import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import commentsMock from "./commentsMock.json";
import postsMock from "./postsMock.json";
import { Post, postModel } from "../posts/model";
import initApp from "../server";
import { userModel } from "../users/model";
import { User } from "./common";
import { commentModel } from "../comments/model";

let app: Express;

const testUser: User = {
  userName: "testUser",
  email: "test@user.com",
  password: "testpassword",
  _id: "",
  image: "testimage",
};

const testPost: Post & { _id: mongoose.Types.ObjectId } = {
  title: postsMock[0].title,
  content: postsMock[0].content,
  sender: new mongoose.Types.ObjectId(),
  comments: [],
  _id: new mongoose.Types.ObjectId(),
  createdAt: new Date(),
  likedBy: [],
  photoSrc: "",
};

beforeAll(async () => {
  console.log("beforeAll");
  app = (await initApp()).app;
  await postModel.deleteMany();
  await commentModel.deleteMany();
  await userModel.deleteMany();

  // create testUser
  await request(app).post("/auth/register").send(testUser);
  const loginRes = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = loginRes.body.accessToken;
  testUser.refreshToken = loginRes.body.refreshToken;

  testUser._id = loginRes.body._id;

  // Create a post required for the comment
  const portResponse = await request(app)
    .post("/posts")
    .send({
      title: postsMock[0].title,
      content: postsMock[0].content,
    })
    .set({ authorization: "JWT " + testUser.accessToken });

  testPost.sender = portResponse.body.sender;
  testPost._id = portResponse.body._id;
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let commentId = "";

describe("Comments Tests", () => {
  test("Comments test get all - when no post is provided", async () => {
    const response = await request(app)
      .get("/comments")
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });
  test("Test Success Create Comment", async () => {
    const response = await request(app)
      .post("/comments")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({
        content: commentsMock[0].content,
        post: testPost._id,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe(commentsMock[0].content);
    expect(response.body.post).toBe(testPost._id);
    expect(response.body.sender).toBe(testUser._id);
    commentId = response.body._id;
  });

  test("Test Fail Create Comment - Non Exsisting Post", async () => {
    const response = await request(app)
      .post("/comments")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send(commentsMock[0]);

    expect(response.statusCode).toBe(404);
  });

  test("Test Fail Create Comment - One or more Required fields are missing.", async () => {
    const response = await request(app)
      .post("/comments")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({ post: testPost._id });

    expect(response.statusCode).toBe(400);
  });

  test("Test Comments get by id", async () => {
    const response = await request(app)
      .get("/comments/" + commentId)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe(commentsMock[0].content);
    expect(response.body.post).toBe(testPost._id);
    expect(response.body.sender).toBe(testUser._id);
  });

  test("Test get comments by post", async () => {
    const response = await request(app)
      .get("/comments?post=" + testPost._id)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].content).toBe(commentsMock[0].content);
    expect(response.body[0].post).toBe(testPost._id);
    expect(response.body[0].sender).toBe(testUser._id);
  });

  test("Test get comment by post- bad Request", async () => {
    const response = await request(app)
      .get("/comments?post=" + commentsMock[0].content)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(400);
  });

  test("Test fail Update Comment - Non Exsisting Id", async () => {
    const response = await request(app)
      .put("/comments/674df5c81b3fe9863591b29a")
      .send(commentsMock[0])
      .set({ authorization: "JWT " + testUser.accessToken });

    // No such commentId
    expect(response.statusCode).toBe(404);
  });

  test("Test fail Update Comment - Post does Not exist", async () => {
    const response = await request(app)
      .put("/comments/" + commentId)
      .send(commentsMock[0])
      .set({ authorization: "JWT " + testUser.accessToken });
    // such post does not exist
    expect(response.statusCode).toBe(404);

    const response2 = await request(app)
      .get("/comments/" + commentId)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response2.statusCode).toBe(200);
    expect(response2.body.content).toBe(commentsMock[0].content);
    expect(response2.body.post).toBe(testPost._id);
    expect(response2.body.sender).toBe(testUser._id);
  });

  test("Test success Update Comment", async () => {
    const postResponse = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({
        title: postsMock[2].title,
        content: postsMock[2].content,
      });

    expect(postResponse.statusCode).toBe(201);
    const post = postResponse.body._id;
    const response2 = await request(app)
      .put("/comments/" + commentId)
      .send({ post })
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response2.statusCode).toBe(200);
  });

  test("Test fail Delete Comment - Non Exsisting Id", async () => {
    const response = await request(app)
      .delete("/comments/674df5c81b3fe9863591b29a")
      .set({ authorization: "JWT " + testUser.accessToken });

    // No such commentId
    expect(response.statusCode).toBe(404);
  });

  test("Test fail Delete Comment - Internal Server Error - Bab comment Id", async () => {
    const response = await request(app)
      .delete("/comments/000")
      .set({ authorization: "JWT " + testUser.accessToken });

    // Mal Formmated commentId
    expect(response.statusCode).toBe(500);
  });

  test("Test success Delete Comment", async () => {
    const response = await request(app)
      .delete("/comments/" + commentId)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app)
      .get("/comments/" + commentId)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response2.statusCode).toBe(404);
  });
});
