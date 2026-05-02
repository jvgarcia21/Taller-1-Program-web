const { Router } = require("express");
const gamesController = require("./games.controller");

const router = Router();

router.get("/", gamesController.getAllGames);
router.get("/:id", gamesController.getGameById);
router.post("/", gamesController.createGame);
router.put("/:id", gamesController.updateGame);
router.delete("/:id", gamesController.deleteGame);

module.exports = router;
