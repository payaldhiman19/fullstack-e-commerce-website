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
async function markPai(razorpayOrderId,razorpayPaymentId) {
    const order=await Order.findByIdAndUpdate(
        {razorpayOrderId,paymentStatus:"pending"},  //only if unpaid
        {paymentStatus:"paid",
        razorpayPaymentId,
        $push:{statusHistory:{status:"placed"}},
        },
        {new:true}
    );
    if(!order) return false;  // already processed or unknown
    for(const it of order.items){
     await Product.updateOne(
        {_id:it.product, sizes:{$elemMatch:{size:it.size,stock :{$gte:it.qty}}}},
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
        
    }
})