const pool = require('../config/database'); // Import the pool from your database configuration
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
require("dotenv").config();

exports.signup = async (req, res) => {
    try{
        
        const {
            NAME,
            EMAIL,
            PASSWORD,
            CONFIRM_PASSWORD
        } = req.body;

        if(!NAME || !EMAIL || !PASSWORD || !CONFIRM_PASSWORD) {
            return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
        }

        if (PASSWORD !== CONFIRM_PASSWORD) {
			return res.status(400).json({
				success: false,
				message: "Password and Confirm Password do not match. Please try again",
			});
		}
        // Check if user already exists

        const queryText = `SELECT EXISTS(SELECT 1 FROM user WHERE EMAIL = ?) AS "exists"`;
        let [rows] = await pool.execute(queryText, [EMAIL]);
        const existingUser = rows[0].exists;

        if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

        // Hash the password
		const hashedPassword = await bcrypt.hash(PASSWORD, 10);

        // Insert user into database
        // Make sure to adjust the table name and column names according to your database schema
        const insertUserQuery = `INSERT INTO user (NAME, EMAIL, PASSWORD, CREATE_DATE, USER_EXP) VALUES (?, ?, ?, CURRENT_DATE, 0)`;
       await pool.execute(insertUserQuery, [NAME, EMAIL, hashedPassword]);

        // await db.query(insertUserQuery, userValues);

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
        });
    } catch(error) {
        console.error(error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
    }
}


exports.login = async (req, res) => {
	try {
		// Get email and password from request body
		const { EMAIL, PASSWORD } = req.body;

		// Check if EMAIL or PASSWORD is missing
		if (!EMAIL || !PASSWORD) {
			return res.status(400).json({
				success: false,
				message: "Please fill up all the required fields.",
			});
		}

		// Find user with provided EMAIL
		const queryText = `SELECT * FROM user WHERE EMAIL = ? LIMIT 1`;
		const [users] = await pool.execute(queryText, [EMAIL]);

		// If user not found with provided EMAIL
		if (users.length === 0) {
			return res.status(401).json({
				success: false,
				message: "User is not registered with us. Please sign up to continue.",
			});
		}

		const user = users[0]; // Since SELECT * returns an array

		// Compare PASSWORD
		if (await bcrypt.compare(PASSWORD, user.PASSWORD)) {
			
			const token = jwt.sign(
				{ email: user.EMAIL, id: user.USER_ID},
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);


			// Exclude PASSWORD for security.
			const userData = { ...user, PASSWORD: undefined, CONFIRM_PASSWORD: undefined };

			// Set cookie for token and return success response
			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};
			res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user: userData,
				message: "User login successful.",
			});
		} else {
			return res.status(401).json({
				success: false,
				message: "Password is incorrect.",
			});
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Login failure. Please try again.",
		});
	}
};
