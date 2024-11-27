import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import {
    CButton, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CFormSelect
} from '@coreui/react';

const ScheduleIndividualMessage = ({ scheduleId, students }) => {
    const [messages, setMessages] = useState([]);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [newMessage, setNewMessage] = useState({ userId: '', messageContent: '' });

    useEffect(() => {
        fetchMessages();
    }, []);

    // Lấy danh sách tin nhắn cá nhân từ API
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`/class-report/${scheduleId}/individual-messages`);
            setMessages(response.data.privateMessages);
        } catch (error) {
            console.error('Error fetching individual messages:', error);
        }
    };

    // Thêm tin nhắn cá nhân mới
    const handleAddMessage = async () => {
        try {
            await axios.post(`/class-report/${scheduleId}/individual-messages`, newMessage);
            fetchMessages();
            setShowMessageModal(false);
            setNewMessage({ userId: '', messageContent: '' });
        } catch (error) {
            console.error('Error adding individual message:', error);
        }
    };

    return (
        <div className="individual-message-section">
            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Student</CTableHeaderCell>
                        <CTableHeaderCell>Message</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {messages.map((message) => (
                        <CTableRow key={message._id}>
                            <CTableDataCell>{message.userId?.fullName}</CTableDataCell>
                            <CTableDataCell>{message.messageContent}</CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
            <CButton color="primary" onClick={() => setShowMessageModal(true)}>Add Message</CButton>

            {/* Modal to Add New Message */}
            <CModal visible={showMessageModal} onClose={() => setShowMessageModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Add New Message</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormSelect
                        value={newMessage.userId}
                        onChange={(e) => setNewMessage({ ...newMessage, userId: e.target.value })}
                    >
                        <option value="">Select Student</option>
                        {students.map((student) => (
                            <option key={student.userId._id} value={student.userId._id}>
                                {student.userId.fullName}
                            </option>
                        ))}
                    </CFormSelect>
                    <CFormInput
                        type="text"
                        placeholder="Enter Message"
                        value={newMessage.messageContent}
                        onChange={(e) => setNewMessage({ ...newMessage, messageContent: e.target.value })}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowMessageModal(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={handleAddMessage}>Send Message</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ScheduleIndividualMessage;
