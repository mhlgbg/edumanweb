import React, { useState } from 'react';
import axios from '../../api/api';
import {
  CForm,
  CFormInput,
  CButton,
  CAlert
} from '@coreui/react';

const ChangePassword = () => {
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Lấy userId từ sessionStorage

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/users/change-password', {
        currentPassword,
        newPassword,
      });

      setSuccess(response.data.message);
      setError('');
    } catch (error) {
      setError('Failed to change password');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      {error && <CAlert color="danger">{error}</CAlert>}
      {success && <CAlert color="success">{success}</CAlert>}
      <CForm onSubmit={handleSubmit}>
        <CFormInput
          type="password"
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="mb-3"
        />

        <CFormInput
          type="password"
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="mb-3"
        />

        <CFormInput
          type="password"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mb-3"
        />

        <CButton type="submit" color="primary">
          Change Password
        </CButton>
      </CForm>
    </div>
  );
};

export default ChangePassword;
