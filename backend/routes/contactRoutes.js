const express = require("express");
const Contact = require("../models/ContactUs");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public: customers can submit messages
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      contact,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to send message",
    });
  }
});

// Admin only: view all messages
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
});

// Admin only: mark a message as read
router.patch("/:id/read", protect, adminOnly, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update message",
    });
  }
});

module.exports = router;