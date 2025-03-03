import "dotenv/config"; // Instead of require("dotenv").config();
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 100, // Limit the response size
    });

    res.json({ reply: openaiResponse.choices[0].message.content });
  } catch (error) {
    console.error(
      "Backend Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error getting response" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
