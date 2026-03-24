// ─────────────────────────────────────────────
//  middleware/auth.js — JWT Verification Guard
// ─────────────────────────────────────────────
const jwt = require("jsonwebtoken");

/**
 * Protect private routes by verifying the JWT sent in the
 * Authorization header: "Bearer <token>"
 *
 * On success  → attaches decoded payload to req.user and calls next()
 * On failure  → responds with 401 Unauthorized
 */
const protect = (req, res, next) => {
  // 1. Read the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token — access denied" });
  }

  // 2. Extract the token part after "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verify signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user payload (id, email) to the request object
    req.user = decoded;

    next(); // hand off to the route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;
