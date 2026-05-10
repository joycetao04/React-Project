import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import pool from "./db.js";
import noteRoute from "./routes/noteRoutes.js";
import documentRoutes from "./routes/documentRoutes.js"

dotenv.config();

const app = express();

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});