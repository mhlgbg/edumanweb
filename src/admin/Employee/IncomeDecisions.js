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

const IncomeDecisions = ({ employeeId, incomeDecisions }) => {
    const [decisionList, setDecisionList] = useState(incomeDecisions || []);
    const [newDecision, setNewDecision] = useState({
        title: '',
        effectiveDate: '',
        gradeOrAmount: '',
        description: '',
        fileKey: '',
        endDate: '',
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchIncomeDecisions();
    }, []);

    const fetchIncomeDecisions = async () => {
        try {
            const response = await axios.get(`/employees/${employeeId}/income-decisions`);
            setDecisionList(response.data);
        } catch (error) {
            console.error('Error fetching income decisions:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDecision((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddDecision = async () => {
        try {
            const response = await axios.post(`/employees/${employeeId}/income-decisions`, newDecision);
            setDecisionList((prev) => [...prev, response.data]);
            setNewDecision({
                title: '',
                effectiveDate: '',
                gradeOrAmount: '',
                description: '',
                fileKey: '',
                endDate: '',
            });
            setShowModal(false);
        } catch (error) {
            console.error('Error adding income decision:', error);
            alert('Lỗi: ' + error.response?.data?.message || 'Không thể thêm quyết định.');
        }
    };

    const handleRemoveDecision = async (index, decisionId) => {
        try {
            await axios.delete(`/employees/${employeeId}/income-decisions/${decisionId}`);
            setDecisionList((prev) => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error removing income decision:', error);
            alert('Lỗi: ' + error.response?.data?.message || 'Không thể xóa quyết định.');
        }
    };

    return (
        <div>
            <h5>Quản lý quyết định thu nhập</h5>
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Tiêu đề</CTableHeaderCell>
                        <CTableHeaderCell>Ngày áp dụng</CTableHeaderCell>
                        <CTableHeaderCell>Bậc/Số tiền</CTableHeaderCell>
                        <CTableHeaderCell>Mô tả</CTableHeaderCell>
                        <CTableHeaderCell>File quyết định</CTableHeaderCell>
                        <CTableHeaderCell>Ngày hết áp dụng</CTableHeaderCell>
                        <CTableHeaderCell>Thao tác</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {decisionList.map((decision, index) => {
                        const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/api/uploaded-files/${decision.fileKey}`;
                        return (
                            <CTableRow key={decision._id}>
                                <CTableDataCell>{decision.title}</CTableDataCell>
                                <CTableDataCell>{new Date(decision.effectiveDate).toLocaleDateString()}</CTableDataCell>
                                <CTableDataCell>{decision.gradeOrAmount}</CTableDataCell>
                                <CTableDataCell>{decision.description || 'N/A'}</CTableDataCell>
                                <CTableDataCell>
                                    {decision.fileKey ? (
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            Xem file
                                        </a>
                                    ) : (
                                        'N/A'
                                    )}
                                </CTableDataCell>
                                <CTableDataCell>
                                    {decision.endDate ? new Date(decision.endDate).toLocaleDateString() : 'Còn hiệu lực'}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="danger" onClick={() => handleRemoveDecision(index, decision._id)}>
                                        Xóa
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        );
                    })}
                </CTableBody>
            </CTable>

            <CButton color="primary" className="mt-3" onClick={() => setShowModal(true)}>
                Thêm quyết định mới
            </CButton>

            {/* Modal thêm quyết định mới */}
            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Thêm quyết định thu nhập</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Tiêu đề</CFormLabel>
                    <CFormInput
                        type="text"
                        name="title"
                        value={newDecision.title}
                        onChange={handleInputChange}
                    />
                    <CFormLabel>Ngày áp dụng</CFormLabel>
                    <CFormInput
                        type="date"
                        name="effectiveDate"
                        value={newDecision.effectiveDate}
                        onChange={handleInputChange}
                    />
                    <CFormLabel>Bậc/Số tiền</CFormLabel>
                    <CFormInput
                        type="number"
                        name="gradeOrAmount"
                        value={newDecision.gradeOrAmount}
                        onChange={handleInputChange}
                    />
                    <CFormLabel>Mô tả</CFormLabel>
                    <CFormInput
                        type="text"
                        name="description"
                        value={newDecision.description}
                        onChange={handleInputChange}
                    />
                    <CFormLabel>Key file quyết định</CFormLabel>
                    <CFormInput
                        type="text"
                        name="fileKey"
                        value={newDecision.fileKey}
                        onChange={handleInputChange}
                    />
                    <CFormLabel>Ngày hết áp dụng</CFormLabel>
                    <CFormInput
                        type="date"
                        name="endDate"
                        value={newDecision.endDate}
                        onChange={handleInputChange}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleAddDecision}>
                        Thêm
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default IncomeDecisions;
