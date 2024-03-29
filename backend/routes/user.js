const express = require('express');
const router = express.Router();


const {signup,login} = require('../controllers/Auth');
const { selectCourse } = require('../controllers/Progress');
const { auth } = require('../middlewares/auth');
const { getCourses } = require('../controllers/Progress');

router.post("/login",login);
router.post("/signup",signup);
router.post("/selectCourse", auth, selectCourse);
router.get("/courses", getCourses);


module.exports = router;