const express = require("express");
const RoleController = require("../controllers/role-controller");
const UserController = require("../controllers/user-controller");
const RoomController = require("../controllers/room-controller");
const AirQualityController = require("../controllers/air-quality-controller");
const {
  authorization,
  userIdentifier,
} = require("../middlewares/auth-middleware");

const router = express.Router();

router.post("/role", RoleController.createRole);
router.post("/register-admin", UserController.registerAdmin);
router.post("/login", UserController.loginUser);
router.post(
  "/logout",
  authorization(["tenant", "admin"]),
  userIdentifier(),
  UserController.logoutUser
);

router.put(
  "/change-password",
  authorization(["tenant", "admin"]),
  userIdentifier(),
  UserController.changePassword
);

router.get(
  "/room/:id",
  authorization(["tenant", "admin"]),
  userIdentifier(),
  RoomController.getRoom
);

router.get(
  "/room/:id/quality",
  authorization(["tenant", "admin"]),
  userIdentifier(),
  AirQualityController.getAirQualityByRoomId
);

router.get(
  "/room/:id/average-quality",
  authorization(["tenant", "admin"]),
  userIdentifier(),
  AirQualityController.getAverageIn24hByRoomId
);

router.use("/admin", authorization("admin"));
router.get("/admin/room", RoomController.getAllRoom);
router.post("/admin/room", RoomController.addRoom);
router.delete("/admin/room/:id", RoomController.deleteRoom);
router.post("/admin/room/:id/register-user", UserController.registerUser);
router.put(
  "/admin/user/:id/change-password",
  UserController.adminChangePassword
);
router.put("/admin/user/:id/change-info", UserController.adminChangeInfo);

module.exports = router;
