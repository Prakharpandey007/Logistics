import jwt from "jsonwebtoken";
export const authenticate = (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization); // Debugging

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
      console.log("Missing Token"); // Debugging
      return res.status(401).json({
          success: false,
          message: "Unauthorized token"
      });
  }
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // Debugging
      req.user = decoded;
      next();
  } catch (error) {
      console.log("Invalid Token Error:", error.message); // Debugging
      res.status(401).json({ success: false, message: "Invalid token" });
  }
};
