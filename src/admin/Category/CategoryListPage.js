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

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    code: '',
    name: '',
    thumbnail: '',
    description: '',
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');  
  const [currentPage, setCurrentPage] = useState(1);  
  const [totalPages, setTotalPages] = useState(1);

  // State for managing articles in a category
  const [showArticlesModal, setShowArticlesModal] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [articles, setArticles] = useState([]);
  const [articleSearchKey, setArticleSearchKey] = useState('');
  const [articlesPage, setArticlesPage] = useState(1);
  const [totalArticlesPages, setTotalArticlesPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, [currentPage, search]);

  const fetchCategories = async () => {
    const response = await axios.get(`/categories?page=${currentPage}&limit=5&search=${search}`);
    setCategories(response.data.categories);
    setTotalPages(response.data.totalPages);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (editingCategory) {
      await axios.put(`/categories/${editingCategory._id}`, editingCategory);
    } else {
      await axios.post('/categories', newCategory);
      setNewCategory({
        code: '',
        name: '',
        thumbnail: '',
        description: '',
      });
    }
    setShowModal(false);
    setEditingCategory(null);
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    await axios.delete(`/categories/${id}`);
    setDeleteId(null);
    fetchCategories();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('thumbnail', file);

    try {
      const response = await axios.post('/upload?field=thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileUrl = response.data.url;
      if (editingCategory) {
        setEditingCategory({ ...editingCategory, thumbnail: fileUrl });
      } else {
        setNewCategory({ ...newCategory, thumbnail: fileUrl });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const openModal = (category = null) => {
    setEditingCategory(category);
    setNewCategory(category || {
      code: '',
      name: '',
      thumbnail: '',
      description: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingCategory(null);
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

  // Functions for managing articles in a category
  const openArticlesModal = (categoryId) => {
    setCurrentCategoryId(categoryId);
    fetchCategoryArticles(categoryId, articlesPage);
    setShowArticlesModal(true);
  };

  const fetchCategoryArticles = async (categoryId, page) => {
    const response = await axios.get(`/categories/${categoryId}/articles?page=${page}&limit=12`);
    setArticles(response.data.articles);
    setTotalArticlesPages(response.data.totalPages);
  };

  const handleAddArticleToCategory = async () => {
    try {
      await axios.post(`/categories/${currentCategoryId}/articles`, { key: articleSearchKey });
      setArticleSearchKey(''); // Clear input after adding
      fetchCategoryArticles(currentCategoryId, articlesPage);
    } catch (error) {
      console.error('Error adding article:', error);
    }
  };

  const handleRemoveArticleFromCategory = async (articleId) => {
    try {
      await axios.delete(`/categories/${currentCategoryId}/articles/${articleId}`);
      fetchCategoryArticles(currentCategoryId, articlesPage);
    } catch (error) {
      console.error('Error removing article:', error);
    }
  };

  return (
    <div>
      <h2>Category Management</h2>

      <CFormInput
        type="text"
        placeholder="Search categories by name..."
        value={search}
        onChange={handleSearchChange}
        className="mb-3"
      />

      <CButton color="primary" className="mb-4" onClick={() => openModal()}>Create New Category</CButton>

      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Code</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Thumbnail</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {categories.map((category) => (
            <CTableRow key={category._id}>
              <CTableDataCell>{category.code}</CTableDataCell>
              <CTableDataCell>{category.name}</CTableDataCell>
              <CTableDataCell>
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/${category.thumbnail ? category.thumbnail : 'uploads/avatars/default-thumbnail.jpg'}`}
                  alt="Thumbnail"
                  width="100"
                />
              </CTableDataCell>
              <CTableDataCell>{category.description}</CTableDataCell>
              <CTableDataCell>
                <CButton color="warning" className="me-2" onClick={() => openModal(category)}>Edit</CButton>
                <CButton color="danger" onClick={() => confirmDelete(category._id)}>Delete</CButton>
                <CButton color="info" onClick={() => openArticlesModal(category._id)}>Manage Articles</CButton>
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

      {/* Add/Edit Category Modal */}
      <CModal visible={showModal} onClose={closeModal} backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSaveCategory}>
            <CFormInput
              type="text"
              label="Code"
              value={editingCategory ? editingCategory.code : newCategory.code}
              onChange={(e) => {
                if (editingCategory) {
                  setEditingCategory({ ...editingCategory, code: e.target.value });
                } else {
                  setNewCategory({ ...newCategory, code: e.target.value });
                }
              }}
              className="mb-3"
            />
            <CFormInput
              type="text"
              label="Name"
              value={editingCategory ? editingCategory.name : newCategory.name}
              onChange={(e) => {
                if (editingCategory) {
                  setEditingCategory({ ...editingCategory, name: e.target.value });
                } else {
                  setNewCategory({ ...newCategory, name: e.target.value });
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
            <CFormInput
              type="textarea"
              label="Description"
              value={editingCategory ? editingCategory.description : newCategory.description}
              onChange={(e) => {
                if (editingCategory) {
                  setEditingCategory({ ...editingCategory, description: e.target.value });
                } else {
                  setNewCategory({ ...newCategory, description: e.target.value });
                }
              }}
              className="mb-3"
            />
            <CButton type="submit" color="primary">
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>Close</CButton>
        </CModalFooter>
      </CModal>

      {/* Manage Articles Modal */}
      <CModal visible={showArticlesModal} onClose={() => setShowArticlesModal(false)} size="lg" backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>Manage Articles for Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            placeholder="Enter article key to add..."
            value={articleSearchKey}
            onChange={(e) => setArticleSearchKey(e.target.value)}
            className="mb-3"
          />
          <CButton color="success" className="mb-4" onClick={handleAddArticleToCategory}>Add Article</CButton>

          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Key</CTableHeaderCell>
                <CTableHeaderCell>Title</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {articles.map((article) => (
                <CTableRow key={article._id}>
                  <CTableDataCell>{article.key}</CTableDataCell>
                  <CTableDataCell>{article.title}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="danger" onClick={() => handleRemoveArticleFromCategory(article._id)}>Remove</CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>

          <CPagination>
            {[...Array(totalArticlesPages).keys()].map(page => (
              <CPaginationItem
                key={page + 1}
                active={page + 1 === articlesPage}
                onClick={() => {
                  setArticlesPage(page + 1);
                  fetchCategoryArticles(currentCategoryId, page + 1);
                }}
              >
                {page + 1}
              </CPaginationItem>
            ))}
          </CPagination>
        </CModalBody>
      </CModal>

      {/* Confirm Delete Modal */}
      <CModal visible={!!deleteId} onClose={() => setDeleteId(null)}>
        <CModalHeader closeButton>
          <CModalTitle>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this category?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteId(null)}>Cancel</CButton>
          <CButton color="danger" onClick={() => handleDeleteCategory(deleteId)}>Delete</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default CategoryListPage;
