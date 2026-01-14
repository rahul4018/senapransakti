"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAI = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
const chatWithAI = async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    // Get live data from DB
    const allSoldiers = await db_1.db.select().from(schema_1.soldiers);
    const allAlerts = await db_1.db.select().from(schema_1.alerts);
    // Build context for AI
    const context = `
You are an AI assistant for a military health monitoring system.

Soldiers:
${JSON.stringify(allSoldiers, null, 2)}

Alerts:
${JSON.stringify(allAlerts, null, 2)}

Answer user questions clearly and professionally based only on this data.
`;
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: context },
                { role: "user", content: message },
            ],
        });
        const reply = completion.choices[0].message.content;
        res.json({ reply });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI failed to respond" });
    }
};
exports.chatWithAI = chatWithAI;
