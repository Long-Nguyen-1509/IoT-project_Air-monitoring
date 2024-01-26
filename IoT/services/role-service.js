const {
  models: { Role },
} = require("../models");

exports.createRole = async (roleData) => {
  return Role.create({ ...roleData });
};

exports.getRoles = async () => {
  return Role.findAll();
};

exports.getRoleById = async (roleId) => {
  return Role.findByPk(roleId);
};

exports.updateRole = async (roleId, updatedData) => {
  const role = await Role.findByPk(roleId);
  if (role) {
    return role.update(updatedData);
  }
  return null;
};

exports.deleteRole = async (roleId) => {
  const role = await Role.findByPk(roleId);
  if (role) {
    return role.destroy();
  }
  return null;
};
