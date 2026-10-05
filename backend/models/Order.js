// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     items: [
//       {
//         product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//         name: String,
//         size: String,
//         qty: Number,
//         price: Number,
//       },
//     ],
//     amount: { type: Number, required: true }, // in rupees
//     address: {
//       name: String,
//       phone: String,
//       line1: String,
//       city: String,
//       state: String,
//       pincode: String,
//     },
//     razorpayOrderId: { type: String, index: true },
//     razorpayPaymentId: String,
//     status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);