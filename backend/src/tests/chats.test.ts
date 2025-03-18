import request from "supertest";
import { Chat, chatModel } from "../chats/model";
import { userModel } from "../users/model";
import initApp from "../server";
import { Express } from "express";
import { User } from "./common";

let app: Express;

const testUser1: User = {
  userName: "testUser1",
  email: "test1@user.com",
  password: "testpassword",
  _id: "",
  image: "testimage",
};

const testUser2: User = {
  userName: "testUser2",
  email: "test2@user.com",
  password: "testpassword",
  _id: "",
  image: "testimage",
};

describe("Chats API", () => {
  let chat: Chat;

  const authHeader = () => ({ authorization: `JWT ${testUser1.accessToken}` }); // Helper for Authorization header

  beforeAll(async () => {
    app = (await initApp()).app;

    await userModel.deleteMany();

    // create testUser1
    await request(app).post("/auth/register").send(testUser1);
    const loginRes1 = await request(app).post("/auth/login").send(testUser1);
    testUser1.accessToken = loginRes1.body.accessToken;
    testUser1.refreshToken = loginRes1.body.refreshToken;
    console.log("-ooo---- " + loginRes1.body._id);
    testUser1._id = loginRes1.body._id;

    // create testUser2
    await request(app).post("/auth/register").send(testUser2);
    const loginRes2 = await request(app).post("/auth/login").send(testUser2);
    testUser2.accessToken = loginRes2.body.accessToken;
    testUser2.refreshToken = loginRes2.body.refreshToken;
    testUser2._id = loginRes2.body._id;

    // Create a test chat
    chat = await chatModel.create({
      users: [testUser1._id, testUser2._id],
    });
  });

  afterAll(async () => {
    // Clean up the database
    await chatModel.deleteMany({});
    await userModel.deleteMany({});
  });

  describe("GET /chats", () => {
    it("should return all chats for the authenticated user", async () => {
      console.log(
        "++++++++++++++++++++++++++++, " + authHeader().authorization
      );
      const response = await request(app)
        .get("/chats")
        .set(authHeader())
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("_id");
      expect(response.body[0]).toHaveProperty("users");
    });

    it("should return 401 if no token is provided", async () => {
      await request(app).get("/chats").expect(401);
    });
  });

  describe("GET /chats/:id", () => {
    it("should return a chat by ID", async () => {
      const response = await request(app)
        .get(`/chats/${chat._id}`)
        .set(authHeader())
        .expect(200);

      expect(response.body).toHaveProperty("_id", chat._id.toString());
      expect(response.body).toHaveProperty("users");
    });

    it("should return 404 if the chat does not exist", async () => {
      const nonExistentId = "000000000000000000000000";
      await request(app)
        .get(`/chats/${nonExistentId}`)
        .set(authHeader())
        .expect(404);
    });

    it("should return 401 if no token is provided", async () => {
      await request(app).get(`/chats/${chat._id}`).expect(401);
    });
  });

  describe("POST /chats", () => {
    it("should create a new chat", async () => {
      const response = await request(app)
        .post("/chats")
        .set(authHeader())
        .send({
          users: [testUser1._id, testUser2._id],
        })
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.users).toContain(testUser1._id.toString());
      expect(response.body.users).toContain(testUser2._id.toString());
    });

    it("should return 400 if required fields are missing", async () => {
      await request(app).post("/chats").set(authHeader()).send({}).expect(400);
    });

    it("should return 400 if required fields are incorrect - 1 user instead minimum of 2", async () => {
      await request(app)
        .post("/chats")
        .set(authHeader())
        .send({ users: [testUser1._id] })
        .expect(400);
    });

    it("should return 401 if no token is provided", async () => {
      await request(app)
        .post("/chats")
        .send({ users: [testUser1._id, testUser2._id] })
        .expect(401);
    });
    it("should return 500 if an internal server error occurs", async () => {
      const response = await request(app)
        .post("/chats")
        .set(authHeader())
        .send({ users: [123, 123] })
        .expect(500);

      expect(response.body).toHaveProperty("error", "Internal server error");
    });
  });

  describe("GET /chats/:chatId/messages", () => {
    it("should return all messages for a chat", async () => {
      const response = await request(app)
        .get(`/chats/${chat._id}/messages`)
        .set(authHeader())
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });

    it("should return 404 if the chat does not exist", async () => {
      const nonExistentId = "000000000000000000000000";
      await request(app)
        .get(`/chats/${nonExistentId}/messages`)
        .set(authHeader())
        .expect(404);
    });

    it("should return 401 if no token is provided", async () => {
      await request(app).get(`/chats/${chat._id}/messages`).expect(401);
    });
  });
});
