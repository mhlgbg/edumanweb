import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import { CButton, CForm, CFormLabel, CFormInput, CRow, CCol } from '@coreui/react';

const EmployeePayrollInfo = ({ employeeId, payrollInfo }) => {
    const [formValues, setFormValues] = useState(payrollInfo || {});

    useEffect(() => {
        setFormValues(payrollInfo || {});
    }, [payrollInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSavePayrollInfo = async () => {
        try {
            await axios.put(`/employees/${employeeId}/payrollInfo`, formValues);
            alert('Payroll information updated successfully');
        } catch (error) {
            console.error('Error updating payroll information:', error);
        }
    };

    return (
        <CForm>
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Mã số thuế</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="taxCode"
                        value={formValues.taxCode || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Số BHXH</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="socialInsuranceNumber"
                        value={formValues.socialInsuranceNumber || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Tên ngân hàng</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="bankName"
                        value={formValues.bankName || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Số tài khoản ngân hàng</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="bankAccountNumber"
                        value={formValues.bankAccountNumber || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Lương cơ bản</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="number"
                        name="baseSalary"
                        value={formValues.baseSalary || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Phụ cấp</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="number"
                        name="allowances"
                        value={formValues.allowances || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CButton color="primary" onClick={handleSavePayrollInfo}>Lưu</CButton>
        </CForm>
    );
};

export default EmployeePayrollInfo;
