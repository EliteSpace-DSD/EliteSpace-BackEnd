import { GoogleGenerativeAI } from "@google/generative-ai";

import "dotenv/config";

type Complaints = {
  id: string;
  tenantId: string | null;
  issueType: string;
  complaintCategory: string;
  complaintTitle: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  resolvedAt: string | null | Date;
  updatedAt: string | Date;
  createdAt: string | Date;
};

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const runGemini = async (extraDetails: string) => {
  try {
    //Take in the complaint, image, and extra details
    const prompt = `Analyze the following complaint and assign a priority level (Low, Medium, High): ${extraDetails}. Response should be just one word: Low, Medium, or High.`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text().trim();
    const validPriorities = ["Low", "Medium", "High"];
    return validPriorities.includes(aiResponse) ? aiResponse : "Medium";
  } catch (error) {
    console.error(error);
    return "High";
  }
};
export const runEscalateComplaints = async (complaints: any): Promise<any> => {
  try {
    const prompt = `
      Analyze the following array of complaints:
      1. Count how many complaints belong to each "complaintCategory".
      2. If any category has 3 or more complaints, update their "priority" to "High".
      3. Sort the final array by priority in the order: "High", "Medium", "Low".
      4. Return ONLY the updated array in valid JSON, do not wrap the JSON code in JSON markers.

      Complaints: ${JSON.stringify(complaints)}
    `;
    const result = await model.generateContent(prompt);
    let aiResponse = result.response.text().trim();
    aiResponse = aiResponse.replace(/```json|```/g, "").trim(); // Remove markdown formatting if present

    const updatedComplaints = JSON.parse(aiResponse);
    return updatedComplaints;
  } catch (error) {
    console.error("Error processing complaints:", error);
  }
};
