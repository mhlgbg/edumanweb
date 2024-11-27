import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import {
    CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CFormLabel,
    CTable, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CFormSelect
} from '@coreui/react';

const ScheduleTask = ({ tasks, onAddTask, onDeleteTask }) => {
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ taskId: '', dueDate: '' });
    const [taskOptions, setTaskOptions] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/tasks'); // API endpoint for fetching tasks
            setTaskOptions(response.data.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSaveTask = () => {
        onAddTask(newTask);
        setShowModal(false);
        setNewTask({ taskId: '', dueDate: '' });
    };

    const handleDeleteTask = (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            onDeleteTask(taskId);
        }
    };

    return (
        <div>
            <CTable striped hover>
                <CTableBody>
                    {tasks.map((task) => (
                        <CTableRow key={task.taskId}>
                            <CTableHeaderCell>{task.taskId.title}</CTableHeaderCell>
                            <CTableDataCell>{new Date(task.dueDate).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="danger" onClick={() => handleDeleteTask(task.taskId._id)}>Delete</CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
            <CButton color="primary" onClick={() => setShowModal(true)}>Add Task</CButton>

            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Add Task</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Select Task</CFormLabel>
                    <CFormSelect
                        value={newTask.taskId}
                        onChange={(e) => setNewTask({ ...newTask, taskId: e.target.value })}
                    >
                        <option value="">Select a task</option>
                        {taskOptions.map((task) => (
                            <option key={task._id} value={task._id}>{task.title}</option>
                        ))}
                    </CFormSelect>
                    <CFormLabel>Due Date</CFormLabel>
                    <CFormInput
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={handleSaveTask}>Save Task</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ScheduleTask;
