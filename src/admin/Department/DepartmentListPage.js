import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import {
  CButton,
  CForm,
  CFormInput,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CPagination,
  CPaginationItem,
  CFormSelect,
} from '@coreui/react';

const DepartmentListPage = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    code: '',
    name: '',
    description: '',
  });
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState(''); // Search input
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [selectedDepartment, setSelectedDepartment] = useState(null); // Selected department for managing users
  const [userEmail, setUserEmail] = useState(''); // Email input for adding user
  const [userRole, setUserRole] = useState('Quản lý'); // Default role
  const [departmentUsers, setDepartmentUsers] = useState([]); // Users in the department
  const [showUserModal, setShowUserModal] = useState(false); // Modal for managing users

  useEffect(() => {
    fetchDepartments();
  }, [currentPage, search]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `/departments?page=${currentPage}&limit=12&search=${search}`
      );
      setDepartments(response.data.departments);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  // Add or update department
  const handleSaveDepartment = async () => {
    try {
      if (editingDepartment) {
        await axios.put(`/departments/${editingDepartment._id}`, newDepartment);
      } else {
        await axios.post('/departments', newDepartment);
      }

      setNewDepartment({ code: '', name: '', description: '' });
      setShowModal(false);
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  // Delete department
  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(`/departments/${id}`);
      setDeleteId(null);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  // Open Modal for add or edit
  const openModal = (department = null) => {
    setEditingDepartment(department);
    setNewDepartment(department || { code: '', name: '', description: '' });
    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => {
    setEditingDepartment(null);
    setShowModal(false);
  };

  // Confirm delete
  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Open modal to manage users for a department
  const openUserModal = async (department) => {
    setSelectedDepartment(department);
    setShowUserModal(true);
    fetchDepartmentUsers(department._id);
  };

  // Fetch users and their roles for the department
  const fetchDepartmentUsers = async (departmentId) => {
    try {
      const response = await axios.get(`/departments/${departmentId}/users`);
      setDepartmentUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching department users:', error);
    }
  };

  // Add user to department
  const handleAddUser = async () => {
    try {
      await axios.post(`/departments/${selectedDepartment._id}/users`, {
        email: userEmail,
        role: userRole,
      });
      fetchDepartmentUsers(selectedDepartment._id);
      setUserEmail('');
      setUserRole('Quản lý');
    } catch (error) {
      console.error('Error adding user to department:', error);
    }
  };

  // Remove user from department
  const handleRemoveUser = async (userId) => {
    try {
      await axios.delete(
        `/departments/${selectedDepartment._id}/users/${userId}`
      );
      fetchDepartmentUsers(selectedDepartment._id);
    } catch (error) {
      console.error('Error removing user from department:', error);
    }
  };

  return (
    <div>
      <h2 className="my-4">Department Management</h2>

      {/* Search input */}
      <CFormInput
        type="text"
        placeholder="Search departments by name..."
        value={search}
        onChange={handleSearchChange}
        className="mb-3"
      />

      <CButton color="primary" className="mb-4" onClick={() => openModal()}>
        Create New Department
      </CButton>

      <h3>Existing Departments</h3>
      <CTable striped hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Code</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {departments && departments.length > 0 ? (
            departments.map((department) => (
              <CTableRow key={department._id}>
                <CTableDataCell>{department.code}</CTableDataCell>
                <CTableDataCell>{department.name}</CTableDataCell>
                <CTableDataCell>{department.description}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="warning"
                    className="me-2"
                    onClick={() => openModal(department)}
                  >
                    Edit
                  </CButton>
                  <CButton
                    color="danger"
                    className="me-2"
                    onClick={() => confirmDelete(department._id)}
                  >
                    Delete
                  </CButton>
                  <CButton
                    color="primary"
                    onClick={() => openUserModal(department)}
                  >
                    Phân quyền quản lý
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="4" className="text-center">
                No departments found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Pagination */}
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

      {/* Modal for add/edit department */}
      <CModal visible={showModal} onClose={closeModal}>
        <CModalHeader closeButton>
          <CModalTitle>
            {editingDepartment ? 'Edit Department' : 'Create New Department'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của phím Enter
            handleSaveDepartment(); // Gọi hàm lưu khi nhấn Enter
          }
        }}>
          <CForm>
            <CFormInput
              type="text"
              label="Code"
              value={newDepartment.code}
              onChange={(e) =>
                setNewDepartment({ ...newDepartment, code: e.target.value })
              }
              disabled={!!editingDepartment} // Disable code input when editing
            />
            <CFormInput
              type="text"
              label="Name"
              value={newDepartment.name}
              onChange={(e) =>
                setNewDepartment({ ...newDepartment, name: e.target.value })
              }
            />
            <CFormInput
              type="text"
              label="Description"
              value={newDepartment.description}
              onChange={(e) =>
                setNewDepartment({
                  ...newDepartment,
                  description: e.target.value,
                })
              }
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSaveDepartment}>
            {editingDepartment ? 'Save Changes' : 'Create Department'}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for confirm delete */}
      <CModal visible={!!deleteId} onClose={() => setDeleteId(null)}>
        <CModalHeader closeButton>
          <CModalTitle>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this department?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={() => handleDeleteDepartment(deleteId)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for managing users */}
      <CModal visible={showUserModal} onClose={() => setShowUserModal(false)} backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>Manage Users for {selectedDepartment?.name}</CModalTitle>
        </CModalHeader>
        <CModalBody  onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Ngăn chặn hành vi mặc định của phím Enter
                  handleAddUser(); // Gọi hàm lưu khi nhấn Enter
                }
              }}>
          <CForm>
            <CFormInput
              type="email"
              placeholder="Enter user email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="mb-3"
            />
            <CFormSelect
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="Quản lý">Quản lý</option>
              <option value="Nhập liệu">Nhập liệu</option>
            </CFormSelect>
            <CButton
              color="success"
              className="mt-3"
              onClick={handleAddUser}
            >
              Add User
            </CButton>
          </CForm>

          <h5 className="mt-4">Current Users</h5>
          {departmentUsers.length > 0 ? (
            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Role</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {departmentUsers.map((user) => (
                  <CTableRow key={user.userId ? user.userId._id : user._id}>
                    <CTableDataCell>{user.userId ? user.userId.email : 'No email available'}</CTableDataCell>
                    <CTableDataCell>{user.role}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="danger"
                        onClick={() => handleRemoveUser(user.userId._id)}
                      >
                        Remove
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <p>No users assigned to this department yet.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowUserModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default DepartmentListPage;
