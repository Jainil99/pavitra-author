const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Quote = mongoose.model("Quote");

const adminAuth = require("../middleware/adminAuth");
const protectAdmin = adminAuth();

// GET all quotes (latest first)
router.get("/random", async (req, res) => {
    try {
      const count = await Quote.countDocuments({ text: { $ne: "" } });
      if (!count) return res.json({ text: null });
  
      const random = Math.floor(Math.random() * count);
      const quote = await Quote.findOne({ text: { $ne: "" } })
        .skip(random)
        .select("text");
  
      res.json({ text: quote.text });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });  

// GET a random quote
router.get("/random", async (req, res) => {
    try {
      const count = await Quote.countDocuments({ text: { $nin: ["", null] } });
  
      if (!count) return res.json({ text: null });
  
      const random = Math.floor(Math.random() * count);
  
      const quote = await Quote.findOne({ text: { $nin: ["", null] } })
        .skip(random);
  
      res.json({ text: quote?.text || null });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });  

// POST a new quote
router.post("/", protectAdmin, async (req, res) => {
    try {
      const text = String(req.body.text || "").trim();
      if (!text) return res.status(400).json({ message: "Quote text is required" });
  
      const newQuote = await Quote.create({ text });
      return res.status(201).json(newQuote);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  });  

module.exports = router;
