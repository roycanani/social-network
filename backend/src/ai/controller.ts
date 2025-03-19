import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.AI_TOKEN!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContent = async (req: Request, res: Response) => {
  if (!req.body.postTitle) {
    res.status(400).send({ error: "postTitle is required" });
    return;
  }
  const { postTitle } = req.body;

  const prompt = `I'm sending you a JSON containing a \`title\` field, which represents the title of a social media post about pets. The title is: "${postTitle}".  
Please generate a compelling and engaging content description based on this title. Respond with a JSON containing a \`text\` field in the following format:
{
  "text": "<generated description>"
}
Ensure the description is engaging, pet-friendly, and suited for social media.`;
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const textToReturn = JSON.parse(result.response.text()).text;

    res.send(textToReturn);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to generate content" });
  }
};
