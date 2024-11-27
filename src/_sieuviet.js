import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBuilding,
  cilUser,
  cilSpeedometer,
  cilGroup,
  cilAddressBook,
  cilBirthdayCake,
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
    name: 'Quản Trị',
    visible: ['admin', 'manager'],  // Chỉ hiển thị nếu người dùng có quyền 'admin' hoặc 'manager'
  },
  {
    component: CNavItem,
    name: 'Người Dùng',
    to: '/admin/users',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    visible: ['admin'],  // Chỉ hiển thị nếu có quyền
  },
  {
    component: CNavItem,
    name: 'Thống Kê Nhập Liệu',
    to: '/admin/customer-statistics',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    visible: ['admin'],  // Chỉ hiển thị nếu có quyền
  },
  {
    component: CNavItem,
    name: 'Phòng Ban',
    to: '/admin/departments',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    visible: ['admin'],  // Chỉ hiển thị nếu có quyền
  },
  {
    component: CNavItem,
    name: 'Khách Hàng (quản trị)',
    to: '/admin/customers',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
    visible: ['admin'],  // Chỉ hiển thị nếu có quyền
  },
  {
    component: CNavItem,
    name: 'Sinh Nhật Gần Nhất',
    to: '/admin/customers/happy-birthday',
    icon: <CIcon icon={cilBirthdayCake} customClassName="nav-icon" />,
    visible: ['admin'],  // Chỉ hiển thị nếu có quyền
  },
  {
    component: CNavItem,
    name: 'Danh Sách Công Ty',
    to: '/admin/company',
    icon: <CIcon icon={cilBirthdayCake} customClassName="nav-icon" />,
    visible: ['admin', 'cus'],  // Chỉ hiển thị nếu có quyền
  },
  {
    component: CNavTitle,
    name: 'Nhân viên',
    visible: ['admin', 'manager', 'cus', 'user'],  // Chỉ hiển thị nếu có quyền
  },  
  {
    component: CNavItem,
    name: 'Dữ liệu Khách hàng',
    to: '/admin/department-customer',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    visible: ['admin', 'manager', 'cus'],  // Hiển thị cho tất cả vai trò
  },
  {
    component: CNavItem,
    name: 'Hồ Sơ Người Dùng',
    to: '/user/my-profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    visible: ['admin', 'manager', 'cus', 'user'],  // Hiển thị cho tất cả vai trò
  },
  {
    component: CNavItem,
    name: 'Đổi mật khẩu',
    to: '/user/change-pass',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    visible: ['admin', 'manager', 'cus', 'user'],  // Hiển thị cho tất cả vai trò
  },
  
]

export default _nav

/*import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBuilding,
  cilUser,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilGroup,
  cilSettings,
  cilAddressBook,
  cilBirthdayCake,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Quản trị',
  },
  {
    component: CNavItem,
    name: 'Phòng ban',
    to: '/admin/departments',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Khách hàng (quản trị)',
    to: '/admin/customers',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Sinh Nhật Gần Nhất',
    to: '/admin/customers/happy-birthday',
    icon: <CIcon icon={cilBirthdayCake} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Nhân viên',
  },
  {
    component: CNavItem,
    name: 'Khách Hàng - Phòng Ban',
    to: '/admin/department-customer',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Người dùng',
  },
  {
    component: CNavItem,
    name: 'Đổi mật khẩu',
    to: '/user/change-pass',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  
]

export default _nav
*/