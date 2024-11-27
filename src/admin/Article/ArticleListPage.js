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
import { useNavigate } from 'react-router-dom';

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    key: '',
    title: '',
    summary: '',
    thumbnailImage: '',
    status: 'draft',
    releaseDate: '',
    contents: [],
  });
  const [editingArticle, setEditingArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');  
  const [currentPage, setCurrentPage] = useState(1);  
  const [totalPages, setTotalPages] = useState(1);  
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, [currentPage, search]);

  const fetchArticles = async () => {
    const response = await axios.get(`/articles?page=${currentPage}&limit=12&search=${search}`);
    setArticles(response.data.articles);
    setTotalPages(response.data.totalPages);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (editingArticle) {
      await axios.put(`/articles/${editingArticle._id}`, editingArticle);
    } else {
      await axios.post('/articles', newArticle);
      setNewArticle({
        key: '',
        title: '',
        summary: '',
        thumbnailImage: '',
        status: 'draft',
        releaseDate: '',
        contents: [],
      });
    }
    setShowModal(false);
    setEditingArticle(null);
    fetchArticles();
  };

  const handleDeleteArticle = async (id) => {
    await axios.delete(`/articles/${id}`);
    setDeleteId(null);
    fetchArticles();
  };

  const openContentPage = (articleId) => {
    navigate(`/admin/articles/${articleId}/contents`);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('thumbnailImage', file);

    try {
      const response = await axios.post('/upload?field=thumbnailImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileUrl = response.data.url;
      if (editingArticle) {
        setEditingArticle({ ...editingArticle, thumbnailImage: fileUrl });
      } else {
        setNewArticle({ ...newArticle, thumbnailImage: fileUrl });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const openModal = (article = null) => {
    setEditingArticle(article);
    setNewArticle(article || {
      key: '',
      title: '',
      summary: '',
      thumbnailImage: '',
      status: 'draft',
      releaseDate: '',
      contents: [],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingArticle(null);
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
      <h2>Article Management</h2>

      <CFormInput
        type="text"
        placeholder="Search articles by title..."
        value={search}
        onChange={handleSearchChange}
        className="mb-3"
      />

      <CButton color="primary" className="mb-4" onClick={() => openModal()}>Create New Article</CButton>

      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Key</CTableHeaderCell>
            <CTableHeaderCell>Title</CTableHeaderCell>
            <CTableHeaderCell>Thumbnail</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Release Date</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {articles.map((article) => (
            <CTableRow key={article._id}>
              <CTableDataCell>{article.key}</CTableDataCell>
              <CTableDataCell>{article.title}</CTableDataCell>
              <CTableDataCell>
                <img                  
                  src={`${import.meta.env.VITE_API_BASE_URL}/${article.thumbnailImage ? article.thumbnailImage : 'uploads/avatars/150.jpg'}`}
                  alt="Thumbnail"
                  width="100"
                />
              </CTableDataCell>
              <CTableDataCell>{article.status}</CTableDataCell>
              <CTableDataCell>{article.releaseDate ? new Date(article.releaseDate).toLocaleDateString() : 'N/A'}</CTableDataCell>
              <CTableDataCell>
                <CButton color="warning" className="me-2" onClick={() => openModal(article)}>Edit</CButton>
                <CButton color="danger" onClick={() => confirmDelete(article._id)}>Delete</CButton>
                <CButton color="info" onClick={() => openContentPage(article._id)}>Contents</CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

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

      {/* Add/Edit Article Modal */}
      <CModal visible={showModal} onClose={closeModal} backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>{editingArticle ? 'Edit Article' : 'Create New Article'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSaveArticle}>
            <CFormInput
              type="text"
              label="Key"
              value={editingArticle ? editingArticle.key : newArticle.key}
              onChange={(e) => {
                if (editingArticle) {
                  setEditingArticle({ ...editingArticle, key: e.target.value });
                } else {
                  setNewArticle({ ...newArticle, key: e.target.value });
                }
              }}
              className="mb-3"
            />
            <CFormInput
              type="text"
              label="Title"
              value={editingArticle ? editingArticle.title : newArticle.title}
              onChange={(e) => {
                if (editingArticle) {
                  setEditingArticle({ ...editingArticle, title: e.target.value });
                } else {
                  setNewArticle({ ...newArticle, title: e.target.value });
                }
              }}
              className="mb-3"
            />
            <CFormInput
              type="text"
              label="Summary"
              value={editingArticle ? editingArticle.summary : newArticle.summary}
              onChange={(e) => {
                if (editingArticle) {
                  setEditingArticle({ ...editingArticle, summary: e.target.value });
                } else {
                  setNewArticle({ ...newArticle, summary: e.target.value });
                }
              }}
              className="mb-3"
            />
            <CFormInput
              type="date"
              label="Release Date"
              value={editingArticle ? editingArticle.releaseDate?.split('T')[0] : newArticle.releaseDate}
              onChange={(e) => {
                if (editingArticle) {
                  setEditingArticle({ ...editingArticle, releaseDate: e.target.value });
                } else {
                  setNewArticle({ ...newArticle, releaseDate: e.target.value });
                }
              }}
              className="mb-3"
            />
            <CFormInput
              type="file"
              label="Thumbnail Image"
              onChange={handleFileChange}
              className="mb-3"
            />
            <CButton type="submit" color="primary">
              {editingArticle ? 'Save Changes' : 'Create Article'}
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
        <CModalBody>Are you sure you want to delete this article?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteId(null)}>Cancel</CButton>
          <CButton color="danger" onClick={() => handleDeleteArticle(deleteId)}>Delete</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ArticleListPage;
