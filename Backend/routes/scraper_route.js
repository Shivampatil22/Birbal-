const { FetchQuestion } = require('../controllers/scraper');

const express = require("express")
const scrape_route = express.Router();

scrape_route.get("/:contestId/:index", async (req, res) => {
    try {
        const { contestId, index } = req.params;
        const data = await FetchQuestion(contestId, index);
        if (!data) {
            return res.status(502).json({ error: "Failed to scrape problem statement" });
        }
        res.json(data);
    } catch (err) {
        console.error("Scrape route error:", err.message || err);
        res.status(500).json({ error: "Scrape failed", detail: String(err.message || err) });
    }
});

module.exports = scrape_route;