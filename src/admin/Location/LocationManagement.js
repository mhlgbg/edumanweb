import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import * as XLSX from 'xlsx';

import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CListGroup,
  CListGroupItem,
  CCollapse,
  CFormInput,
} from '@coreui/react';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]); // Dữ liệu cây địa danh
  const [expandedProvince, setExpandedProvince] = useState(null);
  const [expandedDistrict, setExpandedDistrict] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  // Lấy dữ liệu toàn bộ địa danh
  const fetchLocations = async () => {
    try {
      const response = await axios.get('/locations'); // API trả về cây địa danh
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Xử lý khi upload file Excel
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select an Excel file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      try {
        await axios.post('/locations/upload', { data: jsonData });
        alert('File uploaded successfully');
        fetchLocations(); // Tải lại dữ liệu sau khi upload
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Toggle các tỉnh
  const toggleProvince = (provinceId) => {
    setExpandedProvince(expandedProvince === provinceId ? null : provinceId);
    setExpandedDistrict(null); // Đóng tất cả huyện khi chuyển tỉnh
  };

  // Toggle các huyện
  const toggleDistrict = (districtId) => {
    setExpandedDistrict(expandedDistrict === districtId ? null : districtId);
  };

  return (
    <CCard>
      <CCardHeader>
        <h5>Location Management</h5>
        <div className="d-flex">
          <CFormInput
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="me-3"
          />
          <CButton color="primary" onClick={handleUpload}>
            Upload Excel
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CListGroup>
          {locations.map((province) => (
            <div key={province._id}>
              <CListGroupItem
                className="d-flex justify-content-between align-items-center"
                onClick={() => toggleProvince(province._id)}
              >
                {province.provinceName}
                <span>{expandedProvince === province._id ? '-' : '+'}</span>
              </CListGroupItem>
              <CCollapse visible={expandedProvince === province._id}>
                <CListGroup>
                  {province.districts.map((district) => (
                    <div key={district._id}>
                      <CListGroupItem
                        className="d-flex justify-content-between align-items-center ms-3"
                        onClick={() => toggleDistrict(district._id)}
                      >
                        {district.districtName}
                        <span>{expandedDistrict === district._id ? '-' : '+'}</span>
                      </CListGroupItem>
                      <CCollapse visible={expandedDistrict === district._id}>
                        <CListGroup>
                          {district.wards.map((ward) => (
                            <CListGroupItem key={ward._id} className="ms-5">
                              {ward.wardName}
                            </CListGroupItem>
                          ))}
                        </CListGroup>
                      </CCollapse>
                    </div>
                  ))}
                </CListGroup>
              </CCollapse>
            </div>
          ))}
        </CListGroup>
      </CCardBody>
    </CCard>
  );
};

export default LocationManagement;
