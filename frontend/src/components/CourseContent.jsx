import React, { useState, useEffect } from 'react';

const CourseContent = ({ sectionId,courseId }) => {
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    // console.log(courseId)
    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/v1/course/${courseId}/section/${sectionId}/lessons`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setLessons(data.map(lesson => ({ ...lesson, completed: false })));
                setIsLoading(false);
            })
            .catch(error => {
                setError(error.toString());
                setIsLoading(false);
            });
    }, [sectionId, courseId]);

    const completeLesson = (lessonId,courseId,sectionId) => {
        console.log(localStorage)
        // const userId = localStorage.getItem('userId'); 
        // console.log(userId)
        // if (!userId) {
        //     console.error('User ID not found');
        //     return;
        // }
        fetch('/api/v1/lesson/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessonId,courseId,sectionId }),
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to mark lesson as complete');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                setLessons(lessons.map(lesson => {
                    if (lesson.LESSON_ID === lessonId) {
                        return { ...lesson, completed: true };
                    }
                    return lesson;
                }));
            }
        })
        .catch(error => {
            console.error('Error completing lesson:', error);
        });
    };

    if (isLoading) return <div>Loading lessons...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {lessons.map(lesson => (
                <div key={lesson.LESSON_ID}>
                    <p>{lesson.LESSON_NAME}</p>
                    <button onClick={() => completeLesson(lesson.LESSON_ID,courseId,sectionId)} disabled={lesson.completed}>
                        {lesson.completed ? 'Completed' : 'Complete Lesson'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CourseContent;
