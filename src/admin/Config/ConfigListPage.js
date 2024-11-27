import React, { useState, useEffect } from 'react';
import axios from './../../api/api';
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS của React Quill

// ConfigListPage component
const ConfigListPage = () => {
  const [configs, setConfigs] = useState([]);
  const [newConfig, setNewConfig] = useState({
    configKey: '',
    configValueType: 'text',
    configValue: '',
  });
  const [editingConfig, setEditingConfig] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);  // Biến trạng thái cho việc upload

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await axios.get('/configurations');
      setConfigs(response.data);
    } catch (err) {
      console.error('Error fetching configs:', err);
    }
  };

  // Save or update config
  const handleSaveConfig = async () => {
    if (uploading) {
      alert('Vui lòng đợi trong khi file đang được tải lên!');
      return;
    }

    try {
      if (editingConfig && editingConfig._id) {
        await axios.put(`/configurations/${editingConfig._id}`, editingConfig);
      } else {
        if (newConfig.configKey === '' || newConfig.configValue === '') {
          alert('ConfigKey và ConfigValue là bắt buộc!');
          return;
        }
        await axios.post('/configurations', newConfig);
        setNewConfig({
          configKey: '',
          configValueType: 'text',
          configValue: '',
        });
      }
      setShowModal(false);
      fetchConfigs();
    } catch (error) {
      console.error("Error saving config:", error);
    }
  };

  // Upload file và cập nhật ConfigValue sau khi hoàn tất
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);  // Bắt đầu upload
    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileUrl = res.data.url;
      
      if (editingConfig) {
        setEditingConfig({ ...editingConfig, configValue: fileUrl });
      } else {
        setNewConfig({ ...newConfig, configValue: fileUrl });
      }
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setUploading(false);  // Kết thúc upload
    }
  };

  // Hàm render control cho configValue
  const renderConfigValueInput = (configValueType, configValue, handleChange) => {
    switch (configValueType) {
      case 'text':
        return (
          <CFormInput
            type="text"
            value={configValue}
            onChange={handleChange}
          />
        );
      case 'html':
        return (
          <ReactQuill
            value={configValue}
            onChange={(content) => handleChange({ target: { value: content } })}
            theme="snow" // Giao diện của trình soạn thảo
          />
        );
      case 'image':
        return (
          <>
            <CFormInput
              type="file"
              onChange={handleFileUpload}  // Gọi hàm upload file
            />
            {/* Hiển thị preview nếu có url */}
            {configValue && (
              <img src={`${import.meta.env.VITE_API_BASE_URL}/${configValue ? configValue : 'uploads/avatars/150.jpg'}`} alt="Preview" width="100" style={{ marginTop: '10px' }} />
              
            )}
          </>
        );
      case 'youtubelink':
        return (
          <CFormInput
            type="url"
            value={configValue}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  const openModal = (config = null) => {
    if (config) {
      setEditingConfig(config);
    } else {
      setNewConfig({
        configKey: '',
        configValueType: 'text',
        configValue: '',
      });
      setEditingConfig(null); // Đảm bảo không chỉnh sửa
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingConfig(null);
    setShowModal(false);
  };

  return (
    <CContainer>
      <h2 className="my-4">Config Management</h2>

      <CButton color="primary" className="mb-4" onClick={() => openModal()}>
        Add New Config
      </CButton>

      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Config Key</CTableHeaderCell>
            <CTableHeaderCell>Config Value Type</CTableHeaderCell>
            <CTableHeaderCell>Config Value</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {configs.map((config) => (
            <CTableRow key={config._id}>
              <CTableDataCell>{config.configKey}</CTableDataCell>
              <CTableDataCell>{config.configValueType}</CTableDataCell>
              <CTableDataCell>
                {config.configValueType === 'image' ? (
                  <img src={`${import.meta.env.VITE_API_BASE_URL}/${config.configValue ? config.configValue : 'uploads/avatars/150.jpg'}`} alt="Preview" width="100" style={{ marginTop: '10px' }} />
                ) : (
                  config.configValue
                )}
              </CTableDataCell>
              <CTableDataCell>
                <CButton color="warning" className="me-2" onClick={() => openModal(config)}>
                  Edit
                </CButton>
                <CButton color="danger" onClick={() => handleDeleteConfig(config._id)}>
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal for creating/editing config */}
      <CModal visible={showModal} onClose={closeModal} backdrop="static">
        <CModalHeader closeButton>
          <h5>{editingConfig ? 'Edit Config' : 'Add New Config'}</h5>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CForm className="mb-3">
              <CFormLabel>Config Key</CFormLabel>
              <CFormInput
                type="text"
                value={editingConfig ? editingConfig.configKey : newConfig.configKey}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editingConfig) {
                    setEditingConfig({ ...editingConfig, configKey: value });
                  } else {
                    setNewConfig({ ...newConfig, configKey: value });
                  }
                }}
                required
              />
            </CForm>
            <CForm className="mb-3">
              <CFormLabel>Config Value Type</CFormLabel>
              <CFormSelect
                value={editingConfig ? editingConfig.configValueType : newConfig.configValueType}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editingConfig) {
                    setEditingConfig({ ...editingConfig, configValueType: value, configValue: '' });
                  } else {
                    setNewConfig({ ...newConfig, configValueType: value, configValue: '' });
                  }
                }}
              >
                <option value="text">Text</option>
                <option value="html">HTML</option>
                <option value="image">Image</option>
                <option value="youtubelink">YouTube Link</option>
              </CFormSelect>
            </CForm>
            <CForm className="mb-3">
              <CFormLabel>Config Value</CFormLabel>
              {renderConfigValueInput(
                editingConfig ? editingConfig.configValueType : newConfig.configValueType,
                editingConfig ? editingConfig.configValue : newConfig.configValue,
                (e) => {
                  const value = e.target.value;
                  if (editingConfig) {
                    setEditingConfig({ ...editingConfig, configValue: value });
                  } else {
                    setNewConfig({ ...newConfig, configValue: value });
                  }
                }
              )}
            </CForm>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>Close</CButton>
          <CButton color="primary" onClick={handleSaveConfig}>
            {editingConfig ? 'Save Changes' : 'Add Config'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default ConfigListPage;
