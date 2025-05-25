document.addEventListener('DOMContentLoaded', function() {
            const API_KEY = "cbcc8f8e3dc747739f2f6f18d6366340";
            const gamesContainer = document.getElementById('gamesContainer');
            const spinner = document.querySelector('.loading-spinner');
            
            // My favorite game IDs from RAWG API
            const favoriteGames = [
                { id: 28, name: "Red Dead Redemption 2" },   // RDR2
                { id: 3328, name: "The Witcher 3" },        // The Witcher 3
                { id: 4291, name: "Cyberpunk 2077" },       // Cyberpunk 2077
                { id: 5679, name: "The Last of Us Part II" }// TLOU2
            ];
            
            // Show loading spinner
            spinner.style.display = 'block';
            
            // Fetch all favorite games
            const fetchPromises = favoriteGames.map(game => {
                return fetch(`https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Network response was not ok for ${game.name}`);
                        }
                        return response.json();
                    })
                    .catch(error => {
                        console.error(`Error fetching ${game.name}:`, error);
                        return null;
                    });
            });
            
            // Process all responses
            Promise.all(fetchPromises)
                .then(games => {
                    // Hide spinner
                    spinner.style.display = 'none';
                    
                    // Filter out failed requests
                    const validGames = games.filter(game => game !== null);
                    
                    // Display games
                    validGames.forEach(game => {
                        const gameCard = createGameCard(game);
                        gamesContainer.appendChild(gameCard);
                    });
                    
                    // If no games loaded, show error message
                    if (validGames.length === 0) {
                        gamesContainer.innerHTML = `
                            <div class="col-12 text-center py-5">
                                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                                <h3>Oyun bilgileri yüklenirken bir hata oluştu</h3>
                                <p>Lütfen daha sonra tekrar deneyiniz.</p>
                            </div>
                        `;
                    }
                })
                .catch(error => {
                    console.error('Error loading games:', error);
                    spinner.style.display = 'none';
                    gamesContainer.innerHTML = `
                        <div class="col-12 text-center py-5">
                            <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                            <h3>Oyun bilgileri yüklenirken bir hata oluştu</h3>
                            <p>${error.message}</p>
                        </div>
                    `;
                });
            
            // Create game card HTML element
            function createGameCard(game) {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-3 mb-4';
                
                const card = document.createElement('div');
                card.className = 'card h-100 game-card';
                
                const img = document.createElement('img');
                img.className = 'card-img-top game-img';
                img.src = game.background_image || 'https://via.placeholder.com/400x200?text=No+Image';
                img.alt = game.name;
                
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                
                const title = document.createElement('h5');
                title.className = 'card-title';
                title.textContent = game.name;
                
                const rating = document.createElement('p');
                rating.className = 'card-text';
                rating.innerHTML = `<small class="text-muted"><i class="fas fa-star text-warning"></i> ${game.rating || 'N/A'}/5</small>`;
                
                const released = document.createElement('p');
                released.className = 'card-text';
                released.innerHTML = `<small><i class="fas fa-calendar-alt text-primary"></i> ${game.released || 'Bilinmiyor'}</small>`;
                
                const genres = document.createElement('div');
                genres.className = 'mt-2';
                if (game.genres && game.genres.length > 0) {
                    game.genres.slice(0, 3).forEach(genre => {
                        const badge = document.createElement('span');
                        badge.className = 'badge game-badge me-1 mb-1';
                        badge.textContent = genre.name;
                        genres.appendChild(badge);
                    });
                }
                
                cardBody.appendChild(title);
                cardBody.appendChild(rating);
                cardBody.appendChild(released);
                cardBody.appendChild(genres);
                
                card.appendChild(img);
                card.appendChild(cardBody);
                col.appendChild(card);
                
                return col;
            }
        });