const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo, Rating } = require("../models/models");
const ApiError = require("../error/ApiError");

class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      const product = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });

      if (info) {
        const infoJson = JSON.parse(info);
        infoJson.forEach(async (i) => {
          await DeviceInfo.create({
            title: i.title,
            description: i.description,
            DeviceId: product.id,
          });
        });
      }

      return res.json(product);
    } catch (err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async sendRate(req, res, next) {
    try {
      const { id, userId, rate } = req.body;
      const user = await Rating.findOne({ where: { userId, DeviceId: id } });
      if (user) {
        throw new Error("You can't rate it twice");
      }
      const device = await Device.findOne({ where: { id } });
      const newRate = await Rating.create({
        rate,
        userId,
        DeviceId: id,
      });
      const allRates = await Rating.count({ where: { DeviceId: id } });
      const totalRate = Math.round((device.rating + rate) / allRates);
      device.rating = totalRate;
      await device.save();

      return res.json(totalRate);
    } catch (err) {
      next(ApiError.badRequest(err.message));
    }
  }

  async getAll(req, res) {
    const { brandId, typeId, limit, page } = req.query;
    const pageNum = page || 1;
    const limitNum = limit || 9;
    let offset = pageNum * limitNum - limitNum;
    let devices;

    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      });
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
      });
    }

    return res.json(devices);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });
    return res.json(device);
  }
}

module.exports = new DeviceController();
