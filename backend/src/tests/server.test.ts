import mongoose from "mongoose";
import initApp from "../server";
import { Express } from "express";

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
    app = await initApp();
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
});
