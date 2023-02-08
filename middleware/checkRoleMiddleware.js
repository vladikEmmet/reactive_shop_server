const jwt = require("jsonwebtoken");

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    // return res.status(401).json({ message: req.headers.authorization });
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Not authorized" });
      }
      const decoded = jwt.verify(token, process.env.JWT_ACCESS);
      if (decoded.role !== role) {
        return res.status(403).json({ message: "No access" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: err });
    }
  };
};
