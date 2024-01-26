module.exports = (sequelize, DataTypes) => {
  const AirQuality = sequelize.define(
    "AirQuality",
    {
      temperature: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      humidity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      pm: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: "air_quality" }
  );

  return AirQuality;
};
