import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const safeOriginalName = file.originalname.replace(/\s+/g, "_");
        const uniqueName = `${Date.now()}-${safeOriginalName}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

router.post("/ingest", authMiddleware, upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: "No file uploaded.",
        });
    }

    if (req.file.mimetype !== "application/pdf") {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
            error: "For now, only PDF files can be ingested.",
        });
    }

    try {
        const formData = new FormData();

        formData.append("file", fs.createReadStream(req.file.path), {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        formData.append("ocr_mode", "printed");

        const response = await axios.post(
            `${process.env.FASTAPI_BASE_URL}/ingest`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    "X-API-Key": process.env.FASTAPI_API_KEY,
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            }
        );

        const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        return res.json({
            ...response.data,
            originalName: req.file.originalname,
            storedName: req.file.filename,
            fileUrl,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
        });
    } catch (error) {
        console.error("File ingest error:", error.response?.data || error.message);

        return res.status(error.response?.status || 500).json({
            error:
                error.response?.data?.detail ||
                error.response?.data?.error ||
                "Server error while ingesting file.",
        });
    }
});

export default router;