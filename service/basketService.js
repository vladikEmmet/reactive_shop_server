const { Basket, BasketDevice, Device } = require("../models/models");
const basketDto = require("../dtos/basketDto");
const ApiError = require("../error/ApiError");

class BasketService {
  async createBasket(userId) {
    const basket = await Basket.create({ userId });
    return new basketDto(basket);
  }
}

module.exports = new BasketService();
