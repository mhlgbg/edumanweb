import React, { useState, useEffect } from 'react';
import {
    CButton,
    CForm,
    CFormLabel,
    CFormInput,
    CRow,
    CCol,
    CTable,
    CTableBody,
    CTableRow,
    CTableDataCell,
    CTableHeaderCell,
    CTableHead,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
} from '@coreui/react';
import axios from '../../api/api';

const EmployeeEducationAndCertifications = ({ employeeId, educationAndCertification }) => {
    const [formValues, setFormValues] = useState(educationAndCertification || {});
    const [certifications, setCertifications] = useState(educationAndCertification?.certifications || []);
    const [newCertification, setNewCertification] = useState({ name: '', issuedBy: '', issueDate: '' });
    const [showModal, setShowModal] = useState(false); // Modal trạng thái

    useEffect(() => {
        setFormValues(educationAndCertification || {});
        setCertifications(educationAndCertification?.certifications || []);
    }, [educationAndCertification]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleCertificationChange = (e) => {
        const { name, value } = e.target;
        setNewCertification((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const addCertification = () => {
        setCertifications([...certifications, newCertification]);
        setNewCertification({ name: '', issuedBy: '', issueDate: '' });
        setShowModal(false); // Đóng modal
    };

    const removeCertification = (index) => {
        const updatedCertifications = certifications.filter((_, i) => i !== index);
        setCertifications(updatedCertifications);
    };

    const handleSaveEducationAndCertifications = async () => {
        try {
            await axios.put(`/employees/${employeeId}/educationAndCertifications`, { ...formValues, certifications });
            alert('Cập nhật thành công.');
        } catch (error) {
            console.error('Error updating education and certifications:', error);
            alert('Có lỗi xảy ra khi lưu.');
        }
    };

    return (
        <CForm>
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Bằng cấp cao nhất</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="highestDegree"
                        value={formValues.highestDegree || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Cơ sở đào tạo</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="institution"
                        value={formValues.institution || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Ngành học</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="major"
                        value={formValues.major || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CTable>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Chứng chỉ</CTableHeaderCell>
                        <CTableHeaderCell>Cơ quan cấp</CTableHeaderCell>
                        <CTableHeaderCell>Ngày cấp</CTableHeaderCell>
                        <CTableHeaderCell>Thao tác</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {certifications.map((cert, index) => (
                        <CTableRow key={index}>
                            <CTableDataCell>{cert.name}</CTableDataCell>
                            <CTableDataCell>{cert.issuedBy}</CTableDataCell>
                            <CTableDataCell>{new Date(cert.issueDate).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="danger" size="sm" onClick={() => removeCertification(index)}>
                                    Xóa
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            <CButton color="primary" className="mt-3" onClick={() => setShowModal(true)}>
                Thêm chứng chỉ
            </CButton>
            <CButton color="success" className="ms-3 mt-3" onClick={handleSaveEducationAndCertifications}>
                Lưu
            </CButton>

            {/* Modal thêm chứng chỉ */}
            <CModal visible={showModal} onClose={() => setShowModal(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle>Thêm chứng chỉ</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="mb-3">
                        <CCol sm="3">
                            <CFormLabel>Tên chứng chỉ</CFormLabel>
                        </CCol>
                        <CCol sm="9">
                            <CFormInput
                                type="text"
                                name="name"
                                value={newCertification.name}
                                onChange={handleCertificationChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol sm="3">
                            <CFormLabel>Cơ quan cấp</CFormLabel>
                        </CCol>
                        <CCol sm="9">
                            <CFormInput
                                type="text"
                                name="issuedBy"
                                value={newCertification.issuedBy}
                                onChange={handleCertificationChange}
                            />
                        </CCol>
                    </CRow>
                    <CRow className="mb-3">
                        <CCol sm="3">
                            <CFormLabel>Ngày cấp</CFormLabel>
                        </CCol>
                        <CCol sm="9">
                            <CFormInput
                                type="date"
                                name="issueDate"
                                value={newCertification.issueDate}
                                onChange={handleCertificationChange}
                            />
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={addCertification}>
                        Thêm
                    </CButton>
                </CModalFooter>
            </CModal>
        </CForm>
    );
};

export default EmployeeEducationAndCertifications;
