import express from "express";
import Groq from "groq-sdk";
import { info } from "./info.js";
import cors from 'cors'
import 'dotenv/config';
// Initialize Groq client with your API key
const groq = new Groq({
  apiKey: process.env.api,
});

const app = express();
app.use(express.json());
app.use(cors());




// Create a chat completion function
const getGroqChatCompletion = async (userMessage) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: info, // Pass the system message to provide context
      },
      {
        role: "user",
        content: userMessage, // Pass the user message dynamically
      },
    ],
    model: "llama3-8b-8192", // Adjust model as needed
  });
};

// Define API route for chatbot
app.post("/chat", async (req, res) => {
  const { message } = req.body; // Get user message from request body

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const chatCompletion = await getGroqChatCompletion(message);
    const response = chatCompletion.choices[0]?.message?.content || "No information available.";
    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

// Start server on port 3000
app.listen(4000, () => {
  console.log("Chatbot API is running on http://localhost:4000");
});
