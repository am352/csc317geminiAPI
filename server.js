import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.post("/ask", async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini API raw response:", JSON.stringify(data, null, 2));

    let text = "No response from Gemini.";
    if (data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content.parts;
      if (parts && parts.length > 0) {
        text = parts.map((p) => p.text).join("\n");
      }
    } else if (data.error) {
      text = `Gemini Error: ${data.error.message}`;
    }

    res.json({ text });
  } catch (err) {
    console.error("Error while contacting Gemini API:", err);
    res.status(500).json({ error: "Server error contacting Gemini API." });
  }
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
