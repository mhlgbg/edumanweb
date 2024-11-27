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
    CFormSelect,
    CPagination,
    CPaginationItem,
} from '@coreui/react';

const ImageManagement = () => {
    const [images, setImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [imageTypeFilter, setImageTypeFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [newImage, setNewImage] = useState({ description: '', imageType: 'gallery', url: '' });

    useEffect(() => {
        fetchImages();
    }, [currentPage, searchQuery, imageTypeFilter]);

    const fetchImages = async () => {
        const response = await axios.get(`/images?page=${currentPage}&limit=12&search=${searchQuery}&imageType=${imageTypeFilter}`);
        setImages(response.data.images);
        setTotalPages(response.data.totalPages);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('url', file);

        try {
            const response = await axios.post('/images/url/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const fileUrl = response.data.url;
            setNewImage({ ...newImage, url: fileUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleSaveImage = async (e) => {
        e.preventDefault();
        if (editingImage) {
            await axios.put(`/images/${editingImage._id}`, newImage);
        } else {
            await axios.post('/images', newImage);
        }
        setShowModal(false);
        setEditingImage(null);
        setNewImage({ description: '', imageType: 'gallery', url: '' });
        fetchImages();
    };

    const handleDeleteImage = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            await axios.delete(`/images/${id}`);
            fetchImages();
        }
    };

    const openModal = (image = null) => {
        setEditingImage(image);
        setNewImage(image || { description: '', imageType: 'gallery', url: '' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingImage(null);
    };

    return (
        <CCard>
            <CCardHeader>
                <h5>Image Management</h5>
                <div className="d-flex align-items-center">
                    <CFormInput
                        placeholder="Search by description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="me-3"
                    />
                    <CFormSelect
                        value={imageTypeFilter}
                        onChange={(e) => setImageTypeFilter(e.target.value)}
                        className="me-3"
                    >
                        <option value="">All Types</option>
                        <option value="avatar">Avatar</option>
                        <option value="banner">Banner</option>
                        <option value="document">Document</option>
                        <option value="thumbnail">Thumbnail</option>
                        <option value="gallery">Gallery</option>
                    </CFormSelect>
                    <CButton color="primary" onClick={() => openModal()}>Add New Image</CButton>
                </div>
            </CCardHeader>

            <CCardBody>
                <CTable hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Image</CTableHeaderCell>
                            <CTableHeaderCell>Description</CTableHeaderCell>
                            <CTableHeaderCell>Type</CTableHeaderCell>
                            <CTableHeaderCell>FullURL</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {images.map((image) => (
                            <CTableRow key={image._id}>
                                <CTableDataCell>
                                    <img src={`${import.meta.env.VITE_API_BASE_URL}${image.url}`} alt={image.description} width="100" height="100" />
                                </CTableDataCell>
                                <CTableDataCell>{image.description}</CTableDataCell>
                                <CTableDataCell>{image.imageType}</CTableDataCell>
                                <CTableDataCell>{`${import.meta.env.VITE_API_BASE_URL}${image.url}`}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="warning" className="me-2" onClick={() => openModal(image)}>Edit</CButton>
                                    <CButton color="danger" onClick={() => handleDeleteImage(image._id)}>Delete</CButton>
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
                    <CModalTitle>{editingImage ? 'Edit Image' : 'Add New Image'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSaveImage}>
                        <CFormLabel>Upload Image</CFormLabel>
                        <CFormInput
                            type="file"
                            onChange={handleImageUpload}
                            className="mb-3"
                        />
                        {newImage.url && (
                            <img src={`${import.meta.env.VITE_API_BASE_URL}/${newImage.url}`} alt="Preview" width="100" height="100" className="mb-3" />
                        )}
                        <CFormLabel>Description</CFormLabel>
                        <CFormInput
                            type="text"
                            placeholder="Enter description"
                            value={newImage.description}
                            onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                            className="mb-3"
                        />
                        <CFormLabel>Image Type</CFormLabel>
                        <CFormSelect
                            value={newImage.imageType}
                            onChange={(e) => setNewImage({ ...newImage, imageType: e.target.value })}
                            className="mb-3"
                        >
                            <option value="avatar">Avatar</option>
                            <option value="banner">Banner</option>
                            <option value="document">Document</option>
                            <option value="thumbnail">Thumbnail</option>
                            <option value="gallery">Gallery</option>
                        </CFormSelect>
                        <CButton type="submit" color="primary">
                            {editingImage ? 'Save Changes' : 'Add Image'}
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

export default ImageManagement;
