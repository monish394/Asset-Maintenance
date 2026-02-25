import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKeyRaw = process.env.GEMINI_API_KEY || "";
const apiKey = apiKeyRaw.trim().replace(/^"|"$/g, '');

const genAI = new GoogleGenerativeAI(apiKey);


const MODELS = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-pro-latest"];

const GenerateDescription = async (req, res) => {
    const { problem } = req.body;

    if (!problem) {
        return res.status(400).json({ err: "Problem statement is required" });
    }

    let lastError = null;


    for (const modelName of MODELS) {
        try {
            console.log(`AI Attempting with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = `You are a professional maintenance assistant. 
      The user says: "${problem}".
      Provide a clean, technical, and professional description for a service request.
      No greetings, just the description. Max 100 words.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();

            console.log(`✅ Success with ${modelName}`);
            return res.status(200).json({ description: text });
        } catch (err) {
            console.error(`❌ Failed with ${modelName}:`, err.message);
            lastError = err;

        }
    }


    res.status(500).json({
        err: "AI Service failure. All available models failed.",
        details: lastError?.message,
        hint: "Please check if your API key is valid and 'Generative Language API' is enabled in Google Cloud Console."
    });
};

export default { GenerateDescription };
