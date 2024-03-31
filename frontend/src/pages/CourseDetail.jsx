import React, { useState, useEffect } from 'react';
import CourseSections from '../components/CourseSections';

import { useParams } from 'react-router-dom';

const CourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`/api/v1/course/${courseId}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => setCourse(data))
            .catch(error => setError(error.toString()));
    }, [courseId]);

    if (error) return <div>Error: {error}</div>;
    if (!course) return <div>Loading...</div>;

    return (
        <div>
            <h1>{course.COURSE_NAME}</h1>
            <p>{course.COURSE_DETAILS}</p>
            <CourseSections courseId={courseId} />
        </div>
    );
};

export default CourseDetail;
