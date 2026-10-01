require("dotenv").config();

const express = require("express");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Tell us at startup if any Cloudinary value is missing
const missing = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]
  .filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.log("Missing in .env:", missing.join(", "));
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const router = express.Router();

router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file sent" });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: "client_uploads" },
    (error, result) => {
      if (error) {
        console.log("Cloudinary error:", error.message);
        return res.status(500).json({ message: "Image upload failed", error: error.message });
      }
      res.status(200).json({ url: result.secure_url });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});

module.exports = router;