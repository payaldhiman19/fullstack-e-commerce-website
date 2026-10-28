const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// 1. All my orders, newest first.
// Unpaid online orders (customer closed the popup) are hidden.
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({
  user: req.user.userId,
  $or: [
    { paymentMethod: "cod" },
    { paymentStatus: "paid" },
  ],
}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load orders" });
  }
});

// 2. DEV ONLY: creates a fake order so you can test the pages
// without paying. Disabled when NODE_ENV is "production".
router.post("/dev-create", protect, async (req, res) => {
  if (process.env.NODE_ENV === "production") return res.status(404).end();

  try {
    const product = await Product.findOne();
    if (!product) return res.status(400).json({ error: "Add a product first" });

    const order = await Order.create({
      user: req.user._id,
      items: [
        {
          product: product._id,
          name: product.name,
          size: product.sizes?.[0]?.size || "M",
          qty: 1,
          price: product.price,
        },
      ],
      amount: product.price,
      address: {
        name: "Test User",
        phone: "9999999999",
        line1: "Test address",
        city: "Noida",
        state: "UP",
        pincode: "201301",
      },
      paymentMethod: "cod",
      statusHistory: [{ status: "placed" }],
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create test order" });
  }
});

// 3. One order, only if it belongs to me.
// Keep this LAST, otherwise Express would treat "my" as an id.
router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ error: "Order not found" });
    
    const order = await Order.findOne({ _id: req.params.id, user: req.user.userId });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load order" });
  }
});

module.exports = router;