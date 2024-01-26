const { Sequelize } = require("sequelize");
const config = require("../config/config.json");

const sequelize = new Sequelize(config.development);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.models = {};

db.models.User = require("./user.js")(sequelize, Sequelize.DataTypes);
db.models.Role = require("./role.js")(sequelize, Sequelize.DataTypes);
db.models.Room = require("./room.js")(sequelize, Sequelize.DataTypes);
db.models.AirQuality = require("./air-quality.js")(
  sequelize,
  Sequelize.DataTypes
);

// define associations
db.models.User.belongsTo(db.models.Role, { foreignKey: "roleId" });
db.models.Role.hasMany(db.models.User, { foreignKey: "roleId" });

db.models.Room.hasOne(db.models.User, { foreignKey: "roomId" });
db.models.User.belongsTo(db.models.Room, { foreignKey: "roomId" });

db.models.Room.hasMany(db.models.AirQuality, { foreignKey: "roomId" });
db.models.AirQuality.belongsTo(db.models.Room, { foreignKey: "roomId" });

module.exports = db;
