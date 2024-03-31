import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Home = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch courses
        fetch('/api/v1/courses') 
            .then(response => response.json())
            .then(data => {
                setCourses(data);
            })
            .catch(error => console.log(error));
    }, []);

    const handleEnroll = async (courseId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/v1/selectCourse', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ COURSE_ID: courseId }),
            });
            console.log(courseId)
            const data = await response.json();
            if (response.ok) {
                // Whether new or existing enrollment navigate to the course page 
                console.log(data.message); // Log success or info message
                navigate(`/course/${courseId}`);
            } else {
                throw new Error(data.message || 'Enrollment failed');
            }
        } catch (error) {
            console.error('Enrollment failed', error.message);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
                <div key={course.COURSE_ID} className="bg-white rounded-lg shadow-md p-6 cursor-pointer" onClick={() => handleEnroll(course.COURSE_ID)}>
                    <h2 className="text-xl font-semibold mb-2">{course.COURSE_NAME}</h2>
                    <p>{course.COURSE_DETAILS}</p>
                </div>
            ))}
        </div>
    );
};

export default Home;
