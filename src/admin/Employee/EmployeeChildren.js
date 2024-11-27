import React, { useState, useEffect } from 'react';
import {
    CButton,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CRow,
    CCol,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import axios from '../../api/api';

const EmployeeChildren = ({ employeeId, children }) => {
    const [childrenList, setChildrenList] = useState(children || []);
    const [newChild, setNewChild] = useState({
        name: '',
        dateOfBirth: '',
        gender: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý modal

    useEffect(() => {
        fetchEmployeeChildren();
    }, []);

    const fetchEmployeeChildren = async () => {
        try {
            const response = await axios.get(`/employees/${employeeId}/children`);
            setChildrenList(response.data); // Load danh sách các con từ API
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewChild((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddChild = async () => {
        try {
            const response = await axios.post(`/employees/${employeeId}/children`, newChild);
            setChildrenList((prev) => [...prev, response.data.data]);
            setNewChild({
                name: '',
                dateOfBirth: '',
                gender: '',
            });
            setIsModalOpen(false); // Đóng modal sau khi thêm thành công
            fetchEmployeeChildren();
        } catch (error) {
            console.error('Error adding child:', error);
        }
    };

    const handleRemoveChild = async (index, childId) => {
        try {
            await axios.delete(`/employees/${employeeId}/children/${childId}`);
            setChildrenList((prev) => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error removing child:', error);
        }
    };

    return (
        <div>
            <h5>Quản lý các con</h5>
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Họ và tên</CTableHeaderCell>
                        <CTableHeaderCell>Ngày sinh</CTableHeaderCell>
                        <CTableHeaderCell>Giới tính</CTableHeaderCell>
                        <CTableHeaderCell>Thao tác</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {childrenList.map((child, index) => (
                        <CTableRow key={child._id}>
                            <CTableDataCell>{child.name}</CTableDataCell>
                            <CTableDataCell>
                                {new Date(child.dateOfBirth).toLocaleDateString()}
                            </CTableDataCell>
                            <CTableDataCell>{child.gender}</CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="danger"
                                    onClick={() => handleRemoveChild(index, child._id)}
                                >
                                    Xóa
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            <CButton color="primary" onClick={() => setIsModalOpen(true)}>
                Thêm con mới
            </CButton>

            {/* Modal thêm con mới */}
            <CModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} backdrop="static">
                <CModalHeader>Thêm con mới</CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Họ và tên</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormInput
                                    type="text"
                                    name="name"
                                    value={newChild.name}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Ngày sinh</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormInput
                                    type="date"
                                    name="dateOfBirth"
                                    value={newChild.dateOfBirth}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Giới tính</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormSelect
                                    name="gender"
                                    value={newChild.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                    <option value="Other">Khác</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setIsModalOpen(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleAddChild}>
                        Lưu
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default EmployeeChildren;
