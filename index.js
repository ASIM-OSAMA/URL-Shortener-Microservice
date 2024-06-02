const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/url-shortener", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define the URL model
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true, unique: true },
  shortUrl: { type: String, required: true, unique: true },
});

const Url = mongoose.model("Url", urlSchema);

// Create a new short URL
app.post("/new/*", async (req, res) => {
  const originalUrl = req.body.url;
  const shortUrl = req.originalUrl.replace("/new/", "");

  try {
    // Check if the URL already exists
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      return res.json({
        original_url: existingUrl.originalUrl,
        short_url: existingUrl.shortUrl,
      });
    }

    // Create a new URL document
    const newUrl = new Url({
      originalUrl,
      shortUrl,
    });
    await newUrl.save();

    res.json({ original_url: originalUrl, short_url: shortUrl });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Redirect to the original URL
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;

  try {
    const url = await Url.findOne({ shortUrl });
    if (url) {
      return res.redirect(url.originalUrl);
    }

    res.status(404).json({ error: "URL not found" });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});
