const Router = require("express");
const router = new Router();
const deviceController = require("../controllers/deviceController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), deviceController.create);
router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOne);
router.post("/rate", authMiddleware, deviceController.sendRate);

module.exports = router;
