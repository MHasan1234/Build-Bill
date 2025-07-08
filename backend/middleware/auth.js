import jwt from "jsonwebtoken";

// ✅ Only read process.env.JWT_SECRET inside the function.
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}; 

export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  };
};

