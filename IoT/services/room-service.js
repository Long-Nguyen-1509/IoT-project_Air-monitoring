const {
  models: { Room, User },
} = require("../models");

const bcrypt = require("bcrypt");

exports.addRoom = async (data) => {
  try {
    const room = await Room.create({ ...data });
    const hashedPassword = await bcrypt.hash("1", 10);

    const user = await User.create({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      username: data.id,
      password: hashedPassword,
      roomId: data.id,
      roleId: 2,
    });
    return { room, user };
  } catch (error) {
    throw new Error("Failed to create Room: " + error);
  }
};

exports.getRoom = async (roomId) => {
  try {
    const room = await Room.findOne({
      where: { id: roomId },
      include: User,
    });
    if (!room) {
      throw new Error("Cannot find Room: " + roomId);
    }
    return room;
  } catch (error) {
    throw error;
  }
};

exports.getAllRoom = async () => {
  try {
    const roomList = await Room.findAll();
    if (roomList.length === 0) {
      throw new Error("There are no Room:", error.message);
    }
    return roomList;
  } catch (error) {
    throw error;
  }
};

exports.deleteRoom = async (roomId) => {
  try {
    const room = await Room.findByPk(roomId);
    if (!room) {
      throw new Error(`Cannot find room ${roomId}`);
    }
    const user = await room.getUser();
    if (user) {
      await user.destroy();
    }
    await room.destroy();
    return;
  } catch (error) {
    throw error;
  }
};
