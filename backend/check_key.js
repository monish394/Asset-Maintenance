import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function test() {
    try {
        const apiKey = (process.env.GEMINI_API_KEY || "").replace(/^"|"$/g, '');
        console.log("Checking api key with length: " + apiKey.length);
        const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
        const j = await r.json();
        const names = j.models ? j.models.map(m => m.name) : j;
        fs.writeFileSync('k.json', JSON.stringify(names, null, 2));
        console.log("Wrote to k.json");
    } catch (e) {
        console.log("ERR: " + e.message);
    }
}
test();
