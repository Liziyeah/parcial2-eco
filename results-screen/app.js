import renderScreen1 from "./screens/screen1.js";
import renderScreen2 from "./screens/screen2.js";
import renderWinnerScreen from "./screens/winnerScreen.js";

const socket = io("/", { path: "/real-time" });

function clearScripts() {
  document.getElementById("app").innerHTML = "";
}

let route = { path: "/", data: {} };
renderRoute(route);

function renderRoute(currentRoute) {
  switch (currentRoute?.path) {
    case "/":
      clearScripts();
      renderScreen1(currentRoute?.data);
      break;
    case "/screen2":
      clearScripts();
      renderScreen2(currentRoute?.data);
      break;
    case "/winner":
      clearScripts();
      renderWinnerScreen(currentRoute?.data);
      break;
    default:
      const app = document.getElementById("app");
      app.innerHTML = `<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p>`;
  }
}

function navigateTo(path, data) {
  route = { path, data };
  renderRoute(route);
}

// Escuchar actualizaciones de la pantalla de resultados
socket.on("updateResultsScreen", (data) => {
  // Si estamos en la pantalla principal, actualizamos los datos
  if (route.path === "/") {
    navigateTo("/", data);
  } else if (route.path === "/playerDetail") {
    // Si estamos viendo detalles, mantenemos los detalles pero actualizamos los datos
    route.data = {
      ...route.data,
      player: data.players.find((p) => p.id === route.data.player.id),
      allPlayers: data.players,
    };
    renderRoute(route);
  }
});

// Escuchar si hay un ganador
socket.on("gameWinner", (data) => {
  navigateTo("/winner", data);
});

// Realizar una petición inicial para obtener los datos actuales
async function fetchInitialData() {
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
    console.error("Error fetching initial data:", error);
    navigateTo("/", { players: [] });
  }
}

fetchInitialData();

export { navigateTo, socket };
