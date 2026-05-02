const gamesService = require("./games.service");

const validConditions = ["perfect", "lightly_used", "worn", "damaged"];

function isPositiveNumber(value) {
  return typeof value === "number" && value > 0;
}

function isValidDateFormat(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
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
    errors.push("La fecha de adquisicion debe tener formato YYYY-MM-DD.");
  }

  if (!validConditions.includes(game.condition)) {
    errors.push("El estado del juego no es valido.");
  }

  return errors;
}

function getAllGames(req, res) {
  const games = gamesService.getAll();
  res.status(200).json(games);
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
  deleteGame,
};
