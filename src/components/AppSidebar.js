import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  // Lấy roles từ sessionStorage
  const auth = JSON.parse(sessionStorage.getItem('auth'))
  const userRoles = auth?.roles || []

  // Lấy tên người dùng từ localStorage
  const username = localStorage.getItem('username')

  // Hàm kiểm tra quyền người dùng
  const checkRole = (requiredRoles) => {
    return requiredRoles.some(role => userRoles.includes(role))
  }

  // Lọc các mục điều hướng dựa trên vai trò người dùng
  const filteredNavigation = navigation(userRoles).filter(item => {
    return !item.visible || (item.visible && checkRole(item.visible))
  })

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          {/*
            <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
            <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
          */}
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/logo_trang_chu.png`}
            alt="Logo"
            height={60}
            style={{ maxWidth: '100%' }}  // Đảm bảo ảnh không vượt quá chiều rộng của sidebar
          />
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <AppSidebarNav items={filteredNavigation} />
      {/* Thêm dòng Welcome + username */}
      <div className="welcome-text" style={{ marginLeft: '10px', marginTop: '10px', textAlign: 'left' }}>
        {username ? `Current user: ${username}` : 'Welcome'}
      </div>
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
