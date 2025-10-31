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
          { folder: "nexus uploads/titles" },
          (err, res) => (err ? reject(err) : resolve(res))
        )
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
          (err, res) => (err ? reject(err) : resolve(res))
        )
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
            (err, result) => (err ? reject(err) : resolve(result.secure_url))
          )
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
            (err, result) => (err ? reject(err) : resolve(result.secure_url))
          )
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

export default router;
