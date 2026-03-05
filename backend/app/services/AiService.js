import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AiService = {};

AiService.getAiDiagnosis = async (description, type = "repair") => {
    console.log(`AI Attempting diagnosis for: "${description.substring(0, 40)}..."`);
    const p = description.toLowerCase();

    // 1. Determine category, priority, and requestType locally
    let category = "General";
    let priority = "medium";
    let requestType = type || "repair";

    if (p.includes("power") || p.includes("shock") || p.includes("spark") || p.includes("electric") || p.includes("wire") || p.includes("short")) {
        category = "Electrical"; priority = "high"; requestType = "repair";
    } else if (p.includes("water") || p.includes("leak") || p.includes("pipe") || p.includes("flood") || p.includes("drain") || p.includes("plumb")) {
        category = "Plumbing"; priority = "high"; requestType = "repair";
    } else if (p.includes("smoke") || p.includes("fire") || p.includes("burn") || p.includes("hot") || p.includes("overheat")) {
        category = "Emergency"; priority = "high"; requestType = "repair";
    } else if (p.includes("boot") || p.includes("start") || p.includes("crash") || p.includes("os") || p.includes("software") || p.includes("system")) {
        category = "Software"; priority = "high"; requestType = "repair";
    } else if (p.includes("screen") || p.includes("display") || p.includes("monitor") || p.includes("flicker") || p.includes("hdmi")) {
        category = "Electronics"; priority = "medium"; requestType = "repair";
    } else if (p.includes("print") || p.includes("scan") || p.includes("copier") || p.includes("ink") || p.includes("jam") || p.includes("paper")) {
        category = "Mechanical"; priority = "low"; requestType = "maintenance";
    } else if (p.includes("noise") || p.includes("sound") || p.includes("vibrat") || p.includes("rattl") || p.includes("grind") || p.includes("lock") || p.includes("key") || p.includes("door") || p.includes("engage") || p.includes("stuck")) {
        category = "Mechanical"; priority = "medium"; requestType = "repair";
    }

    // 2. Try Gemini First (Identical to AiController to ensure it definitely works for the User)
    const apiKeyRaw = process.env.GEMINI_API_KEY || "";
    const apiKey = apiKeyRaw.trim().replace(/^"|"$/g, '');
    const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
    const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-pro-latest"];

    if (genAI) {
        for (const modelName of MODELS) {
            try {
                console.log(`Asset AI trying Gemini model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const prompt = `You are a professional maintenance assistant. The user has this problem: "${description}". Provide a professional, technical service request description. No greetings. Max 50 words.`;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().trim();
                console.log(`✅ Success with ${modelName}`);
                return { response: text, category, priority, requestType };
            } catch (err) {
                console.warn(`❌ ${modelName} failed:`, err.message);
            }
        }
    }

    // 3. Fetch descriptive advice from Pollinations with multiple retry attempts incase of 429
    console.log("AI Attempting with Pollinations AI Fallback...");
    const promptForAI = `You are a professional maintenance assistant. The user has this problem: "${description}". Provide exactly 1 to 2 sentences of professional advice on how to handle this safely or wait for a technician. Do not include greetings. Max 50 words.`;

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            console.log(`Pollinations attempt ${attempt} ...`);
            const res = await axios.post('https://text.pollinations.ai/', {
                messages: [{ role: 'user', content: promptForAI }],
                model: 'openai'
            }, { timeout: 15000 });

            if (res.data) {
                const text = res.data.trim();
                console.log("✅ Success with Pollinations AI");
                return { response: text, category, priority, requestType };
            }
        } catch (e) {
            console.warn(`Pollinations attempt ${attempt} failed: ${e.message}`);
            // Wait a bit before retry if it's a 429
            if (e.response?.status === 429 && attempt < 3) {
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    // 4. Complete Fallback if all AI routes fail
    console.log("Using super-fast rule-based text fallback...");
    let fallbackText = "Issue identified. A technician will assess and proceed with standard maintenance.";
    if (priority === "high") fallbackText = "Critical issue detected. Please stand clear and wait for immediate technician assistance.";
    else if (category === "Mechanical" || category === "Electronics") fallbackText = "Hardware issue logged. Please do not force operation; a technician will arrive soon.";

    return { response: fallbackText, category, priority, requestType };
};

export default AiService;
