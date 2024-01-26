module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define("Room", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numberOfTenants: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Room;
};
