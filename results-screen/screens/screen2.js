import { navigateTo } from "../app.js";

export default function renderScreen1(data) {
  const app = document.getElementById("app");

  // Si no hay datos del jugador, volver a la pantalla principal
  if (!data || !data.player) {
    navigateTo("/", { players: data.allPlayers || [] });
    return;
  }

  const player = data.player;
  const scoreClass =
    (player.score || 0) < 0 ? "negative-score" : "positive-score";

  // Generar el HTML de la vista de detalles
  let html = `
    <div class="player-detail-container">
      <h1>Detalles del Jugador</h1>
      
      <div class="player-info">
        <div class="info-row">
          <strong>Nickname:</strong> 
          <span>${player.nickname}</span>
        </div>
        
        <div class="info-row">
          <strong>ID:</strong> 
          <span>${player.id}</span>
        </div>
        
        <div class="info-row">
          <strong>Puntuación:</strong> 
          <span class="${scoreClass}">${player.score || 0}</span>
        </div>
        
        <div class="info-row">
          <strong>Rol actual:</strong> 
          <span>${player.role || "Sin asignar"}</span>
        </div>
      </div>
      
      <div class="player-stats">
        <h2>Estadísticas</h2>
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-value ${scoreClass}">${player.score || 0}</div>
            <div class="stat-label">Puntos totales</div>
          </div>
          
          <div class="stat-item">
            <div class="stat-value">${calculateRank(player.score || 0)}</div>
            <div class="stat-label">Rango</div>
          </div>
          
          <div class="stat-item">
            <div class="stat-value">${calculateRoundPoints(
              player.score || 0,
              player.role
            )}</div>
            <div class="stat-label">Posibles puntos esta ronda</div>
          </div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button id="back-btn">Volver a la tabla</button>
      </div>
    </div>
  `;

  app.innerHTML = html;

  // Añadir escuchador para el botón de volver
  const backButton = document.getElementById("back-btn");
  if (backButton) {
    backButton.addEventListener("click", () => {
      navigateTo("/", { players: data.allPlayers || [] });
    });
  }
}
