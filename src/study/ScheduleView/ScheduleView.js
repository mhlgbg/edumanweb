import React, { useState, useEffect } from 'react';
import {
    CFormSelect,
    CButton,
    CFormInput,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCalendar } from '@coreui/icons';
import ScheduleByTeacher from './ScheduleByTeacher';
import ScheduleByRoom from './ScheduleByRoom';
import ScheduleByDay from './ScheduleByDay';
import ScheduleBySubject from './ScheduleBySubject';
import axios from '../../api/api';

const ScheduleView = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(''); // Học kỳ được chọn
    const [viewType, setViewType] = useState(''); // Loại thời khóa biểu
    const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]); // Ngày tìm kiếm
    const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi
    const [showSchedule, setShowSchedule] = useState(false); // Hiển thị thời khóa biểu

    // Lấy danh sách học kỳ từ API
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await axios.get('/semesters'); // Đường dẫn API
                setSemesters(response.data);
            } catch (error) {
                console.error('Error fetching semesters:', error);
            }
        };
        fetchSemesters();
    }, []);

    // Xử lý khi nhấn nút "Xem thời khóa biểu"
    const handleViewSchedule = () => {
        if (!selectedSemester) {
            setErrorMessage('Vui lòng chọn học kỳ.');
            return;
        }
        if (!viewType) {
            setErrorMessage('Vui lòng chọn loại thời khóa biểu.');
            return;
        }

        setErrorMessage('');
        setShowSchedule(true); // Hiển thị thời khóa biểu
    };

    return (
        <CCard>
            <CCardHeader>
                <h4>
                    <CIcon icon={cilCalendar} className="me-2" />
                    Xem Thời Khóa Biểu
                </h4>
            </CCardHeader>
            <CCardBody>
                {errorMessage && <CAlert color="danger">{errorMessage}</CAlert>}
                <CRow className="mb-3">
                    <CCol md={4}>
                        <label>Học kỳ</label>
                        <CFormSelect
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                        >
                            <option value="">Chọn học kỳ</option>
                            {semesters.map((semester) => (
                                <option key={semester.HocKiId} value={semester.HocKiId}>
                                    {semester.TenHienThi}
                                </option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                        <label>Loại thời khóa biểu</label>
                        <CFormSelect
                            value={viewType}
                            onChange={(e) => setViewType(e.target.value)}
                        >
                            <option value="">Chọn loại</option>
                            <option value="teacher">Theo giáo viên</option>
                            <option value="room">Theo phòng</option>
                            <option value="weekday">Theo thứ</option>
                            <option value="subject">Theo môn</option>
                        </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                        <label>Ngày tìm kiếm</label>
                        <CFormInput
                            type="date"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                        />
                    </CCol>
                </CRow>
                <CButton color="primary" onClick={handleViewSchedule}>
                    <CIcon icon={cilCalendar} className="me-2" />
                    Xem thời khóa biểu
                </CButton>

                {showSchedule && (
                    <div className="mt-4">
                        <h5>Kết quả thời khóa biểu:</h5>
                        {/* Gọi các form con ở đây */}
                        {viewType === 'teacher' && <ScheduleByTeacher hocKiId={selectedSemester} selectedDate={searchDate}/>}
                        {viewType === 'room' && <ScheduleByRoom hocKiId={selectedSemester} selectedDate={searchDate} />}
                        {viewType === 'weekday' && <ScheduleByDay hocKiId={selectedSemester} selectedDate={searchDate} />}
                        {viewType === 'subject' && <ScheduleBySubject hocKiId={selectedSemester} selectedDate={searchDate} />}
                    </div>
                )}
            </CCardBody>
        </CCard>
    );
};

export default ScheduleView;
