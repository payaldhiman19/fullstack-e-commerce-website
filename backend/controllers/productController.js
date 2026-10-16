// const Product = require("../models/Product");
// const mongoose = require("mongoose");
// // const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// const escapeRegex = (s) =>s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// const toList = (v) => String(v).split(",").map((s) => s.trim()).filter(Boolean);
// const matchAny = (v) => ({
//   $in: toList(v).map((x) => new RegExp(`^${escapeRegex(x)}$`, "i")),
// });

// // turns Mongoose errors into the right status code
// const handleError = (res, error, fallbackMessage) => {
//   if (error.name === "ValidationError") {
//     return res.status(400).json({ message: error.message });
//   }
//   if (error.name === "CastError") {
//     return res.status(400).json({ message: "Invalid product id" });
//   }
//   if (error.code === 11000) {
//     return res.status(409).json({ message: "A product with this name/slug already exists" });
//   }
//   return res.status(500).json({ message: fallbackMessage, error: error.message });
// };

// // ---------- public ----------
// const getProducts = async (req, res) => {
//   try {
//     const {
//   category,
//   subcategory,
//   search,
//   sort,
//   page = 1,
//   limit = 12,
//   size,
//   color,
//   pattern,
//   occasion,
//   fabric,
//   minPrice,
//   maxPrice,
//   minDiscount,
//   inStock,
//   readyToShip,
//   isNew,
//   bestseller,
//   sale,
// } = req.query;

//     const filter = {};
//     if (req.query.ids) {
//   const ids = toList(req.query.ids).filter((id) => mongoose.Types.ObjectId.isValid(id));
//   filter._id = { $in: ids };
// }

//    if (category) filter.category = matchAny(category);
//    if (subcategory) filter.subcategory = matchAny(subcategory);
// if (search && search.trim()) {
//   const keyword = search.trim().toLowerCase();

//   // Map search terms to their product categories.
//   const categoryKeywords = {
//     earrings: ["jewellery", "earrings"],
//     earring: ["jewellery", "earrings"],
//     ear: ["jewellery", "earrings"],
//     kurta: ["womenswear", "kurta"],
//     kurtas: ["womenswear", "kurta"],
//     suit: ["womenswear", "suit"],
//     suits: ["womenswear", "suit"],
//   };

//   const matchedCategories = categoryKeywords[keyword];

//   if (matchedCategories) {
//     // Restrict results to the relevant product type.
//     filter.$or = [
//       { category: { $in: matchedCategories } },
//       { subcategory: { $in: matchedCategories } },
//     ];
//   } else {
//     // General search for other keywords.
//     const rx = new RegExp(escapeRegex(keyword), "i");

//     filter.$or = [
//       { name: rx },
//       { category: rx },
//       { subcategory: rx },
//       { description: rx },
//       { color: rx },
//       { fabric: rx },
//       { pattern: rx },
//       { occasion: rx },
//     ];
//   }
// }



//     if (color) filter.color = matchAny(color);
//     if (pattern) filter.pattern = matchAny(pattern);
//     if (occasion) filter.occasion = matchAny(occasion);
//     if (fabric) filter.fabric = matchAny(fabric);

//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = Number(minPrice);
//       if (maxPrice) filter.price.$lte = Number(maxPrice);
//     }

//     if (minDiscount) filter.discountPercent = { $gte: Number(minDiscount) };
//     if (sale === "true") {
//       filter.discountPercent = { ...(filter.discountPercent || {}), $gt: 0 };
//     }

//     // size and in-stock both look inside the sizes array
//     if (size) {
//       filter.sizes = {
//         $elemMatch: {
//           size: matchAny(size),
//           ...(inStock === "true" && { stock: { $gt: 0 } }),
//         },
//       };
//     } else if (inStock === "true") {
//       filter["sizes.stock"] = { $gt: 0 };
//     }

//     if (readyToShip === "true") filter.isReadyToShip = true;
//     if (isNew === "true") filter.isNewArrival = true;
//     if (bestseller === "true") filter.isBestseller = true;

//     const sortMap = {
//       price_asc: { price: 1 },
//       price_desc: { price: -1 },
//       newest: { createdAt: -1 },
//       discount: { discountPercent: -1 },
//     };

//     const pageNum = Math.max(Number(page) || 1, 1);
//     const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 100);

//     const products = await Product.find(filter)
//       .sort(sortMap[sort] || { createdAt: -1 })
//       .skip((pageNum - 1) * limitNum)
//       .limit(limitNum);

//     const total = await Product.countDocuments(filter);

//     res.status(200).json({
//       products,
//       total,
//       page: pageNum,
//       pages: Math.ceil(total / limitNum),
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch products", error: error.message });
//   }
// };

// const getProductBySlug = async (req, res) => {
//   try {
//     const product = await Product.findOne({ slug: req.params.slug });
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch product", error: error.message });
//   }
// };

