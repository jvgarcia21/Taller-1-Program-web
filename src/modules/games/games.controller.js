const gamesService = require("./games.service");

const validConditions = ["perfect", "lightly_used", "worn", "damaged"];

function isPositiveNumber(value) {
  return typeof value === "number" && value > 0;
}

function isValidDateFormat(value) {
  if (typeof value !== "string" || !/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    return false;
  }

  const [day, month, year] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function validateGameData(game, isUpdate = false) {
  const errors = [];

  if (!isUpdate && !game.id) {
    errors.push("El id es requerido.");
  }

  if (!game.name) {
    errors.push("El nombre es requerido.");
  }

  if (!isPositiveNumber(game.minPlayers)) {
    errors.push("El minimo de jugadores debe ser un numero positivo.");
  }

  if (!isPositiveNumber(game.maxPlayers)) {
    errors.push("El maximo de jugadores debe ser un numero positivo.");
  }

  if (
    isPositiveNumber(game.minPlayers) &&
    isPositiveNumber(game.maxPlayers) &&
    game.minPlayers > game.maxPlayers
  ) {
    errors.push("El minimo de jugadores no puede ser mayor al maximo.");
  }

  if (!isPositiveNumber(game.avgDurationMinutes)) {
    errors.push("La duracion promedio debe ser mayor a cero.");
  }

  if (!isValidDateFormat(game.acquiredDate)) {
    errors.push(
      "La fecha de adquisicion debe tener formato DD-MM-YYYY. Ejemplo: 20-04-2025."
    );
  }

  if (!validConditions.includes(game.condition)) {
    errors.push("El estado del juego no es valido.");
  }

  return errors;
}

function getAllGames(req, res) {
  if (req.query.name) {
    const games = gamesService.findByName(req.query.name);
    return res.status(200).json(games);
  }

  const games = gamesService.getAll();
  return res.status(200).json(games);
}

function getGameById(req, res) {
  const game = gamesService.findById(req.params.id);

  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado." });
  }

  return res.status(200).json(game);
}

function createGame(req, res) {
  const gameData = req.body;
  const errors = validateGameData(gameData);

  if (errors.length > 0) {
    return res.status(400).json({ message: "Datos invalidos.", errors });
  }

  const gameExists = gamesService.findById(gameData.id);

  if (gameExists) {
    return res.status(409).json({ message: "Ya existe un juego con ese id." });
  }

  const createdGame = gamesService.create(gameData);
  return res.status(201).json(createdGame);
}

function updateGame(req, res) {
  const id = req.params.id;
  const gameData = {
    ...req.body,
    id,
  };

  if (req.body.id && req.body.id !== id) {
    return res.status(400).json({
      message: "El id del cuerpo no coincide con el id de la ruta.",
    });
  }

  const errors = validateGameData(gameData, true);

  if (errors.length > 0) {
    return res.status(400).json({ message: "Datos invalidos.", errors });
  }

  const updatedGame = gamesService.update(id, gameData);

  if (!updatedGame) {
    return res.status(404).json({ message: "Juego no encontrado." });
  }

  return res.status(200).json(updatedGame);
}

function patchGame(req, res) {
  const id = req.params.id;
  const currentGame = gamesService.findById(id);

  if (!currentGame) {
    return res.status(404).json({ message: "Juego no encontrado." });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Debe enviar al menos un campo para actualizar.",
    });
  }

  if (req.body.id && req.body.id !== id) {
    return res.status(400).json({
      message: "El id del cuerpo no coincide con el id de la ruta.",
    });
  }

  const gameData = {
    ...currentGame,
    ...req.body,
    id,
  };

  const errors = validateGameData(gameData, true);

  if (errors.length > 0) {
    return res.status(400).json({ message: "Datos invalidos.", errors });
  }

  const updatedGame = gamesService.update(id, gameData);
  return res.status(200).json(updatedGame);
}

function deleteGame(req, res) {
  const deletedGame = gamesService.remove(req.params.id);

  if (!deletedGame) {
    return res.status(404).json({ message: "Juego no encontrado." });
  }

  return res.status(200).json({
    message: "Juego eliminado correctamente.",
    game: deletedGame,
  });
}

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  patchGame,
  deleteGame,
};
