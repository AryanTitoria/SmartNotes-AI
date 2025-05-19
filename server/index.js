const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");  // Import OpenAI SDK

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: "YOUR_OPENAI_API_KEY", // Replace with your OpenAI API key
});
const openai = new OpenAIApi(configuration);

// Endpoint to check if the backend is live
app.get("/", (req, res) => {
  res.send("Backend is live!");
});

// Endpoint to summarize text
app.post("/summarize", async (req, res) => {
  const { text } = req.body;  // Get the transcribed text from the frontend

  try {
    // Use GPT-3 to summarize the provided text
    const completion = await openai.createCompletion({
      model: "text-davinci-003",  // You can also use other models
      prompt: `Summarize the following text: ${text}`,
      max_tokens: 150,
    });

    // Send the summary back to the frontend
    res.json({ summary: completion.data.choices[0].text.trim() });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error generating summary");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
