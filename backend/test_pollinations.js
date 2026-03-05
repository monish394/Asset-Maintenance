import axios from 'axios';

async function test() {
    console.log("Testing POST...");
    try {
        const start = Date.now();
        const res = await axios.post('https://text.pollinations.ai/', {
            messages: [{ role: 'user', content: 'Analyze: Paper jam at duplexer. Reply ONLY with JSON: {"response":"1-2 sentence advice","category":"Electrical|Plumbing|Mechanical|Software|General","priority":"low|medium|high","requestType":"repair|maintenance"}' }],
            model: 'openai',
            jsonMode: true
        });
        console.log(`Success in ${Date.now() - start}ms`, res.data);
    } catch (e) {
        console.error("POST failed:", e.message);
    }
}

test();
