let games = [
  {
    id: "catan",
    name: "Catan",
    minPlayers: 3,
    maxPlayers: 4,
    avgDurationMinutes: 90,
    acquiredDate: "15-08-2024",
    condition: "lightly_used",
  },
  {
    id: "ticket-to-ride",
    name: "Ticket to Ride",
    minPlayers: 2,
    maxPlayers: 5,
    avgDurationMinutes: 60,
    acquiredDate: "10-01-2025",
    condition: "perfect",
  },
];

function getAll() {
  return games;
}

function findById(id) {
  return games.find((game) => game.id === id);
}

function findByName(name) {
  const search = name.toLowerCase();

  return games.filter((game) => game.name.toLowerCase().includes(search));
}

function create(game) {
  games.push(game);
  return game;
}

function update(id, newData) {
  const index = games.findIndex((game) => game.id === id);

  if (index === -1) {
    return null;
  }

  games[index] = {
    ...games[index],
    ...newData,
    id,
  };

  return games[index];
}

function remove(id) {
  const index = games.findIndex((game) => game.id === id);

  if (index === -1) {
    return null;
  }

  const deletedGame = games[index];
  games = games.filter((game) => game.id !== id);

  return deletedGame;
}

module.exports = {
  getAll,
  findById,
  findByName,
  create,
  update,
  remove,
};
