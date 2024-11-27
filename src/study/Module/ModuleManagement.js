import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
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
    CForm,
    CFormInput,
    CFormLabel,
    CPagination,
    CPaginationItem,
} from '@coreui/react';

const ModuleManagement = () => {
    const [modules, setModules] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [newModule, setNewModule] = useState({ code: '', name: '', description: '', thumbnailImage: '' });

    useEffect(() => {
        fetchModules();
    }, [currentPage, searchQuery]);

    const fetchModules = async () => {
        const response = await axios.get(`/modules?page=${currentPage}&limit=10&search=${searchQuery}`);
        setModules(response.data.modules);
        setTotalPages(response.data.totalPages);
    };

    const handleSaveModule = async (e) => {
        e.preventDefault();
        if (editingModule) {
            await axios.put(`/modules/${editingModule._id}`, newModule);
        } else {
            await axios.post('/modules', newModule);
        }
        setShowModal(false);
        setEditingModule(null);
        setNewModule({ code: '', name: '', description: '', thumbnailImage: '' });
        fetchModules();
    };

    const handleDeleteModule = async (id) => {
        if (window.confirm('Are you sure you want to delete this module?')) {
            await axios.delete(`/modules/${id}`);
            fetchModules();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('thumbnailImage', file);

        try {
            const response = await axios.post('/modules/thumbnailImage/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const thumbnailImage = response.data.thumbnailImage;
            setNewModule({ ...newModule, thumbnailImage: thumbnailImage });
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const openModal = (module = null) => {
        setEditingModule(module);
        setNewModule(module || { code: '', name: '', description: '', thumbnailImage: '' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingModule(null);
    };

    return (
        <CCard>
            <CCardHeader>
                <h5>Module Management</h5>
                <div className="d-flex align-items-center">
                    <CFormInput
                        placeholder="Search by module name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="me-3"
                    />
                    <CButton color="primary" onClick={() => openModal()}>Add New Module</CButton>
                </div>
            </CCardHeader>

            <CCardBody>
                <CTable hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Thumbnail</CTableHeaderCell>
                            <CTableHeaderCell>Code</CTableHeaderCell>
                            <CTableHeaderCell>Name</CTableHeaderCell>
                            <CTableHeaderCell>Description</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {modules.map((module) => (
                            <CTableRow key={module._id}>
                                <CTableDataCell>
                                    <img src={`${import.meta.env.VITE_API_BASE_URL}${module.thumbnailImage}`} alt={module.name} width="100" height="100" />
                                </CTableDataCell>
                                <CTableDataCell>{module.code}</CTableDataCell>
                                <CTableDataCell>{module.name}</CTableDataCell>
                                <CTableDataCell>{module.description}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="warning" className="me-2" onClick={() => openModal(module)}>Edit</CButton>
                                    <CButton color="danger" onClick={() => handleDeleteModule(module._id)}>Delete</CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>

                <CPagination align="center">
                    {[...Array(totalPages).keys()].map((page) => (
                        <CPaginationItem
                            key={page + 1}
                            active={page + 1 === currentPage}
                            onClick={() => setCurrentPage(page + 1)}
                        >
                            {page + 1}
                        </CPaginationItem>
                    ))}
                </CPagination>
            </CCardBody>

            <CModal visible={showModal} onClose={closeModal} size="lg" backdrop="static">
                <CModalHeader>
                    <CModalTitle>{editingModule ? 'Edit Module' : 'Add New Module'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSaveModule}>
                        <CFormLabel>Code</CFormLabel>
                        <CFormInput
                            type="text"
                            placeholder="Enter module code"
                            value={newModule.code}
                            onChange={(e) => setNewModule({ ...newModule, code: e.target.value })}
                            className="mb-3"
                            required
                        />
                        <CFormLabel>Name</CFormLabel>
                        <CFormInput
                            type="text"
                            placeholder="Enter module name"
                            value={newModule.name}
                            onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                            className="mb-3"
                            required
                        />
                        <CFormLabel>Description</CFormLabel>
                        <CFormInput
                            type="text"
                            placeholder="Enter description"
                            value={newModule.description}
                            onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                            className="mb-3"
                        />
                        <CFormLabel>Thumbnail Image</CFormLabel>
                        <CFormInput
                            type="file"
                            onChange={handleFileChange}
                            className="mb-3"
                        />
                        <CButton type="submit" color="primary">
                            {editingModule ? 'Save Changes' : 'Add Module'}
                        </CButton>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModal}>Close</CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ModuleManagement;
