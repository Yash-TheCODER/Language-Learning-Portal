const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require('../config/database'); 

// Authentication middleware
exports.auth = async (req, res, next) => {
    try {
        // Extract token from cookies, request body, or Authorization header
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorization")?.replace("Bearer ", "");

        // If token is missing, return an error response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing',
            });
        }

        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Stored decoded token information in req.user

            // Fetch user from the database to ensure they exist
            const queryText = `SELECT * FROM user WHERE USER_ID = ? LIMIT 1`;
            const [users] = await pool.execute(queryText, [decoded.id]);

            if (users.length === 0) {
                // User not found
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // Optionally attach more user details to the request object, excluding sensitive information like passwords
            req.userData = users[0];
            req.userData.PASSWORD = undefined; // Remove the password from the user object

        } catch (err) {
            // Token verification failed
            return res.status(401).json({
                success: false,
                message: 'Token is invalid',
            });
        }
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while validating the token',
        });
    }
};
