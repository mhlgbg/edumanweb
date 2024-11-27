import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import {
    CButton, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CFormLabel, CFormSelect
} from '@coreui/react';

const ScheduleIndividualTask = ({ scheduleId, students, tasks }) => {
    const [individualTasks, setIndividualTasks] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({ userId: '', taskId: '', dueDate: '', notes: '' });

    useEffect(() => {
        fetchIndividualTasks();
    }, []);

    const fetchIndividualTasks = async () => {
        try {
            const response = await axios.get(`/class-report/${scheduleId}/individual-tasks`);
            setIndividualTasks(response.data.individualTasks);
        } catch (error) {
            console.error('Error fetching individual tasks:', error);
        }
    };

    const handleAddTask = async () => {
        try {
            await axios.post(`/class-report/${scheduleId}/individual-tasks`, newTask);
            fetchIndividualTasks();
            setShowTaskModal(false);
            setNewTask({ userId: '', taskId: '', dueDate: '', notes: '' });
        } catch (error) {
            console.error('Error adding individual task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await axios.delete(`/class-report/${scheduleId}/individual-tasks/${taskId}`);
                fetchIndividualTasks();
            } catch (error) {
                console.error('Error deleting individual task:', error);
            }
        }
    };

    return (
        <div className="individual-task-section">
            <h4 className="section-title">Individual Tasks</h4>
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Student</CTableHeaderCell>
                        <CTableHeaderCell>Task</CTableHeaderCell>
                        <CTableHeaderCell>Due Date</CTableHeaderCell>
                        <CTableHeaderCell>Notes</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {individualTasks.map((task) => (
                        <CTableRow key={task._id}>
                            <CTableDataCell>{task.userId.fullName}</CTableDataCell>
                            <CTableDataCell>{task.taskId.title}</CTableDataCell>
                            <CTableDataCell>{new Date(task.dueDate).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>{task.notes}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="danger" onClick={() => handleDeleteTask(task._id)}>Delete</CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
            <CButton color="primary" onClick={() => setShowTaskModal(true)}>Add Task</CButton>

            {/* Modal to Add New Task */}
            <CModal visible={showTaskModal} onClose={() => setShowTaskModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Add Individual Task</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Student</CFormLabel>
                    <CFormSelect
                        value={newTask.userId}
                        onChange={(e) => setNewTask({ ...newTask, userId: e.target.value })}
                    >
                        <option value="">Select Student</option>
                        {students.map((student) => (
                            <option key={student.userId._id} value={student.userId._id}>
                                {student.userId.fullName}
                            </option>
                        ))}
                    </CFormSelect>

                    <CFormLabel>Task</CFormLabel>
                    <CFormSelect
                        value={newTask.taskId}
                        onChange={(e) => setNewTask({ ...newTask, taskId: e.target.value })}
                    >
                        <option value="">Select Task</option>
                        {tasks.map((task) => (
                            <option key={task._id} value={task._id}>
                                {task.title}
                            </option>
                        ))}
                    </CFormSelect>

                    <CFormLabel>Due Date</CFormLabel>
                    <CFormInput
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />

                    <CFormLabel>Notes</CFormLabel>
                    <CFormInput
                        type="text"
                        value={newTask.notes}
                        onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowTaskModal(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={handleAddTask}>Save Task</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ScheduleIndividualTask;
