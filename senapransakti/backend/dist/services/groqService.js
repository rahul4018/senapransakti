"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groqChat = groqChat;
const node_fetch_1 = __importDefault(require("node-fetch"));
async function groqChat(prompt) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY missing in .env");
    }
    const response = await (0, node_fetch_1.default)("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama3-70b-8192",
            messages: [
                {
                    role: "system",
                    content: "You are a professional military medical AI assistant.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.4,
        }),
    });
    const data = (await response.json());
    return data.choices?.[0]?.message?.content || "No AI response";
}
