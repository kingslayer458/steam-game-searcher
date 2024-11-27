const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const gameList = document.getElementById("game-list");
const gameDetails = document.getElementById("game-details");
const detailsContent = document.getElementById("details-content");
const backButton = document.getElementById("back-button");

// Fetch and display game list
async function fetchGames(query) {
    try {
        const response = await fetch(`/search?q=${query}`);
        const games = await response.json();

        if (games.length === 0) {
            gameList.innerHTML = `<p>No games found for "${query}". Try a different search term.</p>`;
            return;
        }

        // Remove the 'expanded' class for images during search
        gameList.innerHTML = games.map(game => `
            <div class="game" data-id="${game.id}">
                <img src="${game.background_image}" alt="${game.name}" />
                <h3>${game.name}</h3>
                <p><strong>Rating:</strong> ${game.rating} / 5</p>
            </div>
        `).join("");

        // Apply hover effect and click handlers after rendering games
        attachGameClickHandlers();
    } catch (error) {
        console.error("Error fetching games:", error);
    }
}

// Attach click handlers to game cards
function attachGameClickHandlers() {
    const gameCards = document.querySelectorAll(".game");
    gameCards.forEach(card => {
        card.addEventListener("click", () => {
            const gameId = card.dataset.id;
            fetchGameDetails(gameId);
        });
    });
}

// Fetch and display game details
async function fetchGameDetails(gameId) {
    try {
        const response = await fetch(`/details?id=${gameId}`);
        const game = await response.json();

        if (game) {
            gameDetails.classList.add("visible");
            gameList.innerHTML = ""; // Hide game list

            detailsContent.innerHTML = `
                <h2>${game.name}</h2>
                <img src="${game.background_image}" alt="${game.name}" class="expanded-image"/>
                <p>${game.description_raw}</p>
                <p><strong>Release Date:</strong> ${game.released || "Unknown"}</p>
                <p><strong>Genres:</strong> ${game.genres.map(genre => genre.name).join(", ")}</p>
                <p><strong>Rating:</strong> ${game.rating} / 5</p>
                <p><strong>Website:</strong> <a href="${game.website}" target="_blank">${game.website}</a></p>
            `;
        }
    } catch (error) {
        console.error("Error fetching game details:", error);
    }
}

// Event listeners
searchButton.addEventListener("click", () => {
    const query = searchBar.value.trim();
    if (query) fetchGames(query);
});

backButton.addEventListener("click", () => {
    gameDetails.classList.remove("visible");
    detailsContent.innerHTML = ""; // Clear details
});
