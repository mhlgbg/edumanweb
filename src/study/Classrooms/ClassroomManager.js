import ScheduleModal from './ScheduleModal';
import { Tooltip } from 'react-tooltip';
import './ClassroomManager.css';
import React, { useState, useEffect } from 'react';
import {
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
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import axios from '../../api/api';

const ClassroomManager = () => {
  const [semesterList, setSemesterList] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [keyword, setKeyword] = useState('');
  const [lopHocPhanList, setLopHocPhanList] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [relatedClasses, setRelatedClasses] = useState([]);

  const [studentIdsInput, setStudentIdsInput] = useState('');

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await axios.get('/semesters');
      setSemesterList(response.data);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const fetchLopHocPhans = async () => {
    if (!selectedSemester) {
      alert('Vui lòng chọn học kỳ.');
      return;
    }

    try {
      const response = await axios.get('/classrooms/get-all', {
        params: {
          HocKiId: selectedSemester,
          keyword,
        },
      });
      setLopHocPhanList(response.data);
    } catch (error) {
      console.error('Error fetching Lop Hoc Phans:', error);
      alert('Có lỗi xảy ra khi lấy danh sách lớp học phần.');
    }
  };

  const fetchStudents = async (lopHocPhanHocKiId) => {
    try {
      const response = await axios.get(`/classrooms/${lopHocPhanHocKiId}/students`);
      setStudents(response.data);
      setStudentModalVisible(true);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Có lỗi xảy ra khi lấy danh sách sinh viên.');
    }
  };

  const fetchRelatedClasses = async (HocKiId, MaHocPhan, MaNhom) => {
    try {
      const response = await axios.get(`/classrooms/related-classes`, {
        params: { HocKiId, MaHocPhan, MaNhom },
      });
      setRelatedClasses(response.data);
    } catch (error) {
      console.error('Error fetching related classes:', error);
    }
  };

  const fetchSchedules = async (lopHocPhanHocKiId) => {
    try {
      const response = await axios.get(`/classrooms/${lopHocPhanHocKiId}/schedules`);
      setSchedules(response.data);
      setScheduleModalVisible(true);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      alert('Có lỗi xảy ra khi lấy lịch học.');
    }
  };

  const addStudentsToClass = async () => {
    if (!studentIdsInput.trim()) {
      alert('Vui lòng nhập danh sách mã sinh viên.');
      return;
    }

    try {
      const studentIds = studentIdsInput.split(/[\s,;]+/).filter((id) => id.trim());
      await axios.post(`/classrooms/${selectedClass}/students`, { studentIds });
      fetchStudents(selectedClass);
      setStudentIdsInput('');
      alert('Thêm sinh viên vào lớp thành công.');
    } catch (error) {
      console.error('Error adding students:', error);
      alert('Có lỗi xảy ra khi thêm sinh viên.');
    }
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };


  const deleteStudentFromClass = async (maSinhVien) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sinh viên ${maSinhVien} khỏi lớp?`)) return;

    try {
      await axios.delete(`/classrooms/${selectedClass}/students/${maSinhVien}`);
      fetchStudents(selectedClass);
      alert('Xóa sinh viên thành công.');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Có lỗi xảy ra khi xóa sinh viên.');
    }
  };

  return (
    <div>
      <div className="mb-3">
        <CRow className="align-items-center">
          <CCol md={4}>
            <CFormSelect
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">-- Chọn học kỳ --</option>
              {semesterList.map((semester) => (
                <option key={semester.HocKiId} value={semester.HocKiId}>
                  {semester.TenHienThi}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol md={5}>
            <CFormInput
              placeholder="Nhập từ khóa tìm kiếm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </CCol>
          <CCol md={3} className="text-end">
            <CButton color="primary" onClick={fetchLopHocPhans}>
              Tìm kiếm
            </CButton>
          </CCol>
        </CRow>
      </div>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell> {/* Thêm cột số thứ tự */}
            <CTableHeaderCell>Mã học phần</CTableHeaderCell>
            <CTableHeaderCell>Tên học phần</CTableHeaderCell>
            <CTableHeaderCell>Tên lớp</CTableHeaderCell>
            <CTableHeaderCell>Tình trạng</CTableHeaderCell>
            <CTableHeaderCell>Số lượng sinh viên</CTableHeaderCell>
            <CTableHeaderCell>Số lịch học đã tạo</CTableHeaderCell>
            <CTableHeaderCell>Hành động</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
  {lopHocPhanList.map((lopHocPhan, index) => {
    const maNhom = lopHocPhan.TenLop.split('_').pop();
    return (
      <CTableRow key={lopHocPhan.LopHocPhanHocKiId}>
        <CTableDataCell>{index + 1}</CTableDataCell>
        <CTableDataCell>{lopHocPhan.MaHocPhan}</CTableDataCell>
        <CTableDataCell>{lopHocPhan.TenHocPhan}</CTableDataCell>

        <CTableDataCell
          data-tooltip-id={`tooltip-${lopHocPhan.LopHocPhanHocKiId}`}
          onMouseEnter={() =>
            fetchRelatedClasses(selectedSemester, lopHocPhan.MaHocPhan, maNhom)
          }
        >
          {lopHocPhan.TenLop}
          <Tooltip   className="custom-tooltip" place="top"  effect="solid" id={`tooltip-${lopHocPhan.LopHocPhanHocKiId}`}>
            {relatedClasses.length > 0 ? (
              relatedClasses.map((cls, idx) => <div key={idx}>{cls.MaLop}</div>)
            ) : (
              <div>Không có lớp chuyên ngành nào</div>
            )}
          </Tooltip>
        </CTableDataCell>
        <CTableDataCell>{lopHocPhan.TinhTrang}</CTableDataCell>
        <CTableDataCell>{lopHocPhan.SoLuongSinhVien}</CTableDataCell>
        <CTableDataCell>{lopHocPhan.SoLichHocDaTao}</CTableDataCell>
        <CTableDataCell>
          <CButton
            color="info"
            size="sm"
            className="me-2"
            onClick={() => {
              setSelectedClass(lopHocPhan.LopHocPhanHocKiId);
              fetchStudents(lopHocPhan.LopHocPhanHocKiId);
            }}
          >
            Danh sách sinh viên
          </CButton>
          <CButton
            color="success"
            size="sm"
            onClick={() => {
              setSelectedClass(lopHocPhan.LopHocPhanHocKiId);
              fetchSchedules(lopHocPhan.LopHocPhanHocKiId);
            }}
          >
            Lịch học
          </CButton>
        </CTableDataCell>
      </CTableRow>
    );
  })}
</CTableBody>
      </CTable>

      {/* Modal danh sách sinh viên */}
      <CModal visible={studentModalVisible} onClose={() => setStudentModalVisible(false)} backdrop="static" size='lg'>
        <CModalHeader>
          <CModalTitle>Danh sách sinh viên</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Mã sinh viên</CTableHeaderCell>
                <CTableHeaderCell>Họ tên</CTableHeaderCell>
                <CTableHeaderCell>Ngày sinh</CTableHeaderCell>
                <CTableHeaderCell>Lớp chuyên ngành</CTableHeaderCell>
                <CTableHeaderCell>Hành động</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {students.map((student) => (
                <CTableRow key={student.MaSinhVien}>
                  <CTableDataCell>{student.MaSinhVien}</CTableDataCell>
                  <CTableDataCell>{student.HoTen}</CTableDataCell>
                  <CTableDataCell>  {student.NgaySinh ? formatDate(student.NgaySinh) : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>{student.LopChuyenNganh}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => deleteStudentFromClass(student.MaSinhVien)}
                    >
                      Xóa
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <div className="mt-3">
            <CFormInput
              placeholder="Nhập mã sinh viên (ngăn cách bởi dấu cách, chấm phẩy hoặc phẩy)"
              value={studentIdsInput}
              onChange={(e) => setStudentIdsInput(e.target.value)}
            />
            <CButton color="primary" className="mt-2" onClick={addStudentsToClass}>
              Thêm sinh viên vào lớp
            </CButton>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setStudentModalVisible(false)}>
            Đóng
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal lịch học */}
      {/* Modal lịch học */}
      <ScheduleModal
        visible={scheduleModalVisible}
        onClose={() => setScheduleModalVisible(false)}
        classId={selectedClass}
        semesterId={selectedSemester}
      />
    </div>
  );
};

export default ClassroomManager;
