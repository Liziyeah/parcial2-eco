import { makeRequest, navigateTo, socket } from "../app.js";

export default function renderGameOverScreen(data) {
  const app = document.getElementById("app");

  // Obtener la puntuación actual del jugador
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

  // Renderizar inicialmente la pantalla
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

  // Actualizar la puntuación en la pantalla
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

  // Inicializar la pantalla
  renderInitialScreen();
  updateScoreDisplay();

  // Añadir estilos CSS a la pantalla
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .negative-score {
      color: red;
      font-weight: bold;
    }
    .positive-score {
      color: green;
      font-weight: bold;
    }
  `;
  document.head.appendChild(styleElement);

  const restartButton = document.getElementById("restart-button");

  restartButton.addEventListener("click", async () => {
    await makeRequest("/api/game/start", "POST");
  });

  // Keep the socket.on listener for game start event
  socket.on("startGame", (role) => {
    navigateTo("/game", { nickname: data.nickname, role });
  });
}
