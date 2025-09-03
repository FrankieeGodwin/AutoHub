import express from "express";
import upload from "../config/multer.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

const router = express.Router();

// Upload images
router.post("/upload-images", upload.array("images", 5), async (req, res) => {
  try {
    const urls = [];
    for (const file of req.files) {
      const url = await uploadToCloudinary(file.buffer);
      urls.push({ imageURL: url });
    }
    res.status(200).json({ message: "Images uploaded", urls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
