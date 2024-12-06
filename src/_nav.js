import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBuilding,
  cilUser,
  cilPeople,
  cilSpeedometer,
  cilGroup,
  cilAddressBook,
  cilBirthdayCake,
  cilText,
  cilList,
  cilChatBubble,
  cilSettings,
  cilCalendar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

// Hàm kiểm tra vai trò người dùng
const checkRole = (userRoles, requiredRoles) => {
  return requiredRoles.some(role => userRoles.includes(role))
}

const _nav = (userRoles) => [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Quản Lý sinh viên',
    visible: ['admin'],  // Chỉ hiển thị nếu người dùng có quyền 'admin' hoặc 'manager'
  },
  {
    component: CNavItem,
    name: 'Danh sách sinh viên',
    to: '/study/students',
    icon: <CIcon icon={cilText} customClassName="nav-icon" />,
    visible: ['admin', 'editor'],  // Chỉ hiển thị nếu có quyền
  },
  {
    component: CNavTitle,
    name: 'Thời khóa biểu',
    visible: ['admin'],  // Chỉ hiển thị nếu người dùng có quyền 'admin' hoặc 'manager'
  },
  {
    component: CNavItem,
    name: 'Kế hoạch đào tạo',
    to: '/study/training-plans',
    icon: <CIcon icon={cilText} customClassName="nav-icon" />,
    visible: ['admin', 'editor'],  // Chỉ hiển thị nếu có quyền
  },
  {
    component: CNavItem,
    name: 'Kế hoạch theo lớp',
    to: '/study/training-plans-by-class',
    icon: <CIcon icon={cilText} customClassName="nav-icon" />,
    visible: ['admin', 'editor'],  // Chỉ hiển thị nếu có quyền
  },
  {
    component: CNavItem,
    name: 'Quản lý lớp học phần',
    to: '/study/classroom-manager',
    icon: <CIcon icon={cilText} customClassName="nav-icon" />,
    visible: ['admin', 'editor'],  // Chỉ hiển thị nếu có quyền
  }
  ,
  {
    component: CNavItem,
    name: 'Xem thời khóa biểu',
    to: '/study/schedule-views',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    visible: ['admin', 'editor'],  // Chỉ hiển thị nếu có quyền
  }
]

export default _nav

