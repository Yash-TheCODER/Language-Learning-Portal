const pool = require('../config/database');
exports.getSectionsByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;
        const [sections] = await pool.execute('SELECT * FROM section WHERE COURSE_ID = ?', [courseId]);
        res.json(sections);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch sections" });
    }
};

exports.getLessonsBySectionId = async (req, res) => {
    try {
        const { sectionId, courseId } = req.params;
        const [lessons] = await pool.execute('SELECT * FROM lesson WHERE SECTION_ID = ? AND COURSE_ID = ?', [sectionId, courseId]);

        res.json(lessons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch lessons" });
    }
};

async function getCourseIdForLesson(lessonId) {
    try {
        const [rows] = await pool.execute('SELECT SECTION_ID FROM lesson WHERE LESSON_ID = ?', [lessonId]);
        if(rows.length > 0) {
            const sectionId = rows[0].SECTION_ID;
            const [courseRows] = await pool.execute('SELECT COURSE_ID FROM section WHERE SECTION_ID = ?', [sectionId]);
            if(courseRows.length > 0) {
                return courseRows[0].COURSE_ID;
            }
        }
        throw new Error('Course not found for the provided lessonId');
    } catch (error) {
        console.error('Error fetching courseId:', error);
        throw error;
    }
}


exports.markLessonComplete = async (req, res) => {
    const { lessonId, courseId, sectionId } = req.body;
    const USER_ID = req.user.id;
    try {
        const courseId = await getCourseIdForLesson(lessonId);
        const countQuery = `SELECT COUNT(*) AS count FROM lesson_status WHERE LESSON_ID = ? AND USER_ID = ? AND COURSE_ID = ? AND SECTION_ID = ? AND STATUS = 'completed'`;
        const [[{ count }]] = await pool.execute(countQuery, [lessonId, USER_ID, courseId, sectionId]); 
        
        if(count == 0) {

            const insertUserExpQuery = `UPDATE USER SET USER_EXP = USER_EXP + 5 WHERE USER_ID = ${USER_ID}`;
            await pool.execute(insertUserExpQuery,[USER_ID]);

            const insertLessonStatusQuery = `INSERT INTO lesson_status (USER_ID,COURSE_ID, SECTION_ID, LESSON_ID, STATUS) VALUES (?, ?,?,?, 'completed') ON DUPLICATE KEY UPDATE STATUS = 'completed'`;
            await pool.execute(insertLessonStatusQuery, [USER_ID,courseId,sectionId, lessonId]);

            const updateProgressQuery = `UPDATE progress SET LESSONS_DONE = LESSONS_DONE + 1, EXP_GAIN = EXP_GAIN + 5 WHERE USER_ID = ? AND COURSE_ID = ?`;
            await pool.execute(updateProgressQuery, [USER_ID, courseId]);

            res.json({ success: true, message: "Lesson marked as complete and progress updated." });
        } else {
            // Lesson already completed -> do not update progress
            res.json({ success: true, message: "Lesson is already completed." });
        }        
    } catch (error) {
        console.error('Failed to mark lesson as complete:', error);
        res.status(500).json({ success: false, message: "Failed to mark lesson as complete and update progress" });
    }
};
