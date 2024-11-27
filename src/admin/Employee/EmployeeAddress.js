import React, { useState, useEffect } from 'react';
import {
    CButton,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CRow,
    CCol,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import axios from '../../api/api';

const EmployeeAddress = ({ employeeId, addresses }) => {
    const [addressList, setAddressList] = useState(addresses || []);
    const [newAddress, setNewAddress] = useState({
        title: '',
        provinceId: '',
        districtId: '',
        wardId: '',
        detailedAddress: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý modal

    useEffect(() => {
        fetchProvinces();
        fetchEmployeeAddresses();
    }, []);

    const fetchEmployeeAddresses = async () => {
        try {
            const response = await axios.get(`/employees/${employeeId}/addresses`);
            setAddressList(response.data); // Dữ liệu đã được populate
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const fetchProvinces = async () => {
        try {
            const response = await axios.get('/locations/provinces');
            setProvinces(response.data.map((prov) => ({
                _id: prov._id.toString(), // Chuyển ObjectId thành chuỗi
                provinceName: prov.provinceName,
            })));
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await axios.get(`/locations/provinces/${provinceId}/districts`);
            setDistricts(response.data.map((dist) => ({
                _id: dist._id.toString(), // Chuyển ObjectId thành chuỗi
                districtName: dist.districtName,
            })));
            setWards([]); // Reset wards
            setNewAddress((prev) => ({ ...prev, districtId: '', wardId: '' }));
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await axios.get(`/locations/districts/${districtId}/wards`);
            setWards(response.data.map((ward) => ({
                _id: ward._id.toString(), // Chuyển ObjectId thành chuỗi
                wardName: ward.wardName,
            })));
            setNewAddress((prev) => ({ ...prev, wardId: '' }));
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'provinceId') {
            fetchDistricts(value);
            setNewAddress((prev) => ({ ...prev, provinceId: value, districtId: '', wardId: '' }));
        } else if (name === 'districtId') {
            fetchWards(value);
            setNewAddress((prev) => ({ ...prev, districtId: value, wardId: '' }));
        } else {
            setNewAddress((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddAddress = async () => {
        try {
            const response = await axios.post(`/employees/${employeeId}/addresses`, newAddress);
            setAddressList((prev) => [...prev, response.data.data]);
            setNewAddress({
                title: '',
                provinceId: '',
                districtId: '',
                wardId: '',
                detailedAddress: '',
            });
            fetchEmployeeAddresses();
            setIsModalOpen(false); // Đóng modal sau khi thêm thành công
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const handleRemoveAddress = async (index, addressId) => {
        try {
            await axios.delete(`/employees/${employeeId}/addresses/${addressId}`);
            setAddressList((prev) => prev.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error removing address:', error);
        }
    };

    return (
        <div>
            <h5>Quản lý địa chỉ</h5>
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Loại địa chỉ</CTableHeaderCell>
                        <CTableHeaderCell>Tỉnh/Thành phố</CTableHeaderCell>
                        <CTableHeaderCell>Quận/Huyện</CTableHeaderCell>
                        <CTableHeaderCell>Xã/Phường</CTableHeaderCell>
                        <CTableHeaderCell>Địa chỉ chi tiết</CTableHeaderCell>
                        <CTableHeaderCell>Thao tác</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {addressList.map((addr, index) => (
                        <CTableRow key={addr._id}>
                            <CTableDataCell>{addr.title}</CTableDataCell>
                            <CTableDataCell>{addr.provinceId?.provinceName}</CTableDataCell>
                            <CTableDataCell>{addr.districtId?.districtName}</CTableDataCell>
                            <CTableDataCell>{addr.wardId?.wardName}</CTableDataCell>
                            <CTableDataCell>{addr.detailedAddress}</CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="danger"
                                    onClick={() => handleRemoveAddress(index, addr._id)}
                                >
                                    Xóa
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            <CButton color="primary" onClick={() => setIsModalOpen(true)}>
                Thêm địa chỉ mới
            </CButton>

            {/* Modal thêm địa chỉ mới */}
            <CModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} backdrop="static">
                <CModalHeader>Thêm địa chỉ mới</CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Loại địa chỉ</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormInput
                                    type="text"
                                    name="title"
                                    value={newAddress.title}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Tỉnh/Thành phố</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormSelect
                                    name="provinceId"
                                    value={newAddress.provinceId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn tỉnh/thành phố</option>
                                    {provinces.map((prov) => (
                                        <option key={prov._id} value={prov._id}>
                                            {prov.provinceName}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Quận/Huyện</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormSelect
                                    name="districtId"
                                    value={newAddress.districtId}
                                    onChange={handleInputChange}
                                    disabled={!districts.length}
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map((dist) => (
                                        <option key={dist._id} value={dist._id}>
                                            {dist.districtName}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Xã/Phường</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormSelect
                                    name="wardId"
                                    value={newAddress.wardId}
                                    onChange={handleInputChange}
                                    disabled={!wards.length}
                                >
                                    <option value="">Chọn xã/phường</option>
                                    {wards.map((ward) => (
                                        <option key={ward._id} value={ward._id}>
                                            {ward.wardName}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="align-items-center mt-2">
                            <CCol sm="4">
                                <CFormLabel>Địa chỉ chi tiết</CFormLabel>
                            </CCol>
                            <CCol sm="8">
                                <CFormInput
                                    type="text"
                                    name="detailedAddress"
                                    value={newAddress.detailedAddress}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setIsModalOpen(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleAddAddress}>
                        Lưu
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default EmployeeAddress;
