import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^"|"$/g, '');

async function listModelsDetailed() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await axios.get(url);
        const names = response.data.models.map(m => m.name).join("\n");
        fs.writeFileSync("model_names_only.txt", names);
        console.log("Done writing names");
    } catch (err) {
        fs.writeFileSync("model_names_only.txt", "Error: " + JSON.stringify(err.response?.data || err.message));
    }
}

listModelsDetailed();
