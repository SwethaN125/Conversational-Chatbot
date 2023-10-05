const express = require("express");
const path = require("path");
const ejs = require("ejs");
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const app = express();
const PORT =  3000;
require('dotenv').config();
let api_key = process.env.API_KEY;
const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "AIzaSyDbV6BwwPD6IUTPFj9Nmc1VQbukjtWYs5c"; // Replace with your actual API key

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

let messages = [];

async function generateResponse(messages) {
  const result = await client.generateMessage({
    model: MODEL_NAME,
    prompt: { messages },
  });

  return result[0].candidates[0].content;
}

app.get("/api/chat", async (req, res) => {
  const userInput = req.query.message;

  if (userInput.toLowerCase() === "exit") {
    res.json({ response: "Chatbot: Goodbye!" });
    return;
  }

  messages.push({ content: userInput });

  const response = await generateResponse(messages);
  messages.push({ content: response });

  res.json({ response: response });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
