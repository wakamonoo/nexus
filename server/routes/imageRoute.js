import express from "express";
import cloudinary from "../config/cloudinaryConfig.js";
import multer from "multer";
import { Readable } from "stream";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/imageUpload", upload.single("file"), async (req, res) => {
  try {
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const result = await new Promise((resolve, reject) => {
      bufferStream.pipe(
        cloudinary.uploader.upload_stream(
          { folder: "nexus uploads" },
          (err, res) => (err ? reject(err) : resolve(res))
        )
      );
    });

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("failed upload", err)
    res.status(500).json({ error: "upload error"})
  }
});

export default router;
