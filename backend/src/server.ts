import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import express, { Express } from "express";
import { usersRouter } from "./users/route";
import authRouter from "./auth/route";
import passport from "passport";
import "./auth/googleStrategy";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";
import { chatModel } from "./chats/model";
import { messageModel } from "./messages/model";

const app = express();
const corsOptions = {
  origin: "http://localhost:3001",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/users", usersRouter);
app.use("/auth", authRouter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/**/*route.ts"],
};
const specs = swaggerJSDoc(options);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
app.get("/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const initApp = () => {
  return new Promise<{ app: Express; server: http.Server }>(
    (resolve, reject) => {
      if (!process.env.DB_CONNECT) {
        reject("DB_CONNECT is not defined in .env file");
      } else {
        mongoose
          .connect(process.env.DB_CONNECT)
          .then(() => {
            const server = http.createServer(app);
            setupWebSocket(server);
            resolve({ app, server });
          })
          .catch((error) => {
            reject(error);
          });
      }
    }
  );
};

const setupWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ server });
  console.log("WebSocket server initialized.");

  wss.on("connection", async (ws, req) => {
    console.log("New WebSocket connection established.");

    ws.on("message", async (message) => {
      try {
        const { chatId, senderId, text } = JSON.parse(message.toString());

        if (!chatId || !senderId || !text) {
          ws.send(JSON.stringify({ error: "Invalid message format" }));
          return;
        }

        // Find or create the chat
        let chat = await chatModel.findById(chatId);
        if (!chat) {
          ws.send(JSON.stringify({ error: "Chat not found" }));
          return;
        }

        // Save the new message in DB
        const newMessage = new messageModel({ chatId, sender: senderId, text });
        await newMessage.save();

        // Update last message in chat
        chat.lastMessage = newMessage._id;
        await chat.save();

        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(JSON.stringify({ chatId, senderId, text }));
          }
        });

        console.log("Message saved and broadcasted.");
      } catch (error) {
        console.error("Error processing message:", error);
        ws.send(JSON.stringify({ error: "Server error" }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed.");
    });
  });
};

export default initApp;
