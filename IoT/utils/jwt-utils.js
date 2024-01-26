const { sign, verify } = require("jsonwebtoken");
const { getRoleById } = require("../services/role-service");

exports.generateJWT = (user, role) => {
  return sign(
    {
      userId: user.id,
      username: user.fullName,
      role: role.roleName,
      roomId: user.roomId,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "20m" }
  );
};

exports.verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        const nowInSeconds = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < nowInSeconds) {
          reject(new Error("Token has expired"));
        } else {
          resolve(decoded);
          console.log(decoded);
        }
      }
    });
  });
};
