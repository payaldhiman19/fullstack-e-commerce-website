const express =require("express");
const cors=require("cors");
require("dotenv").config();
const connectDB=require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const app=express();
app.use(cors());
app.use("/api/auth", authRoutes);
app.use(express.json());
connectDB();
app.get("/",(req,res)=>{
    res.send("Aachoo api is running");
})
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
   console.log(`Server running on port ${PORT}`);
});