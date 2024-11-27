import React, { useState, useEffect } from 'react';
import {
    CButton,
    CForm,
    CFormInput,
    CFormLabel,
    CRow,
    CCol,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CPagination,
    CPaginationItem,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import axios from '../../api/api';

const UploadedFileManager = () => {
    const [files, setFiles] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [newFile, setNewFile] = useState({
        key: '',
        description: '',
        file: null,
    });
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [modalVisible, setModalVisible] = useState(false); // Trạng thái modal

    useEffect(() => {
        fetchFiles();
    }, [page, search, refresh]);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/uploaded-files', {
                params: { page, search, limit: 12 },
            });
            setFiles(response.data.files);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleFileChange = (e) => {
        setNewFile((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFile((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadFile = async () => {
        if (!newFile.key) {
            setError('Key không được để trống');
            return;
        }

        if (!newFile.file) {
            setError('Vui lòng chọn file để tải lên.');
            return;
        }

        const formData = new FormData();
        formData.append('file', newFile.file);
        formData.append('key', newFile.key);
        formData.append('description', newFile.description);

        try {
            await axios.post('/uploaded-files', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Tải file thành công.');
            setNewFile({ key: '', description: '', file: null });
            setError('');
            setRefresh(!refresh);
            setModalVisible(false); // Đóng modal
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Lỗi khi tải file.';
            setError(errorMessage);
            console.error('Error uploading file:', error);
        }
    };

    const handleDeleteFile = async (fileId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa file này không?')) return;

        try {
            await axios.delete(`/uploaded-files/${fileId}`);
            alert('Xóa file thành công.');
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Xóa file thất bại.');
        }
    };

    return (
        <div>
            <h5>Quản lý tệp đã tải lên</h5>

            {/* Tìm kiếm */}
            <CForm className="d-flex mb-3">
                <CFormInput
                    type="text"
                    placeholder="Tìm kiếm file..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="me-2"
                />
                <CButton color="primary" onClick={() => setPage(1)}>
                    Tìm kiếm
                </CButton>
            </CForm>

            {/* Bảng file */}
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Tên file</CTableHeaderCell>
                        <CTableHeaderCell>Mô tả</CTableHeaderCell>
                        <CTableHeaderCell>Người tải lên</CTableHeaderCell>
                        <CTableHeaderCell>Ngày tải lên</CTableHeaderCell>
                        <CTableHeaderCell>Key</CTableHeaderCell>
                        <CTableHeaderCell>Thao tác</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {files.map((file) => (
                        <CTableRow key={file._id}>
                            <CTableDataCell>
                                <a
                                    href={`${import.meta.env.VITE_API_BASE_URL}${file.fileUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {file.fileName}
                                </a>
                            </CTableDataCell>
                            <CTableDataCell>
                                {file.description || 'N/A'}
                            </CTableDataCell>
                            <CTableDataCell>
                                {file.uploadedBy?.fullName || 'N/A'}
                            </CTableDataCell>
                            <CTableDataCell>
                                {new Date(file.createdAt).toLocaleDateString()}
                            </CTableDataCell>
                            <CTableDataCell>{file.key || 'N/A'}</CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="danger"
                                    onClick={() =>
                                        handleDeleteFile(file._id)
                                    }
                                >
                                    Xóa
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            {/* Phân trang */}
            <CPagination aria-label="Page navigation">
                <CPaginationItem
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Trước
                </CPaginationItem>
                {Array.from({ length: totalPages }).map((_, index) => (
                    <CPaginationItem
                        key={index}
                        active={page === index + 1}
                        onClick={() => setPage(index + 1)}
                    >
                        {index + 1}
                    </CPaginationItem>
                ))}
                <CPaginationItem
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Sau
                </CPaginationItem>
            </CPagination>

            {/* Nút mở modal */}
            <CButton color="success" className="mt-4" onClick={() => setModalVisible(true)}>
                Thêm file mới
            </CButton>

            {/* Modal thêm file */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle>Thêm file mới</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="align-items-center">
                            <CCol sm="3">
                                <CFormLabel>Key</CFormLabel>
                            </CCol>
                            <CCol sm="9">
                                <CFormInput
                                    type="text"
                                    name="key"
                                    value={newFile.key}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-3">
                            <CCol sm="3">
                                <CFormLabel>Chọn file</CFormLabel>
                            </CCol>
                            <CCol sm="9">
                                <CFormInput type="file" onChange={handleFileChange} />
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-3">
                            <CCol sm="3">
                                <CFormLabel>Mô tả</CFormLabel>
                            </CCol>
                            <CCol sm="9">
                                <CFormInput
                                    type="text"
                                    name="description"
                                    value={newFile.description}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>
                        Đóng
                    </CButton>
                    <CButton color="primary" onClick={handleUploadFile}>
                        Tải lên
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default UploadedFileManager;
