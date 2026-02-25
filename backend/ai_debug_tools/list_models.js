import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listAllModels() {
    try {
        const response = await axios.get(url);
        console.log("AVAILABLE MODELS:");
        response.data.models.forEach(m => console.log(`- ${m.name}`));
    } catch (err) {
        console.log("❌ Failed to list models:", err.response?.data || err.message);
    }
}

listAllModels();
