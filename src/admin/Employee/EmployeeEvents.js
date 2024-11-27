import React, { useState, useEffect } from 'react';
import {
    CButton,
    CForm,
    CFormInput,
    CFormLabel,
    CRow,
    CCol,
    CTable,
    CTableBody,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CFormSelect,
} from '@coreui/react';
import axios from '../../api/api';

const EmployeeEvents = ({ employeeId, events }) => {
    const [eventList, setEventList] = useState(events || []);
    const [currentEvent, setCurrentEvent] = useState({
        title: '',
        description: '',
        fileKey: '',
        startDate: '',
        endDate: '',
        status: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    useEffect(() => {
        fetchEmployeeEvents();
    }, []);

    const fetchEmployeeEvents = async () => {
        try {
            const response = await axios.get(`/employees/${employeeId}/events`);
            setEventList(response.data);
        } catch (error) {
            console.error('Error fetching employee events:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddEvent = async () => {
        try {
            const response = await axios.post(`/employees/${employeeId}/events`, currentEvent);
            setEventList((prev) => [...prev, response.data]);
            handleCloseModal();
        } catch (error) {
            console.error('Error adding event:', error);
            alert('Không thể thêm sự kiện.');
        }
    };

    const handleEditEvent = async () => {
        try {
            const response = await axios.put(`/employees/${employeeId}/events/${selectedEventId}`, currentEvent);
            setEventList((prev) =>
                prev.map((event) => (event._id === selectedEventId ? response.data : event))
            );
            handleCloseModal();
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Không thể sửa sự kiện.');
        }
    };

    const handleRemoveEvent = async (eventId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return;
        try {
            await axios.delete(`/employees/${employeeId}/events/${eventId}`);
            setEventList((prev) => prev.filter((event) => event._id !== eventId));
        } catch (error) {
            console.error('Error removing event:', error);
            alert('Không thể xóa sự kiện.');
        }
    };

    const handleShowModal = (event = null) => {
        if (event) {
            setIsEditing(true);
            setSelectedEventId(event._id);
            setCurrentEvent({
                title: event.title,
                description: event.description,
                fileKey: event.fileKey,
                startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 10) : '',
                endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : '',
                status: event.status,
            });
        } else {
            setIsEditing(false);
            setSelectedEventId(null);
            setCurrentEvent({
                title: '',
                description: '',
                fileKey: '',
                startDate: '',
                endDate: '',
                status: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEvent({
            title: '',
            description: '',
            fileKey: '',
            startDate: '',
            endDate: '',
            status: '',
        });
        setSelectedEventId(null);
    };

    const handleSubmit = () => {
        if (isEditing) {
            handleEditEvent();
        } else {
            handleAddEvent();
        }
    };

    return (
        <div>
            <h5>Quản lý sự kiện nhân sự</h5>
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Tiêu đề</CTableHeaderCell>
                        <CTableHeaderCell>Mô tả</CTableHeaderCell>
                        <CTableHeaderCell>Ngày bắt đầu</CTableHeaderCell>
                        <CTableHeaderCell>Ngày kết thúc</CTableHeaderCell>
                        <CTableHeaderCell>Tình trạng</CTableHeaderCell>
                        <CTableHeaderCell>File</CTableHeaderCell>
                        <CTableHeaderCell>Thao tác</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {eventList.map((event) => (
                        <CTableRow key={event._id}>
                            <CTableDataCell>{event.title}</CTableDataCell>
                            <CTableDataCell>{event.description}</CTableDataCell>
                            <CTableDataCell>
                                {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'}
                            </CTableDataCell>
                            <CTableDataCell>
                                {event.endDate ? new Date(event.endDate).toLocaleDateString() : 'N/A'}
                            </CTableDataCell>
                            <CTableDataCell>{event.status || 'N/A'}</CTableDataCell>
                            <CTableDataCell>
                                {event.fileKey ? (
                                    <a
                                        href={`${import.meta.env.VITE_API_BASE_URL}/api/uploaded-files/${event.fileKey}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Xem file
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton color="primary" size="sm" onClick={() => handleShowModal(event)}>
                                    Sửa
                                </CButton>{' '}
                                <CButton
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleRemoveEvent(event._id)}
                                >
                                    Xóa
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
            <CButton color="primary" className="mt-3" onClick={() => handleShowModal()}>
                Thêm sự kiện mới
            </CButton>

            <CModal visible={showModal} onClose={handleCloseModal}>
                <CModalHeader closeButton>
                    <CModalTitle>{isEditing ? 'Sửa sự kiện' : 'Thêm sự kiện mới'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="mb-3">
                            <CCol>
                                <CFormLabel>Tiêu đề</CFormLabel>
                                <CFormInput
                                    name="title"
                                    value={currentEvent.title}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol>
                                <CFormLabel>Mô tả</CFormLabel>
                                <CFormInput
                                    name="description"
                                    value={currentEvent.description}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol>
                                <CFormLabel>Key file</CFormLabel>
                                <CFormInput
                                    name="fileKey"
                                    value={currentEvent.fileKey}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol>
                                <CFormLabel>Ngày bắt đầu</CFormLabel>
                                <CFormInput
                                    type="date"
                                    name="startDate"
                                    value={currentEvent.startDate}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                            <CCol>
                                <CFormLabel>Ngày kết thúc</CFormLabel>
                                <CFormInput
                                    type="date"
                                    name="endDate"
                                    value={currentEvent.endDate}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CCol>
                                <CFormLabel>Tình trạng</CFormLabel>
                                <CFormInput
                                    name="status"
                                    value={currentEvent.status}
                                    onChange={handleInputChange}
                                />
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseModal}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleSubmit}>
                        {isEditing ? 'Lưu' : 'Thêm'}
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default EmployeeEvents;
