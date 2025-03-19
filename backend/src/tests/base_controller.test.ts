import request from "supertest";
import express, { Express } from "express";
import { Model } from "mongoose";
import BaseController from "../common/base_controller";

const mockModel = {
  find: jest.fn(),
} as unknown as Model<unknown>;

const app: Express = express();
app.use(express.json());

const baseController = new BaseController(mockModel);
app.get("/test", (req, res) => baseController.getAll(req, res));

describe("BaseController - getAll", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return all items successfully", async () => {
    const mockItems = [{ name: "Item1" }, { name: "Item2" }];
    jest.spyOn(mockModel, "find").mockResolvedValueOnce(mockItems);

    const response = await request(app).get("/test");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockItems);
    expect(mockModel.find).toHaveBeenCalledTimes(1);
  });

  test("should return 500 with database connection error", async () => {
    const error = new Error("Database connection error");
    error.name = "MongoServerSelectionError";
    jest.spyOn(mockModel, "find").mockRejectedValueOnce(error);

    const response = await request(app).get("/test");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Internal Server Error",
      details: "Database connection error",
    });
    expect(mockModel.find).toHaveBeenCalledTimes(1);
  });

  test("should return 404 when no items are found", async () => {
    jest.spyOn(mockModel, "find").mockResolvedValueOnce([]);

    const response = await request(app).get("/test");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(mockModel.find).toHaveBeenCalledTimes(1);
  });

  test("should handle invalid query parameters gracefully", async () => {
    jest.spyOn(mockModel, "find").mockImplementationOnce(() => {
      throw new Error("Invalid query parameters");
    });

    const response = await request(app).get("/test?invalidParam=value");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Internal Server Error",
      details: "Invalid query parameters",
    });
    expect(mockModel.find).toHaveBeenCalledTimes(1);
  });

  test("should handle large datasets gracefully", async () => {
    const mockItems = Array.from({ length: 1000 }, (_, i) => ({
      name: `Item${i + 1}`,
    }));
    jest.spyOn(mockModel, "find").mockResolvedValueOnce(mockItems);

    const response = await request(app).get("/test");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1000);
    expect(mockModel.find).toHaveBeenCalledTimes(1);
  });

  test("should return 500 when model.find throws a non-error object", async () => {
    jest.spyOn(mockModel, "find").mockRejectedValueOnce("Non-error object");

    const response = await request(app).get("/test");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Internal Server Error",
    });
    expect(mockModel.find).toHaveBeenCalledTimes(1);
  });
});
