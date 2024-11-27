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
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import axios from '../../api/api';

const EmploymentHistory = ({ employeeId, employmentHistory }) => {
    const [historyList, setHistoryList] = useState(employmentHistory || []);
    const [newHistory, setNewHistory] = useState({
        type: '',
        description: '',
        effectiveDate: '',
        endDate: '',
        departmentId: '',
        position: '',
        decisionFileKey: '',
    });

    const [departments, setDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false); // Trạng thái Modal

    useEffect(() => {
        fetchDepartments();
        fetchEmployeeHistory();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('/departments/all');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchEmployeeHistory = async () => {
        try {
            const response = await axios.get(`/employees/${employeeId}/employment-history`);
            setHistoryList(response.data);
        } catch (error) {
            console.error('Error fetching employment history:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewHistory((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddHistory = async () => {
        try {
            const response = await axios.post(`/employees/${employeeId}/employment-history`, newHistory);
            setHistoryList((prev) => [...prev, response.data]);
            setNewHistory({
                type: '',
                description: '',
                effectiveDate: '',
                endDate: '',
                departmentId: '',
                position: '',
                decisionFileKey: '',
            });
            setShowModal(false); // Đóng Modal
            fetchEmployeeHistory();
        } catch (error) {
            console.error('Error adding employment history:', error);
            alert('Lỗi: ' + error.response?.data?.message || 'Không thể thêm bản ghi.');
        }
    };

    const handleRemoveHistory = async (index, historyId) => {
        try {
            await axios.delete(`/employees/${employeeId}/employment-history/${historyId}`);
            setHistoryList((prev) => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error removing employment history:', error);
            alert('Lỗi: ' + error.response?.data?.message || 'Không thể xóa bản ghi.');
        }
    };

    return (
        <div>
            <h5>Quản lý quá trình làm việc</h5>
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Loại</CTableHeaderCell>
                        <CTableHeaderCell>Mô tả</CTableHeaderCell>
                        <CTableHeaderCell>Ngày hiệu lực</CTableHeaderCell>
                        <CTableHeaderCell>Ngày hết hiệu lực</CTableHeaderCell>
                        <CTableHeaderCell>Phòng ban</CTableHeaderCell>
                        <CTableHeaderCell>Vị trí</CTableHeaderCell>
                        <CTableHeaderCell>File quyết định</CTableHeaderCell>
                        <CTableHeaderCell>Thao tác</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {historyList.map((history, index) => {
                        const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploaded-files/${history.decisionFileKey}`;
                        return (
                            <CTableRow key={history._id}>
                                <CTableDataCell>{history.type}</CTableDataCell>
                                <CTableDataCell>{history.description}</CTableDataCell>
                                <CTableDataCell>{new Date(history.effectiveDate).toLocaleDateString()}</CTableDataCell>
                                <CTableDataCell>
                                    {history.endDate ? new Date(history.endDate).toLocaleDateString() : 'N/A'}
                                </CTableDataCell>
                                <CTableDataCell>{history.departmentId?.name || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{history.position || 'N/A'}</CTableDataCell>
                                <CTableDataCell>
                                    {history.decisionFileKey ? (
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            Xem file
                                        </a>
                                    ) : (
                                        'N/A'
                                    )}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="danger"
                                        onClick={() => handleRemoveHistory(index, history._id)}
                                    >
                                        Xóa
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        );
                    })}
                </CTableBody>
            </CTable>

            <CButton color="primary" className="mt-3" onClick={() => setShowModal(true)}>
                Thêm mới
            </CButton>

            {/* Modal thêm mới */}
            <CModal visible={showModal} onClose={() => setShowModal(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle>Thêm sự kiện mới</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Loại</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormSelect name="type" value={newHistory.type} onChange={handleInputChange}>
                                    <option value="">Chọn loại</option>
                                    <option value="Thực tập">Thực tập</option>
                                    <option value="Thử việc">Thử việc</option>
                                    <option value="Hợp đồng chính thức">Hợp đồng chính thức</option>
                                    <option value="Nghỉ thai sản">Nghỉ thai sản</option>
                                    <option value="Kí lại hợp đồng">Kí lại hợp đồng</option>
                                    <option value="Nghỉ việc">Nghỉ việc</option>
                                    <option value="Điều chuyển">Điều chuyển</option>
                                    <option value="Khác">Khác</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Mô tả</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormInput
                                    type="text"
                                    name="description"
                                    value={newHistory.description}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Ngày hiệu lực</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormInput
                                    type="date"
                                    name="effectiveDate"
                                    value={newHistory.effectiveDate}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Ngày hết hiệu lực</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormInput
                                    type="date"
                                    name="endDate"
                                    value={newHistory.endDate}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Phòng ban</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormSelect
                                    name="departmentId"
                                    value={newHistory.departmentId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn phòng ban</option>
                                    {departments.map((dept) => (
                                        <option key={dept._id} value={dept._id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Vị trí</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormInput
                                    type="text"
                                    name="position"
                                    value={newHistory.position}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Key File Quyết Định</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormInput
                                    type="text"
                                    name="decisionFileKey"
                                    value={newHistory.decisionFileKey}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleAddHistory}>
                        Thêm mới
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default EmploymentHistory;
