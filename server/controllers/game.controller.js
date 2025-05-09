const playersDb = require("../db/players.db");
const {
  emitEvent,
  emitToSpecificClient,
} = require("../services/socket.service");

const joinGame = async (req, res) => {
  try {
    const { nickname, socketId } = req.body;
    playersDb.addPlayer(nickname, socketId);

    const gameData = playersDb.getGameData();
    emitEvent("userJoined", gameData);

    // Emitir evento para actualizar la pantalla de resultados
    emitEvent("updateResultsScreen", gameData);

    res.status(200).json({ success: true, players: gameData.players });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const startGame = async (req, res) => {
  try {
    const playersWithRoles = playersDb.assignPlayerRoles();

    playersWithRoles.forEach((player) => {
      emitToSpecificClient(player.id, "startGame", player.role);
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const notifyMarco = async (req, res) => {
  try {
    const { socketId } = req.body;

    const rolesToNotify = playersDb.findPlayersByRole([
      "polo",
      "polo-especial",
    ]);

    rolesToNotify.forEach((player) => {
      emitToSpecificClient(player.id, "notification", {
        message: "Marco!!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const notifyPolo = async (req, res) => {
  try {
    const { socketId } = req.body;

    const rolesToNotify = playersDb.findPlayersByRole("marco");

    rolesToNotify.forEach((player) => {
      emitToSpecificClient(player.id, "notification", {
        message: "Polo!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const selectPolo = async (req, res) => {
  try {
    const { socketId, poloId } = req.body;

    const myUser = playersDb.findPlayerById(socketId);
    const poloSelected = playersDb.findPlayerById(poloId);
    const allPlayers = playersDb.getAllPlayers();

    if (poloSelected.role === "polo-especial") {
      playersDb.updatePlayerScore(socketId, 50);
      playersDb.updatePlayerScore(poloId, -10);

      allPlayers.forEach((player) => {
        emitToSpecificClient(player.id, "notifyGameOver", {
          message: `El marco ${myUser.nickname} ha ganado, ${poloSelected.nickname} ha sido capturado`,
        });
      });
    } else {
      playersDb.updatePlayerScore(socketId, -10);

      allPlayers.forEach((player) => {
        emitToSpecificClient(player.id, "notifyGameOver", {
          message: `El marco ${myUser.nickname} ha perdido`,
        });
      });
    }
    const specialPolos = allPlayers.filter(
      (player) => player.role === "polo-especial" && player.id !== poloId
    );

    specialPolos.forEach((player) => {
      playersDb.updatePlayerScore(player.id, 10);
    });
    const winner = allPlayers.find((player) => player.score >= 100);
    const gameData = playersDb.getGameData();

    if (winner) {
      // cuando se hace la validacion de q un jugador alcanzo los +100puntos, emitir evento especial
      emitEvent("gameWinner", {
        winner: winner,
        players: gameData.players,
      });
    }

    emitEvent("updateResultsScreen", gameData);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const disconnectPlayer = async (req, res) => {
  try {
    const { socketId } = req.body;
    playersDb.removePlayer(socketId);

    // Emitir evento para actualizar la pantalla de resultados
    const gameData = playersDb.getGameData();
    emitEvent("updateResultsScreen", gameData);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getScores = async (req, res) => {
  try {
    const players = playersDb.getAllPlayers();
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  joinGame,
  startGame,
  notifyMarco,
  notifyPolo,
  selectPolo,
  disconnectPlayer,
  getScores,
};
