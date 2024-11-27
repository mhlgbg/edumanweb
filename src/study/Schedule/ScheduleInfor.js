import React from 'react';
import './ScheduleInfor.css';

const ScheduleInfor = ({ schedule }) => {
    if (!schedule) return null;
    console.log(schedule);
    const { userId, classId, date, startHour, startMinute, duration } = schedule;

    const formattedDate = new Date(date).toLocaleDateString();
    const formattedTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;

    return (
        <div className="schedule-info">
            <p><strong>Teacher:</strong> {userId?.fullName || 'N/A'}</p>
            <p><strong>Class:</strong> {classId?.name || 'N/A'}</p>
            <p><strong>Date:</strong> {formattedDate}</p>
            <p><strong>Start Time:</strong> {formattedTime}</p>
            <p><strong>Duration:</strong> {duration} minutes</p>
        </div>
    );
};

export default ScheduleInfor;
