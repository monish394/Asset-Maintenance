import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^"|"$/g, '');
const genAI = new GoogleGenerativeAI(apiKey);

import fs from 'fs';

async function test(m) {
    try {
        const res = await genAI.getGenerativeModel({ model: m }).generateContent("hello");
        fs.appendFileSync('gemini_test_out.txt', `[PASS] ${m}\n`);
    } catch (e) {
        fs.appendFileSync('gemini_test_out.txt', `[FAIL] ${m}: ${e.message.split('\n')[0].substring(0, 50)}\n`);
    }
}
async function start() {
    fs.writeFileSync('gemini_test_out.txt', 'START\n');
    await test("gemini-1.5-flash");
    await test("gemini-1.5-pro");
    await test("gemini-1.5-flash-latest");
    await test("gemini-2.0-flash");
    await test("gemini-1.0-pro");
}
start();
