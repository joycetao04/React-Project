import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    const {
        search = "",
        sources = "",
        contentTypes = "",
        languages = "",
        accessTypes = "",
        tags = "",
        yearFrom = "",
        yearTo = "",
    } = req.query;

    try {
         let sql = `
            select *
            from public.documents
            where 1 = 1
        `;

        const values = [];

        if (search.trim() !== "") {
            values.push(`%${search}%`);
            sql += ` and title ilike $${values.length}`;
        }

        if (sources.trim() !== "") {
            values.push(sources.split(","));
            sql += ` and source = any($${values.length})`;
        }

        if (contentTypes.trim() !== "") {
            values.push(contentTypes.split(","));
            sql += ` and content_type = any($${values.length})`;
        }

        if (languages.trim() !== "") {
            values.push(languages.split(","));
            sql += ` and language = any($${values.length})`;
        }

        if (accessTypes.trim() !== "") {
            values.push(accessTypes.split(","));
            sql += ` and access_type = any($${values.length})`;
        }

        if (tags.trim() !== "") {
            values.push(tags.split(","));
            sql += ` and tags && $${values.length}::text[]`;
        }

        if (yearFrom.trim() !== "") {
            values.push(Number(yearFrom));
            sql += ` and publication_year >= $${values.length}`;
        }

        if (yearTo.trim() !== "") {
            values.push(Number(yearTo));
            sql += ` and publication_year <= $${values.length}`;
        }

        sql += ` order by created_at desc`;

        const result = await pool.query(sql, values);

        res.json({
            documents: result.rows,
        });
    } catch (error) {
        console.error("Get documents error:", error);
        res.status(500).json({
            error: "Server error while getting documents.",
        });
    }
});

router.get("/filters", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            select source, content_type, language, access_type, tags
            from public.documents
        `);

        const docs = result.rows;

        const sources = [...new Set(docs.map((doc) => doc.source).filter(Boolean))];
        const contentTypes = [...new Set(docs.map((doc) => doc.content_type).filter(Boolean))];
        const languages = [...new Set(docs.map((doc) => doc.language).filter(Boolean))];
        const accessTypes = [...new Set(docs.map((doc) => doc.access_type).filter(Boolean))];

        const allTags = docs.flatMap((doc) => doc.tags || []);
        const tagOptions = [...new Set(allTags.filter(Boolean))];

        res.json({
            sources,
            contentTypes,
            languages,
            accessTypes,
            tags: tagOptions,
        });
    } catch (error) {
        console.error("Get document filters error:", error);
        res.status(500).json({
            error: "Server error while getting document filters.",
        });
    }
});

export default router;