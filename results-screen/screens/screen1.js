import { navigateTo } from "../app.js";

export default function renderScreen1(data) {
  const app = document.getElementById("app");

  const sortedPlayers = [...(data.players || [])].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  // Generar el HTML de la pantalla
  let html = `
    <div class="leaderboard-container">
      <h1>Tabla de resultados</h1>
      <div class="players-connected">
        <p><strong>Jugadores conectados:</strong> ${sortedPlayers.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Puntuación</th>
          </tr>
        </thead>
        <tbody>
  `;

  sortedPlayers.forEach((player, index) => {
    const scoreClass =
      (player.score || 0) < 0 ? "negative-score" : "positive-score";

    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${player.nickname}</td>
        <td class="${scoreClass}">${player.score || 0}</td>
        <td>${player.role || "Sin asignar"}</td>
        <td><button class="view-details-btn" data-player-id="${
          player.id
        }">Ver detalles</button></td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <div class="refresh-section">
        <button id="refresh-btn">Actualizar datos</button>
      </div>
    </div>
  `;

  app.innerHTML = html;

  const detailButtons = document.querySelectorAll(".view-details-btn");
  detailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const playerId = button.getAttribute("data-player-id");
      const playerData = data.players.find((p) => p.id === playerId);

      if (playerData) {
        navigateTo("/playerDetail", {
          player: playerData,
          allPlayers: data.players,
        });
      }
    });
  });

  const refreshButton = document.getElementById("refresh-btn");
  if (refreshButton) {
    refreshButton.addEventListener("click", async () => {
      try {
        const BASE_URL = "http://localhost:5050";
        const response = await fetch(`${BASE_URL}/api/game/scores`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const players = await response.json();
        navigateTo("/", { players });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });
  }
}
