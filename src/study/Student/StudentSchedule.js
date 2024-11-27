import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CButton, CFormSelect, CPagination, CPaginationItem } from '@coreui/react';
import axios from '../../api/api'; // Đường dẫn api của bạn
import { useSelector } from 'react-redux';

const StudentSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewCondition, setViewCondition] = useState('past');

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get('/student-schedule/schedules', {
                    params: {
                        viewCondition,
                        searchQuery,
                        page: currentPage,
                        limit: 12
                    }
                });
                setSchedules(response.data.schedules);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSchedules();
    }, [viewCondition, searchQuery, currentPage]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleConditionChange = (e) => {
        setViewCondition(e.target.value);
        setCurrentPage(1); // Reset trang khi đổi điều kiện
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <CCard>
            <CCardHeader>
                <h5>Lịch Học Của Tôi</h5>
                <div className="d-flex gap-2">
                    <CFormInput
                        placeholder="Tìm kiếm lớp hoặc thầy giáo"
                        onChange={handleSearch}
                        value={searchQuery}
                    />
                    <CFormSelect onChange={handleConditionChange} value={viewCondition}>                        
                        <option value="past">Quá khứ</option>
                        <option value="future">Tương lai</option>
                    </CFormSelect>
                    <CButton onClick={() => setCurrentPage(1)}>Tìm kiếm</CButton>
                </div>
            </CCardHeader>
            <CCardBody>
                <CTable>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Date</CTableHeaderCell>
                            <CTableHeaderCell>Start Hour</CTableHeaderCell>
                            <CTableHeaderCell>Duration</CTableHeaderCell>
                            <CTableHeaderCell>TeacherName</CTableHeaderCell>
                            <CTableHeaderCell>Class Name</CTableHeaderCell>
                            <CTableHeaderCell>Attendance</CTableHeaderCell>
                            <CTableHeaderCell>Number of Tasks</CTableHeaderCell>
                            <CTableHeaderCell>Number of Comments</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {schedules.map((schedule) => (
                            <CTableRow key={schedule._id}>
                                <CTableDataCell title={schedule.teacherNotes.map(note => `${note.title}: ${note.content}`).join('\n')}>
                                    {new Date(schedule.date).toLocaleDateString()}
                                </CTableDataCell>
                                <CTableDataCell>{`${schedule.startHour}:${schedule.startMinute}`}</CTableDataCell>
                                <CTableDataCell>{schedule.duration}</CTableDataCell>
                                <CTableDataCell>{schedule.teacherName}</CTableDataCell>
                                <CTableDataCell>{schedule.className}</CTableDataCell>
                                <CTableDataCell>{schedule.attendanceStatus}</CTableDataCell>
                                <CTableDataCell>{schedule.taskCount}</CTableDataCell>
                                <CTableDataCell>{schedule.commentCount}</CTableDataCell>
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

export default StudentSchedule;
