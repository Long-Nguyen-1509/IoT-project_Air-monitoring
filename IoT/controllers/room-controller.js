const RoomService = require("../services/room-service.js");

exports.addRoom = async (req, res) => {
  try {
    const { room, user } = await RoomService.addRoom(req.body);
    res.status(201).json({ room: room, user: user });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await RoomService.getRoom(req.params.id);
    res.status(200).json({ room: room, user: room.User });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getAllRoom = async (req, res) => {
  try {
    const roomList = await RoomService.getAllRoom();
    console.log("reached");
    console.log(roomList);
    res.status(200).json(roomList);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await RoomService.deleteRoom(req.params.id);
    res
      .status(200)
      .json({ message: `Room ${req.params.id} deleted successfully` });
  } catch (error) {
    console.log(error.message);
    res.status(404).json(error.message);
  }
};
