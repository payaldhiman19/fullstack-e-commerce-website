const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // who bought it
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },

    // what they bought (name and price are copied so old orders never change)
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        size: String,
        qty: Number,
        price: Number,
      },
    ],

    // total in rupees
    amount: { type: Number, required: true },

    // where to deliver
    address: {
      name: String,
      phone: String,
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },

    // payment (generic, no gateway yet)
    paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },

    // delivery
    orderStatus: {
      type: String,
      enum: ["placed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"],
      default: "placed",
    },
    courier: String,
    trackingId: String,
    statusHistory: [{ status: String, at: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);