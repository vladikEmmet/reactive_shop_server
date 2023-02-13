const Router = require("express");
const router = new Router();
const basketController = require("../controllers/basketController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, basketController.getBasketUser);
router.post("/", authMiddleware, basketController.addToBasket);
router.delete("/", authMiddleware, basketController.removeItem);

module.exports = router;
