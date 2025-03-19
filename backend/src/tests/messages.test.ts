import request from "supertest";
import { Message, messageModel } from "../messages/model";
import { userModel } from "../users/model";
import { Chat, chatModel } from "../chats/model";
import initApp from "../server";
import { Express } from "express";
import { User } from "./common";
import mongoose from "mongoose";

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

describe("Messages API", () => {
    let chat: Chat;
    let message: Message;

    const authHeader = () => ({ Authorization: `JWT ${testUser1.accessToken}` }); // Helper for Authorization header

    beforeAll(async () => {
        app = (await initApp()).app;

        // Clean up the database
        await userModel.deleteMany();
        await chatModel.deleteMany();
        await messageModel.deleteMany();

        // create testUser1
        await request(app).post("/auth/register").send(testUser1);
        const loginRes1 = await request(app).post("/auth/login").send(testUser1);
        testUser1.accessToken = loginRes1.body.accessToken;
        testUser1.refreshToken = loginRes1.body.refreshToken;
        console.log('-ooo---- ' + loginRes1.body._id)
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

        // Create a test message
        message = await messageModel.create({
            chat: chat._id,
            sender: testUser1._id,
            content: "Hello, this is a test message!",
        });
    });

    afterAll(async () => {
        // Clean up the database
        await messageModel.deleteMany({});
        await chatModel.deleteMany({});
        await userModel.deleteMany({});
    
        await mongoose.connection.close();
      });

    describe("GET /messages", () => {
        it("should return all messages", async () => {
            const response = await request(app)
                .get("/messages")
                .set(authHeader())
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty("_id");
            expect(response.body[0]).toHaveProperty("content");
            expect(response.body[0]).toHaveProperty("chat");
            expect(response.body[0]).toHaveProperty("sender");
        });

        it("should return 401 if no token is provided", async () => {
            await request(app).get("/messages").expect(401);
        });
    });

    describe("GET /messages/:id", () => {
        it("should return a message by ID", async () => {
            const response = await request(app)
                .get(`/messages/${message._id}`)
                .set(authHeader())
                .expect(200);

            expect(response.body).toHaveProperty("_id", message._id.toString());
            expect(response.body).toHaveProperty("content", message.content);
            expect(response.body).toHaveProperty("chat", chat._id.toString());
            expect(response.body).toHaveProperty("sender", testUser1._id.toString());
        });

        it("should return 404 if the message does not exist", async () => {
            const nonExistentId = "000000000000000000000000";
            await request(app)
                .get(`/messages/${nonExistentId}`)
                .set(authHeader())
                .expect(404);
        });

        it("should return 401 if no token is provided", async () => {
            await request(app).get(`/messages/${message._id}`).expect(401);
        });
    });

});