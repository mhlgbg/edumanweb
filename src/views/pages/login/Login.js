import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link từ react-router-dom
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/api';


import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { auth, setAuth, loading } = useAuth();  // Thêm loading từ useAuth
  useEffect(() => {
    if (auth) { // Chỉ điều hướng nếu `auth` tồn tại
      navigate('/dashboard'); // Điều hướng đến dashboard
    }
  }, [auth, navigate]);
  const handleLogin = async (event) => {
    event.preventDefault(); // Ngăn trình duyệt tải lại trang mặc định
    
    try {
      const response = await api.post('/users/login', { username, password });
      const data = response.data;
      const decodedToken = parseJwt(data.token);
      const authData = {
        token: data.token,
        roles: decodedToken.roles,
        user: {
          avatar: decodedToken.avatar,
          username: decodedToken.username,
        },
        expiresAt: Date.now() + 60 * 60 * 1000,
      };
  
      sessionStorage.setItem('auth', JSON.stringify(authData));
      localStorage.setItem('username', username);
      localStorage.setItem('roles', authData.roles);
      localStorage.setItem('avatar', authData.user.avatar);
      console.log("authData roles ", authData.roles);
      setAuth(authData);
      navigate('/dashboard'); // Điều hướng đến dashboard sau khi đăng nhập
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message); // Hiển thị thông báo lỗi từ API
      } else {
        alert('Login failed. Please check your username and password!'); // Thông báo lỗi chung
      }
      
    }
  };

  // Hàm giải mã JWT
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to parse JWT:", e);
      return {};
    }
  }
  if (loading) {
    return <div>Loading...</div>;  // Hiển thị loading khi đang kiểm tra trạng thái đăng nhập
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody >
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    {/* Hiển thị thông báo lỗi */}
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/forgot-pass" style={{ textDecoration: 'none' }}>
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
