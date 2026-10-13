const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "12mb" }));
app.use(express.static(path.join(__dirname, "public")));

function configured(res) {
  return res.status(501).json({
    error: "AI generation provider is not configured yet.",
    message: "Connect a provider in server.js and set its API key as a server environment variable. Never put secret API keys in browser JavaScript."
  });
}

// These routes intentionally fail clearly until you connect a real image/video provider.
// Provider APIs and model input schemas vary. See README.md for setup guidance.
app.post("/api/generate-image", (req, res) => {
  const { image, style, prompt } = req.body || {};
  if (!image) return res.status(400).json({ error: "Please upload a photo first." });
  if (!style) return res.status(400).json({ error: "Please choose a style." });
  return configured(res);
});

app.post("/api/generate-video", (req, res) => {
  const { image, style, prompt } = req.body || {};
  if (!image) return res.status(400).json({ error: "Please upload a photo first." });
  if (!style) return res.status(400).json({ error: "Please choose a style." });
  return configured(res);
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`AI Couple website running at http://localhost:${PORT}`));
