const Product=require("../models/Product");
const getProducts = async (req, res) => {
  try {
    const { category, sale, search, sort, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (sale === "true") filter.isOnSale = true;
    if (search) filter.name = { $regex: search, $options: "i" };

    const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, newest: { createdAt: -1 } };

    const products = await Product.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);
    res.status(200).json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

  const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

  //admin only--can create product
  const createProduct=async (req,res)=>{
    try{
        const product=await Product.create(req.body);
        res.status(201).json(product);
    }catch(error){
        res.status(500).json({message:"Failed to create product",error:error.message});
    }
  };
    const updateProduct=async (req,res)=>{
        try{
            const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
                if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
        }catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
    }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

module.exports = { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct };