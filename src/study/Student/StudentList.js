import React, { useState, useEffect } from 'react';
import {
    CFormInput,
    CButton,
    CRow,
    CCol,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CFormSelect,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import axios from '../../api/api';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPagination = () => {
        const pages = [];
        const maxVisible = 5; // Hiển thị tối đa 5 trang xung quanh trang hiện tại

        if (totalPages <= maxVisible) {
            // Hiển thị tất cả các trang nếu tổng số trang nhỏ hơn maxVisible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Thêm trang đầu tiên
            pages.push(1);

            // Thêm ... nếu cách xa trang đầu
            if (currentPage > 3) {
                pages.push('...');
            }

            // Thêm các trang xung quanh trang hiện tại
            const startPage = Math.max(2, currentPage - 2);
            const endPage = Math.min(totalPages - 1, currentPage + 2);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Thêm ... nếu cách xa trang cuối
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Thêm trang cuối
            pages.push(totalPages);
        }

        return pages;
    };

    const paginationItems = renderPagination();

    return (
        <div className="d-flex justify-content-center">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                </li>
                {paginationItems.map((page, index) =>
                    page === '...' ? (
                        <li key={index} className="page-item disabled">
                            <span className="page-link">...</span>
                        </li>
                    ) : (
                        <li
                            key={index}
                            className={`page-item ${page === currentPage ? 'active' : ''}`}
                        >
                            <button className="page-link" onClick={() => onPageChange(page)}>
                                {page}
                            </button>
                        </li>
                    )
                )}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </div>
    );
};

