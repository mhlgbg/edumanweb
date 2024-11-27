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
    CFormLabel,
    CFormSelect
} from '@coreui/react'

const ScheduleManagement = () => {
    const [schedules, setSchedules] = useState([])
    const [totalSchedules, setTotalSchedules] = useState(0)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [currentSchedule, setCurrentSchedule] = useState(null)
    const [classes, setClasses] = useState([])
    const [teachers, setTeachers] = useState([])

    const fetchSchedules = async (page, search = '', startDate = '', endDate = '') => {
        try {
            const response = await axios.get('/schedules', { params: { page, limit, search, startDate, endDate } })
            setSchedules(response.data.schedules)
            setTotalSchedules(response.data.totalSchedules)
        } catch (error) {
            console.error('Error fetching schedules:', error)
        }
    }

    useEffect(() => {
        fetchSchedules(page, search, startDate, endDate)
        fetchClasses()
        fetchTeachers()
    }, [page])

    const fetchClasses = async () => {
        try {
            const response = await axios.get('/schedules/classes')
            setClasses(response.data.classes)
        } catch (error) {
            console.error('Error fetching classes:', error)
        }
    }

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('/schedules/teachers')
            setTeachers(response.data.teachers)
        } catch (error) {
            console.error('Error fetching teachers:', error)
        }
    }

    const handleSearchBlur = () => {
        setPage(1)
        fetchSchedules(1, search, startDate, endDate)
    }

    const handleStartDateBlur = () => {
        setPage(1)
        fetchSchedules(1, search, startDate, endDate)
    }

    const handleEndDateBlur = () => {
        setPage(1)
        fetchSchedules(1, search, startDate, endDate)
    }

    const handleSaveSchedule = async () => {
        const apiMethod = currentSchedule && currentSchedule._id ? 'put' : 'post'
        const apiUrl = currentSchedule && currentSchedule._id ? `/schedules/${currentSchedule._id}` : '/schedules'

        try {
            await axios[apiMethod](apiUrl, currentSchedule)
            fetchSchedules(page, search, startDate, endDate)
            setShowModal(false)
            setCurrentSchedule(null)
        } catch (error) {
            console.error('Error saving schedule:', error)
        }
    }

    const openModal = (scheduleData = null) => {
        setCurrentSchedule(
            scheduleData || {
                classId: '',
                userId: '',
                date: '',
                startHour: '',
                startMinute: '',
                duration: '',
                status: 'scheduled',
                note: ''
            }
        )
        setShowModal(true)
    }

    const totalPages = Math.ceil(totalSchedules / limit)

    return (
        <>
            <div className="d-flex justify-content-between mb-3">
                <CFormInput
                    type="text"
                    placeholder="Search by teacher or class"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onBlur={handleSearchBlur}
                />
                <CFormInput
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onBlur={handleStartDateBlur}
                />
                <CFormInput
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onBlur={handleEndDateBlur}
                />
                <CButton color="primary" onClick={() => openModal(null)}>Add Schedule</CButton>
            </div>

            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Class</CTableHeaderCell>
                        <CTableHeaderCell>Teacher</CTableHeaderCell>
                        <CTableHeaderCell>Date</CTableHeaderCell>
                        <CTableHeaderCell>Start Time</CTableHeaderCell>
                        <CTableHeaderCell>Duration (minutes)</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {schedules.map((schedule) => (
                        <CTableRow key={schedule._id}>
                            <CTableDataCell>{schedule.className}</CTableDataCell>
                            <CTableDataCell>{schedule.userName}</CTableDataCell>
                            <CTableDataCell>{new Date(schedule.date).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>{`${schedule.startHour}:${schedule.startMinute}`}</CTableDataCell>
                            <CTableDataCell>{schedule.duration}</CTableDataCell>
                            <CTableDataCell>{schedule.status}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="warning" onClick={() => openModal(schedule)} className="me-2">
                                    Edit
                                </CButton>
                                <CButton color="danger" onClick={() => handleDeleteSchedule(schedule._id)}>
                                    Delete
                                </CButton>
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

            <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg" backdrop="static">
                <CModalHeader closeButton>
                    <CModalTitle>{currentSchedule && currentSchedule._id ? 'Edit Schedule' : 'Add Schedule'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Class</CFormLabel>
                    <CFormSelect
                        value={currentSchedule?.classId || ''}
                        onChange={(e) => setCurrentSchedule({ ...currentSchedule, classId: e.target.value })}
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>
                                {cls.name}
                            </option>
                        ))}
                    </CFormSelect>

                    <CFormLabel>Teacher</CFormLabel>
                    <CFormSelect
                        value={currentSchedule?.userId || ''}
                        onChange={(e) => setCurrentSchedule({ ...currentSchedule, userId: e.target.value })}
                    >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher._id} value={teacher._id}>
                                {teacher.fullName}
                            </option>
                        ))}
                    </CFormSelect>

                    <CFormLabel>Date</CFormLabel>
                    <CFormInput
                        type="date"
                        value={currentSchedule?.date || ''}
                        onChange={(e) => setCurrentSchedule({ ...currentSchedule, date: e.target.value })}
                    />

                    <CFormLabel>Start Hour</CFormLabel>
                    <CFormInput
                        type="number"
                        min="0"
                        max="23"
                        value={currentSchedule?.startHour || ''}
                        onChange={(e) => setCurrentSchedule({ ...currentSchedule, startHour: e.target.value })}
                    />

                    <CFormLabel>Start Minute</CFormLabel>
                    <CFormInput
                        type="number"
                        min="0"
                        max="59"
                        value={currentSchedule?.startMinute || ''}
                        onChange={(e) => setCurrentSchedule({ ...currentSchedule, startMinute: e.target.value })}
                    />

                    <CFormLabel>Duration (minutes)</CFormLabel>
                    <CFormInput
                        type="number"
                        min="1"
                        value={currentSchedule?.duration || ''}
                        onChange={(e) => setCurrentSchedule({ ...currentSchedule, duration: e.target.value })}
                    />

                    <CFormLabel>Status</CFormLabel>
                    <CFormSelect
                        value={currentSchedule?.status || 'scheduled'}
                        onChange={(e) => setCurrentSchedule({ ...currentSchedule, status: e.target.value })}
                    >
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="canceled">Canceled</option>
                        <option value="postponed">Postponed</option>
                    </CFormSelect>

                    <CFormLabel>Note</CFormLabel>
                    <CFormInput
                        type="text"
                        value={currentSchedule?.note || ''}
                        onChange={(e) => setCurrentSchedule({ ...currentSchedule, note: e.target.value })}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={handleSaveSchedule}>Save</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}

export default ScheduleManagement
