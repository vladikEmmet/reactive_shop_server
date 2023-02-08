const { Basket } = require("../models/models");
const basketDto = require("../dtos/basketDto");

class BasketService {
  async createBasket(userId) {
    const basket = await Basket.create({ userId });
    return new basketDto(basket);
  }
}

module.exports = new BasketService();
