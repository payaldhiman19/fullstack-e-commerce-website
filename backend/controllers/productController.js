const Product = require("../models/Product");
const mongoose = require("mongoose");
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const toList = (v) => String(v).split(",").map((s) => s.trim()).filter(Boolean);
const matchAny = (v) => ({
  $in: toList(v).map((x) => new RegExp(`^${escapeRegex(x)}$`, "i")),
});

// turns Mongoose errors into the right status code
const handleError = (res, error, fallbackMessage) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid product id" });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: "A product with this name/slug already exists" });
  }
  return res.status(500).json({ message: fallbackMessage, error: error.message });
};

// ---------- public ----------
const getProducts = async (req, res) => {
  try {
    const {
      category, search, sort, page = 1, limit = 12,
      size, color, pattern, occasion, fabric,
      minPrice, maxPrice, minDiscount,
      inStock, readyToShip, isNew, bestseller, sale,
    } = req.query;

    const filter = {};
    if (req.query.ids) {
  const ids = toList(req.query.ids).filter((id) => mongoose.Types.ObjectId.isValid(id));
  filter._id = { $in: ids };
}

    if (category) filter.category = matchAny(category);
    if (search && search.trim()) {
      const fields = ["name", "category", "subCategory", "color", "fabric", "pattern", "occasion"];

      filter.$and = search
        .trim()
        .split(/\s+/) // "pink saree" becomes ["pink", "saree"]
        .map((word) => {
          const rx = new RegExp(escapeRegex(word), "i"); // contains this word, ignoring capitals
          return { $or: fields.map((f) => ({ [f]: rx })) }; // the word can be in any one field
        });
    }    
    if (color) filter.color = matchAny(color);
    if (pattern) filter.pattern = matchAny(pattern);
    if (occasion) filter.occasion = matchAny(occasion);
    if (fabric) filter.fabric = matchAny(fabric);

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minDiscount) filter.discountPercent = { $gte: Number(minDiscount) };
    if (sale === "true") {
      filter.discountPercent = { ...(filter.discountPercent || {}), $gt: 0 };
    }

    // size and in-stock both look inside the sizes array
    if (size) {
      filter.sizes = {
        $elemMatch: {
          size: matchAny(size),
          ...(inStock === "true" && { stock: { $gt: 0 } }),
        },
      };
    } else if (inStock === "true") {
      filter["sizes.stock"] = { $gt: 0 };
    }

    if (readyToShip === "true") filter.isReadyToShip = true;
    if (isNew === "true") filter.isNewArrival = true;
    if (bestseller === "true") filter.isBestseller = true;

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      discount: { discountPercent: -1 },
    };

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 100);

    const products = await Product.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
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

// ---------- admin only ----------
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    handleError(res, error, "Failed to create product");
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    handleError(res, error, "Failed to update product");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    handleError(res, error, "Failed to delete product");
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};