import "./TrainingPlan.css"
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
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormInput,
    CFormSelect,
} from '@coreui/react';
import Select from 'react-select';
import axios from '../../api/api';

const TrainingPlan = () => {
    const [semesterList, setSemesterList] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [keyword, setKeyword] = useState('');

    const [groupedPlans, setGroupedPlans] = useState({});
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [newPlan, setNewPlan] = useState({
        MaHocPhan: '',
        MaLop: '',
        MaNhom: '',
    });

    const [isAddClassModalVisible, setIsAddClassModalVisible] = useState(false);
    const [selectedSubjectForClass, setSelectedSubjectForClass] = useState(null);
    const [newClassData, setNewClassData] = useState({
        MaLop: '',
        MaNhom: '',
    });

    const [allSubjects, setAllSubjects] = useState([]);
    const [allClasses, setAllClasses] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => {
        fetchSemesters();
        fetchAllSubjects();
        fetchAllClasses();
    }, []);

    const fetchSemesters = async () => {
        const response = await axios.get('/semesters');
        setSemesterList(response.data);
    };

    const fetchTrainingPlans = async () => {
        if (!selectedSemester) return;

        const response = await axios.get('/training-plans', { params: { keyword, HocKiId: selectedSemester } });
        const plans = response.data;
        setTrainingPlans(plans);

        // Nhóm dữ liệu theo MaHocPhan
        const grouped = plans.reduce((acc, plan) => {
            if (!acc[plan.MaHocPhan]) {
                acc[plan.MaHocPhan] = {
                    TenHocPhan: plan.TenHocPhan,
                    LopHocs: [],
                };
            }
            acc[plan.MaHocPhan].LopHocs.push({
                Id: plan.Id,
                MaLop: plan.MaLop,
                TenLop: plan.TenLop,
                MaNhom: plan.MaNhom,
            });
            return acc;
        }, {});
        setGroupedPlans(grouped);
    };

    const fetchAllSubjects = async () => {
        const response = await axios.get('/training-plans/hocphan/all');
        const formattedSubjects = response.data.map((subject) => ({
            value: subject.MaHocPhan,
            label: subject.TenHocPhan,
        }));
        setAllSubjects(formattedSubjects);
    };

    const fetchAllClasses = async () => {
        const response = await axios.get('/training-plans/lop/all');
        const formattedClasses = response.data.map((lop) => ({
            value: lop.MaLopChuyenNganh,
            label: lop.TenLopChuyenNganh,
        }));
        setAllClasses(formattedClasses);
    };

    const handleAddPlan = async () => {
        try {
            await axios.post('/training-plans', {
                HocKiId: selectedSemester,
                MaHocPhan: selectedSubject?.value,
                MaLop: selectedClass?.value,
                MaNhom: newPlan.MaNhom,
            });
            fetchTrainingPlans();
            setNewPlan({ MaHocPhan: '', MaLop: '', MaNhom: '' });
            setSelectedSubject(null);
            setSelectedClass(null);
            setIsAddModalVisible(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleDeletePlan = async (Id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa lớp này?')) return;
        try {
            await axios.delete(`/training-plans/${Id}`);
            fetchTrainingPlans();
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa');
        }
    };

    const handleDeleteSubject = async (MaHocPhan) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ học phần này?')) return;
        try {
            await axios.delete(`/training-plans/subject/${MaHocPhan}`);
            fetchTrainingPlans();
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa học phần');
        }
    };

    const handleOpenAddClassModal = (maHocPhan) => {
        setSelectedSubjectForClass(maHocPhan);
        setIsAddClassModalVisible(true);
    };

    const handleAddClassToSubject = async () => {
        try {
            await axios.post('/training-plans', {
                HocKiId: selectedSemester,
                MaHocPhan: selectedSubjectForClass,
                MaLop: newClassData.MaLop,
                MaNhom: newClassData.MaNhom,
            });
            fetchTrainingPlans();
            setNewClassData({ MaLop: '', MaNhom: '' });
            //setIsAddClassModalVisible(false);
            alert('Thêm lớp thành công!');
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng kiểm tra lại!');
        }
    };
    const handleSearch = () => {
        fetchTrainingPlans(); // Gọi API để tìm kiếm
    };
    return (
        <div>
            {/* Chọn học kỳ */}
            <div className="mb-3">
                {/* Chọn học kỳ */}
                <CRow className="mb-3">
                    <CCol md={12}>
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
                </CRow>

                {/* Tìm kiếm từ khóa */}
                <CRow className="align-items-center">
                    <CCol md={9}>
                        <CFormInput
                            placeholder="Tìm kiếm từ khóa"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </CCol>
                    <CCol md={3} className="text-end">
                        <CButton color="primary" onClick={handleSearch}>
                            Tìm kiếm
                        </CButton>
                    </CCol>
                </CRow>
            </div>

            {/* Danh sách kế hoạch */}
            <div className="mb-3">
                <CButton color="success" onClick={() => setIsAddModalVisible(true)}>
                    Thêm mới kế hoạch
                </CButton>
            </div>
            <CTable>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Mã học phần</CTableHeaderCell>
                        <CTableHeaderCell>Tên học phần</CTableHeaderCell>
                        <CTableHeaderCell>Lớp</CTableHeaderCell>
                        <CTableHeaderCell>Mã nhóm</CTableHeaderCell>
                        <CTableHeaderCell>Hành động</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {Object.entries(groupedPlans).map(([maHocPhan, plan]) => (
                        <React.Fragment key={maHocPhan}>
                            {plan.LopHocs.map((lop, index) => (
                                <CTableRow key={lop.Id}>
                                    {/* Chỉ hiển thị Mã học phần và Tên học phần ở dòng đầu tiên */}
                                    {index === 0 && (
                                        <>
                                            <CTableDataCell rowSpan={plan.LopHocs.length}>
                                                {maHocPhan}
                                            </CTableDataCell>
                                            <CTableDataCell rowSpan={plan.LopHocs.length}>
                                                {plan.TenHocPhan}
                                            </CTableDataCell>
                                        </>
                                    )}
                                    {/* Hiển thị thông tin lớp học */}
                                    <CTableDataCell>{lop.TenLop}</CTableDataCell>
                                    <CTableDataCell>{lop.MaNhom}</CTableDataCell>
                                    <CTableDataCell>
                                        <div className="action-buttons">
                                            <CButton
                                                color="danger"
                                                size="sm"
                                                className="mb-2"
                                                onClick={() => handleDeletePlan(lop.Id)}
                                            >
                                                Xóa lớp
                                            </CButton>
                                            {/* Chỉ hiển thị nút Xóa môn ở dòng đầu tiên */}
                                            {index === 0 && (
                                                <CButton
                                                    color="danger"
                                                    size="sm"
                                                    className="ms-2"
                                                    onClick={() => handleDeleteSubject(maHocPhan)}
                                                >
                                                    Xóa môn
                                                </CButton>
                                            )}
                                            {index === 0 && (
                                                <CButton
                                                    color="info"
                                                    size="sm"
                                                    className="ms-2"
                                                    onClick={() => handleOpenAddClassModal(maHocPhan)}
                                                >
                                                    Thêm lớp
                                                </CButton>
                                            )}
                                        </div>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </CTableBody>
            </CTable>

            {/* Modal thêm kế hoạch */}
            <CModal visible={isAddModalVisible} onClose={() => setIsAddModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Thêm mới kế hoạch</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <label htmlFor="subject-select">Chọn học phần</label>
                        <Select
                            id="subject-select"
                            options={allSubjects}
                            value={selectedSubject}
                            onChange={setSelectedSubject}
                            placeholder="Nhập từ khóa học phần..."
                            isClearable
                            isSearchable
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="class-select">Chọn lớp</label>
                        <Select
                            id="class-select"
                            options={allClasses}
                            value={selectedClass}
                            onChange={setSelectedClass}
                            placeholder="Nhập từ khóa lớp..."
                            isClearable
                            isSearchable
                        />
                    </div>
                    <div className="mb-3">
                        <label>Mã nhóm</label>
                        <CFormInput
                            value={newPlan.MaNhom}
                            onChange={(e) => setNewPlan({ ...newPlan, MaNhom: e.target.value })}
                        />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={handleAddPlan}>
                        Lưu
                    </CButton>
                    <CButton color="secondary" onClick={() => setIsAddModalVisible(false)}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal visible={isAddClassModalVisible} onClose={() => setIsAddClassModalVisible(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle>Thêm lớp cho môn học</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <label htmlFor="class-select-modal">Chọn lớp</label>
                        <Select
                            id="class-select-modal"
                            options={allClasses}
                            value={allClasses.find((cls) => cls.value === newClassData.MaLop)}
                            onChange={(selectedOption) => setNewClassData({ ...newClassData, MaLop: selectedOption?.value })}
                            placeholder="Nhập từ khóa lớp..."
                            isClearable
                            isSearchable
                        />
                    </div>
                    <div className="mb-3">
                        <label>Mã nhóm</label>
                        <CFormInput
                            value={newClassData.MaNhom}
                            onChange={(e) => setNewClassData({ ...newClassData, MaNhom: e.target.value })}
                            placeholder="Nhập mã nhóm"
                        />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={handleAddClassToSubject}>
                        Thêm lớp
                    </CButton>
                    <CButton color="secondary" onClick={() => setIsAddClassModalVisible(false)}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default TrainingPlan;
