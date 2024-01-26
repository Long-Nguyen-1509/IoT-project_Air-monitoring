const { verifyJWT } = require("../utils/jwt-utils");
const { getUserByIdWithRole } = require("../services/user-service");

exports.authorization = (requiredRole) => {
  return async (req, res, next) => {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Missing token" });
    }
    try {
      const decoded = await verifyJWT(token);
      req.decoded = decoded;
      req.userToken = token;
      const user = await getUserByIdWithRole(decoded.userId);
      if (user && requiredRole.includes(decoded.role)) {
        next();
      } else {
        res.status(403).json({ error: "Forbidden - Insufficient permissions" });
      }
    } catch (error) {
      console.error("Error verifying JWT or authenticating user:", error);
      res
        .status(403)
        .json({ error: "Forbidden - Invalid token or authentication error" });
    }
  };
};

exports.userIdentifier = () => {
  return async (req, res, next) => {
    try {
      console.log("reached");
      const decoded = req.decoded;
      if (decoded.role === "admin") {
        next();
      } else if (
        (req.body &&
          req.body.id !== undefined &&
          decoded.roomId === req.body.id) ||
        (req.params &&
          req.params.id !== undefined &&
          decoded.roomId === parseInt(req.params.id, 10))
      ) {
        next();
      } else {
        res.status(403).json({
          error: "Forbidden - Unauthorized",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
};
