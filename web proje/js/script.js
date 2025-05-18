const API_KEY = "cbcc8f8e3dc747739f2f6f18d6366340";
const RDR2_ID = 28; // Red Dead Redemption 2'nin RAWG ID'si

fetch(fetch(`https://corsproxy.io/?${encodeURIComponent(`https://api.rawg.io/api/games/28?key=${API_KEY}`)}`))
  .then(r => r.json())
  .then(game => {
    document.getElementById('games-container').innerHTML = `
      <img src="${game.background_image}" class="img-fluid rounded">
      <h4 class="mt-3">${game.name}</h4>
    `;
  });