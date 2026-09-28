const express=require("express");
const{protect,adminOnly}=require("../middleware/authMiddleware");
//getting and posting products in differnt ways
const{
    getProducts,getProductBySlug,createProduct,updateProduct,deleteProduct,}=require("../controllers/productController");
    const router=express.Router();
    router.get("/",getProducts);
    router.get("/:slug",getProductBySlug);//public
    router.post("/",protect,adminOnly,createProduct);  //admin creating product
    router.put("/:id",protect,adminOnly,updateProduct);  //admin update
    router.delete("/:id",protect,adminOnly,deleteProduct);
    module.exports=router;

