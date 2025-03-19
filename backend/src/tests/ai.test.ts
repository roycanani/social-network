import request from "supertest";
import express, { Express } from "express";
import aiRouter from "../ai/route"; // Import the ai router

jest.mock("@google/generative-ai", () => {
  const mockGenerateContent = jest.fn(); // Define the mock function inside the mock
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: mockGenerateContent, // Use the mock function here
      }),
    })),
  };
});

const { GoogleGenerativeAI } = require("@google/generative-ai");
const mockGenerateContent =
  GoogleGenerativeAI().getGenerativeModel().generateContent;

let app: Express;

beforeAll(() => {
  app = express();
  app.use(express.json()); // Middleware to parse JSON
  app.use("/ai", aiRouter); // Mount the ai router
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("generateContent Tests", () => {
  test("Success - Generate content", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({ text: "Generated content description" }),
      },
    });

    const response = await request(app)
      .post("/ai/generate-content")
      .send({ postTitle: "Sample Post Title" });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Generated content description");
  });

  test("Fail - Missing postTitle in request body", async () => {
    const response = await request(app).post("/ai/generate-content").send({});

    expect(response.statusCode).toBe(400); // Assuming the controller handles missing fields with a 400 status
    expect(response.body.error).toBe("postTitle is required");
  });

  test("Fail - Error in generateContent method", async () => {
    mockGenerateContent.mockRejectedValue(new Error("AI Service Error"));

    const response = await request(app)
      .post("/ai/generate-content")
      .send({ postTitle: "Sample Post Title" });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("Failed to generate content");
  });
});
