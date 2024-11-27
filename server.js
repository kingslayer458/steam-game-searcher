const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

// Your RAWG API key
const RAWG_API_KEY = "";

// Serve static files
app.use(express.static(__dirname));

// Search games by keyword
app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        const response = await axios.get(
            `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${query}`
        );
        res.json(response.data.results); // Return the search results
    } catch (error) {
        console.error("Error fetching search results:", error.message);
        res.status(500).json({ error: "Failed to fetch game data." });
    }
});

// Fetch game details by ID
app.get("/details", async (req, res) => {
    const gameId = req.query.id;
    if (!gameId) {
        return res.status(400).json({ error: "Game ID (id) is required." });
    }

    try {
        const response = await axios.get(
            `https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`
        );
        res.json(response.data); // Return game details
    } catch (error) {
        console.error("Error fetching game details:", error.message);
        res.status(500).json({ error: "Failed to fetch game details." });
    }
});

// Fetch random games (Add this endpoint for random games)
app.get("/random", async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating&page_size=5`
        );
        res.json(response.data); // Return random games
    } catch (error) {
        console.error("Error fetching random games:", error.message);
        res.status(500).json({ error: "Failed to fetch random games." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
