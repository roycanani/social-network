import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import fs from "fs";
import bodyParser from "body-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import express, { Express } from "express";
import { usersRouter } from "./users/route";
import { postsRouter } from "./posts/route";
import { commentsRouter } from "./comments/route";
import { aiRouter } from "./ai/route";
import authRouter from "./auth/route";
import passport from "passport";
import "./auth/googleStrategy";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";
import https from "https";
import { chatModel } from "./chats/model";
import { messageModel } from "./messages/model";
import { chatsRouter } from "./chats/route";
import { messagesRouter } from "./messages/route";

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:80",
    "http://localhost",
    "http://node119.cs.colman.ac.il",
    "http://node119.cs.colman.ac.il:4000",
    "http://node119.cs.colman.ac.il:80",
    "https://localhost:80",
    "https://localhost",
    "https://node119.cs.colman.ac.il",
    "https://node119.cs.colman.ac.il:4000",
    "https://node119.cs.colman.ac.il:80",
  ],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/auth", authRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messagesRouter);
app.use("/ai", aiRouter);
app.use(express.static("public"));

app.enable("trust proxy");

if (process.env.USE_HTTPS === "true") {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

const BASE_URL = process.env.BASE_URL || "https://localhost:4000";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: BASE_URL }],
  },
  apis: ["./src/**/*route.ts"],
};
const specs = swaggerJSDoc(options);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));
app.get("/openapi.json", (_req, res) => {
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
            console.log(process.env.USE_HTTPS);
            if (process.env.USE_HTTPS === "true") {
              console.log("Using HTTPS");
              const keyPath =
                process.env.SSL_KEY_PATH || "/certs/selfsigned.key";
              const certPath =
                process.env.SSL_CERT_PATH || "/certs/selfsigned.crt";
              const key = fs.readFileSync(keyPath);
              const cert = fs.readFileSync(certPath);
              const server = https.createServer({ key, cert }, app);
              setupWebSocket(server);
              resolve({ app, server });
            } else {
              const server = http.createServer(app);
              setupWebSocket(server);
              resolve({ app, server });
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    }
  );
};

const setupWebSocket = (server: http.Server | https.Server) => {
  const wss = new WebSocketServer({ server });
  console.log("WebSocket server initialized.");

  wss.on("connection", async (ws) => {
    console.log("New WebSocket connection established.");

    ws.on("message", async (message) => {
      try {
        const { type, chat, sender, content, users } = JSON.parse(
          message.toString()
        );

        if (type === "createChat") {
          if (!users || users.length === 0) {
            ws.send(JSON.stringify({ error: "Invalid participants format" }));
            return;
          }

          const newChat = new chatModel({ users });
          await newChat.save();

          wss.clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: "createChat",
                  users,
                  updatedAt: newChat.updatedAt,
                  _id: newChat._id,
                })
              );
            }
          });

          console.log("Chat created and broadcasted.");
        } else if (type === "sendMessage") {
          if (!chat || !sender || !content) {
            ws.send(JSON.stringify({ error: "Invalid message format" }));
            return;
          }

          const referencedChat = await chatModel.findById(chat);
          if (!referencedChat) {
            ws.send(JSON.stringify({ error: "Chat not found" }));
            return;
          }

          const newMessage = new messageModel({ chat, sender, content });
          await newMessage.save();

          referencedChat.lastMessage = newMessage._id.toString();
          await referencedChat.save();

          wss.clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: "updateChat",
                  _id: referencedChat._id,
                  users: referencedChat.users,
                  lastMessage: referencedChat.lastMessage,
                  updatedAt: referencedChat.updatedAt,
                })
              );
            }
          });

          wss.clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  type: "sendMessage",
                  _id: newMessage._id,
                  chat,
                  sender,
                  content,
                  createdAt: newMessage.createdAt,
                })
              );
            }
          });

          console.log("Message saved and broadcasted.");
        } else {
          ws.send(JSON.stringify({ error: "Unknown message type" }));
        }
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
