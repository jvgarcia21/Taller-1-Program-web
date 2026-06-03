const API_URL = "/api/games";

const gameForm = document.getElementById("game-form");
const searchForm = document.getElementById("search-form");
const tableBody = document.getElementById("games-table-body");
const message = document.getElementById("message");
const submitButton = document.getElementById("submit-button");
const cancelEditButton = document.getElementById("cancel-edit-button");
const clearSearchButton = document.getElementById("clear-search-button");

let editingGameId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadGames();
});

gameForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const game = getGameFromForm();

  if (editingGameId) {
    await updateGame(editingGameId, game);
  } else {
    await createGame(game);
  }
});

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchName = document.getElementById("search-name").value.trim();
  await loadGames(searchName);
});

clearSearchButton.addEventListener("click", async () => {
  searchForm.reset();
  await loadGames();
});

cancelEditButton.addEventListener("click", () => {
  resetForm();
  showMessage("Edicion cancelada.");
});

async function loadGames(name = "") {
  try {
    const url = name ? `${API_URL}?name=${encodeURIComponent(name)}` : API_URL;
    const games = await request(url);

    renderGames(games);

    if (games.length === 0) {
      showMessage("No se encontraron juegos.");
    } else if (name) {
      showMessage(`Se encontraron ${games.length} juego(s).`);
    } else {
      showMessage("Juegos cargados correctamente.");
    }
  } catch (error) {
    renderEmptyTable("No se pudieron cargar los juegos.");
    showMessage(error.message, true);
  }
}

async function createGame(game) {
  try {
    await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });

    resetForm();
    await loadGames();
    showMessage("Juego creado correctamente.");
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function updateGame(id, game) {
  try {
    await request(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    });

    resetForm();
    await loadGames();
    showMessage("Juego actualizado correctamente.");
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function deleteGame(id) {
  const confirmed = confirm(`Seguro que deseas eliminar el juego "${id}"?`);

  if (!confirmed) {
    return;
  }

  try {
    await request(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (editingGameId === id) {
      resetForm();
    }

    await loadGames();
    showMessage("Juego eliminado correctamente.");
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    const errors = Array.isArray(data.errors) ? ` ${data.errors.join(" ")}` : "";
    throw new Error(`${data.message || "Ocurrio un error en la solicitud."}${errors}`);
  }

  return data;
}

function getGameFromForm() {
  return {
    id: document.getElementById("id").value.trim(),
    name: document.getElementById("name").value.trim(),
    minPlayers: Number(document.getElementById("minPlayers").value),
    maxPlayers: Number(document.getElementById("maxPlayers").value),
    avgDurationMinutes: Number(document.getElementById("avgDurationMinutes").value),
    acquiredDate: document.getElementById("acquiredDate").value.trim(),
    condition: document.getElementById("condition").value,
  };
}

function renderGames(games) {
  tableBody.innerHTML = "";

  if (games.length === 0) {
    renderEmptyTable("No hay juegos para mostrar.");
    return;
  }

  games.forEach((game) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${game.id}</td>
      <td>${game.name}</td>
      <td>${game.minPlayers} - ${game.maxPlayers}</td>
      <td>${game.avgDurationMinutes} min</td>
      <td>${game.acquiredDate}</td>
      <td>${translateCondition(game.condition)}</td>
      <td>
        <button type="button" data-action="edit" data-id="${game.id}">Editar</button>
        <button type="button" data-action="delete" data-id="${game.id}">Eliminar</button>
      </td>
    `;

    row.querySelector('[data-action="edit"]').addEventListener("click", () => {
      fillFormForEdit(game);
    });

    row.querySelector('[data-action="delete"]').addEventListener("click", () => {
      deleteGame(game.id);
    });

    tableBody.appendChild(row);
  });
}

function renderEmptyTable(text) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="7">${text}</td>
    </tr>
  `;
}

function fillFormForEdit(game) {
  editingGameId = game.id;

  document.getElementById("id").value = game.id;
  document.getElementById("id").readOnly = true;
  document.getElementById("name").value = game.name;
  document.getElementById("minPlayers").value = game.minPlayers;
  document.getElementById("maxPlayers").value = game.maxPlayers;
  document.getElementById("avgDurationMinutes").value = game.avgDurationMinutes;
  document.getElementById("acquiredDate").value = game.acquiredDate;
  document.getElementById("condition").value = game.condition;

  submitButton.textContent = "Actualizar juego";
  cancelEditButton.hidden = false;
  showMessage(`Editando el juego "${game.name}".`);
}

function resetForm() {
  editingGameId = null;
  gameForm.reset();

  document.getElementById("id").readOnly = false;
  submitButton.textContent = "Crear juego";
  cancelEditButton.hidden = true;
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "red" : "green";
}

function translateCondition(condition) {
  const conditions = {
    perfect: "Perfecto",
    lightly_used: "Ligeramente usado",
    worn: "Gastado",
    damaged: "Danado",
  };

  return conditions[condition] || condition;
}
