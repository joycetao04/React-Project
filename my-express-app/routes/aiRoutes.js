import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/query-text", authMiddleware, async (req, res) => {
    const {
        question,
        top_k = 3,
        source_filter = "",
        use_rag = false,
        chat_history = [],
    } = req.body;

    const shouldUseRag = use_rag === true || use_rag === "true";

    if (!question || !question.trim()) {
        return res.status(400).json({
            error: "Question is required.",
        });
    }

    try {
        const formData = new URLSearchParams();
        formData.append("question", question);
        formData.append("chat_history", JSON.stringify(chat_history));

        let endpoint = "/query/general";

        if (shouldUseRag) {
            endpoint = "/query/text";
            formData.append("top_k", String(top_k));

            if (source_filter) {
                formData.append("source_filter", source_filter);
            }
        }

        console.log("AI ROUTE DEBUG:", {
            question,
            shouldUseRag,
            endpoint,
            historyCount: Array.isArray(chat_history) ? chat_history.length : 0,
        });

        const response = await fetch(`${process.env.FASTAPI_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "X-API-Key": process.env.FASTAPI_API_KEY,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.detail || data.error || "FastAPI query failed.",
            });
        }

        res.json({
            answer: data.answer,
            sources: data.sources || [],
            mode: data.mode,
            question: data.question,
        });
    } catch (error) {
        console.error("AI query error:", error);

        res.status(500).json({
            error: "Server error while calling FastAPI.",
        });
    }
});

export default router;