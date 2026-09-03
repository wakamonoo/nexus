import express from "express";
import cloudinary from "../config/cloudinaryConfig.js";
import multer from "multer";
import { Readable } from "stream";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

router.post("/imageUpload", upload.single("file"), async (req, res) => {
  try {
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const result = await new Promise((resolve, reject) => {
      bufferStream.pipe(
        cloudinary.uploader.upload_stream(
          { folder: "nexus uploads/titles" },
          (err, res) => (err ? reject(err) : resolve(res)),
        ),
      );
    });

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("failed upload", err);
    res.status(500).json({ error: "upload error" });
  }
});

router.post("/userImageUpload", upload.single("file"), async (req, res) => {
  try {
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const result = await new Promise((resolve, reject) => {
      bufferStream.pipe(
        cloudinary.uploader.upload_stream(
          { folder: "nexus uploads/userProfiles" },
          (err, res) => (err ? reject(err) : resolve(res)),
        ),
      );
    });

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("failed upload", err);
    res.status(500).json({ error: "upload error" });
  }
});

router.post("/postUpload", upload.array("files"), async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(
          cloudinary.uploader.upload_stream(
            { folder: "nexus uploads/posts", resource_type: "auto" },
            (err, result) => (err ? reject(err) : resolve(result.secure_url)),
          ),
        );
      });
    });

    const urls = await Promise.all(uploadPromises);

    res.status(200).json({ urls });
  } catch (err) {
    console.error("failed upload", err);
    res.status(500).json({ error: "upload error" });
  }
});

router.post("/citadelUpload", upload.array("files"), async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(
          cloudinary.uploader.upload_stream(
            { folder: "nexus uploads/citadel", resource_type: "auto" },
            (err, result) => (err ? reject(err) : resolve(result.secure_url)),
          ),
        );
      });
    });

    const urls = await Promise.all(uploadPromises);

    res.status(200).json({ urls });
  } catch (err) {
    console.error("failed upload", err);
    res.status(500).json({ error: "upload error" });
  }
});

router.post("/commentUpload", upload.array("files"), async (req, res) => {
  try {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(
          cloudinary.uploader.upload_stream(
            { folder: "nexus uploads/comments", resource_type: "auto" },
            (err, result) => (err ? reject(err) : resolve(result.secure_url)),
          ),
        );
      });
    });

    const urls = await Promise.all(uploadPromises);

    res.status(200).json({ urls });
  } catch (err) {
    console.error("failed upload", err);
    res.status(500).json({ error: "upload error" });
  }
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: "File too large. Maximum size is 50 MB per file",
      });
    }

    return res.status(400).json({
      error: err.message,
    });
  }

  console.error("Upload miidleware error:", err);

  return res.status(500).json({
    error: "Upload error",
  });
});

export default router;
