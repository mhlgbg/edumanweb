import React from 'react'
import PrivateRoute from './PrivateRoute' // Import PrivateRoute

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const BirthDayDashboard  = React.lazy(() => import('./views/dashboard/BirthDayDashboard'))
const BirthdayCardPagination  = React.lazy(() => import('./views/dashboard/BirthdayCardPagination'))

const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

//Admin
const UserManagementForm = React.lazy(() => import('./admin/user/UserManagementForm'))
const ProfilePage = React.lazy(() => import('./admin/user/ProfilePage'))

const ChangePassword = React.lazy(() => import('./admin/user/ChangePassword'))

const CustomerListPage = React.lazy(() => import('./admin/Customer/CustomerListPage'))
const CustomerStatistics = React.lazy(() => import('./admin/Customer/CustomerStatistics'))

const DepartmentListPage = React.lazy(() => import('./admin/Department/DepartmentListPage'))

const ArticleListPage = React.lazy(() => import('./admin/Article/ArticleListPage'))

const ArticleContentListPage  = React.lazy(() => import('./admin/Article/ArticleContentListPage'))

const ConfigListPage = React.lazy(() => import('./admin/Config/ConfigListPage'))

const CompanyManagement = React.lazy(() => import('./admin/Company/CompanyManagement'))
//Staff
const DepartmentCustomerListPage = React.lazy(() => import('./admin/Department/DepartmentCustomerListPage'))

//Study
const TaskListPage = React.lazy(() => import('./study/Task/TaskListPage'))
const ClassManagement = React.lazy(() => import('./study/Class/ClassManagement'))
const ScheduleManagement = React.lazy(() => import('./study/Schedule/ScheduleManagement'))
const Classroom = React.lazy(() => import('./study/Class/Classroom'))
const ClassReport = React.lazy(() => import('./study/Schedule/ClassReport'))
const StudentList = React.lazy(() => import('./study/Student/StudentList'))
const TrainingPlan = React.lazy(() => import('./study/TrainingPlan/TrainingPlan'))
const TrainingPlanByClass = React.lazy(() => import('./study/TrainingPlan/TrainingPlanByClass'))
const ClassroomManager = React.lazy(() => import('./study/Classrooms/ClassroomManager'))

//Student
const StudentSchedule = React.lazy(() => import('./study/Student/StudentSchedule'))

const StudentTask = React.lazy(() => import('./study/Student/StudentTask'));
const ListStudentTaskComment = React.lazy(() => import('./study/Student/ListStudentTaskComment'));
const UserGradeCard = React.lazy(() => import('./study/Student/UserGradeCard'));

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))
//Club
const ClubProfile = React.lazy(() => import('./admin/Club/ClubProfile'))
const ClubMemberManagement = React.lazy(() => import('./admin/Club/ClubMemberManagement'))
const ClubPracticeSessionManagement = React.lazy(() => import('./admin/Club/ClubPracticeSessionManagement'))
//Category
const CategoryListPage = React.lazy(() => import('./admin/Category/CategoryListPage'))

//Contact 
const ContactMessage = React.lazy(() => import('./admin/Contact/ContactMessage'))
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
//Employee

const EmployeeList = React.lazy(() => import('./admin/Employee/EmployeeList'));
const EmployeeForm = React.lazy(() => import('./admin/Employee/EmployeeForm'));
const ImageManagement = React.lazy(() => import('./admin/Image/ImageManagement'));
const UploadedFileManager = React.lazy(() => import('./admin/UploadedFile/UploadedFileManager'));

const ModuleManagement = React.lazy(() => import('./study/Module/ModuleManagement'));

const LocationManagement = React.lazy(() => import('./admin/Location/LocationManagement'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Birthday Dashboard', element: BirthDayDashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/admin/users', name: 'Người dùng', element: UserManagementForm },
  { path: '/user/my-profile', name: 'Cập Nhật Hồ Sơ', element: ProfilePage },
  { path: '/user/change-pass', name: 'Đổi mật khẩu', element: ChangePassword },
  { path: '/admin/customers', name: 'Khách hàng', element: CustomerListPage },
  { path: '/admin/customer-statistics', name: 'Thống Kê Nhập Liệu', element: CustomerStatistics },

  { path: '/admin/customers/happy-birthday', name: 'Sinh Nhật Gần Nhất', element: BirthdayCardPagination },
  { path: '/admin/departments', name: 'Phòng ban', element: DepartmentListPage },
  { path: '/admin/department-customer', name: 'Khách Hàng Phòng Ban', element: DepartmentCustomerListPage },
  { path: '/admin/articles', name: 'Quản lý bài báo', element: ArticleListPage },
  { path: '/admin/articles/:articleId/contents', name: 'Chi tiết bài báo', element: ArticleContentListPage },
  { path: '/admin/config-system', name: 'Cấu hình hệ thống', element: ConfigListPage },
  { path: '/club/club-profile', name: 'Hồ Sơ CLB', element: ClubProfile },
  { path: '/club/club-members', name: 'Hồ Sơ Thành Viên', element: ClubMemberManagement },
  { path: '/club/matches-trainning', name: 'Kết Quả Tập Luyện', element: ClubPracticeSessionManagement },
  { path: '/admin/category', name: 'Phân Loại', element: CategoryListPage },
  { path: '/admin/contact-message', name: 'Thông tin liên hệ', element: ContactMessage },
  { path: '/admin/company', name: 'Danh sách công ty', element: CompanyManagement },
  { path: '/admin/images', name: 'Danh sách ảnh', element: ImageManagement },
  { path: '/admin/file-manager', name: 'Danh sách file', element: UploadedFileManager },

  { path: '/study/tasks', name: 'Danh sách nhiệm vụ', element: TaskListPage },
  { path: '/study/classes', name: 'Các Lớp Học', element: ClassManagement },
  { path: '/study/schedules', name: 'Lịch Học', element: ScheduleManagement },
  { path: '/study/classrooms', name: 'Classroom Command Center', element: Classroom },
  { path: '/study/class-report/:scheduleId', name: 'Classroom Report', element: ClassReport },
  { path: '/study/modules', name: 'Môn học', element: ModuleManagement },
  { path: '/study/students', name: 'Danh sách sinh viên', element: StudentList },
  { path: '/study/training-plans', name: 'Kế hoạch giảng dạy', element: TrainingPlan },
  { path: '/study/training-plans-by-class', name: 'Kế hoạch theo lớp', element: TrainingPlanByClass },

  { path: '/study/classroom-manager', name: 'Quản lý lớp học phần', element: ClassroomManager },

  { path: '/student/schedules', name: 'Schedule', element: StudentSchedule },
  { path: '/student/my-tasks', name: 'Schedule', element: StudentTask },
  { path: '/student-task/:userTaskId/comments', name: 'ListStudentTaskComment', element: ListStudentTaskComment },
  { path: '/student/my-grade', name: 'Stduent Grades', element: UserGradeCard },
  { path: '/admin/employees/:employeeId', name: 'Employee Form', element: EmployeeForm },
  { path: '/admin/employees', name: 'Employee List', element: EmployeeList },

  { path: '/admin/locations', name: 'Location Management', element: LocationManagement },

]

export default routes
