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
    const prompt = `Analyze the following tenant complaint and generate the following:
      1. A concise summary based on the Complaint Category and Additional Details.
      2. A priority level (Low, Medium, High) based on the urgency of the complaint.
      
    Complaint Category: ${selectedCategory}
    Additional Details: ${extraDetails || "No extra details provided."}
    
    Provide the output in this format:
    Summary: [summary]
    Priority: [Low | Medium | High]`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text().trim();
    //Fix: Curentyl logging 2 priorities
    console.log("AI Raw Response:", aiResponse);

    // Extract the summary and priority from the AI response
    const regex = /Summary:\s*(.*?)[\s\S]*?Priority:\s*(Low|Medium|High)/;
    const match = aiResponse.match(regex);
    if (match) {
      const summary = match[1]; // Extracted summary from AI
      const priority = match[2] as "Low" | "Medium" | "High"; // Extracted priority from AI

      // Return the complaint object with summary and priority
      const complaint = {
        summary: summary,
        priority: priority,
      };

      return complaint;
    } else {
      throw new Error("AI response did not match expected format");
    }
  } catch (error) {
    console.error(error);
  }
};
