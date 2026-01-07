const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Thought = mongoose.model("Thought");

const adminAuth = require("../middleware/adminAuth");
const protectAdmin = adminAuth();

// GET all thoughts (public)
router.get("/", async (req, res) => {
    try {
      const thoughts = await Thought.find().sort({ createdAt: -1 });
      res.json(thoughts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// POST a new thought (protected)
router.post("/", protectAdmin, async (req, res) => {
    try {
      const { title, content, category } = req.body;
  
      const newThought = await Thought.create({
        title,
        content,
        category,
      });
  
      res.status(201).json(newThought);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  module.exports = router;




// GET all thoughts
router.get("/", async (req, res) => {
    try {
      const thoughts = await Thought.find().sort({ createdAt: -1 });
      res.json(thoughts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });  

// POST a new thought
router.post("/",protectAdmin, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const newThought = await Thought.create({
      title,
      content,
      category,
    });

    res.status(201).json(newThought);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
