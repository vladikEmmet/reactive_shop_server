module.exports = class BasketDto {
  id;

  constructor(model) {
    this.id = model.id;
  }
};
