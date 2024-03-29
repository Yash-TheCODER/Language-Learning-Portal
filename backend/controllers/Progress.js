// Import pool from your database configuration file
const pool = require('../config/database');

exports.selectCourse = async (req, res) => {
    try {
        const USER_ID = req.user.id; 
        const { COURSE_ID } = req.body;

        // Check if the user has already selected the course
        const checkProgressQuery = `SELECT COUNT(*) AS count FROM progress WHERE USER_ID = ? AND COURSE_ID = ?`;
        const [checkResult] = await pool.execute(checkProgressQuery, [USER_ID, COURSE_ID]);

        if (checkResult[0].count === 0) {
            // Since the user has not previously selected this course,
            // Increasing enrollment in the course table
            const updateCourseQuery = `UPDATE course SET ENROLLMENT = ENROLLMENT + 1 WHERE COURSE_ID = ?`;
            await pool.execute(updateCourseQuery, [COURSE_ID]);

            // Insert into progress table
            const insertProgressQuery = `INSERT INTO progress (USER_ID, COURSE_ID, WORDS_LEARNED, LESSONS_DONE, EXP_GAIN) VALUES (?, ?, 0, 0, 0)`;
            await pool.execute(insertProgressQuery, [USER_ID, COURSE_ID]);

            res.status(200).json({
                success: true,
                message: "Course selected successfully, and progress initialized."
            });
        } else {
            // User has already selected the course
            res.status(200).json({
                success: true,
                message: "User already enrolled in this course.",
                newUser: false 
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while selecting the course."
        });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const [courses] = await pool.execute('SELECT * FROM course');
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch courses" });
    }
};


exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const [courseDetails] = await pool.execute('SELECT * FROM course WHERE COURSE_ID = ?', [courseId]);
        
        if (courseDetails.length > 0) {
            res.json(courseDetails[0]);
        } else {
            res.status(404).json({ success: false, message: "Course not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch course details" });
    }
};
