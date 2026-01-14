import { Request, Response } from "express";
import Groq from "groq-sdk";
import { db } from "../db";
import { soldiers, healthRecords, alerts } from "../db/schema";
import { desc, eq } from "drizzle-orm";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const chatWithAI = async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Get live data from DB
  const allSoldiers = await db.select().from(soldiers);
  const allAlerts = await db.select().from(alerts);

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed to respond" });
  }
};
