import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../../api/api';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CAlert
} from '@coreui/react';

function ResetPasswordPage() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);  // Track success state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/users/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
      setIsSuccess(true);  // Set success to true if reset was successful
    } catch (error) {
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra.');
      setIsSuccess(false);  // In case of error, set success to false
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h2>Reset Password</h2>
                    {message && <CAlert color={isSuccess ? "success" : "danger"}>{message}</CAlert>}
                    <CFormInput
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="mb-3"
                      disabled={isSuccess}  // Disable input if reset is successful
                    />
                    <CButton type="submit" color="primary" disabled={isSuccess}>
                      Reset Password
                    </CButton>
                  </CForm>
                  {isSuccess && (
                    <div className="mt-3">
                      <Link to="/login">
                        <CButton color="link">Go to Login</CButton>
                      </Link>
                    </div>
                  )}
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

export default ResetPasswordPage;
