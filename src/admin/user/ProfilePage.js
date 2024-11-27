import React, { useState, useEffect } from 'react';
import axios from './../../api/api';
import {
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CImage,
  CContainer,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react';

const defaultAvatar = 'https://via.placeholder.com/150'; // Ảnh mặc định nếu không có ảnh đại diện

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null); // Để hiện ảnh mới khi upload
  const [showModal, setShowModal] = useState(false); // Modal to confirm avatar upload

  useEffect(() => {
    // Lấy thông tin người dùng hiện tại
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/users/profile'); // Endpoint lấy thông tin người dùng
        setUser(response.data);
        setFullName(response.data.HoTen || '');
        setPhoneNumber(response.data.Phone || '');
        setEmail(response.data.Email || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleAvatarUpload = async () => {
    if (!newAvatar) return;
    const formData = new FormData();
    formData.append('avatar', newAvatar);

    try {
      await axios.put('/users/upload-avatar', formData); // Endpoint cập nhật ảnh đại diện
      setShowModal(false);
      window.location.reload(); // Tải lại trang sau khi cập nhật ảnh thành công
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await axios.put('/users/profile', { fullName, phoneNumber, email }); // Endpoint cập nhật thông tin
      window.alert('Cập nhật hồ sơ thành công');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Hiển thị ảnh xem trước khi người dùng chọn ảnh mới
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatar(file);
    setAvatarPreview(URL.createObjectURL(file)); // Tạo URL tạm thời để xem trước ảnh
  };

  if (!user) {
    return <p>Đang tải thông tin...</p>;
  }

  return (
    <CContainer>
      <h2>Thông tin hồ sơ</h2>

      {/* Hiển thị ảnh đại diện */}
      <CImage        
        src={`${import.meta.env.VITE_API_BASE_URL}/${user.Avatar ? user.Avatar : 'uploads/avatars/150.jpg'}`}
        roundedCircle
        width="150"
        alt="Avatar"
        className="mb-3"
      />
      <CForm>
        <CFormLabel>Thay đổi ảnh đại diện</CFormLabel>
        <CFormInput type="file" onChange={handleAvatarChange} />
        <CButton className="mt-2" color="primary" onClick={() => setShowModal(true)}>
          Cập nhật ảnh đại diện
        </CButton>
      </CForm>

      <CForm className="mt-4">
        {/* Không cho sửa */}
        <CForm>
          <CFormLabel>Username</CFormLabel>
          <CFormInput type="text" value={user.TenDangNhap} readOnly />
        </CForm>

        <CForm>
          <CFormLabel>Email</CFormLabel>
          <CFormInput type="email" value={user.Email} onChange={(e) => setEmail(e.target.value)}
          />
          
        </CForm>

        {/* Cho phép sửa */}
        <CForm>
          <CFormLabel>Họ tên</CFormLabel>
          <CFormInput
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </CForm>

        <CForm>
          <CFormLabel>Điện thoại</CFormLabel>
          <CFormInput
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </CForm>

        <CButton className="mt-3" color="primary" onClick={handleProfileUpdate}>
          Cập nhật hồ sơ
        </CButton>
      </CForm>

      {/* Modal xác nhận cập nhật ảnh đại diện */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} backdrop="static">
        <CModalHeader closeButton>
          <h5>Xác nhận cập nhật ảnh đại diện</h5>
        </CModalHeader>
        <CModalBody>
          Bạn có chắc chắn muốn cập nhật ảnh đại diện không?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </CButton>
          <CButton color="primary" onClick={handleAvatarUpload}>
            Cập nhật
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default ProfilePage;
