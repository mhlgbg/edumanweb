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
    CModalFooter,
    CPagination,
    CPaginationItem,
} from '@coreui/react';

const CompanyManagement = () => {
    const [companies, setCompanies] = useState([]); // Khởi tạo thành mảng rỗng
    const [newCompany, setNewCompany] = useState({
        name: '',
        code: '',
        foundedDate: '',
        taxCode: '',
        registrationNumber: '',
        address: '',
        website: '',
        notes: '',
    });
    const [editingCompany, setEditingCompany] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCompanies();
    }, [currentPage, search]);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get(`/companies?page=${currentPage}&limit=20&search=${search}`);
            setCompanies(response.data.companies || []); // Đảm bảo dữ liệu là mảng
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching companies:', error);
            setCompanies([]); // Nếu có lỗi, đặt thành mảng rỗng để tránh lỗi `map`
        }
    };

    const handleSaveCompany = async (e) => {
        e.preventDefault();
        try {
            if (editingCompany) {
                await axios.put(`/companies/${editingCompany._id}`, editingCompany);
            } else {
                await axios.post('/companies', newCompany);
                setNewCompany({
                    name: '',
                    code: '',
                    foundedDate: '',
                    taxCode: '',
                    registrationNumber: '',
                    address: '',
                    website: '',
                    notes: '',
                });
            }
            setShowModal(false);
            setEditingCompany(null);
            fetchCompanies();
        } catch (error) {
            console.error('Error saving company:', error);
        }
    };

    const handleDeleteCompany = async (id) => {
        try {
            await axios.delete(`/companies/${id}`);
            setDeleteId(null);
            fetchCompanies();
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const openModal = (company = null) => {
        setEditingCompany(company);
        setNewCompany(company || {
            name: '',
            code: '',
            foundedDate: '',
            taxCode: '',
            registrationNumber: '',
            address: '',
            website: '',
            notes: '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setEditingCompany(null);
        setShowModal(false);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <h2>Company Management</h2>

            <CFormInput
                type="text"
                placeholder="Search companies by name or code..."
                value={search}
                onChange={handleSearchChange}
                className="mb-3"
            />

            <CButton color="primary" className="mb-4" onClick={() => openModal()}>Create New Company</CButton>
            {companies.length > 0 ? (
                <CTable striped hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Mã</CTableHeaderCell>
                            <CTableHeaderCell>Tên Công Ty</CTableHeaderCell>
                            <CTableHeaderCell>Ngày Thành Lập</CTableHeaderCell>
                            <CTableHeaderCell>Mã Số Thuế</CTableHeaderCell>
                            <CTableHeaderCell>Số ĐK Kinh Doanh</CTableHeaderCell>
                            <CTableHeaderCell>Website</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {companies.map((company) => (
                            <CTableRow key={company._id}>
                                <CTableDataCell>{company.code}</CTableDataCell>
                                <CTableDataCell>{company.name}</CTableDataCell>
                                <CTableDataCell>{company.foundedDate ? new Date(company.foundedDate).toLocaleDateString() : 'N/A'}</CTableDataCell>
                                <CTableDataCell>{company.taxCode}</CTableDataCell>
                                <CTableDataCell>{company.registrationNumber}</CTableDataCell>
                                <CTableDataCell>{company.website}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="warning" className="me-2" onClick={() => openModal(company)}>Edit</CButton>
                                    <CButton color="danger" onClick={() => confirmDelete(company._id)}>Delete</CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            ) : (
                <p>No companies found.</p>
            )}
            <CPagination>
                {[...Array(totalPages).keys()].map(page => (
                    <CPaginationItem
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </CPaginationItem>
                ))}
            </CPagination>

            {/* Add/Edit Company Modal */}
            <CModal visible={showModal} onClose={closeModal} backdrop="static">
                <CModalHeader closeButton>
                    <CModalTitle>{editingCompany ? 'Edit Company' : 'Create New Company'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSaveCompany}>
                        <CFormInput
                            type="text"
                            label="Mã Công Ty"
                            value={editingCompany ? editingCompany.code : newCompany.code}
                            onChange={(e) => {
                                if (editingCompany) {
                                    setEditingCompany({ ...editingCompany, code: e.target.value });
                                } else {
                                    setNewCompany({ ...newCompany, code: e.target.value });
                                }
                            }}
                            className="mb-3"
                            required
                        />
                        <CFormInput
                            type="text"
                            label="Tên Công Ty"
                            value={editingCompany ? editingCompany.name : newCompany.name}
                            onChange={(e) => {
                                if (editingCompany) {
                                    setEditingCompany({ ...editingCompany, name: e.target.value });
                                } else {
                                    setNewCompany({ ...newCompany, name: e.target.value });
                                }
                            }}
                            className="mb-3"
                            required
                        />
                        <CFormInput
                            type="date"
                            label="Ngày Thành Lập"
                            value={editingCompany ? editingCompany.foundedDate : newCompany.foundedDate}
                            onChange={(e) => {
                                if (editingCompany) {
                                    setEditingCompany({ ...editingCompany, foundedDate: e.target.value });
                                } else {
                                    setNewCompany({ ...newCompany, foundedDate: e.target.value });
                                }
                            }}
                            className="mb-3"
                        />
                        <CFormInput
                            type="text"
                            label="Mã Số Thuế"
                            value={editingCompany ? editingCompany.taxCode : newCompany.taxCode}
                            onChange={(e) => {
                                if (editingCompany) {
                                    setEditingCompany({ ...editingCompany, taxCode: e.target.value });
                                } else {
                                    setNewCompany({ ...newCompany, taxCode: e.target.value });
                                }
                            }}
                            className="mb-3"
                        />
                        <CFormInput
                            type="text"
                            label="Số Đăng Ký Kinh Doanh"
                            value={editingCompany ? editingCompany.registrationNumber : newCompany.registrationNumber}
                            onChange={(e) => {
                                if (editingCompany) {
                                    setEditingCompany({ ...editingCompany, registrationNumber: e.target.value });
                                } else {
                                    setNewCompany({ ...newCompany, registrationNumber: e.target.value });
                                }
                            }}
                            className="mb-3"
                        />
                        <CFormInput
                            type="text"
                            label="Địa Chỉ"
                            value={editingCompany ? editingCompany.address : newCompany.address}
                            onChange={(e) => {
                                if (editingCompany) {
                                    setEditingCompany({ ...editingCompany, address: e.target.value });
                                } else {
                                    setNewCompany({ ...newCompany, address: e.target.value });
                                }
                            }}
                            className="mb-3"
                        />
                        <CFormInput
                            type="text"
                            label="Website"
                            value={editingCompany ? editingCompany.website : newCompany.website}
                            onChange={(e) => {
                                if (editingCompany) {
                                    setEditingCompany({ ...editingCompany, website: e.target.value });
                                } else {
                                    setNewCompany({ ...newCompany, website: e.target.value });
                                }
                            }}
                            className="mb-3"
                        />
                        <CFormInput
                            type="textarea"
                            label="Notes"
                            value={editingCompany ? editingCompany.notes : newCompany.notes}
                            onChange={(e) => {
                                if (editingCompany) {
                                    setEditingCompany({ ...editingCompany, notes: e.target.value });
                                } else {
                                    setNewCompany({ ...newCompany, notes: e.target.value });
                                }
                            }}
                            className="mb-3"
                        />
                        <CButton type="submit" color="primary">
                            {editingCompany ? 'Save Changes' : 'Create Company'}
                        </CButton>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModal}>Close</CButton>
                </CModalFooter>
            </CModal>

            {/* Confirm Delete Modal */}
            <CModal visible={!!deleteId} onClose={() => setDeleteId(null)}>
                <CModalHeader closeButton>
                    <CModalTitle>Confirm Deletion</CModalTitle>
                </CModalHeader>
                <CModalBody>Are you sure you want to delete this company?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setDeleteId(null)}>Cancel</CButton>
                    <CButton color="danger" onClick={() => handleDeleteCompany(deleteId)}>Delete</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default CompanyManagement;
