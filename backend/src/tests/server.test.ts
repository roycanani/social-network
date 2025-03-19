import mongoose from "mongoose";
import initApp from "../server";
import { Express } from "express";
import WebSocket from "ws";
import { Server } from "http";

let app: Express;

beforeAll(async () => {
  jest.setTimeout(30000); // Set timeout to 30 seconds for database connection
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Server Initialization Tests", () => {
  test("Successful initialization when DB_CONNECT is defined", async () => {
    process.env.DB_CONNECT = "mongodb://localhost:27017/testdb";
    app = (await initApp()).app;
    expect(app).toBeDefined();
  });

  test("Failure when DB_CONNECT is not defined", async () => {
    delete process.env.DB_CONNECT;
    await expect(initApp()).rejects.toEqual(
      "DB_CONNECT is not defined in .env file"
    );
  });

  test("Failure when there is a database connection error", async () => {
    process.env.DB_CONNECT = "invalid_connection_string";
    await expect(initApp()).rejects.toThrow();
  });

  test("App serves OpenAPI JSON", async () => {
    process.env.DB_CONNECT = "mongodb://localhost:27017/testdb";
    app = (await initApp()).app;
    const response = await (await import("supertest"))
      .default(app)
      .get("/openapi.json");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
  });

  test("App handles invalid routes with 404", async () => {
    process.env.DB_CONNECT = "mongodb://localhost:27017/testdb";
    app = (await initApp()).app;
    const response = await (await import("supertest"))
      .default(app)
      .get("/nonexistent-route");
    expect(response.status).toBe(404);
  });
  test("Successful initialization when DB_CONNECT is defined", async () => {
    process.env.DB_CONNECT = "mongodb://localhost:27017/testdb";
    app = (await initApp()).app;
    expect(app).toBeDefined();
  });

  test("Failure when DB_CONNECT is not defined", async () => {
    delete process.env.DB_CONNECT;
    await expect(initApp()).rejects.toEqual(
      "DB_CONNECT is not defined in .env file"
    );
  });

  test("Failure when there is a database connection error", async () => {
    process.env.DB_CONNECT = "invalid_connection_string";
    await expect(initApp()).rejects.toThrow();
  });
  test("App serves Swagger UI documentation", async () => {
    process.env.DB_CONNECT = "mongodb://localhost:27017/testdb";
    app = (await initApp()).app;
    const response = await (await import("supertest"))
      .default(app)
      .get("/docs");
    expect(response.status).toBe(301);
  });

  test("WebSocket server initializes successfully", async () => {
    process.env.DB_CONNECT = "mongodb://localhost:27017/testdb";
    const { server } = await initApp();
    expect(server).toBeDefined();
    server.close(); // Clean up the server after the test
  });

  test("App handles invalid JSON payload gracefully", async () => {
    process.env.DB_CONNECT = "mongodb://localhost:27017/testdb";
    app = (await initApp()).app;
    const response = await (
      await import("supertest")
    )
      .default(app)
      .post("/users") // Replace with an actual POST route
      .send("invalid-json")
      .set("Content-Type", "application/json");
    expect(response.status).toBe(400);
  });

  test("App handles missing required fields in POST request", async () => {
    process.env.DB_CONNECT = "mongodb://localhost:27017/testdb";
    app = (await initApp()).app;
    const response = await (
      await import("supertest")
    )
      .default(app)
      .post("/users") // Replace with an actual POST route
      .send({}) // Send an empty payload
      .set("Content-Type", "application/json");
    expect(response.status).toBe(400);
  });

  test("App handles CORS preflight requests", async () => {
    process.env.DB_CONNECT = "mongodb://localhost:27017/testdb";
    app = (await initApp()).app;
    const response = await (
      await import("supertest")
    )
      .default(app)
      .options("/docs") // Replace with an actual route
      .set("Origin", "http://localhost");
    expect(response.status).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost"
    );
  });
});
describe("WebSocket Server Tests", () => {
  let server: Server;
  let wsClient: WebSocket;

  beforeEach(async () => {
    process.env.DB_CONNECT = "mongodb://localhost:27017/testdb";
    const appInit = await initApp();
    server = appInit.server;
    server.listen(4001); // Start the server on a test port
  });

  afterEach((done) => {
    if (wsClient && wsClient.readyState === WebSocket.OPEN) {
      wsClient.close();
    }
    server.close(done);
  });

  test("WebSocket connection is established successfully", (done) => {
    wsClient = new WebSocket("ws://localhost:4001");

    wsClient.on("open", () => {
      expect(wsClient.readyState).toBe(WebSocket.OPEN);
      done();
    });

    wsClient.on("error", (err) => {
      done(err);
    });
  });

  test("WebSocket handles invalid message type gracefully", (done) => {
    wsClient = new WebSocket("ws://localhost:4001");

    wsClient.on("open", () => {
      wsClient.send(
        JSON.stringify({
          type: "invalidType",
        })
      );
    });

    wsClient.on("message", (data) => {
      const response = JSON.parse(data.toString());
      expect(response.error).toBe("Unknown message type");
      done();
    });

    wsClient.on("error", (err) => {
      done(err);
    });
  });

  test("WebSocket handles invalid JSON format gracefully", (done) => {
    wsClient = new WebSocket("ws://localhost:4001");

    wsClient.on("open", () => {
      wsClient.send("invalid-json");
    });

    wsClient.on("message", (data) => {
      const response = JSON.parse(data.toString());
      expect(response.error).toBe("Server error");
      done();
    });

    wsClient.on("error", (err) => {
      done(err);
    });
  });
});
