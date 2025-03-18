import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
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

const app = express();
// Or, enable CORS for specific origins
const corsOptions = {
  origin: [
    "http://localhost:80",
    "http://localhost",
    "http://node119.cs.colman.ac.il",
    "http://node119.cs.colman.ac.il:80",
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
app.use("/ai", aiRouter);
app.use(express.static("public"));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description:
        "REST server including authentication using JWT by Roy Canani & Urir Shiber",
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
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;
