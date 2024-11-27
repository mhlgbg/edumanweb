import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CPagination, CPaginationItem } from '@coreui/react';
import axios from '../../api/api';
import { useNavigate } from 'react-router-dom';

const StudentTask = () => {
    const [tasks, setTasks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('/student-task/mytasks', {
                    params: {
                        page: currentPage,
                        limit: 10
                    }
                });
                setTasks(response.data.tasks);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách nhiệm vụ:', error);
            }
        };

        fetchTasks();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleSubmitTask = (userTaskId) => {
        navigate(`/student-task/${userTaskId}/comments`); // Chuyển đến màn hình comment
    };
    return (
        <CCard>
            <CCardHeader>
                <h5>Nhiệm Vụ Của Tôi</h5>
            </CCardHeader>
            <CCardBody>
                <CTable>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Nhiệm vụ</CTableHeaderCell>
                            <CTableHeaderCell>Ngày Đến Hạn</CTableHeaderCell>
                            <CTableHeaderCell>Điểm</CTableHeaderCell>
                            <CTableHeaderCell>Nhận Xét Của Thầy</CTableHeaderCell>
                            <CTableHeaderCell>Nộp Bài</CTableHeaderCell>

                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {tasks.map((task) => (
                            <CTableRow key={task._id}>
                                <CTableDataCell>{task.taskId.title}</CTableDataCell>
                                <CTableDataCell>{new Date(task.dueDate).toLocaleDateString()}</CTableDataCell>
                                <CTableDataCell>{task.score !== null ? task.score : 'Chưa có'}</CTableDataCell>
                                <CTableDataCell>{task.teacherComment || 'Không có nhận xét'}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="primary" onClick={() => handleSubmitTask(task._id)}>
                                        Nộp bài
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
                <CPagination align="center">
                    {[...Array(totalPages).keys()].map(page => (
                        <CPaginationItem
                            key={page + 1}
                            active={page + 1 === currentPage}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            {page + 1}
                        </CPaginationItem>
                    ))}
                </CPagination>
            </CCardBody>
        </CCard>
    );
};

export default StudentTask;
