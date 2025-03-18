import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import usersMock from "./usersMock.json";
import initApp from "../server";
import { userModel } from "../users/model";
import { User } from "./common";

let app: Express;

const testUser: User = {
  userName: usersMock[0].userName!,
  email: usersMock[0].email,
  password: usersMock[0].password,
  _id: usersMock[0]._id!,
  image: usersMock[0].image!,
};
const testUser2: User = {
  userName: usersMock[1].userName!,
  email: usersMock[1].email,
  password: usersMock[1].password,
  _id: usersMock[1]._id!,
  image: usersMock[1].image!,
};

beforeAll(async () => {
  console.log("beforeAll");
  app = (await initApp()).app;
  await userModel.deleteMany();

  // create testUser
  await request(app).post("/auth/register").send(testUser);
  const loginRes = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = loginRes.body.accessToken;
  testUser.refreshToken = loginRes.body.refreshToken;
  testUser._id = loginRes.body._id;

  // create testUser2
  await request(app).post("/auth/register").send(testUser2);
  const loginRes2 = await request(app).post("/auth/login").send(testUser2);
  testUser2.accessToken = loginRes2.body.accessToken;
  testUser2.refreshToken = loginRes2.body.refreshToken;
  testUser2._id = loginRes2.body._id;
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

describe("Users Tests", () => {
  test("Test Success users get all", async () => {
    const response = await request(app)
      .get("/users")
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2); // Created 2 users in the beforeAll
  });

  test("Test fail users get all - Internal Server Error", async () => {
    const err = new Error("MongoServerSelectionError");
    err.name = "MongoServerSelectionError";
    jest.spyOn(userModel, "find").mockRejectedValue(err);

    const response = await request(app)
      .get("/users")
      .set({ authorization: "JWT " + testUser.accessToken });

    expect(response.statusCode).toBe(500);
    expect(response.body.details).toBe("Database connection error");

    jest.restoreAllMocks();
  });

  test("Succses Users get by id", async () => {
    const response = await request(app)
      .get("/users/" + testUser._id)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(usersMock[0].email);
    expect(response.body.userName).toBe(usersMock[0].userName);
  });

  test("Test fail users get by id - Internal Server Error", async () => {
    const err = new Error("MongoServerSelectionError");
    err.name = "MongoServerSelectionError";
    jest.spyOn(userModel, "findById").mockRejectedValue(err);

    const response = await request(app)
      .get("/users/" + testUser._id)
      .set({ authorization: "JWT " + testUser.accessToken });

    expect(response.statusCode).toBe(500);
    expect(response.body.details).toBe("Database connection error");

    jest.restoreAllMocks();
  });

  test("Test Users get by non existing id", async () => {
    const response = await request(app)
      .get("/users/674df5c81b3fe9863591b29a")
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).not.toBe(200);
  });

  test("Test fail Update User - Email in use by another user", async () => {
    const response = await request(app)
      .put("/users/" + testUser._id)
      .send({ user: JSON.stringify(usersMock[1]) })
      .set({ authorization: "JWT " + testUser.accessToken });

    expect(response.statusCode).toBe(500);
  });

  test("Test success Update User", async () => {
    const response = await request(app)
      .put("/users/" + testUser._id)
      .send({ user: JSON.stringify(testUser) })
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
  });

  test("Test fail Delete User - Non Exsisting UserId", async () => {
    const response = await request(app)
      .delete("/users/674df5c81baf09765591b23a")
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(404);
  });

  test("Test Success Delete User", async () => {
    const response = await request(app)
      .delete("/users/" + testUser._id)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app)
      .get("/users/" + testUser._id)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response2.statusCode).toBe(404);
  });
});
