import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import { useParams, useNavigate   } from 'react-router-dom'; // Sử dụng useParams để lấy scheduleId từ URL
import TeacherNotes from './TeacherNotes';
import ScheduleTask from './ScheduleTask';
import ScheduleAttendance from './ScheduleAttendance';
import ScheduleGrade from './ScheduleGrade';
import ScheduleIndividualTask from './ScheduleIndividualTask';
import ScheduleIndividualMessage from './ScheduleIndividualMessage';
import ScheduleInfor from './ScheduleInfor';

import './ClassReport.css';

import {
    CButton
} from '@coreui/react';

const ClassReport = () => {
    const { scheduleId } = useParams(); // Lấy scheduleId từ URL
    const [schedule, setSchedule] = useState(null);
    const navigate = useNavigate(); // Khai báo navigate để điều hướng

    useEffect(() => {
        fetchScheduleData();
    }, []);

    const fetchScheduleData = async () => {
        try {
            const response = await axios.get(`/class-report/${scheduleId}`);
            console.log('fetchScheduleData ', response);
            setSchedule({
                report: response.data.report,
                students: response.data.students,
                tasks: response.data.tasks
            });
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    const handleAddNote = async (note) => {
        try {
            await axios.post(`/class-report/${scheduleId}/teacher-note`, note);
            fetchScheduleData();
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await axios.delete(`/class-report/${scheduleId}/teacher-note/${noteId}`);
            fetchScheduleData();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleAddTask = async (task) => {
        try {
            await axios.post(`/class-report/${scheduleId}/task`, task);
            fetchScheduleData();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await axios.delete(`/class-report/${scheduleId}/task/${taskId}`);
                fetchScheduleData();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleSubmitReport = async () => {
        if (window.confirm("Are you sure you want to submit the report? This will mark the schedule as completed.")) {
            try {
                await axios.put(`/class-report/${scheduleId}/complete`);
                window.alert("Report submitted successfully!");
                navigate('/study/classrooms'); // Điều hướng về /study/classrooms sau khi người dùng nhấn OK
            } catch (error) {
                console.error("Error submitting report:", error);
            }
        }
    };

    return (
        <div className="class-report-container">
            <ScheduleInfor schedule={schedule?.report} />

            <div className="section-container">
                <div className="section-header">Teacher Notes</div>
                <div className="section-content">
                    <TeacherNotes
                        notes={schedule?.report?.teacherNotes || []}
                        onAddNote={handleAddNote}
                        onDeleteNote={handleDeleteNote}
                    />
                </div>
            </div>

            <div className="section-container">
                <div className="section-header">Tasks</div>
                <div className="section-content">
                    <ScheduleTask
                        tasks={schedule?.report?.tasks || []}
                        onAddTask={handleAddTask}
                        onDeleteTask={handleDeleteTask}
                    />
                </div>
            </div>

            <div className="section-container">
                <div className="section-header">Attendance</div>
                <div className="section-content">
                    <ScheduleAttendance scheduleId={scheduleId} />
                </div>
            </div>
            <div className="section-container">
                <div className="section-header">Grade Management</div>
                <div className="section-content">
                    <ScheduleGrade scheduleId={scheduleId} grades={schedule?.grades || []} />
                </div>
            </div>

            <div className="section-container">
                <div className="section-header">Individual Tasks</div>
                <div className="section-content">
                    <ScheduleIndividualTask scheduleId={scheduleId} students={schedule?.students || []} tasks={schedule?.tasks || []} />
                </div>
            </div>

            <div className="section-container">
                <div className="section-header">Individual Messages</div>
                <div className="section-content">
                    <ScheduleIndividualMessage scheduleId={scheduleId} students={schedule?.students || []} />
                </div>
            </div>
            {/* Nút Gửi Báo Cáo */}
            <div className="submit-report">
                <CButton color="primary" onClick={handleSubmitReport}>Submit Report</CButton>
            </div>
        </div>
    );
};

export default ClassReport;
