const AirQualityService = require("../services/air-quality-service");

exports.getAirQualityByRoomId = async (req, res) => {
  try {
    const lastUpdate = await AirQualityService.getAirQualityByRoomId(
      req.params.id
    );
    res.status(200).json(lastUpdate);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

exports.getAverageIn24hByRoomId = async (req, res) => {
  try {
    const averageData = await AirQualityService.getAverageIn24hByRoomId(
      req.params.id
    );
    res.status(200).json(averageData);
  } catch (error) {
    res.status(404).json(error.message);
  }
};
