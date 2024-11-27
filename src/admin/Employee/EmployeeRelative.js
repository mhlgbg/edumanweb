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

const EmployeeRelative = ({ employeeId, relatives }) => {
    const [relativeList, setRelativeList] = useState(relatives || []);
    const [newRelative, setNewRelative] = useState({
        name: '',
        relationship: '',
        description: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý trạng thái modal

    useEffect(() => {
        fetchEmployeeRelatives();
    }, []);

    const fetchEmployeeRelatives = async () => {
        try {
            const response = await axios.get(`/employees/${employeeId}/relatives`);
            setRelativeList(response.data); // Load danh sách người thân từ API
        } catch (error) {
            console.error('Error fetching relatives:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRelative((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddRelative = async () => {
        try {
            const response = await axios.post(`/employees/${employeeId}/relatives`, newRelative);
            setRelativeList((prev) => [...prev, response.data.data]);
            setNewRelative({
                name: '',
                relationship: '',
                description: '',
            });
            setIsModalOpen(false); // Đóng modal sau khi thêm thành công
        } catch (error) {
            console.error('Error adding relative:', error);
        }
    };

    const handleRemoveRelative = async (index, relativeId) => {
        try {
            await axios.delete(`/employees/${employeeId}/relatives/${relativeId}`);
            setRelativeList((prev) => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error removing relative:', error);
        }
    };

    return (
        <div>
            <h5>Quản lý người thân</h5>
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Họ và tên</CTableHeaderCell>
                        <CTableHeaderCell>Mối quan hệ</CTableHeaderCell>
                        <CTableHeaderCell>Số ĐT</CTableHeaderCell>
                        <CTableHeaderCell>Thao tác</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {relativeList.map((rel, index) => (
                        <CTableRow key={rel._id}>
                            <CTableDataCell>{rel.name}</CTableDataCell>
                            <CTableDataCell>{rel.relationship}</CTableDataCell>
                            <CTableDataCell>{rel.description}</CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="danger"
                                    onClick={() => handleRemoveRelative(index, rel._id)}
                                >
                                    Xóa
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            <CButton color="primary" onClick={() => setIsModalOpen(true)}>
                Thêm người thân mới
            </CButton>

            {/* Modal thêm người thân */}
            <CModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} backdrop="static">
                <CModalHeader>Thêm người thân</CModalHeader>
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
                                    value={newRelative.name}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Mối quan hệ</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormSelect
                                    name="relationship"
                                    value={newRelative.relationship}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn mối quan hệ</option>
                                    <option value="Vợ">Vợ</option>
                                    <option value="Chồng">Chồng</option>
                                    <option value="Bố">Bố</option>
                                    <option value="Mẹ">Mẹ</option>
                                    <option value="Anh em trai">Anh em trai</option>
                                    <option value="Chị em gái">Chị em gái</option>
                                    <option value="Khác">Khác</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Số ĐT</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormInput
                                    type="text"
                                    name="description"
                                    value={newRelative.description}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setIsModalOpen(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleAddRelative}>
                        Lưu
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default EmployeeRelative;
