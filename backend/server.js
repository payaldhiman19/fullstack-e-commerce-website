const express =require("express");
const cors=require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
require("dotenv").config();
const connectDB=require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/upload", uploadRoutes);
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