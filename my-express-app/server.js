import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import pool from "./db.js";
import noteRoute from "./routes/noteRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import linkRoutes from "./routes/linkRountes.js";
import aiRoutes from "./routes/aiRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());

app.get("/api/test", async (req, res) => {
    try {
        const result = await pool.query("select now() as current_time");
        res.json({
            message: "Backend is working and Supabase is connected.",
            databaseTime: result.rows[0].current_time,
        });
    } catch (error) {
        console.error("Database test error:", error);
        res.status(500).json({
            error: "Backend is running, but database connection failed.",
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoute);
app.use("/api/documents", documentRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/files", fileRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});