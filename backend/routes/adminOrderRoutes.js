const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const STATUSES = ["placed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];

// 1. List all orders, newest first.
// Unpaid online orders (popup closed) are hidden.
// Optional filter: /api/admin/orders?status=shipped
// Dashboard numbers
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const visible = { $or: [{ paymentMethod: "cod" }, { paymentStatus: "paid" }] };

    const totalOrders = await Order.countDocuments(visible);

    // sales = money actually received, minus cancelled orders
    const sales = await Order.aggregate([
      { $match: { paymentStatus: "paid", orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalUsers = await User.countDocuments();

    res.json({ totalOrders, totalSales: sales[0]?.total || 0, totalUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load stats" });
  }
});


router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const filter = {
      $or: [{ paymentMethod: "cod" }, { paymentStatus: "paid" }],
    };
    if (req.query.status && STATUSES.includes(req.query.status)) {
      filter.orderStatus = req.query.status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })  //newwest order first
      .populate("user", "name email");

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load orders" });
  }
});
// 2. Update one order's delivery status, courier and tracking ID
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ error: "Order not found" });

    const { orderStatus, courier, trackingId } = req.body;

    if (!STATUSES.includes(orderStatus))
      return res.status(400).json({ error: "Invalid status" });
    //find the order by id
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    //record status history
    if (order.orderStatus !== orderStatus) {
      order.statusHistory.push({ status: orderStatus });
    }

    order.orderStatus = orderStatus;
    order.courier = (courier || "").trim();
    order.trackingId = (trackingId || "").trim();

    // cash on delivery is paid when the parcel is delivered
    if (orderStatus === "delivered" && order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }
//save the updated chnages
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update order" });
  }
});

module.exports = router;