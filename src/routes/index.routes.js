const { Router } = require("express");
const gamesRoutes = require("../modules/games/games.routes");

const router = Router();

router.use("/games", gamesRoutes);

module.exports = router;