const StudentList = () => {
    // State
    const [students, setStudents] = useState([]);
    const [khoaHeList, setKhoaHeList] = useState([]);
    const [nganhList, setNganhList] = useState([]);
    const [lopList, setLopList] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentScores, setStudentScores] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [selectedKhoaHe, setSelectedKhoaHe] = useState('all');
    const [selectedNganh, setSelectedNganh] = useState('all');
    const [selectedLop, setSelectedLop] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch data
    useEffect(() => {
        fetchKhoaHeList();
        fetchStudents();
    }, []);



    useEffect(() => {
        if (selectedKhoaHe !== 'all') {
            fetchNganhList(selectedKhoaHe);
        } else {
            setNganhList([]);
            setLopList([]);
        }
    }, [selectedKhoaHe]);

    useEffect(() => {
        if (selectedNganh !== 'all') {
            fetchLopList(selectedNganh);
        } else {
            setLopList([]);
        }
    }, [selectedNganh]);

    const fetchKhoaHeList = async () => {
        const response = await axios.get('/studies/khoahe', { params: { LaKhoa: 0 } });
        setKhoaHeList(response.data);
    };

    const fetchNganhList = async (maKhoaHe) => {
        const response = await axios.get('/studies/nganh', { params: { MaKhoaHe: maKhoaHe } });
        setNganhList(response.data);
    };

    const fetchLopList = async (maNganh) => {
        const response = await axios.get('/studies/lopchuyennganh', { params: { MaNganh: maNganh } });
        setLopList(response.data);
    };
    // Fetch student scores
    const fetchStudentScores = async (maSinhVien) => {
        const response = await axios.get(`/studies/diemtongket/${maSinhVien}`);
        setStudentScores(response.data);
    };
    const fetchStudents = async () => {
        const response = await axios.get('/studies/sinhvien', {
            params: {
                keyword,
                MaKhoaHe: selectedKhoaHe !== 'all' ? selectedKhoaHe : null,
                MaNganh: selectedNganh !== 'all' ? selectedNganh : null,
                MaLopChuyenNganh: selectedLop !== 'all' ? selectedLop : null,
                TinhTrang: statusFilter !== 'all' ? statusFilter : null,
                page: currentPage,
                limit: 50,
            },
        });
        setStudents(response.data.students);
        setTotalPages(response.data.totalPages);
    };

    // Event Handlers
    const handleSearch = () => {
        setCurrentPage(1);
        fetchStudents();
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            fetchStudents(page);
        }
    };
    const handleViewScore = async (student) => {
        setSelectedStudent(null); // Reset thông tin sinh viên
        setStudentScores([]); // Reset danh sách điểm
        setIsModalVisible(true); // Hiển thị modal

        try {
            const response = await axios.get(`/studies/diemtongket/${student.MaSinhVien}`);
            const { studentInfo, scores } = response.data;

            setSelectedStudent(studentInfo); // Cập nhật thông tin sinh viên
            setStudentScores(scores); // Cập nhật danh sách điểm
        } catch (error) {
            console.error('Error fetching student scores:', error);
            alert('Không thể lấy bảng điểm của sinh viên.');
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedStudent(null);
        setStudentScores([]);
    };
    const handleExportExcel = async (studentInfo, scores) => {
        try {
            // Gửi yêu cầu xuất Excel đến backend
            const response = await axios.post(
                '/exports/student-scores/excel',
                { studentInfo, scores },
                { responseType: 'blob' } // Để nhận file trả về
            );
    
            // Tạo file blob và trigger tải xuống
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `BangDiem_${studentInfo.MaSinhVien}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting Excel:', error);
            alert('Xuất Excel thất bại!');
        }
    };
    
    // JSX
    return (
        <div>
            {/* Bộ lọc */}
            <CRow className="mb-3">
                <CCol md={3}>
                    <CFormSelect
                        value={selectedKhoaHe}
                        onChange={(e) => setSelectedKhoaHe(e.target.value)}
                    >
                        <option value="all">Tất cả Khoa Hệ</option>
                        {khoaHeList.map((khoaHe) => (
                            <option key={khoaHe.MaKhoaHe} value={khoaHe.MaKhoaHe}>
                                {khoaHe.TenKhoaHe}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol md={3}>
                    <CFormSelect
                        value={selectedNganh}
                        onChange={(e) => setSelectedNganh(e.target.value)}
                        disabled={selectedKhoaHe === 'all'}
                    >
                        <option value="all">Tất cả Ngành</option>
                        {nganhList.map((nganh) => (
                            <option key={nganh.MaNganh} value={nganh.MaNganh}>
                                {nganh.TenNganh}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol md={3}>
                    <CFormSelect
                        value={selectedLop}
                        onChange={(e) => setSelectedLop(e.target.value)}
                        disabled={selectedNganh === 'all'}
                    >
                        <option value="all">Tất cả Lớp</option>
                        {lopList.map((lop) => (
                            <option key={lop.MaLopChuyenNganh} value={lop.MaLopChuyenNganh}>
                                {lop.TenLopChuyenNganh}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol md={3}>
                    <CFormSelect
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả Tình Trạng</option>
                        <option value="BT">Bình thường</option>
                        <option value="KHAC">Khác</option>
                    </CFormSelect>
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol md={9}>
                    <CFormInput
                        placeholder="Tìm kiếm từ khóa"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </CCol>
                <CCol md={3}>
                    <CButton color="primary" onClick={handleSearch}>
                        Tìm kiếm
                    </CButton>
                </CCol>
            </CRow>

            {/* Danh sách sinh viên */}
            <CTable hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Mã SV</CTableHeaderCell>
                        <CTableHeaderCell>Họ đệm</CTableHeaderCell>
                        <CTableHeaderCell>Tên</CTableHeaderCell>
                        <CTableHeaderCell>Ngày sinh</CTableHeaderCell>
                        <CTableHeaderCell>Tình trạng</CTableHeaderCell>
                        <CTableHeaderCell>Hành động</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {students.map((sv) => (
                        <CTableRow key={sv.MaSinhVien}>
                            <CTableDataCell>{sv.MaSinhVien}</CTableDataCell>
                            <CTableDataCell>{sv.HoDem}</CTableDataCell>
                            <CTableDataCell>{sv.Ten}</CTableDataCell>
                            <CTableDataCell>  {new Date(sv.NgaySinh).toLocaleDateString()}
                            </CTableDataCell>
                            <CTableDataCell>{sv.TinhTrang}</CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="info"
                                    size="sm"
                                    onClick={() => handleViewScore(sv)}
                                >
                                    Xem bảng điểm
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            {/* Phân trang */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            {/* Modal Xem bảng điểm */}
            {isModalVisible && (
                <CModal visible={isModalVisible} onClose={closeModal} size="lg" backdrop="static">
                    <CModalHeader>
                        <CModalTitle>Bảng điểm sinh viên</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {selectedStudent && (
                            <>
                                <h5>Thông tin sinh viên</h5>
                                <p>
                                    <strong>Mã SV:</strong> {selectedStudent.MaSinhVien}
                                </p>
                                <p>
                                    <strong>Họ tên:</strong> {`${selectedStudent.HoDem} ${selectedStudent.Ten}`}
                                </p>
                                <p>
                                    <strong>Ngày sinh:</strong>{' '}
                                    {new Date(selectedStudent.NgaySinh).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Hệ đào tạo:</strong> {selectedStudent.TenKhoaHe}
                                </p>
                                <p>
                                    <strong>Ngành đào tạo:</strong> {selectedStudent.TenNganh}
                                </p>
                                <p>
                                    <strong>Lớp:</strong> {selectedStudent.MaLopChuyenNganh}
                                </p>
                                <p>
                                    <strong>Khóa học:</strong> {selectedStudent.KhoaHoc}
                                </p>
                                <p>
                                    <strong>Tổng số tín chỉ tích lũy:</strong> {selectedStudent.TongTinChiTichLuy}
                                </p>
                                <p>
                                    <strong>Trung bình chung tích lũy:</strong> {selectedStudent.TrungBinhTichLuy}
                                </p>
                                <h5>Danh sách điểm</h5>
                                <CTable hover>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>STT</CTableHeaderCell>
                                            <CTableHeaderCell>Tên môn học</CTableHeaderCell>
                                            <CTableHeaderCell>Số tín chỉ</CTableHeaderCell>
                                            <CTableHeaderCell>Điểm hệ 10</CTableHeaderCell>
                                            <CTableHeaderCell>Điểm chữ</CTableHeaderCell>
                                            <CTableHeaderCell>Điểm hệ 4</CTableHeaderCell>
                                            <CTableHeaderCell>Ghi chú</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {studentScores.length > 0 ? (
                                            studentScores.map((score, index) => (
                                                <CTableRow key={index}>
                                                    <CTableDataCell>{index + 1}</CTableDataCell>
                                                    <CTableDataCell>{score.TenHocPhan}</CTableDataCell>
                                                    <CTableDataCell>{score.SoTinChi}</CTableDataCell>
                                                    <CTableDataCell>{score.DiemHe10}</CTableDataCell>
                                                    <CTableDataCell>{score.DiemChu}</CTableDataCell>
                                                    <CTableDataCell>{score.DiemHe4}</CTableDataCell>
                                                    <CTableDataCell>{score.GhiChu || ''}</CTableDataCell>
                                                </CTableRow>
                                            ))
                                        ) : (
                                            <CTableRow>
                                                <CTableDataCell colSpan="5" className="text-center">
                                                    Không có dữ liệu điểm
                                                </CTableDataCell>
                                            </CTableRow>
                                        )}
                                    </CTableBody>
                                </CTable>
                            </>
                        )}
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="primary" onClick={() => handleExportExcel(selectedStudent, studentScores)}>
                            Xuất Excel
                        </CButton>
                        <CButton color="secondary" onClick={closeModal}>
                            Đóng
                        </CButton>
                    </CModalFooter>
                </CModal>
            )}
        </div>
    );
};

export default StudentList;
