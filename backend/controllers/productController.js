const Product=require("../models/Product");
const getProducts=async (req,res)=>{
    //anyone can view
    try{
        const products=await Product.find();
        res.status(200).json(products);
    }catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  };
  const getProductBySlug=async (req,res)=>{
    try{
        const product=await Product.findOne({slug:req.params.slug});
        if(!product)
            return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
    }
  };
  //admin only
  const createProduct=async (req,res)=>{
    try{
        const product=await Product.create(req.body);
        res.status(201).json(product);
    }catch(erro)
  }
}