import { navigateTo } from "../app.js";

// Función para calcular el rango de un jugador
function calculateRank(score) {
  if (score >= 100) return "Maestro";
  if (score >= 50) return "Experto";
  if (score >= 0) return "Novato";
  return "Principiante";
}

export default function renderScreen2(data) {
  const app = document.getElementById("app");

  // Verificar que se recibieron datos
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

  // Ordenar jugadores por puntuación (de mayor a menor)
  const sortedPlayers = [...data.players].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  // Generar el HTML de la pantalla de ganador
  let html = `
    <div class="winner-container">
      <h1>¡Tenemos un Ganador!</h1>
      <div class="winner-announcement">
        <h2>🏆 ${data.winner.nickname} ha ganado con ${
    data.winner.score
  } puntos 🏆</h2>
        <p class="winner-rank">Rango: ${calculateRank(data.winner.score)}</p>
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
        <td>${player.nickname}${isWinner ? " 👑" : ""}</td>
        <td class="${scoreClass}">${player.score || 0}</td>
        <td>${calculateRank(player.score || 0)}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      
      <div class="action-buttons">
        <button id="back-btn">Volver a la tabla</button>
      </div>
    </div>
  `;

  app.innerHTML = html;

  // Agregar estilos específicos para la pantalla de ganador
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .winner-container {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .winner-announcement {
      background-color: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .winner-row {
      background-color: #fff3cd;
      font-weight: bold;
    }
    
    .negative-score {
      color: red;
      font-weight: bold;
    }
    
    .positive-score {
      color: green;
      font-weight: bold;
    }
    
    .winner-rank {
      font-size: 18px;
      margin-top: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    th, td {
      padding: 12px 15px;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }
    
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    
    .action-buttons {
      margin-top: 20px;
    }
    
    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    
    button:hover {
      background-color: #0056b3;
    }
  `;
  document.head.appendChild(styleElement);

  // Añadir escuchador para el botón de volver
  const backButton = document.getElementById("back-btn");
  if (backButton) {
    backButton.addEventListener("click", () => {
      navigateTo("/", { players: data.players });
    });
  }
}
