import "./TrainingPlanByClass.css";
import React, { useState, useEffect } from "react";
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
  CFormSelect,
  CFormInput,
} from "@coreui/react";
import Select from "react-select";
import axios from "../../api/api";

const TrainingPlanByClass = () => {
  const [semesterList, setSemesterList] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [groupedPlans, setGroupedPlans] = useState({});
  const [keyword, setKeyword] = useState("");

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedClassForSubject, setSelectedClassForSubject] = useState(null);
  const [newSubjectData, setNewSubjectData] = useState({
    MaHocPhan: "",
    MaNhom: "",
  });

  const [allSubjects, setAllSubjects] = useState([]);

  useEffect(() => {
    fetchSemesters();
    fetchAllSubjects();
  }, []);

  const fetchSemesters = async () => {
    const response = await axios.get("/semesters");
    setSemesterList(response.data);
  };

  const fetchTrainingPlans = async () => {
    if (!selectedSemester) return;

    const response = await axios.get("/training-plans", {
      params: { keyword, HocKiId: selectedSemester },
    });
    const plans = response.data;

    // Nhóm dữ liệu theo MaLop
    const grouped = plans.reduce((acc, plan) => {
      if (!acc[plan.MaLop]) {
        acc[plan.MaLop] = {
          TenLop: plan.TenLop,
          MonHocs: [],
        };
      }
      acc[plan.MaLop].MonHocs.push({
        Id: plan.Id,
        MaHocPhan: plan.MaHocPhan,
        TenHocPhan: plan.TenHocPhan,
        MaNhom: plan.MaNhom,
      });
      return acc;
    }, {});
    setGroupedPlans(grouped);
  };

  const fetchAllSubjects = async () => {
    const response = await axios.get("/training-plans/hocphan/all");
    const formattedSubjects = response.data.map((subject) => ({
      value: subject.MaHocPhan,
      label: subject.TenHocPhan,
    }));
    setAllSubjects(formattedSubjects);
  };

  const handleAddSubjectToClass = async () => {
    try {
      await axios.post("/training-plans", {
        HocKiId: selectedSemester,
        MaHocPhan: newSubjectData.MaHocPhan,
        MaLop: selectedClassForSubject,
        MaNhom: newSubjectData.MaNhom,
      });
      fetchTrainingPlans();
      setNewSubjectData({ MaHocPhan: "", MaNhom: "" });
      //setIsAddModalVisible(false);
      alert("Thêm môn thành công!");
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra, vui lòng kiểm tra lại!");
    }
  };

  const handleDeleteSubject = async (Id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa môn này?")) return;
    try {
      await axios.delete(`/training-plans/${Id}`);
      fetchTrainingPlans();
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi xóa môn");
    }
  };

  const handleOpenAddModalForClass = (maLop) => {
    setSelectedClassForSubject(maLop);
    setIsAddModalVisible(true);
  };

  const handleSearch = () => {
    fetchTrainingPlans();
  };

  return (
    <div>
      {/* Chọn học kỳ */}
      <div className="mb-3">
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
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Lớp chuyên ngành</CTableHeaderCell>
            <CTableHeaderCell>Môn học</CTableHeaderCell>
            <CTableHeaderCell>Mã nhóm</CTableHeaderCell>
            <CTableHeaderCell>Hành động</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {Object.entries(groupedPlans).map(([maLop, plan]) => (
            <React.Fragment key={maLop}>
              {plan.MonHocs.map((mon, index) => (
                <CTableRow key={mon.Id}>
                  {/* Chỉ hiển thị Lớp chuyên ngành ở dòng đầu tiên */}
                  {index === 0 && (
                    <CTableDataCell rowSpan={plan.MonHocs.length}>
                      {plan.TenLop}
                    </CTableDataCell>
                  )}
                  <CTableDataCell>{mon.TenHocPhan}</CTableDataCell>
                  <CTableDataCell>{mon.MaNhom}</CTableDataCell>
                  <CTableDataCell>
                    {index === 0 && (
                      <CButton
                        color="success"
                        size="sm"
                        className="mb-2 me-2"
                        onClick={() => handleOpenAddModalForClass(maLop)}
                      >
                        Thêm môn
                      </CButton>
                    )}
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteSubject(mon.Id)}
                    >
                      Xóa
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </React.Fragment>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal thêm môn */}
      <CModal visible={isAddModalVisible} onClose={() => setIsAddModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Thêm môn vào lớp</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="subject-select">Chọn môn học</label>
            <Select
              id="subject-select"
              options={allSubjects}
              value={allSubjects.find(
                (subject) => subject.value === newSubjectData.MaHocPhan
              )}
              onChange={(selectedOption) =>
                setNewSubjectData({ ...newSubjectData, MaHocPhan: selectedOption?.value })
              }
              placeholder="Nhập từ khóa môn học..."
              isClearable
              isSearchable
            />
          </div>
          <div className="mb-3">
            <label>Mã nhóm</label>
            <CFormInput
              value={newSubjectData.MaNhom}
              onChange={(e) => setNewSubjectData({ ...newSubjectData, MaNhom: e.target.value })}
              placeholder="Nhập mã nhóm"
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleAddSubjectToClass}>
            Thêm môn
          </CButton>
          <CButton color="secondary" onClick={() => setIsAddModalVisible(false)}>
            Đóng
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default TrainingPlanByClass;
