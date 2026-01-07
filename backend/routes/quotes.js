const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Quote = mongoose.model("Quote");

const adminAuth = require("../middleware/adminAuth");
const protectAdmin = adminAuth();

// GET all quotes (latest first)
router.get("/", async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a random quote
router.get("/random", async (req, res) => {
  try {
    const count = await Quote.countDocuments();
    if (count === 0) return res.json({ text: "" });

    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(random);

    res.json(quote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new quote
router.post("/",protectAdmin, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Quote text is required." });
    }

    const newQuote = await Quote.create({ text: text.trim() });
    res.status(201).json(newQuote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
