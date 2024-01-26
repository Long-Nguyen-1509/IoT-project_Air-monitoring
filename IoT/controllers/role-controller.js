const RoleService = require("../services/role-service");

exports.createRole = async (req, res) => {
  try {
    const newRole = await RoleService.createRole(req.body);
    res.status(201).json(newRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
