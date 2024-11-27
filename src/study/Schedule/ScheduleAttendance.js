import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import {
    CButton, CTable, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CFormSelect
} from '@coreui/react';

const ScheduleAttendance = ({ scheduleId }) => {
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const response = await axios.get(`/class-report/${scheduleId}/attendance`);
            setAttendance(response.data.attendance);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const fetchClassStudents = async () => {
        try {
            await axios.post(`/class-report/${scheduleId}/attendance/fetch-students`);
            fetchAttendance(); // Refresh attendance after fetching students
        } catch (error) {
            console.error('Error fetching class students:', error);
        }
    };

    const updateAttendanceStatus = async (userId, status) => {
        try {
            await axios.put(`/class-report/${scheduleId}/attendance/${userId}`, { status });
            setAttendance((prev) => prev.map((att) => (att.userId._id === userId ? { ...att, status } : att)));
        } catch (error) {
            console.error('Error updating attendance status:', error);
        }
    };

    return (
        <div>
            <CButton color="primary" onClick={fetchClassStudents}>Fetch Students</CButton>
            <CTable striped hover className="mt-3">
                <CTableBody>
                    {attendance.map((record) => (
                        <CTableRow key={record.userId._id}>
                            <CTableHeaderCell>{record.userId.fullName}</CTableHeaderCell>
                            <CTableDataCell>
                                <CFormSelect
                                    value={record.status}
                                    onChange={(e) => updateAttendanceStatus(record.userId._id, e.target.value)}
                                >
                                    <option value="no_attendance">No Attendance</option>
                                    <option value="present">Present</option>
                                    <option value="absent_unexcused">Absent Unexcused</option>
                                    <option value="absent_excused">Absent Excused</option>
                                    <option value="late">Late</option>
                                </CFormSelect>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </div>
    );
};

export default ScheduleAttendance;
