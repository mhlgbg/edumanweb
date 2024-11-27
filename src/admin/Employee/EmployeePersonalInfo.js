import React, { useState } from 'react';
import axios from '../../api/api';
import { CButton, CForm, CFormLabel, CFormInput, CFormSelect, CRow, CCol} from '@coreui/react';

const EmployeePersonalInfo = ({ employeeId, personalInfo }) => {
    const [formValues, setFormValues] = useState(personalInfo || {});
    const [avatarFile, setAvatarFile] = useState(null);
    console.log('personalInfo ', personalInfo);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleAvatarChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleSavePersonalInfo = async () => {
        try {
            let avatarUrl = formValues.avatar;

            // Upload avatar if a new file is selected
            if (avatarFile) {
                const formData = new FormData();
                formData.append('avatar', avatarFile);
                const uploadResponse = await axios.post(`/employees/avatar/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                avatarUrl = uploadResponse.data.url;
            }

            const personalData = {
                ...formValues,
                avatar: avatarUrl,
            };

            await axios.put(`/employees/${employeeId}/personalInfo`, personalData);
            alert('Thông tin cá nhân đã được cập nhật thành công');
        } catch (error) {
            console.error('Error updating personal information:', error);
        }
    };

    return (
        <CForm>
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Họ và tên</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="fullName"
                        value={formValues.fullName || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>
            
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Ngày sinh</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="date"
                        name="dateOfBirth"
                        value={formValues.dateOfBirth?.split('T')[0] || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>
            
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Giới tính</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormSelect
                        name="gender"
                        value={formValues.gender || ''}
                        onChange={handleInputChange}
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                    </CFormSelect>
                </CCol>
            </CRow>
            
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Số CCCD (Số căn cước)</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="idNumber"
                        value={formValues.idNumber || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Ngày cấp CCCD</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="date"
                        name="issuedDate"
                        value={formValues.issuedDate?.split('T')[0] || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Nơi cấp CCCD</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="issuedPlace"
                        value={formValues.issuedPlace || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Nguyên quán</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="nativePlace"
                        value={formValues.nativePlace || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Quốc tịch</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="nationality"
                        value={formValues.nationality || 'Việt Nam'}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Số điện thoại</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="phoneNumber"
                        value={formValues.phoneNumber || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Email cá nhân</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="email"
                        name="email"
                        value={formValues.email || ''}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Email Công ty</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput
                        type="text"
                        name="companyEmail"
                        value={formValues.companyEmail}
                        onChange={handleInputChange}
                    />
                </CCol>
            </CRow>

            {formValues.avatar && (
                <CRow className="mb-3">
                    <CCol sm="2">
                        <CFormLabel>Ảnh đại diện hiện tại</CFormLabel>
                    </CCol>
                    <CCol sm="10">
                        <img src={`${import.meta.env.VITE_API_BASE_URL}${formValues.avatar}`} alt="Avatar" style={{ width: '100px', marginTop: '10px' }} />
                    </CCol>
                </CRow>
            )}

            <CRow className="mb-3">
                <CCol sm="2">
                    <CFormLabel>Ảnh đại diện mới</CFormLabel>
                </CCol>
                <CCol sm="10">
                    <CFormInput type="file" accept="image/*" onChange={handleAvatarChange} />
                </CCol>
            </CRow>

            <CRow>
                <CCol sm="12" className="d-flex justify-content-end">
                    <CButton color="primary" onClick={handleSavePersonalInfo}>Lưu</CButton>
                </CCol>
            </CRow>
        </CForm>
    );
};

export default EmployeePersonalInfo;
