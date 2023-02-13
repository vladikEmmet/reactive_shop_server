module.exports = class BasketDto {
  id;
  devices = [];

  constructor(model) {
    this.id = model.id;
    this.devices = model.devices || [];
  }
};
