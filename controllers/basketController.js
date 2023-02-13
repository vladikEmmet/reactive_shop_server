const ApiError = require("../error/ApiError");
const { Device, BasketDevice } = require("../models/models");
const basketService = require("../service/basketService");
const deviceController = require("./deviceController");

class BasketController {
  async addToBasket(req, res, next) {
    try {
      const user = req.user;
      if (!user) {
        throw ApiError.UnauthorizedError();
      }
      const { deviceId } = req.body;
      const basket = await BasketDevice.create({
        basketId: user.id,
        DeviceId: deviceId,
      });
      return res.json(basket);
    } catch (err) {
      next(err);
    }
  }

  async getBasketUser(req, res, next) {
    try {
      const { id } = req.user;
      if (!id) {
        throw ApiError.UnauthorizedError();
      }
      const basket = await BasketDevice.findAll({
        include: {
          model: Device,
        },
        where: { basketId: id },
      });

      return res.json(basket);
    } catch (err) {
      next(err);
    }
  }

  async removeItem(req, res, next) {
    try {
      const { productId } = req.body;
      if (!productId) {
        throw ApiError.badRequest("Device not found");
      }

      const removedItem = await BasketDevice.destroy({
        where: { id: productId },
      });

      return res.json({ removedItem });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BasketController();
