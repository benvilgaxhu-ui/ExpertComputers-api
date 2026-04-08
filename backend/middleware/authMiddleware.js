const jwt = require('jsonwebtoken');

/**
 * 1. PROTECT: Verify if the user is logged in
 * Ensures the request contains a valid JWT "VIP Pass"
 */
const protect = (req, res, next) => {
    let token;

    // Check for "Authorization" header and ensure it starts with "Bearer "
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header: "Bearer <token_string>"
            token = req.headers.authorization.split(' ')[1];

            // Verify token against secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'expert_secret_key_123');

            // Attach decoded user data (ID & Role) to the Request object
            req.user = decoded;
            
            next(); // Move to the next function
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            res.status(401).json({ message: "Not authorized: Token expired or invalid" });
        }
    } else {
        res.status(401).json({ message: "No token provided, authorization denied" });
    }
};

/**
 * 2. ADMIN ONLY: Verify Role-based access
 * Ensures only users with the 'Admin' role can proceed
 */
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        // Forbidden status (403) for non-admin users
        res.status(403).json({ message: "Access denied: Administrator privileges required" });
    }
};

module.exports = { protect, adminOnly };