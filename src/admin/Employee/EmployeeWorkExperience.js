import React, { useState } from 'react';
import {
    CButton,
    CForm,
    CFormLabel,
    CFormInput,
    CRow,
    CCol,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
} from '@coreui/react';
import axios from '../../api/api';

const EmployeeWorkExperience = ({ employeeId, workExperience }) => {
    const [experiences, setExperiences] = useState(workExperience || []);
    const [newExperience, setNewExperience] = useState({
        companyName: '',
        position: '',
        duration: '',
        achievements: '',
    });
    const [showModal, setShowModal] = useState(false); // Trạng thái modal

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExperience({ ...newExperience, [name]: value });
    };

    const handleAddExperience = async () => {
        try {
            const response = await axios.post(`/employees/${employeeId}/workExperience`, newExperience);
            const savedExperience = response.data.data;

            // Cập nhật danh sách sau khi thêm
            setExperiences([...experiences, savedExperience]);
            setNewExperience({
                companyName: '',
                position: '',
                duration: '',
                achievements: '',
            });
            setShowModal(false); // Đóng modal
        } catch (error) {
            console.error('Error adding work experience:', error);
            alert('Lỗi khi thêm kinh nghiệm.');
        }
    };

    const handleRemoveExperience = async (index, experienceId) => {
        try {
            await axios.delete(`/employees/${employeeId}/workExperience/${experienceId}`);
            setExperiences(experiences.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error removing work experience:', error);
            alert('Lỗi khi xóa kinh nghiệm.');
        }
    };

    return (
        <div>
            <h5>Kinh nghiệm làm việc</h5>
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Tên công ty</CTableHeaderCell>
                        <CTableHeaderCell>Vị trí</CTableHeaderCell>
                        <CTableHeaderCell>Thời gian</CTableHeaderCell>
                        <CTableHeaderCell>Thành tích</CTableHeaderCell>
                        <CTableHeaderCell>Thao tác</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {experiences.map((exp, index) => (
                        <CTableRow key={exp._id}>
                            <CTableDataCell>{exp.companyName}</CTableDataCell>
                            <CTableDataCell>{exp.position}</CTableDataCell>
                            <CTableDataCell>{exp.duration}</CTableDataCell>
                            <CTableDataCell>{exp.achievements}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="danger" onClick={() => handleRemoveExperience(index, exp._id)}>
                                    Xóa
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            <CButton color="primary" className="mt-3" onClick={() => setShowModal(true)}>
                Thêm kinh nghiệm
            </CButton>

            {/* Modal thêm kinh nghiệm */}
            <CModal visible={showModal} onClose={() => setShowModal(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle>Thêm kinh nghiệm</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="mb-3">
                        <CCol sm="3">
                            <CFormLabel>Tên công ty</CFormLabel>
                        </CCol>
                        <CCol sm="9">
                            <CFormInput
                                type="text"
                                name="companyName"
                                value={newExperience.companyName}
                                onChange={handleInputChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol sm="3">
                            <CFormLabel>Vị trí</CFormLabel>
                        </CCol>
                        <CCol sm="9">
                            <CFormInput
                                type="text"
                                name="position"
                                value={newExperience.position}
                                onChange={handleInputChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol sm="3">
                            <CFormLabel>Thời gian</CFormLabel>
                        </CCol>
                        <CCol sm="9">
                            <CFormInput
                                type="text"
                                name="duration"
                                placeholder="Jan 2018 - Dec 2020"
                                value={newExperience.duration}
                                onChange={handleInputChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol sm="3">
                            <CFormLabel>Thành tích</CFormLabel>
                        </CCol>
                        <CCol sm="9">
                            <CFormInput
                                type="text"
                                name="achievements"
                                value={newExperience.achievements}
                                onChange={handleInputChange}
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleAddExperience}>
                        Thêm
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default EmployeeWorkExperience;
