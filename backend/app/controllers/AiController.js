import Bytez from "bytez.js";

// NOTE: All env vars are read inside the handler (not at module level)
// because ES Module imports are hoisted before dotenv.config() runs in index.js.

const PROMPT_TEMPLATE = (problem) =>
    `You are a maintenance service desk assistant writing a formal fault ticket.
Summarize this issue in EXACTLY ONE sentence of around 20 words.
State the fault clearly and end with the action required (inspect / repair / replace).
No greetings. No explanation. No markdown. Plain text only.
Issue: "${problem}"`;


// Keyword-based local fallback — always works with zero dependencies
const localFallback = (problem) => {
    const p = problem.toLowerCase();
    if (p.includes("leak") || p.includes("water"))
        return `Water leak reported: "${problem}". Immediate inspection of plumbing/fixtures required to prevent water damage.`;
    if (p.includes("broken") || p.includes("crack") || p.includes("damage"))
        return `Component failure reported: "${problem}". Requires assessment and repair or replacement of the affected parts.`;
    if (p.includes("noise") || p.includes("sound") || p.includes("vibrat"))
        return `Unusual noise/vibration reported: "${problem}". Mechanical inspection and potential lubrication or part adjustment needed.`;
    if (p.includes("wire") || p.includes("power") || p.includes("electric") || p.includes("light") || p.includes("switch"))
        return `Electrical issue reported: "${problem}". Requires a qualified electrician to inspect wiring and power supply.`;
    if (p.includes("heat") || p.includes("cold") || p.includes("ac") || p.includes("air") || p.includes("hvac"))
        return `HVAC issue reported: "${problem}". System requires inspection of heating/cooling elements and airflow.`;
    return `Service request logged for: "${problem}". Please assign a technician to evaluate and resolve the issue promptly.`;
};

const GenerateDescription = async (req, res) => {
    const { problem } = req.body;

    if (!problem || !problem.trim()) {
        return res.status(400).json({ err: "Problem statement is required" });
    }

    // Read keys at request time so dotenv.config() has already executed
    const bytezKey = (process.env.BYTEZ_API_KEY || "").trim().replace(/^"|"$/g, "");

    // ── 1. Try Bytez (GPT-4o) ──────────────────────────────────────────────
    if (bytezKey) {
        try {
            console.log("🤖 Attempting Bytez GPT-4o...");
            const sdk = new Bytez(bytezKey);
            const model = sdk.model("openai/gpt-4o");

            const { error, output } = await model.run([
                {
                    role: "system",
                    content: "You are a maintenance service desk assistant. Write formal fault tickets. Always respond with ONE sentence of exactly ~20 words stating the fault and action required. No greetings. No markdown. Plain text only."
                },
                {
                    role: "user",
                    content: PROMPT_TEMPLATE(problem)
                }
            ]);

            if (!error && output) {
                // output may be a string or an object with a text/content field
                const text = (typeof output === "string"
                    ? output
                    : output?.choices?.[0]?.message?.content
                    || output?.content
                    || output?.text
                    || JSON.stringify(output)
                ).trim();

                if (text) {
                    console.log("✅ Bytez GPT-4o success");
                    return res.status(200).json({ description: text });
                }
            } else if (error) {
                console.error("❌ Bytez GPT-4o error:", error);
            }
        } catch (err) {
            console.error("❌ Bytez GPT-4o exception:", err.message);
        }
    } else {
        console.warn("⚠️  BYTEZ_API_KEY not set — skipping Bytez");
    }

    // ── 2. Local keyword-based fallback (always works) ─────────────────────
    console.log("🤖 Using local keyword fallback...");
    return res.status(200).json({ description: localFallback(problem) });
};

export default { GenerateDescription };
