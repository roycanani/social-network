import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import initApp from "../server";
import { userModel } from "../users/model";
import bcrypt from "bcrypt";
import controller from "../auth/controller";
import * as jwtManager from "../common/jwt";
import jwt from "jsonwebtoken";
import { User } from "./common";

let app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = (await initApp()).app;
  await userModel.deleteMany();

  // create testUser2
  await request(app).post("/auth/register").send(testUser2);
  const loginRes2 = await request(app).post("/auth/login").send(testUser2);
  testUser2.refreshToken = loginRes2.body.refreshToken;
  testUser2._id = loginRes2.body._id;
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

beforeEach(() => {
  jest.resetAllMocks();
});

const baseUrl = "/auth";

const testUser: User = {
  userName: "urishiber",
  email: "test@user.com",
  password: "testpassword",
  _id: "",
  image: "testimage",
};

const testUser2: User = {
  userName: "testUser2",
  email: "test@user2.com",
  password: "testpassword2",
  _id: "",
  image: "testimage2",
};

describe("Auth Tests", () => {
  test("Test success Auth register", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send(testUser);
    expect(response.statusCode).toBe(200);
  });

  test("Auth test register fail", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test register fail", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send({
        email: "aaa",
      });
    expect(response.statusCode).toBe(400);

    const response2 = await request(app)
      .post(baseUrl + "/register")
      .send({
        email: "",
        password: "aaa",
      });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Register fails when user creation throws an error", async () => {
    jest
      .spyOn(userModel, "create")
      .mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post(baseUrl + "/register")
      .send({
        userName: "testUser",
        email: "test@user.com",
        password: "password123",
      });

    expect(response.statusCode).toBe(400);
    jest.restoreAllMocks();
  });

  test("Register fails when bcrypt.hash throws an error", async () => {
    (jest.spyOn(bcrypt, "hash") as jest.Mock).mockRejectedValue(
      new Error("Hashing error")
    );

    const response = await request(app)
      .post(baseUrl + "/register")
      .send({
        userName: "testUser",
        email: "test@user.com",
        password: "password123",
      });

    expect(response.statusCode).toBe(400);
    jest.restoreAllMocks();
  });

  test("Test success Auth login", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);

    expect(response.statusCode).toBe(200);

    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(response.body._id).toBeDefined();

    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser._id = response.body._id;
  });

  test("Check tokens are not the same", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    const accessToken = response.body.accessToken;

    const refreshToken = response.body.refreshToken;

    expect(accessToken).not.toBe(testUser.accessToken);
    expect(refreshToken).not.toBe(testUser.refreshToken);
  });

  test("Auth test login fail", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send({
        email: testUser.email,
        password: "sdfsd",
      });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app)
      .post(baseUrl + "/login")
      .send({
        email: "dsfasd",
        password: "sdfsd",
      });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Test refresh token", async () => {
    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test("Refresh token fails with invalid token", async () => {
    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: "invalidToken",
      });

    expect(response.statusCode).toBe(400);
  });

  test("Login fails when generateToken returns null", async () => {
    jest.spyOn(controller, "register").mockImplementation(() => {
      throw new Error("JWT Signing error");
    });

    const response = await request(app)
      .post(baseUrl + "/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.statusCode).toBe(200);
    jest.restoreAllMocks();
  });

  test("Login handles null refreshToken array", async () => {
    const user = await userModel.create({
      userName: "testUser",
      email: "emailTest@user.com",
      password: await bcrypt.hash("password123", 10),
      refreshToken: null, // No refresh tokens initially
    });

    const response = await request(app).post("/auth/login").send({
      email: user.email,
      password: "password123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.refreshToken).toBeDefined();
    const updatedUser = await userModel.findById(user._id);
    expect(updatedUser?.refreshToken).toContain(response.body.refreshToken);
  });

  test("Login handles user with null refreshToken", async () => {
    // Create a user with a null refreshToken array
    const user = await userModel.create({
      userName: "nullTokenUser",
      email: "nullTokenUser@user.com",
      password: await bcrypt.hash("password123", 10),
      refreshToken: null,
    });

    // Attempt login
    const response = await request(app)
      .post(baseUrl + "/login")
      .send({
        email: user.email,
        password: "password123",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.refreshToken).toBeDefined();

    // Verify that the refreshToken array is populated
    const updatedUser = await userModel.findById(user._id);
    expect(updatedUser?.refreshToken).toContain(response.body.refreshToken);
  });

  test("Refresh token fails when refresh token is invalid", async () => {
    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: "invalidToken",
      });

    expect(response.statusCode).toBe(400);
  });

  test("Refresh token fails when user is not found", async () => {
    jest.spyOn(userModel, "findById").mockResolvedValue(null);

    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });

    expect(response.statusCode).toBe(400);

    jest.restoreAllMocks();
  });

  test("Refresh token fails when token verification throws an error", async () => {
    jest.spyOn(jwtManager, "verifyRefreshToken").mockImplementation(() => {
      throw new Error("JWT Verification error");
    });

    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });

    expect(response.statusCode).toBe(400);
    jest.restoreAllMocks();
  });

  test("Logout fails when refresh token is missing", async () => {
    const response = await request(app)
      .post(baseUrl + "/logout")
      .send({});

    expect(response.statusCode).toBe(400);
  });

  test("Logout fails when refresh token is invalid", async () => {
    const response = await request(app)
      .post(baseUrl + "/logout")
      .send({
        refreshToken: "invalidToken",
      });

    expect(response.statusCode).toBe(400);
  });

  test("Double use refresh token", async () => {
    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser2.refreshToken,
      });
    expect(response.statusCode).toBe(200);
    const refreshTokenNew = response.body.refreshToken;

    const response2 = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser2.refreshToken,
      });
    expect(response2.statusCode).not.toBe(200);

    const response3 = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: refreshTokenNew,
      });
    expect(response3.statusCode).not.toBe(200);
  });

  test("Refresh token fails when token is not in user's refreshToken array", async () => {
    // Clear the refreshToken array before the test
    await userModel.updateOne({ _id: testUser._id }, { refreshToken: [] });

    // Generate a token that is not in the user's array
    const invalidToken = jwt.sign(
      { _id: "nonexistentUserId" },
      process.env.SERVER_TOKEN_SECRET!,
      { expiresIn: "1h" }
    );

    // Send the invalid token to the refresh endpoint
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: invalidToken,
    });

    // Assert the response indicates failure
    expect(response.statusCode).toBe(400);

    // Verify the user's refreshToken array remains empty
    const updatedUser = await userModel.findById(testUser._id);
    expect(updatedUser?.refreshToken).toEqual([]);
  });

  test("Refresh token fails when SERVER_TOKEN_SECRET is missing", async () => {
    const originalRefreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    delete process.env.REFRESH_TOKEN_SECRET;

    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });

    expect(response.statusCode).toBe(400);

    process.env.REFRESH_TOKEN_SECRET = originalRefreshTokenSecret;
  });

  test("Generate token fails when environment variables are missing", () => {
    const originalRefreshTokenSecret = process.env.SERVER_TOKEN_SECRET;

    // Temporarily unset environment variables
    delete process.env.SERVER_TOKEN_SECRET;

    const tokens = jwtManager.generateToken(
      "",
      "testUserId",
      "testEmail",
      "testImage"
    );
    expect(tokens).toBeNull();

    // Restore environment variables
    process.env.SERVER_TOKEN_SECRET = originalRefreshTokenSecret;
  });

  test("Test logout", async () => {
    const original_jwt_token_expiration = process.env.TOKEN_EXPIRES;

    // temparerlly change the vlaues
    process.env.TOKEN_EXPIRES = "3s";

    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .post(baseUrl + "/logout")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response2.statusCode).toBe(200);

    const response3 = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response3.statusCode).not.toBe(200);

    process.env.JWT_TOKEN_EXPIRATION = original_jwt_token_expiration;
  });

  test("Logout fails with invalid refresh token", async () => {
    const response = await request(app)
      .post(baseUrl + "/logout")
      .send({
        refreshToken: "invalidToken",
      });

    expect(response.statusCode).toBe(400);
  });

  test("Logout fails when token verification throws an error", async () => {
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("JWT Verification error");
    });

    const response = await request(app)
      .post(baseUrl + "/logout")
      .send({
        refreshToken: testUser.refreshToken,
      });

    expect(response.statusCode).toBe(400);
    jest.restoreAllMocks();
  });

  test("Returns 500 when generateToken returns null", async () => {
    // Mock `generateToken` to return null
    jest.spyOn(jwtManager, "generateToken").mockReturnValue(null);

    // Mock `verifyRefreshToken` to resolve with a valid user
    jest.spyOn(jwtManager, "verifyRefreshToken").mockResolvedValue({
      _id: testUser._id,
      refreshToken: testUser.refreshToken,
    } as jwtManager.TokenUser);

    const response = await request(app).post("/auth/refreshToken").send({
      refreshToken: "validToken",
    });

    expect(response.statusCode).toBe(404);

    jest.restoreAllMocks();
  });
});
