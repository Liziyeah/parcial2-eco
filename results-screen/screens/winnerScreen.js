import { navigateTo } from "../app.js";

export default function renderWinnerScreen(data) {
  const app = document.getElementById("app");

  if (!data || !data.winner || !data.players) {
    app.innerHTML = `
      <div class="error-container">
        <h1>Error</h1>
        <p>No se recibieron datos correctos del ganador.</p>
        <button id="back-btn">Volver a la tabla</button>
      </div>
    `;

    const backButton = document.getElementById("back-btn");
    if (backButton) {
      backButton.addEventListener("click", () => {
        navigateTo("/", { players: data?.players || [] });
      });
    }

    return;
  }
  const sortedPlayers = [...data.players].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  let html = `
    <div class="winner-container">
      <h1>Hay un nuevo ganador :D!</h1>
      <div class="winner-announcement">
        <h2> ${data.winner.nickname} ha ganado con ${data.winner.score} puntos</h2>
      </div>
      
      <div class="leaderboard-container">
        <h2>Tabla de Posiciones Final</h2>
        <table>
          <thead>
            <tr>
              <th>Posición</th>
              <th>Jugador</th>
              <th>Puntuación</th>
              <th>Rango</th>
            </tr>
          </thead>
          <tbody>
  `;

  sortedPlayers.forEach((player, index) => {
    const scoreClass =
      (player.score || 0) < 0 ? "negative-score" : "positive-score";
    const isWinner = player.id === data.winner.id;

    html += `
      <tr${isWinner ? ' class="winner-row"' : ""}>
        <td>${index + 1}</td>
        <td>${player.nickname}${isWinner ? " 👑 Ganador!" : ""}</td>
        <td class="${scoreClass}">${player.score || 0}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      
      <div class="action-buttons">
        <button id="back-btn">volver a pantalla de resultados</button>
      </div>
    </div>
  `;

  app.innerHTML = html;
  document.head.appendChild(styleElement);
  const backButton = document.getElementById("back-btn");
  if (backButton) {
    backButton.addEventListener("click", () => {
      navigateTo("/", { players: data.players });
    });
  }
}
