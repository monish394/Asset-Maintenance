import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const testAI = async () => {
    try {
        const res = await axios.post("http://localhost:3000/api/generate-description",
            { problem: "The sink in the laboratory is leaking from the bottom pipe. Water is pooling on the floor." },
            { headers: { Authorization: "REPLACE_WITH_VALID_TOKEN" } }
        );
        console.log("AI RESPONSE:", res.data);
    } catch (err) {
        console.error("TEST FAILED:", err.response?.data || err.message);
    }
};

testAI();
