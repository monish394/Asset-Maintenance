import { GoogleGenerativeAI } from "@google/generative-ai";
import Bytez from "bytez.js";
import axios from "axios";

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-pro"];

const SYSTEM_INSTRUCTION = `You are an expert AI Maintenance Assistant for an asset maintenance platform.
Your job is to help users describe their equipment/asset issues clearly and professionally.

When a user describes a problem (e.g. "AC not cooling", "laptop screen flickering", "printer jamming"):
- Generate a concise, professional 1-3 sentence fault report suitable for a maintenance ticket.
- Identify the fault clearly, mention the symptom, and state the recommended action (inspect / repair / replace).
- Do NOT echo back the user's words verbatim inside quotes.
- Do NOT add greetings or sign-offs.
- Write in plain text only — no markdown, no bullet points.

When a user asks you to generate a sample issue (e.g. "give me an AC issue", "write a printer fault"):
- Understand they want an EXAMPLE fault description.
- Generate a realistic, professional example fault report for that equipment type.
- Do NOT treat their meta-instruction as the actual problem.

Always write as if filling in a formal maintenance service request.`;

const GenerateDescription = async (req, res) => {
    const { problem } = req.body;

    console.log("\n🤖 [AI Chatbot Request]", { problem, user: req.userid, time: new Date().toLocaleTimeString() });

    if (!problem || !problem.trim()) {
        console.warn("⚠️  Empty problem statement rejected");
        return res.status(400).json({ err: "Problem statement is required" });
    }

    // ── 1. Gemini ──────────────────────────────────────────────────────────
    const apiKeyRaw = (process.env.GEMINI_API_KEY || "").trim().replace(/^"|"$/g, "");

    if (apiKeyRaw) {
        const genAI = new GoogleGenerativeAI(apiKeyRaw);

        for (const modelName of GEMINI_MODELS) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: SYSTEM_INSTRUCTION
                });

                const result = await model.generateContent(problem.trim());
                const response = await result.response;
                const text = response.text().trim();

                if (text) {
                    console.log(`✅ Gemini (${modelName}) success:`, text.substring(0, 60) + "...");
                    return res.status(200).json({ description: text });
                }
            } catch (err) {
                console.error(`❌ Gemini ${modelName} Error:`, err.message);
            }
        }
    } else {
        console.warn("ℹ️ Skipping Gemini: No GEMINI_API_KEY found in environment");
    }

    // ── 2. Bytez GPT-4o ───────────────────────────────────────────────────
    const bytezKey = (process.env.BYTEZ_API_KEY || "").trim().replace(/^"|"$/g, "");

    if (bytezKey) {
        try {
            const sdk = new Bytez(bytezKey);
            const model = sdk.model("openai/gpt-4o");

            const { error, output } = await model.run([
                { role: "system", content: SYSTEM_INSTRUCTION },
                { role: "user",   content: problem.trim() }
            ]);

            if (!error && output) {
                const text = (
                    typeof output === "string"
                        ? output
                        : output?.choices?.[0]?.message?.content
                        || output?.content
                        || output?.text
                        || JSON.stringify(output)
                ).trim();

                if (text) {
                    console.log("✅ Bytez GPT-4o success:", text.substring(0, 60) + "...");
                    return res.status(200).json({ description: text });
                }
            } else if (error) {
                console.error("❌ Bytez Error object:", error);
            }
        } catch (err) {
            console.error("❌ Bytez SDK Exception:", err.message);
        }
    } else {
        console.warn("ℹ️ Skipping Bytez: No BYTEZ_API_KEY found in environment");
    }

    // ── 3. Pollinations (free, no key needed) ─────────────────────────────
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const polRes = await axios.post(
                "https://text.pollinations.ai/",
                {
                    messages: [
                        { role: "system", content: SYSTEM_INSTRUCTION },
                        { role: "user", content: problem.trim() }
                    ],
                    model: "openai"
                },
                { timeout: 15000 }
            );

            if (polRes.data) {
                const text = (typeof polRes.data === "string" ? polRes.data : JSON.stringify(polRes.data)).trim();
                if (text) {
                    console.log("✅ Pollinations success");
                    return res.status(200).json({ description: text });
                }
            }
        } catch (e) {
            console.error(`❌ Pollinations attempt ${attempt} Error:`, e.message);
            if (e.response?.status === 429 && attempt < 3) {
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    // ── All providers failed ───────────────────────────────────────────────
    console.error("🚨 All AI providers failed. No response generated.");
    return res.status(503).json({
        err: "AI service is currently unavailable. Please try again in a moment."
    });
};

export default { GenerateDescription };
