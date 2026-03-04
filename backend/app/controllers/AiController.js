import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const apiKeyRaw = process.env.GEMINI_API_KEY || "";
const apiKey = apiKeyRaw.trim().replace(/^"|"$/g, '');

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const MODELS = ["gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-pro-latest"];

const GenerateDescription = async (req, res) => {
    const { problem } = req.body;

    if (!problem) {
        return res.status(400).json({ err: "Problem statement is required" });
    }

    // Try Gemini First if API Key is available
    if (genAI) {
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
            }
        }
    }

    // Fallback to Pollinations AI (Free, No API Key needed)
    try {
        console.log("AI Attempting with Pollinations AI Fallback...");

        // Construct a more reliable prompt for Pollinations
        // Sometimes the params in GET cause 404 if not exactly right, let's use a clear prompt in path
        const promptForAI = `You are a professional maintenance assistant. The user has this problem: "${problem}". Provide a professional, technical service request description. No greetings. Max 50 words.`;

        // Simpler GET request to Pollinations
        const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(promptForAI)}`;

        const response = await axios.get(pollinationsUrl);

        if (response.data) {
            const text = response.data.trim();
            console.log("✅ Success with Pollinations AI");
            return res.status(200).json({ description: text });
        }
    } catch (fallbackErr) {
        console.error("❌ Fallback AI Failed:", fallbackErr.message);
    }

    res.status(500).json({
        err: "AI Service failure. All available models failed.",
        hint: "Please try again later or check your internet connection."
    });
};

export default { GenerateDescription };
