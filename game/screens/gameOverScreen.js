import { makeRequest, navigateTo, socket } from "../app.js";

export default function renderGameOverScreen(data) {
  const app = document.getElementById("app");

  const getPlayerScore = async (nickname) => {
    try {
      const result = await makeRequest("/api/game/scores", "GET");
      const player = result.find((p) => p.nickname === nickname);
      return player ? player.score : 0;
    } catch (error) {
      console.error("Error al obtener puntuación:", error);
      return 0;
    }
  };

  const renderInitialScreen = () => {
    app.innerHTML = `
      <div id="game-over">
        <h1>Game Over</h1>
        <h2 id="game-result">${data.message}</h2>
        <div id="player-score">Cargando puntuación...</div>
        <button id="restart-button">Restart game</button>
      </div>
    `;
  };

  const updateScoreDisplay = async () => {
    const score = await getPlayerScore(data.nickname);
    const playerScoreElement = document.getElementById("player-score");
    if (playerScoreElement) {
      const scoreClass = score < 0 ? "negative-score" : "positive-score";
      playerScoreElement.innerHTML = `
        <h3>Tu puntuación actual: <span class="${scoreClass}">${score}</span></h3>
      `;
    }
  };

  renderInitialScreen();
  updateScoreDisplay();

  const restartButton = document.getElementById("restart-button");

  restartButton.addEventListener("click", async () => {
    await makeRequest("/api/game/start", "POST");
  });

  // Keep the socket.on listener for game start event
  socket.on("startGame", (role) => {
    navigateTo("/game", { nickname: data.nickname, role });
  });
}
