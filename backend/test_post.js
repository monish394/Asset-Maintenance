import axios from "axios";

async function testPost() {
    try {
        const p = "Analyze: 'The door lock is jammed'. Reply 1-2 sentences advice.";
        const res = await axios.post('https://text.pollinations.ai/', {
            messages: [{ role: 'user', content: p }],
            model: 'openai'
        }, { timeout: 15000 });
        console.log("POST Success:", res.data);
    } catch (e) {
        console.error("POST Failed:", e.message, e.response?.status);
    }
}
testPost();
