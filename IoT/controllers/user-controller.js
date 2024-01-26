const UserService = require("../services/user-service");

exports.getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserByIdWithRole(req.params.id);
    res.status(200).json({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.Role.roleName,
      isBanned: user.isBanned,
    });
  } catch (error) {
    res.status(500).json(error.meassage);
  }
};

exports.registerUser = async (req, res) => {
  try {
    const newUser = await UserService.registerUser(req.params.id, req.body);
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(201).json(error.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await UserService.loginUser(username, password);
    res.status(200).json({ user: user, token: token });
  } catch (error) {
    res.status(401).json(error.message);
  }
};

exports.logoutUser = async (req, res) => {
  try {
    const decoded = req.decoded;
    const token = req.userToken;
    await UserService.logoutUser(decoded.userId, token);
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const decoded = req.decoded;
    await UserService.changePassword(
      decoded.userId,
      req.body.oldPassword,
      req.body.newPassword
    );
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json(error.meassage);
  }
};

exports.adminChangePassword = async (req, res) => {
  try {
    await UserService.changePassword(req.params.id, req.body.newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(404).json(error.message);
  }
};

exports.adminChangeInfo = async (req, res) => {
  try {
    const newUser = await UserService.changeInfo(req.params.id, req.body);
    res.status(200).json(newUser);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    console.log(req.body);
    const admin = await UserService.registerAdmin(req.body);
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
