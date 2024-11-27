import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import {
    CButton, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
    CPagination, CPaginationItem, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CFormInput, CFormLabel, CFormSelect, CForm
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, [page, search]);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/employees', { params: { page, search } });
            setEmployees(response.data.data);
            setTotalPages(response.data.pages);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const openModal = (employee = null) => {
        setCurrentEmployee(employee || {
            personalInfo: { fullName: '', dateOfBirth: '', gender: '', email: '', companyEmail: '', phoneNumber: '', idNumber: '', issuedDate: '', issuedPlace: '', nativePlace: '', skypeLink: '', facebookLink: '', avatar: '', nationality: ''},
            notes: '',
            emergencyContact: { contactName: '', relationship: '', contactPhone: '' }
        });
        setModalVisible(true);
    };

    const closeModal = () => {
        setCurrentEmployee(null);
        setAvatarFile(null);
        setModalVisible(false);
    };

    const handleAvatarChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleSave = async () => {
        try {
            let avatarUrl = currentEmployee?.personalInfo.avatar;

            if (avatarFile) {
                const formData = new FormData();
                formData.append('avatar', avatarFile);
                const uploadResponse = await axios.post(`/employees/avatar/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                avatarUrl = uploadResponse.data.url;
            }

            const employeeData = {
                ...currentEmployee,
                personalInfo: { ...currentEmployee.personalInfo, avatar: avatarUrl }
            };

            if (currentEmployee._id) {
                await axios.put(`/employees/${currentEmployee._id}`, employeeData);
            } else {
                await axios.post('/employees', employeeData);
            }
            fetchEmployees();
            closeModal();
        } catch (error) {
            console.error('Error saving employee:', error);
        }
    };

    const handleDelete = async (employeeId) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await axios.delete(`/employees/${employeeId}`);
                fetchEmployees();
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };
    const handleEditEmployee = (employeeId) => {
        navigate(`/admin/employees/${employeeId}`);
    };
    
    return (
        <div>
            <h2>Quản lý nhân viên</h2>
            <div className="d-flex justify-content-between mb-3">
                <CFormInput
                    type="text"
                    placeholder="Tìm kiếm nhân viên..."
                    value={search}
                    onChange={handleSearchChange}
                    className="me-2"
                />
                <CButton color="primary" onClick={() => openModal()}>Thêm mới nhân viên</CButton>
            </div>
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Họ và tên</CTableHeaderCell>
                        <CTableHeaderCell>Ngày sinh</CTableHeaderCell>
                        <CTableHeaderCell>Giới tính</CTableHeaderCell>
                        <CTableHeaderCell>Email</CTableHeaderCell>
                        <CTableHeaderCell>Điện thoại</CTableHeaderCell>
                        <CTableHeaderCell>Số CCCD</CTableHeaderCell>
                        <CTableHeaderCell>Quốc tịch</CTableHeaderCell>
                        <CTableHeaderCell>Thao tác</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {employees.map((employee) => (
                        <CTableRow key={employee._id}>
                            <CTableDataCell>{employee.personalInfo.fullName}</CTableDataCell>
                            <CTableDataCell>{new Date(employee.personalInfo.dateOfBirth).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>{employee.personalInfo.gender}</CTableDataCell>
                            <CTableDataCell>{employee.personalInfo.email}</CTableDataCell>
                            <CTableDataCell>{employee.personalInfo.phoneNumber}</CTableDataCell>
                            <CTableDataCell>{employee.personalInfo.idNumber}</CTableDataCell>
                            <CTableDataCell>{employee.personalInfo.nationality}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="info" onClick={() => openModal(employee)}>Chỉnh sửa</CButton>{' '}
                                <CButton color="danger" onClick={() => handleDelete(employee._id)}>Xóa</CButton>
                                <CButton color="info" onClick={() => handleEditEmployee(employee._id)}>Chỉnh Sửa Hồ Sơ</CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
            <CPagination aria-label="Page navigation">
                <CPaginationItem disabled={page === 1} onClick={() => setPage(page - 1)}>Trước</CPaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                    <CPaginationItem key={i} active={i + 1 === page} onClick={() => setPage(i + 1)}>
                        {i + 1}
                    </CPaginationItem>
                ))}
                <CPaginationItem disabled={page === totalPages} onClick={() => setPage(page + 1)}>Sau</CPaginationItem>
            </CPagination>

            {/* Modal for Add/Edit */}
            <CModal visible={modalVisible} onClose={closeModal} backdrop="static" size="lg">
                <CModalHeader closeButton>
                    <CModalTitle>{currentEmployee?._id ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormLabel>Họ và tên</CFormLabel>
                        <CFormInput
                            type="text"
                            value={currentEmployee?.personalInfo.fullName || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, fullName: e.target.value } })}
                        />
                        <CFormLabel>Ngày sinh</CFormLabel>
                        <CFormInput
                            type="date"
                            value={currentEmployee?.personalInfo.dateOfBirth?.split('T')[0] || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, dateOfBirth: e.target.value } })}
                        />
                        <CFormLabel>Giới tính</CFormLabel>
                        <CFormSelect
                            value={currentEmployee?.personalInfo.gender || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, gender: e.target.value } })}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                            <option value="Other">Khác</option>
                        </CFormSelect>
                        <CFormLabel>Email cá nhân</CFormLabel>
                        <CFormInput
                            type="email"
                            value={currentEmployee?.personalInfo.email || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, email: e.target.value } })}
                        />
                        <CFormLabel>Email công ty</CFormLabel>
                        <CFormInput
                            type="email"
                            value={currentEmployee?.personalInfo.companyEmail || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, companyEmail: e.target.value } })}
                        />
                        <CFormLabel>Điện thoại</CFormLabel>
                        <CFormInput
                            type="text"
                            value={currentEmployee?.personalInfo.phoneNumber || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, phoneNumber: e.target.value } })}
                        />
                        <CFormLabel>Số CCCD</CFormLabel>
                        <CFormInput
                            type="text"
                            value={currentEmployee?.personalInfo.idNumber || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, idNumber: e.target.value } })}
                        />
                        <CFormLabel>Ngày cấp</CFormLabel>
                        <CFormInput
                            type="date"
                            value={currentEmployee?.personalInfo.issuedDate?.split('T')[0] || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, issuedDate: e.target.value } })}
                        />
                        <CFormLabel>Nơi cấp</CFormLabel>
                        <CFormInput
                            type="text"
                            value={currentEmployee?.personalInfo.issuedPlace || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, issuedPlace: e.target.value } })}
                        />
                        <CFormLabel>Nguyên quán</CFormLabel>
                        <CFormInput
                            type="text"
                            value={currentEmployee?.personalInfo.nativePlace || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, nativePlace: e.target.value } })}
                        />
                        <CFormLabel>Quốc tịch</CFormLabel>
                        <CFormInput
                            type="text"
                            value={currentEmployee?.personalInfo.nationality || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, nationality: e.target.value } })}
                        />
                        
                        <CFormLabel>Skype Link</CFormLabel>
                        <CFormInput
                            type="url"
                            value={currentEmployee?.personalInfo.skypeLink || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, skypeLink: e.target.value } })}
                        />
                        <CFormLabel>Facebook Link</CFormLabel>
                        <CFormInput
                            type="url"
                            value={currentEmployee?.personalInfo.facebookLink || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, personalInfo: { ...currentEmployee.personalInfo, facebookLink: e.target.value } })}
                        />
                        <CFormLabel>Avatar</CFormLabel>
                        <CFormInput
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                        {currentEmployee?.personalInfo.avatar && (
                            <img src={currentEmployee.personalInfo.avatar} alt="Avatar" style={{ width: '100px', marginTop: '10px' }} />
                        )}
                        <CFormLabel>Ghi chú</CFormLabel>
                        <CFormInput
                            type="text"
                            value={currentEmployee?.notes || ''}
                            onChange={(e) => setCurrentEmployee({ ...currentEmployee, notes: e.target.value })}
                        />
                        <CFormLabel>Liên hệ khẩn cấp</CFormLabel>
                        <CFormInput
                            placeholder="Tên liên hệ"
                            type="text"
                            value={currentEmployee?.emergencyContact.contactName || ''}
                            onChange={(e) => setCurrentEmployee({
                                ...currentEmployee,
                                emergencyContact: { ...currentEmployee.emergencyContact, contactName: e.target.value }
                            })}
                        />
                        <CFormInput
                            placeholder="Mối quan hệ"
                            type="text"
                            value={currentEmployee?.emergencyContact.relationship || ''}
                            onChange={(e) => setCurrentEmployee({
                                ...currentEmployee,
                                emergencyContact: { ...currentEmployee.emergencyContact, relationship: e.target.value }
                            })}
                        />
                        <CFormInput
                            placeholder="Số điện thoại liên hệ"
                            type="text"
                            value={currentEmployee?.emergencyContact.contactPhone || ''}
                            onChange={(e) => setCurrentEmployee({
                                ...currentEmployee,
                                emergencyContact: { ...currentEmployee.emergencyContact, contactPhone: e.target.value }
                            })}
                        />
                        
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModal}>Hủy</CButton>
                    <CButton color="primary" onClick={handleSave}>Lưu</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default EmployeeList;
