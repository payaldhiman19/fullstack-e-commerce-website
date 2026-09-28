const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    brand: {
      type: String,
      default: "Aachho",
    },

    description: {
      type: String,
    },

    // Product images
    images: [
      {
        type: String,
        required: true,
      },
    ],

    // Pricing
    price: {
      type: Number,
      required: true,
    },

    comparePrice: {
      type: Number,
    },

    discountPercent: {
      type: Number,
    },

    // Category
    category: {
      type: String,
      required: true,
    },

    // Specifications
    color: {
      type: String,
    },

    fabric: {
      type: String,
    },

    dupattaFabric: {
      type: String,
    },

    neckline: {
      type: String,
    },

    sleeve: {
      type: String,
    },

    pattern: {
      type: String,
    },

    occasion: {
      type: String,
    },

    technique: {
      type: String,
    },

    care: {
      type: String,
    },

    modelSize: {
      type: String,
    },

    modelHeight: {
      type: String,
    },

    // Sizes and stock
    sizes: [
      {
        size: {
          type: String,
          required: true,
        },

        sku: {
          type: String,
        },

        stock: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Reviews
    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    // Badges
    offerLabel: {
      type: String,
    },

    isReadyToShip: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isBestseller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;