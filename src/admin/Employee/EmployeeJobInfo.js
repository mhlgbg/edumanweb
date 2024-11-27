import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import { CButton, CForm, CFormLabel, CFormInput, CFormSelect, CRow, CCol} from '@coreui/react';

const EmployeeJobInfo = ({ employeeId, jobInfo }) => {
    const [formValues, setFormValues] = useState(jobInfo || {});
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('/departments/all');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSaveJobInfo = async () => {
        try {
            await axios.put(`/employees/${employeeId}/jobInfo`, formValues);
            alert('Job information updated successfully');
        } catch (error) {
            console.error('Error updating job information:', error);
        }
    };

    return (
        <CForm>
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Mã nhân viên</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="employeeCode"
                        value={formValues.employeeCode || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Phòng ban</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormSelect
                        name="departmentId"
                        value={formValues.departmentId || ''}
                        onChange={handleInputChange}
                    >
                        <option value="">Chọn phòng ban</option>
                        {departments && departments.map((dept) => (
                            <option key={dept._id} value={dept._id}>{dept.name}</option>
                        ))}
                    </CFormSelect>
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Chức vụ</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="position"
                        value={formValues.position || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Ngày bắt đầu</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="date"
                        name="startDate"
                        value={formValues.startDate?.split('T')[0] || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Trạng thái công việc</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormSelect
                        name="employmentStatus"
                        value={formValues.employmentStatus || ''}
                        onChange={handleInputChange}
                    >
                        <option value="Active">Đang làm việc</option>
                        <option value="On Leave">Nghỉ phép</option>
                        <option value="Resigned">Đã nghỉ việc</option>
                    </CFormSelect>
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Loại hợp đồng</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormSelect
                        name="contractType"
                        value={formValues.contractType || ''}
                        onChange={handleInputChange}
                    >
                        <option value="Full-time">Toàn thời gian</option>
                        <option value="Part-time">Bán thời gian</option>
                        <option value="Contract">Hợp đồng</option>
                        <option value="Internship">Thực tập</option>
                    </CFormSelect>
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Ngày kết thúc hợp đồng</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="date"
                        name="contractEndDate"
                        value={formValues.contractEndDate?.split('T')[0] || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CButton color="primary" onClick={handleSaveJobInfo}>Lưu</CButton>
        </CForm>
    );
};

export default EmployeeJobInfo;
