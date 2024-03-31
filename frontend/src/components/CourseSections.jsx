
import React, { useState, useEffect } from 'react';
import CourseContent from './CourseContent'; 

const CourseSections = ({ courseId }) => {
    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/v1/course/${courseId}/sections`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setSections(data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error.toString());
                setIsLoading(false);
            });
    }, [courseId]);

    if (isLoading) return <div>Loading sections...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {sections.map(section => (
                <div key={section.SECTION_ID}>
                    <h2 className='text-red-500'>{section.SECTION_NAME}</h2>
                    <CourseContent sectionId={section.SECTION_ID}  courseId={courseId}/>
                </div>
            ))}
        </div>
    );
};

export default CourseSections;
