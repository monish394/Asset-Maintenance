import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

async function testFetch() {
    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "hi" }] }]
        });
        console.log("✅ Direct Fetch Works!", response.data.candidates[0].content.parts[0].text);
    } catch (err) {
        console.log("❌ Direct Fetch Failed:", err.response?.data || err.message);
    }
}

testFetch();
