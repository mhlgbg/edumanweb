import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CButton,
    CFormInput,
    CPagination,
    CPaginationItem,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormLabel,
    CFormSelect
} from '@coreui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TaskListPage = () => {
    const [tasks, setTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [description, setDescription] = useState('');

    const limit = 10;

    useEffect(() => {
        fetchTasks();
    }, [page, searchText]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/tasks`, {
                params: { page, limit, search: searchText }
            });
            setTasks(response.data.tasks);
            setTotalTasks(response.data.totalTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        setPage(1); // Reset to first page on new search
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const openModal = (task = null) => {
        setModalType(task ? 'edit' : 'add');
        setCurrentTask(task || {
            title: '',
            description: '',
            difficultyLevel: 'Beginner',
            tags: []
        });
        setDescription(task ? task.description : '');
        setShowModal(true);
    };

    const saveTask = async () => {
        try {
            const taskData = {
                ...currentTask,
                description // Use state description for HTML content
            };
            if (modalType === 'add') {
                await axios.post('/tasks', taskData);
            } else {
                await axios.put(`/tasks/${currentTask._id}`, taskData);
            }
            fetchTasks();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`/tasks/${taskId}`);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const totalPages = Math.ceil(totalTasks / limit);

    return (
        <>
            <CCard>
                <CCardHeader>
                    <h4>Task Management</h4>
                    <CFormInput
                        type="text"
                        placeholder="Search tasks..."
                        value={searchText}
                        onChange={handleSearch}
                        className="mb-3"
                    />
                    <CButton color="primary" onClick={() => openModal()}>
                        Add New Task
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    <CTable striped hover>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Title</CTableHeaderCell>
                                <CTableHeaderCell>Difficulty</CTableHeaderCell>
                                <CTableHeaderCell>Tags</CTableHeaderCell>
                                <CTableHeaderCell>Description</CTableHeaderCell>
                                <CTableHeaderCell>Actions</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {tasks.map((task) => (
                                <CTableRow key={task._id}>
                                    <CTableDataCell>{task.title}</CTableDataCell>
                                    <CTableDataCell>{task.difficultyLevel}</CTableDataCell>
                                    <CTableDataCell>{task.tags.join(', ')}</CTableDataCell>
                                    <CTableDataCell>
                                        <div dangerouslySetInnerHTML={{ __html: task.description }} />
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CButton
                                            color="warning"
                                            size="sm"
                                            onClick={() => openModal(task)}
                                            className="me-2"
                                        >
                                            Edit
                                        </CButton>
                                        <CButton
                                            color="danger"
                                            size="sm"
                                            onClick={() => deleteTask(task._id)}
                                        >
                                            Delete
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            {/* Pagination */}
            <CPagination align="center">
                <CPaginationItem
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </CPaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                    <CPaginationItem
                        key={i + 1}
                        active={i + 1 === page}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </CPaginationItem>
                ))}
                <CPaginationItem
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </CPaginationItem>
            </CPagination>

            {/* Modal for Add/Edit Task */}
            <CModal visible={showModal} onClose={() => setShowModal(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle>{modalType === 'add' ? 'Add Task' : 'Edit Task'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Title</CFormLabel>
                    <CFormInput
                        type="text"
                        value={currentTask?.title || ''}
                        onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                        required
                    />

                    <CFormLabel>Difficulty Level</CFormLabel>
                    <CFormSelect
                        value={currentTask?.difficultyLevel || 'Beginner'}
                        onChange={(e) =>
                            setCurrentTask({ ...currentTask, difficultyLevel: e.target.value })
                        }
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </CFormSelect>

                    <CFormLabel>Tags (comma separated)</CFormLabel>
                    <CFormInput
                        type="text"
                        value={currentTask?.tags?.join(', ') || ''}
                        onChange={(e) =>
                            setCurrentTask({ ...currentTask, tags: e.target.value.split(',').map(tag => tag.trim()) })
                        }
                    />

                    <CFormLabel>Description</CFormLabel>
                    <ReactQuill theme="snow" value={description} onChange={setDescription} />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={saveTask}>
                        Save
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default TaskListPage;
