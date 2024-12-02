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
import * as XLSX from "xlsx";

const TrainingPlan = () => {
    const [semesterList, setSemesterList] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [keyword, setKeyword] = useState('');

    const [groupedPlans, setGroupedPlans] = useState({});
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const [isImportModalVisible, setIsImportModalVisible] = useState(false); // Import modal
    const [importFile, setImportFile] = useState(null);


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

    const handleImportExcel = async () => {
        if (!selectedSemester) {
            alert("Vui lòng chọn học kỳ trước khi import dữ liệu.");
            return;
        }

        if (!importFile) {
            alert("Vui lòng chọn file Excel để import.");
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                const formattedData = jsonData.map((row) => ({
                    MaHocPhan: row["Mã môn"],
                    MaNhom: row["Mã nhóm"],
                    MaLop: row["Mã lớp"],
                }));
                console.log("handleImportExcel formattedData", formattedData);


                await axios.post("/training-plans/import", {
                    HocKiId: selectedSemester,
                    Plans: formattedData,
                });

                fetchTrainingPlans();
                setIsImportModalVisible(false);
                setImportFile(null);
                alert("Import dữ liệu thành công!");
            };
            reader.readAsArrayBuffer(importFile);
        } catch (error) {
            alert(error.response?.data?.message || "Có lỗi xảy ra khi import dữ liệu");
        }
    };

    const handleGenerateClassesForSemester = async () => {
        if (!selectedSemester) {
            alert('Vui lòng chọn học kỳ trước khi tạo lớp học phần.');
            return;
        }

        try {
            await axios.post('/training-plans/generate-classes', { HocKiId: selectedSemester });
            alert('Tạo lớp học phần thành công!');
            fetchTrainingPlans();
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo lớp học phần.');
        }
    };

    const handleGenerateClassesForSubject = async (MaHocPhan) => {
        if (!selectedSemester) {
            alert('Vui lòng chọn học kỳ trước khi tạo lớp học phần.');
            return;
        }

        try {
            await axios.post('/training-plans/generate-classes', { HocKiId: selectedSemester, MaHocPhan });
            alert(`Tạo lớp học phần cho môn ${MaHocPhan} thành công!`);
            fetchTrainingPlans();
        } catch (error) {
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo lớp học phần.');
        }
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

                <CButton color="info" onClick={() => setIsImportModalVisible(true)}>
                    Import Excel
                </CButton>

                <CButton color="primary" onClick={handleGenerateClassesForSemester}>
                    Tạo Lớp Học Phần
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
                                            {index === 0 && (
                                                <CButton
                                                    color="info"
                                                    size="sm"
                                                    onClick={() => handleGenerateClassesForSubject(maHocPhan)}
                                                >
                                                    Tạo Lớp Học Phần
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
            {/* Modal Import Excel */}
            <CModal visible={isImportModalVisible} onClose={() => setIsImportModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Import dữ liệu từ Excel</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => setImportFile(e.target.files[0])}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={handleImportExcel}>
                        Import
                    </CButton>
                    <CButton color="secondary" onClick={() => setIsImportModalVisible(false)}>
                        Đóng
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default TrainingPlan;
