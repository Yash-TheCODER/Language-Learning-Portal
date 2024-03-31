const express = require('express');
const router = express.Router();


const {signup,login} = require('../controllers/Auth');
const { selectCourse } = require('../controllers/Progress');
const { auth } = require('../middlewares/auth');
const { getCourses } = require('../controllers/Progress');
const { getCourseById  } = require('../controllers/Progress');

const { getSectionsByCourseId, getLessonsBySectionId, markLessonComplete } = require('../controllers/LessonProgress');


router.post("/login",login);
router.post("/signup",signup);
router.post("/selectCourse", auth, selectCourse);
router.get("/courses", getCourses);
router.get("/course/:courseId", getCourseById);


router.get("/course/:courseId/sections", auth, getSectionsByCourseId);
router.get("/course/:courseId/section/:sectionId/lessons", auth, getLessonsBySectionId);
router.post("/lesson/complete", auth, markLessonComplete);

module.exports = router;