import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Đảm bảo đúng đường dẫn

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth(); // Lấy thông tin auth từ AuthContext

  // Nếu chưa đăng nhập, điều hướng tới trang đăng nhập
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung của route
  return children;
};

export default PrivateRoute;
