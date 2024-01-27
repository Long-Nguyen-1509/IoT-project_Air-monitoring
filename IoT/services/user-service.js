const bcrypt = require("bcrypt");
const { generateJWT } = require("../utils/jwt-utils");
const {
  models: { User, Role, Room },
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

exports.getUsers = async () => {
  return User.findAll();
};

exports.getUserById = async (userId) => {
  return User.findByPk(userId);
};

exports.getUserByRoomId = async (roomId) => {
  return User.findOne({ where: { roomId: roomId } });
};

exports.getUserByIdWithRole = async (userId) => {
  try {
    const user = User.findOne({
      where: { id: userId },
      include: Role,
    });

    return user;
  } catch (error) {
    console.error("Error finding user with role:", error);
    throw new Error("Error finding user with role");
  }
};

exports.updateUser = async (userId, updatedData) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const updatedUser = await user.update({ ...updatedData });
      return updatedUser;
    }
    return "User not found";
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Error updating user");
  }
};

exports.deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (user) {
    return user.destroy();
  }
  return null;
};

exports.registerUser = async (roomId, userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await User.create({
      ...userData,
      username: roomId,
      password: hashedPassword,
      roomId: roomId,
      roleId: 2,
    });

    return newUser;
  } catch (error) {
    throw new Error("Registration failed");
  }
};
exports.loginUser = async (username, password) => {
  try {
    const user = await User.findOne({
      where: { username },
      include: [{ model: Role, attributes: ["roleName"] }],
    });

    if (!user) {
      throw new Error("User does not exist");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("Password is incorrect");
    }
    const role = user.Role;
    const token = generateJWT(user, role);
    return { user, token };
  } catch (error) {
    console.error("Error during user authentication:", error);
    throw error;
  }
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found: " + userId);
    } else {
      const hashedPassword = await bcrypt.compare(oldPassword, user.password);
      if (hashedPassword) {
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.update({ password: newHashedPassword });
        return;
      } else {
        throw new Error("Old password is incorrect");
      }
    }
  } catch (error) {
    console.error("Error during change password:", error);
    throw error;
  }
};

exports.logoutUser = async (userId, token) => {
  try {
    return;
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

exports.adminChangePassword = async (userId, newPassword) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found: " + userId);
    } else {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      user.update({ password: newHashedPassword });
      return;
    }
  } catch (error) {
    throw error;
  }
};

exports.adminChangeInfo = async (userId, data) => {
  try {
    const { fullName, phoneNumber } = data;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const newUser = await user.update({
      fullName: fullName,
      phoneNumber: phoneNumber,
    });
    return newUser;
  } catch (error) {}
};

exports.registerAdmin = async (data) => {
  try {
    console.log(data.password);
    const user = await User.findOne({ where: { username: data.username } });
    if (user) {
      throw new Error("User already registered");
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = await User.create({
        ...data,
        password: hashedPassword,
        roleId: 1,
      });
      return newUser;
    }
  } catch (error) {
    console.error("Error during registering admin:", error);
    throw error;
  }
};

exports.checkChatId = async (chatId) => {
  try {
    const user = await User.findOne({ where: { chatId: chatId } });
    if (!user) {
      return;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

exports.registerChatId = async (chatId, phoneNumber) => {
  try {
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    const user = await User.findOne({
      where: { phoneNumber: formattedPhoneNumber },
    });
    if (!user) {
      throw new Error("User does not exist");
    }
    await user.update({ chatId: chatId });
  } catch (error) {
    throw error;
  }
};

function formatPhoneNumber(globalFormNumber) {
  const numberWithoutPlus = globalFormNumber.replace(/^\+/, "");

  const replacedNumber = numberWithoutPlus.replace(/^84/, "0");

  return replacedNumber;
}
