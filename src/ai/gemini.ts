import { GoogleGenerativeAI } from "@google/generative-ai";

import "dotenv/config";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const prompt: string = "create a short poem";

export const runGemini = async (
  extraDetails: string,
  selectedCategory: string
) => {
  try {
    //Take in the complaint, image, and extra details
    const prompt = `Analyze the following complaint and assign a priority level (low, medium, high): ${selectedCategory} and ${extraDetails}. Response should be just one word: Low, Medium, or High.`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text().trim();
    console.log(aiResponse);
    const validPriorities = ["Low", "Medium", "High"];
    const complaint = {
      priority: validPriorities.includes(aiResponse) ? aiResponse : "Medium";

    };
    return complaint;
  } catch (error) {
    console.error(error);
  }
};
