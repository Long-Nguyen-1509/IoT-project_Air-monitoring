const {
  models: { AirQuality },
} = require("../models");
const { Op } = require("sequelize");
exports.saveAirQuality = async (roomId, airQualityData) => {
  try {
    const { temperature, humidity, pm } = airQualityData;
    return await AirQuality.create({
      roomId: roomId,
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      pm: parseInt(pm),
    });
  } catch (error) {
    console.log("Error saving air quality data:", error);
    throw error;
  }
};

exports.getAirQualityByRoomId = async (roomId) => {
  console.log("reached");
  console.log(roomId);
  try {
    const lastUpdate = await AirQuality.findOne({
      where: {
        roomId: roomId,
      },
      order: [["createdAt", "DESC"]],
    });
    if (!lastUpdate) {
      throw new Error(`No air quality index found for room ${roomId}`);
    }
    console.log(lastUpdate);
    return lastUpdate;
  } catch (error) {
    throw error;
  }
};

exports.getAverageIn24hByRoomId = async (roomId) => {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    const averageData = await AirQuality.findAll({
      attributes: [
        [
          AirQuality.sequelize.fn(
            "HOUR",
            AirQuality.sequelize.col("created_at")
          ),
          "hour",
        ],
        [
          AirQuality.sequelize.fn(
            "AVG",
            AirQuality.sequelize.col("temperature")
          ),
          "averageTemperature",
        ],
        [
          AirQuality.sequelize.fn("AVG", AirQuality.sequelize.col("humidity")),
          "averageHumidity",
        ],
        [
          AirQuality.sequelize.fn("AVG", AirQuality.sequelize.col("pm")),
          "averagePm",
        ],
      ],
      where: {
        roomId: roomId,
        createdAt: {
          [Op.between]: [twentyFourHoursAgo, now],
        },
      },
      group: ["hour"],
    });
    if (!averageData) {
      throw new Error(`No average air quality data found for room ${roomId}`);
    }
    return averageData;
  } catch (error) {
    throw error;
  }
};
