const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//This function safely compares two strings, such as the expected payment signature and the signature received from Razorpay.
const safeEqual = (a, b) => {
  const x = Buffer.from(a || "");
  const y = Buffer.from(b || "");
  return x.length === y.length &&
         crypto.timingSafeEqual(x, y);
};

//This function is responsible for updating an order after its payment has been verified.
// Marks an order paid ONCE and reduces stock for each size
async function markPaid(razorpayOrderId, razorpayPaymentId) {
  const order = await Order.findOneAndUpdate(
    { razorpayOrderId: razorpayOrderId, paymentStatus: "pending" }, // filter: which order
    {
      $set: { paymentStatus: "paid", razorpayPaymentId: razorpayPaymentId }, // what to change
      $push: { statusHistory: { status: "placed" } },
    },
    { returnDocument: "after" } // return the updated order
  );
  if (!order) return false; // already processed or unknown

  for (const it of order.items) {
    await Product.updateOne(
      { _id: it.product, sizes: { $elemMatch: { size: it.size, stock: { $gte: it.qty } } } },
      { $inc: { "sizes.$.stock": -it.qty } }
    );
  }
  return true;
}

//route 1:create order (called when customer pay)
router.post("/create-order",protect,async(req,res)=>{
    try{
        const{items,address}=req.body;
        if(!Array.isArray(items)||items.length==0)
            return res.status(400).json({error:"cart is empty"})
        if ( !address || !address.name || !/^\d{10}$/.test(address.phone || "") || !address.line1 || !address.city || !/^\d{6}$/.test(address.pincode || "") ) return res.status(400).json({ error: "Please enter a valid address" });
      let total=0;   //total accumulates the price of all products.
      const orderItems=[];
    for (const item of items) { 
        //Process each cart item
    const qty = Number(item.qty); if (!Number.isInteger(qty) || qty < 1 || qty > 20) 
    return res.status(400).json({ error: "Invalid quantity" });
    // The price comes from MongoDB, never from the frontend
    const product=await Product.findById(item.productId).catch(()=> null);
    if(!product)return res.status(400).json({error:"Product not found"});
      const sizeObj = product.sizes.find((s) => s.size === item.size);
      if (!sizeObj)
        return res.status(400).json({ error: `Size ${item.size} not available for ${product.name}` });
      if (qty > sizeObj.stock)
        return res.status(400).json({ error: `${product.name} (${item.size}) is out of stock` });
              total += product.price * qty;
      orderItems.push({
        product: product._id,
        name: product.name,
        size: item.size,
        qty,
        price: product.price,
      });
    }
     // Ask Razorpay to create an order (amount is in paise: rupees x 100)
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
    // Save our own record as "pending" (not paid yet)
    await Order.create({
      user: req.user._id,
      items: orderItems,
      amount: total,
      address,
      paymentMethod: "online",
      razorpayOrderId: rzpOrder.id,
    });
  res.json({
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      key: process.env.RAZORPAY_KEY_ID, // public key, safe to send
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create order" });
  }
});
// ROUTE 2: verify the payment (called after the customer pays)
  router.post("/verify",protect,async (req,res)=>{
    try{
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
        //recreate signature using our secret key
        const expected=crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
          // If it matches Razorpay's signature, the payment is genuine
    if (!safeEqual(expected, razorpay_signature))
      return res.status(400).json({ success: false, error: "Invalid signature" });
    await markPaid(razorpay_order_id,razorpay_payment_id);
    res.json({success:true});
    }catch(err){
        console.error(err);
        res.status(500).json({success:false,error:"verification falied"});
    }
  });
  module.exports={router};

