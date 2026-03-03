const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY environment variable not set.");
}

app.post("/chat", async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "API key not configured on server." });
  }

  try {
    const { messages, system } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "mcp-client-2025-04-04",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        system,
        messages,
        mcp_servers: [
          {
            type: "url",
            url: "https://mcp.box.com",
            name: "box-mcp",
            authorization_token: process.env.BOX_ACCESS_TOKEN,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Anthropic API error" });
    }

    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    res.json({ reply: text || "No response from hub." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy server error." });
  }
});

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "fleet-hub-chat.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Fleet proxy running on port ${PORT}`));
