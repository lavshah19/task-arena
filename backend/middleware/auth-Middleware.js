const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // brearer ehydhshdbzbzkdlzdbzkjsbdjkbzjkdsbjkdsbjkdsbjksdb

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Please login to continue"
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again."
    });
  }
};

module.exports = authMiddleware;
