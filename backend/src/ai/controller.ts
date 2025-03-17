import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCEdXTZTbKyc86WYyNqGbXLP77cjkw679w");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContent = async (req: Request, res: Response) => {
  const { postTitle } = req.body;

  const promt = `I'm sending you a json with a text field, which is the tile of a post on a social network, please create a content description from the title, and respond with a json with a text field {text: "${postTitle}"}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: promt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const textToReturn = JSON.parse(result.response.text()).text;

  res.send(textToReturn);
};
