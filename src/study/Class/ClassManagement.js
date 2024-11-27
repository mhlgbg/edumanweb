import React, { useState, useEffect } from 'react'
import axios from '../../api/api'
import {
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CButton,
    CPagination,
    CPaginationItem,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormInput,
    CFormLabel
} from '@coreui/react'

const ClassManagement = () => {
    const [classes, setClasses] = useState([])
    const [totalClasses, setTotalClasses] = useState(0)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [currentClass, setCurrentClass] = useState(null)
    const [file, setFile] = useState(null)
    const [showStudentsModal, setShowStudentsModal] = useState(false)
    const [students, setStudents] = useState([])
    const [studentEmail, setStudentEmail] = useState('')
    const [joinDate, setJoinDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const fetchClasses = async (page, search = '') => {
        try {
            const response = await axios.get('/classes', { params: { page, limit, search } })
            setClasses(response.data.classes)
            setTotalClasses(response.data.totalClasses)
        } catch (error) {
            console.error('Error fetching classes:', error)
        }
    }

    useEffect(() => {
        fetchClasses(page, search)
    }, [page, search])

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
        setPage(1)
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleSaveClass = async () => {
        try {
            const formData = new FormData()
            if (file) {
                formData.append('avatar', file)
            }
            if (currentClass) {
                formData.append('name', currentClass.name)
                formData.append('startDate', currentClass.startDate)
                formData.append('endDate', currentClass.endDate)
            }
            if (currentClass && currentClass._id) {
                await axios.put(`/classes/${currentClass._id}`, formData)
            } else {
                await axios.post('/classes', formData)
            }
            fetchClasses(page, search)
            setShowModal(false)
            setCurrentClass(null)
            setFile(null)
        } catch (error) {
            console.error('Error saving class:', error)
        }
    }

    const handleAddStudent = async () => {
        try {
            await axios.post('/classes/enrollments', {
                email: studentEmail,
                classId: currentClass._id,
                joinDate,
                endDate
            })
            fetchStudents(currentClass._id)
            setStudentEmail('')
            setJoinDate('')
            setEndDate('')
        } catch (error) {
            console.error('Error adding student:', error)
        }
    }

    const handleDeleteStudent = async (userId) => {
        if (window.confirm('Are you sure you want to remove this student from the class?')) {
            try {
                await axios.delete(`/classes/enrollments/${userId}/${currentClass._id}`)
                fetchStudents(currentClass._id)
            } catch (error) {
                console.error('Error deleting student:', error)
            }
        }
    }

    const fetchStudents = async (classId) => {
        try {
            const response = await axios.get(`/classes/enrollments/class/${classId}`)
            setStudents(response.data.students)
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    const openModal = (classData = null) => {
        setCurrentClass(classData || { name: '', startDate: '', endDate: '', avatar: null })
        setShowModal(true)
    }

    const openStudentsModal = (classData) => {
        setCurrentClass(classData)
        fetchStudents(classData._id)
        setShowStudentsModal(true)
    }

    const totalPages = Math.ceil(totalClasses / limit)

    return (
        <>
            <div className="d-flex justify-content-between mb-3">
                <CFormInput
                    type="text"
                    placeholder="Search class"
                    value={search}
                    onChange={handleSearchChange}
                />
                <CButton color="primary" onClick={() => openModal(null)}>Add Class</CButton>
            </div>

            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Avatar</CTableHeaderCell>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Start Date</CTableHeaderCell>
                        <CTableHeaderCell>End Date</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {classes.map((classData) => (
                        <CTableRow key={classData._id}>
                            <CTableDataCell>
                                {classData.avatar ? (
                                    <img src={`${import.meta.env.VITE_API_BASE_URL}/${classData.avatar}`} width="100px" />
                                ) : 'No Avatar'}
                            </CTableDataCell>
                            <CTableDataCell>{classData.name}</CTableDataCell>
                            <CTableDataCell>{new Date(classData.startDate).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>{new Date(classData.endDate).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="warning" onClick={() => openModal(classData)} className="me-2">Edit</CButton>
                                <CButton color="primary" onClick={() => openStudentsModal(classData)}>Manage Students</CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            <CPagination align="center" aria-label="Page navigation">
                <CPaginationItem disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</CPaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                    <CPaginationItem key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
                        {i + 1}
                    </CPaginationItem>
                ))}
                <CPaginationItem disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</CPaginationItem>
            </CPagination>

            <CModal visible={showModal} onClose={() => setShowModal(false)} backdrop="static">
                <CModalHeader closeButton>
                    <CModalTitle>{currentClass && currentClass._id ? 'Edit Class' : 'Add Class'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Name</CFormLabel>
                    <CFormInput
                        type="text"
                        value={currentClass?.name || ''}
                        onChange={(e) => setCurrentClass({ ...currentClass, name: e.target.value })}
                    />
                    <CFormLabel>Start Date</CFormLabel>
                    <CFormInput
                        type="date"
                        value={currentClass?.startDate ? new Date(currentClass.startDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setCurrentClass({ ...currentClass, startDate: e.target.value })}
                    />
                    <CFormLabel>End Date</CFormLabel>
                    <CFormInput
                        type="date"
                        value={currentClass?.endDate ? new Date(currentClass.endDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => setCurrentClass({ ...currentClass, endDate: e.target.value })}
                    />
                    <CFormLabel>Avatar</CFormLabel>
                    <CFormInput type="file" onChange={handleFileChange} />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={handleSaveClass}>Save</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={showStudentsModal} onClose={() => setShowStudentsModal(false)} backdrop="static" size="lg">
                <CModalHeader closeButton>
                    <CModalTitle>Manage Students</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Student Email</CFormLabel>
                    <CFormInput
                        type="email"
                        placeholder="Enter student email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                    />
                    <CFormLabel>Join Date</CFormLabel>
                    <CFormInput
                        type="date"
                        value={joinDate}
                        onChange={(e) => setJoinDate(e.target.value)}
                    />
                    <CFormLabel>End Date</CFormLabel>
                    <CFormInput
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <CButton color="primary" className="mt-2" onClick={handleAddStudent}>Add Student</CButton>

                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '20px' }}>
                        <CTable striped hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Full Name</CTableHeaderCell>
                                    <CTableHeaderCell>Email</CTableHeaderCell>
                                    <CTableHeaderCell>Join Date</CTableHeaderCell>
                                    <CTableHeaderCell>End Date</CTableHeaderCell>
                                    <CTableHeaderCell>Status</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {students.map((student) => (
                                    <CTableRow key={student.userId}>
                                        <CTableDataCell>{student.fullName}</CTableDataCell>
                                        <CTableDataCell>{student.email}</CTableDataCell>
                                        <CTableDataCell>{new Date(student.joinDate).toLocaleDateString()}</CTableDataCell>
                                        <CTableDataCell>{student.endDate ? new Date(student.endDate).toLocaleDateString() : 'N/A'}</CTableDataCell>
                                        <CTableDataCell>{student.status}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton color="danger" onClick={() => handleDeleteStudent(student.userId)}>
                                                Remove
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowStudentsModal(false)}>Close</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default ClassManagement
