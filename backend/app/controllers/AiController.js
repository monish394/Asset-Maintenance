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

    if (!problem || !problem.trim()) {
        return res.status(400).json({ err: "Problem statement is required" });
    }

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
                    return res.status(200).json({ description: text });
                }
            } catch (err) {
                console.warn(`Gemini ${modelName} failed:`, err.message);
            }
        }
    }

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
                    return res.status(200).json({ description: text });
                }
            }
        } catch (err) {
            console.warn("Bytez GPT-4o failed:", err.message);
        }
    }

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
                    return res.status(200).json({ description: text });
                }
            }
        } catch (e) {
            console.warn(`Pollinations attempt ${attempt} failed:`, e.message);
            if (e.response?.status === 429 && attempt < 3) {
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    const p = problem.toLowerCase();
    let fallback;

    if (p.includes("ac") || p.includes("air con") || p.includes("hvac") || p.includes("cool") || p.includes("heat")) {
        fallback = "HVAC unit is not maintaining the set temperature. Airflow appears restricted and cooling performance has degraded. Technician inspection of filters, refrigerant levels, and compressor required.";
    } else if (p.includes("leak") || p.includes("water") || p.includes("pipe") || p.includes("drain")) {
        fallback = "Water leak detected from plumbing fixture. Surrounding area at risk of water damage. Immediate inspection and repair of affected pipe or fitting required.";
    } else if (p.includes("electric") || p.includes("power") || p.includes("wire") || p.includes("short") || p.includes("spark")) {
        fallback = "Electrical fault reported with intermittent power supply. Potential wiring issue or short circuit detected. Qualified electrician must inspect and repair before further use.";
    } else if (p.includes("print") || p.includes("scanner") || p.includes("copier")) {
        fallback = "Printer is experiencing a paper jam and failing to complete print jobs. Internal feed rollers appear worn. Technician required to clear jam and inspect roller mechanism.";
    } else if (p.includes("laptop") || p.includes("computer") || p.includes("screen") || p.includes("monitor")) {
        fallback = "Display unit showing flickering and intermittent shutdowns. Hardware fault suspected in GPU or display cable. Device requires diagnostic inspection and component replacement.";
    } else if (p.includes("lift") || p.includes("elevator")) {
        fallback = "Elevator is not stopping accurately at floor levels. Door sensors and motor calibration appear to be faulty. Immediate inspection by certified lift technician required.";
    } else {
        fallback = "Equipment fault reported. Asset is not functioning as expected and requires a technician assessment. Please assign a qualified engineer to inspect and resolve the issue promptly.";
    }

    return res.status(200).json({ description: fallback });
};

export default { GenerateDescription };
