"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGemini = void 0;
const generative_ai_1 = require("@google/generative-ai");
require("dotenv/config");
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const prompt: string = "create a short poem";
const runGemini = (extraDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Take in the complaint, image, and extra details
        const prompt = `Analyze the following complaint and assign a priority level (Low, Medium, High): ${extraDetails}. Response should be just one word: Low, Medium, or High.`;
        const result = yield model.generateContent(prompt);
        const aiResponse = result.response.text().trim();
        console.log(aiResponse);
        const validPriorities = ["Low", "Medium", "High"];
        return validPriorities.includes(aiResponse) ? aiResponse : "Medium";
    }
    catch (error) {
        console.error(error);
    }
});
exports.runGemini = runGemini;
