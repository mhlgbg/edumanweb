import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import 'react-quill/dist/quill.snow.css';
import axios from '../../api/api';
import TinyMCEEditor from './TinyMCEEditor'; // Thêm dòng này để import TinyMCEEditor
import {
    CButton,
    CForm,
    CTable,
    CContainer,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react';


const ArticleContentListPage = () => {
    const { articleId } = useParams();
    const [contents, setContents] = useState([]);
    const [newContent, setNewContent] = useState({ contentTitle: '', contentType: 'text', contentValue: '', displayOrder: 0 });
    const [editingContent, setEditingContent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
            ['table'], // Nếu hỗ trợ bảng sau khi cài đặt
        ],
        'better-table': { operationMenu: { items: { insertColumnRight: true } } },
    };
    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        const response = await axios.get(`/articles/${articleId}/contents`);
        setContents(response.data);
    };

    const handleSaveContent = async (e) => {
        e.preventDefault();
        if (editingContent) {
            await axios.put(`/articles/contents/${editingContent._id}`, editingContent);
        } else {
            await axios.post(`/articles/${articleId}/contents`, newContent);
            setNewContent({ contentTitle: '', contentType: 'text', contentValue: '', displayOrder: 0 });
        }
        setShowModal(false);
        setEditingContent(null);
        fetchContents();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const fileUrl = response.data.url;
            setNewContent({ ...newContent, contentValue: fileUrl });
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const renderContentValueField = () => {
        const contentType = editingContent ? editingContent.contentType : newContent.contentType;
        if (contentType === 'image') {
            return (
                <>
                    <CFormLabel>Upload Image</CFormLabel>
                    <CFormInput type="file" onChange={handleFileChange} />
                    {editingContent?.contentValue && <img src={editingContent.contentValue} alt="Uploaded" width="100" />}
                </>
            );
        } else if (contentType === 'html') {
            return (
                <>
                    <CFormLabel>HTML Content</CFormLabel>
                    <TinyMCEEditor
                        content={editingContent ? editingContent.contentValue : newContent.contentValue}
                        setContent={(content) => {
                            if (editingContent) {
                                setEditingContent({ ...editingContent, contentValue: content });
                            } else {
                                setNewContent({ ...newContent, contentValue: content });
                            }
                        }}
                    />
                </>
            );
        } else if (contentType === 'pdf' || contentType === 'video') {
            return (
                <>
                    <CFormLabel>{contentType === 'pdf' ? 'PDF URL' : 'Video URL'}</CFormLabel>
                    <CFormInput
                        type="text"
                        placeholder={contentType === 'pdf' ? 'Enter PDF link' : 'Enter YouTube link'}
                        value={editingContent ? editingContent.contentValue : newContent.contentValue}
                        onChange={(e) => {
                            if (editingContent) {
                                setEditingContent({ ...editingContent, contentValue: e.target.value });
                            } else {
                                setNewContent({ ...newContent, contentValue: e.target.value });
                            }
                        }}
                    />
                </>
            );
        } else {
            return (
                <>
                    <CFormLabel>Text Content</CFormLabel>
                    <CFormInput
                        type="text"
                        value={editingContent ? editingContent.contentValue : newContent.contentValue}
                        onChange={(e) => {
                            if (editingContent) {
                                setEditingContent({ ...editingContent, contentValue: e.target.value });
                            } else {
                                setNewContent({ ...newContent, contentValue: e.target.value });
                            }
                        }}
                    />
                </>
            );
        }
    };

    const handleDeleteContent = async (contentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this content?");
        if (confirmDelete) {
            await axios.delete(`/articles/contents/${contentId}`);
            fetchContents();
        }
    };

    const openModal = (content = null) => {
        setEditingContent(content);
        setNewContent(content || { contentTitle: '', contentType: 'text', contentValue: '', displayOrder: 0 });
        setShowModal(true);
    };

    const closeModal = () => {
        setEditingContent(null);
        setShowModal(false);
    };
    

    return (
        <CContainer>
            <h2 className="my-4">Manage Article Contents</h2>

            <CButton color="primary" className="mb-4" onClick={() => openModal()}>Add New Content</CButton>

            <CTable striped hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Title</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Value</CTableHeaderCell>
                        <CTableHeaderCell>Display Order</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {contents.map((content) => (
                        <CTableRow key={content._id}>
                            <CTableDataCell>{content.contentTitle}</CTableDataCell>
                            <CTableDataCell>{content.contentType}</CTableDataCell>
                            <CTableDataCell>
                                {content.contentType === 'image' ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_BASE_URL}/${content.contentValue}`}
                                        alt="Content"
                                        width="100"
                                    />
                                ) : (
                                    content.contentValue
                                )}
                            </CTableDataCell>
                            <CTableDataCell>{content.displayOrder}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="warning" className="me-2" onClick={() => openModal(content)}>Edit</CButton>
                                <CButton color="danger" onClick={() => handleDeleteContent(content._id)}>Delete</CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            <CModal visible={showModal} onClose={closeModal} backdrop="static" size="xl">
                <CModalHeader closeButton>
                    <h5>{editingContent ? 'Edit Content' : 'Add New Content'}</h5>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSaveContent}>
                        <CFormLabel>Title</CFormLabel>
                        <CFormInput
                            type="text"
                            value={editingContent ? editingContent.contentTitle : newContent.contentTitle}
                            onChange={(e) => {
                                if (editingContent) {
                                    setEditingContent({ ...editingContent, contentTitle: e.target.value });
                                } else {
                                    setNewContent({ ...newContent, contentTitle: e.target.value });
                                }
                            }}
                            className="mb-3"
                        />

                        <CFormLabel>Content Type</CFormLabel>
                        <CFormSelect
                            value={editingContent ? editingContent.contentType : newContent.contentType}
                            onChange={(e) => {
                                if (editingContent) {
                                    setEditingContent({ ...editingContent, contentType: e.target.value });
                                } else {
                                    setNewContent({ ...newContent, contentType: e.target.value });
                                }
                            }}
                            className="mb-3"
                        >
                            <option value="text">Text</option>
                            <option value="html">HTML</option>
                            <option value="image">Image</option>
                            <option value="video">Video (YouTube)</option>
                            <option value="pdf">PDF</option>
                        </CFormSelect>

                        {renderContentValueField()}

                        <CFormLabel>Display Order</CFormLabel>
                        <CFormInput
                            type="number"
                            value={editingContent ? editingContent.displayOrder : newContent.displayOrder}
                            onChange={(e) => {
                                if (editingContent) {
                                    setEditingContent({ ...editingContent, displayOrder: e.target.value });
                                } else {
                                    setNewContent({ ...newContent, displayOrder: e.target.value });
                                }
                            }}
                            className="mb-3"
                        />
                        <CButton type="submit" color="primary">
                            {editingContent ? 'Save Changes' : 'Add Content'}
                        </CButton>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModal}>Close</CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    );
};

export default ArticleContentListPage;
