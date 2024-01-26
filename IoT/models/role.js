module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Role;
};
