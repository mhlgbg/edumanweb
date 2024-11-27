import React, { useState, useEffect } from 'react';
import axios from '../../api/api';

import {
  CForm,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CAlert,
  CPagination,
  CPaginationItem,
  CFormSelect
} from '@coreui/react';

const UserManagementForm = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]); // Danh sách toàn bộ phòng ban
  const [availableDepartments, setAvailableDepartments] = useState([]); // Danh sách phòng ban chưa tham gia
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    roles: ['user'],
    status: 'pending',
    password: '',
  });
  const [userDepartments, setUserDepartments] = useState([]); // Dữ liệu phòng ban người dùng
  const [selectedDepartment, setSelectedDepartment] = useState(''); // Phòng ban được chọn để thêm
  const [selectedRole, setSelectedRole] = useState('Quản lý'); // Vai trò được chọn để thêm

  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
    fetchDepartments(); // Load toàn bộ danh sách phòng ban trong hệ thống
  }, [currentPage, searchQuery]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`/departments/all`);
      setDepartments(response.data); // Lưu toàn bộ phòng ban vào state
    } catch (err) {
      setError('Lỗi khi tải danh sách phòng ban.');
    }
  };

  const fetchUserDepartments = async (userId) => {
    try {
      const response = await axios.get(`/departments/users/${userId}/departments`);
      setUserDepartments(response.data.departments); // Cập nhật danh sách phòng ban người dùng

      // Lọc các phòng ban chưa được phân quyền cho người dùng
      const addedDepartmentIds = response.data.departments.map(dept => dept._id);
      const available = departments.filter(dept => !addedDepartmentIds.includes(dept._id));
      setAvailableDepartments(available); // Lưu phòng ban chưa thêm
    } catch (err) {
      setError('Lỗi khi tải phòng ban của người dùng.');
    }
  };

  const handleManageDepartments = (user) => {
    setEditingUser(user);
    fetchUserDepartments(user._id); // Lấy phòng ban của người dùng
    setShowDepartmentModal(true); // Mở modal quản lý phòng ban
  };

  const handleAddDepartment = async () => {
    const departmentToAdd = departments.find(dept => dept._id === selectedDepartment);
    if (departmentToAdd) {
      try {
        // Gửi yêu cầu API để thêm phòng ban và vai trò cho người dùng
        await axios.put(`/departments/users/${editingUser._id}/addDepartment`, {
          departmentId: selectedDepartment,
          role: selectedRole
        });
  
        // Cập nhật bảng hiển thị phòng ban của người dùng
        const updatedUserDepartments = [...userDepartments];
        const newDepartment = {
          ...departmentToAdd,
          users: [...departmentToAdd.users, { userId: { _id: editingUser._id, username: editingUser.username }, role: selectedRole }]
        };
  
        updatedUserDepartments.push(newDepartment);
        setUserDepartments(updatedUserDepartments);
  
        setAvailableDepartments(availableDepartments.filter(dept => dept._id !== selectedDepartment)); // Xóa phòng ban khỏi danh sách available
        setSelectedDepartment(''); // Reset lựa chọn
      } catch (err) {
        setError('Lỗi khi thêm phòng ban cho người dùng.');
      }
    }
  };
  

  const handleDeleteDepartment = async (departmentId) => {
    const updatedDepartments = userDepartments.filter(dept => dept._id !== departmentId);
    try {
      await axios.delete(`/departments/${departmentId}/users/${editingUser._id}`);
      setUserDepartments(updatedDepartments); // Cập nhật danh sách phòng ban
      const deletedDepartment = departments.find(dept => dept._id === departmentId);
      if (deletedDepartment) {
        setAvailableDepartments([...availableDepartments, deletedDepartment]); // Thêm lại phòng ban vào danh sách có thể thêm
      }
    } catch (err) {
      setError('Lỗi khi xóa phòng ban của người dùng.');
    }
  };

  const fetchUsers = async (page, query) => {
    setLoading(true);
    try {
      const response = await axios.get(`/users/getUsersPaginated?page=${page}&limit=20&search=${query}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Lỗi khi tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm mới
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setNewUser({
      username: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      roles: ['user'],
      status: 'pending',
      password: '',
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ ...user, password: '' }); // Không hiển thị mật khẩu
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      try {
        await axios.delete(`/users/${userId}`);
        fetchUsers(currentPage, searchQuery);
      } catch (err) {
        setError('Lỗi khi xóa người dùng.');
      }
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`/users/${editingUser._id}`, newUser);
      } else {
        await axios.post('/users', newUser);
      }
      setShowModal(false);
      fetchUsers(currentPage, searchQuery);
    } catch (err) {
      setError('Lỗi khi lưu người dùng.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h2>Quản lý người dùng</h2>

      {error && <CAlert color="danger">{error}</CAlert>}

      <CFormInput
        type="text"
        placeholder="Tìm kiếm người dùng theo username hoặc email"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-3"
      />

      <CButton color="primary" className="mb-3" onClick={handleAddUser}>
        Thêm người dùng mới
      </CButton>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <CTable striped hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Username</CTableHeaderCell>
                <CTableHeaderCell>Họ tên</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Số điện thoại</CTableHeaderCell>
                <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                <CTableHeaderCell>Vai trò</CTableHeaderCell>
                <CTableHeaderCell>Hành động</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.map((user) => (
                <CTableRow key={user._id}>
                  <CTableDataCell>{user.username}</CTableDataCell>
                  <CTableDataCell>{user.fullName}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.phoneNumber}</CTableDataCell>
                  <CTableDataCell>{user.status}</CTableDataCell>
                  <CTableDataCell>{user.roles.join(', ')}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" onClick={() => handleEditUser(user)}>
                      Sửa
                    </CButton>{' '}
                    <CButton color="danger" onClick={() => handleDeleteUser(user._id)}>
                      Xóa
                    </CButton>
                    <CButton color="info" onClick={() => handleManageDepartments(user)}>Phân quyền phòng ban</CButton>
                  </CTableDataCell>
                </CTableRow>))}
            </CTableBody>
          </CTable>
          <CPagination>
            {[...Array(totalPages).keys()].map((page) => (
              <CPaginationItem
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </CPaginationItem>
            ))}
          </CPagination>
        </>
      )}

      {/* Modal thêm/sửa người dùng */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>{editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSaveUser}>
            <CFormInput
              type="text"
              label="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
            />
            <CFormInput
              type="text"
              label="Họ tên"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            />
            <CFormInput
              type="email"
              label="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <CFormInput
              type="text"
              label="Số điện thoại"
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
            />
            <CFormSelect
              label="Trạng thái"
              value={newUser.status}
              onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </CFormSelect>
            <CFormSelect
              label="Vai trò"
              multiple
              value={newUser.roles}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  roles: [].slice.call(e.target.selectedOptions).map((item) => item.value),
                })
              }
            >
              <option value="user">Người dùng thông thường</option>
              <option value="admin">Quản trị</option>
              <option value="hr">Quản lý Nhân sự</option>
              <option value="cus">CSKH</option>
              <option value="teacher">Giáo viên</option>
              <option value="manager">Quản lý</option>
            </CFormSelect>
            <CFormInput
              type="password"
              label={editingUser ? 'Mật khẩu mới' : 'Mật khẩu'}
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required={!editingUser}
            />
            <CButton type="submit" color="primary">
              {editingUser ? 'Cập nhật' : 'Thêm mới'}
            </CButton>
          </CForm>
        </CModalBody>
      </CModal>

      {/* Modal quản lý phòng ban */}
      <CModal visible={showDepartmentModal} onClose={() => setShowDepartmentModal(false)} backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>Phân quyền phòng ban cho {editingUser?.username}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Thêm combobox chọn phòng ban và vai trò */}
          <CFormSelect
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="mb-3"
          >
            <option value="">Chọn phòng ban</option>
            {availableDepartments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </CFormSelect>
          <CFormSelect
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mb-3"
          >
            <option value="Quản lý">Quản lý</option>
            <option value="Nhập liệu">Nhập liệu</option>
          </CFormSelect>
          <CButton color="success" onClick={handleAddDepartment}>Thêm phòng ban</CButton>

          {/* Bảng hiển thị phòng ban của người dùng */}
          <CTable striped hover className="mt-3">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Tên phòng ban</CTableHeaderCell>
                <CTableHeaderCell>Vai trò</CTableHeaderCell>
                <CTableHeaderCell>Hành động</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {userDepartments.map((department) => {
                // Tìm userId trong danh sách `users` của mỗi phòng ban
                const userRole = department.users.find(
                  (user) => user.userId._id === editingUser._id
                )?.role;

                return (
                  <CTableRow key={department._id}>
                    <CTableDataCell>{department.name}</CTableDataCell>
                    <CTableDataCell>{userRole || 'Không có vai trò'}</CTableDataCell> {/* Hiển thị vai trò */}
                    <CTableDataCell>
                      <CButton
                        color="danger"
                        onClick={() => handleDeleteDepartment(department._id)}
                      >
                        Xóa
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                );
              })}
            </CTableBody>
          </CTable>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default UserManagementForm;