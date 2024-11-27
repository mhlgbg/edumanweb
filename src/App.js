import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './PrivateRoute' // Import PrivateRoute

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const ForgotPasswordPage = React.lazy(() => import('./views/pages/login/ForgotPasswordPage'))
const ResetPasswordPage = React.lazy(() => import('./views/pages/login/ResetPasswordPage'))

const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const BirthdayCard = React.lazy(() => import('./admin/Customer/BirthdayCard'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthProvider>
      <HashRouter>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            {/* Các trang không yêu cầu đăng nhập */}
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/birthday-card" name="Thiệp chúc mừng sinh nhật" element={<BirthdayCard />} />
            <Route exact path="/forgot-pass" name="Quân mật khẩu" element={<ForgotPasswordPage />} />
            <Route exact path="/reset-password/:token" name="Đặt lại mật khẩu" element={<ResetPasswordPage />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />

            {/* Trang yêu cầu đăng nhập sẽ sử dụng PrivateRoute */}
            <Route
              path="*"
              name="Home"
              element={
                <PrivateRoute>
                  <DefaultLayout />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </HashRouter>
    </AuthProvider>
  )
}

export default App