// const createProduct = async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.status(201).json(product);
//   } catch (error) {
//     handleError(res, error, "Failed to create product");
//   }
// };

// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.status(200).json(product);
//   } catch (error) {
//     handleError(res, error, "Failed to update product");
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.status(200).json({ message: "Product deleted" });
//   } catch (error) {
//     handleError(res, error, "Failed to delete product");
//   }
// };

// module.exports = {
//   getProducts,
//   getProductBySlug,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// };



const Product = require("../models/Product");
const mongoose = require("mongoose");

// Escape special regex characters in search/filter values
const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Convert comma-separated values into an array
const toList = (value) =>
  String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

// Case-insensitive exact matching
const matchAny = (value) => ({
  $in: toList(value).map(
    (item) => new RegExp(`^${escapeRegex(item)}$`, "i")
  ),
});

// Handle common Mongoose errors
const handleError = (res, error, fallbackMessage) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid product id" });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: "A product with this name/slug already exists",
    });
  }

  return res.status(500).json({
    message: fallbackMessage,
    error: error.message,
  });
};

// ---------------- PUBLIC: GET PRODUCTS ----------------

const getProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      search,
      sort,
      page = 1,
      limit = 12,
      size,
      color,
      pattern,
      occasion,
      fabric,
      minPrice,
      maxPrice,
      minDiscount,
      inStock,
      readyToShip,
      isNew,
      bestseller,
      sale,
    } = req.query;

    const filter = {};

    // Filter by product IDs
    if (req.query.ids) {
      const ids = toList(req.query.ids);

      if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({
          message: "Invalid product id",
        });
      }

      filter._id = { $in: ids };
    }

    // Category and subcategory filters
    if (category) {
      filter.category = matchAny(category);
    }

    if (subcategory) {
      filter.subcategory = matchAny(subcategory);
    }

    // General search across product fields.
    // Searching "kurta" can return men's and women's kurtas.
    // Category pages remain separated by their category filter.
    if (search && search.trim()) {
      const keyword = escapeRegex(search.trim());

      const regex = new RegExp(keyword, "i");

      filter.$or = [
        { name: regex },
        { category: regex },
        { subcategory: regex },
        { description: regex },
        { color: regex },
        { fabric: regex },
        { pattern: regex },
        { occasion: regex },
      ];
    }

    // Product attribute filters
    if (color) filter.color = matchAny(color);

    if (pattern) filter.pattern = matchAny(pattern);

    if (occasion) filter.occasion = matchAny(occasion);

    if (fabric) filter.fabric = matchAny(fabric);

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined && minPrice !== "") {
        const min = Number(minPrice);

        if (!Number.isFinite(min)) {
          return res.status(400).json({
            message: "Invalid minimum price",
          });
        }

        filter.price.$gte = min;
      }

      if (maxPrice !== undefined && maxPrice !== "") {
        const max = Number(maxPrice);

        if (!Number.isFinite(max)) {
          return res.status(400).json({
            message: "Invalid maximum price",
          });
        }

        filter.price.$lte = max;
      }
    }

    // Discount filters
    if (minDiscount !== undefined && minDiscount !== "") {
      const discount = Number(minDiscount);

      if (!Number.isFinite(discount)) {
        return res.status(400).json({
          message: "Invalid minimum discount",
        });
      }

      filter.discountPercent = {
        ...(filter.discountPercent || {}),
        $gte: discount,
      };
    }

    if (sale === "true") {
      filter.discountPercent = {
        ...(filter.discountPercent || {}),
        $gt: 0,
      };
    }

    // Size and stock filters
    if (size) {
      filter.sizes = {
        $elemMatch: {
          size: matchAny(size),
          ...(inStock === "true" && {
            stock: { $gt: 0 },
          }),
        },
      };
    } else if (inStock === "true") {
      filter["sizes.stock"] = { $gt: 0 };
    }

    // Boolean filters
    if (readyToShip === "true") {
      filter.isReadyToShip = true;
    }

    if (isNew === "true") {
      filter.isNewArrival = true;
    }

    if (bestseller === "true") {
      filter.isBestseller = true;
    }

    // Sorting: support both backend and frontend sort values
    const sortMap = {
      price_asc: { price: 1 },
      "price-asc": { price: 1 },

      price_desc: { price: -1 },
      "price-desc": { price: -1 },

      newest: { createdAt: -1 },
      discount: { discountPercent: -1 },
    };

    // Pagination
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(
      Math.max(Number(limit) || 12, 1),
      100
    );

    // Fetch products
    const products = await Product.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Count matching products
    const total = await Product.countDocuments(filter);

    return res.status(200).json({
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ---------------- GET SINGLE PRODUCT ----------------

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ---------------- CREATE PRODUCT ----------------

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json(product);
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to create product"
    );
  }
};

// ---------------- UPDATE PRODUCT ----------------

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update product"
    );
  }
};

// ---------------- DELETE PRODUCT ----------------

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted",
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete product"
    );
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};

