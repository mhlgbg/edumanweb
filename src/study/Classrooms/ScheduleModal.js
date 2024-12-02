import React, { useEffect, useState } from 'react';
import {
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CFormSelect,
    CFormInput,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import axios from '../../api/api';

const ScheduleModal = ({ visible, onClose, classId, semesterId }) => {
    const [schedules, setSchedules] = useState([]);
    const [gioHocList, setGioHocList] = useState([]);
    const [phongHocList, setPhongHocList] = useState([]);
    const [nhanSuList, setNhanSuList] = useState([]);
    const [semester, setSemester] = useState({});
    const daysOfWeek = [
        { value: 2, label: 'Hai' },
        { value: 3, label: 'Ba' },
        { value: 4, label: 'Tư' },
        { value: 5, label: 'Năm' },
        { value: 6, label: 'Sáu' },
        { value: 7, label: 'Bảy' },
        { value: 8, label: 'Chủ nhật' },
    ];

    useEffect(() => {
        if (visible) {
            fetchInitialData();
        }
    }, [visible]);

    const fetchInitialData = async () => {
        try {
            const [scheduleRes, gioHocRes, phongHocRes, nhanSuRes, semesterRes] = await Promise.all([
                axios.get(`/classrooms/${classId}/schedules`),
                axios.get('/schedules/gio-hoc'),
                axios.get('/schedules/phong-hoc'),
                axios.get('/schedules/nhan-su'),
                axios.get(`/semesters/${semesterId}/semester-detail`),
            ]);

            setSchedules(scheduleRes.data);
            setGioHocList(gioHocRes.data);
            setPhongHocList(phongHocRes.data);
            setNhanSuList(nhanSuRes.data);
            setSemester(semesterRes.data);
            setNewSchedule((prev) => ({
                ...prev,
                TuNgay: semesterRes.data.NgayBatDauHocKi ? formatDateForInput(semesterRes.data.NgayBatDauHocKi) : '',
                DenNgay: semesterRes.data.NgayKetThucHocKi ? formatDateForInput(semesterRes.data.NgayKetThucHocKi) : '',
            }));
        } catch (error) {
            console.error('Error fetching data for schedules:', error);
        }
    };
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Chỉ lấy phần yyyy-MM-dd
    };

    const handleUpdateSchedule = async (schedule) => {
        try {
            await axios.put(`/schedules/${schedule.ThoiKhoaBieuId}`, schedule);
            fetchInitialData();
            alert('Cập nhật thành công!');
        } catch (error) {
            console.error('Error updating schedule:', error);
            alert('Cập nhật thất bại.');
        }
    };

    const handleDeleteSchedule = async (scheduleId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa lịch học này?')) return;
        try {
            await axios.delete(`/schedules/${scheduleId}`);
            fetchInitialData();
            alert('Xóa thành công!');
        } catch (error) {
            console.error('Error deleting schedule:', error);
            alert('Xóa thất bại.');
        }
    };

    const handleAddSchedule = async (newSchedule) => {
        try {
            await axios.post(`/classrooms/${classId}/schedules`, newSchedule);
            fetchInitialData();
            alert('Thêm thành công!');
        } catch (error) {
            console.error('Error adding schedule:', error);
            alert('Thêm thất bại.');
        }
    };

    const defaultNewSchedule = {
        ThuTrongTuan: 2,
        GioBatDauId: gioHocList[0]?.GioHocId || '',
        GioKetThucId: gioHocList[gioHocList.length - 1]?.GioHocId || '',
        SoHieuPhong: phongHocList[0]?.SoHieuPhong || '',
        MaNhanSu: nhanSuList[0]?.MaNhanhSu || '',
        TuNgay: semester.NgayBatDauHocKi ? formatDateForInput(semester.NgayBatDauHocKi) : '',
        DenNgay: semester.NgayKetThucHocKi ? formatDateForInput(semester.NgayKetThucHocKi) : '',
    };

    const [newSchedule, setNewSchedule] = useState(defaultNewSchedule);

    useEffect(() => {
        setNewSchedule(defaultNewSchedule);
    }, [gioHocList, phongHocList, nhanSuList, semester]);


    return (
        <CModal visible={visible} onClose={onClose} size="xl" backdrop="static">
            <CModalHeader>
                <CModalTitle>Lịch học</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CTable>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Thứ</CTableHeaderCell>
                            <CTableHeaderCell>Tiết bắt đầu</CTableHeaderCell>
                            <CTableHeaderCell>Tiết kết thúc</CTableHeaderCell>
                            <CTableHeaderCell>Phòng</CTableHeaderCell>
                            <CTableHeaderCell>Giáo viên</CTableHeaderCell>
                            <CTableHeaderCell>Từ ngày</CTableHeaderCell>

                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {schedules.map((schedule) => (
                            <CTableRow key={schedule.ThoiKhoaBieuId}>
                                <CTableDataCell>
                                    <CFormSelect
                                        value={schedule.ThuTrongTuan}
                                        onChange={(e) =>
                                            setSchedules((prev) =>
                                                prev.map((item) =>
                                                    item.ThoiKhoaBieuId === schedule.ThoiKhoaBieuId
                                                        ? { ...item, ThuTrongTuan: parseInt(e.target.value) }
                                                        : item
                                                )
                                            )
                                        }
                                    >
                                        {daysOfWeek.map((day) => (
                                            <option key={day.value} value={day.value}>
                                                {day.label}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CFormSelect
                                        value={schedule.GioBatDauId}
                                        onChange={(e) =>
                                            setSchedules((prev) =>
                                                prev.map((item) =>
                                                    item.ThoiKhoaBieuId === schedule.ThoiKhoaBieuId
                                                        ? { ...item, GioBatDauId: e.target.value }
                                                        : item
                                                )
                                            )
                                        }
                                    >
                                        {gioHocList.map((gio) => (
                                            <option key={gio.GioHocId} value={gio.GioHocId}>
                                                {gio.ThuTuGioTrongNgay}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CFormSelect
                                        value={schedule.GioKetThucId}
                                        onChange={(e) =>
                                            setSchedules((prev) =>
                                                prev.map((item) =>
                                                    item.ThoiKhoaBieuId === schedule.ThoiKhoaBieuId
                                                        ? { ...item, GioKetThucId: e.target.value }
                                                        : item
                                                )
                                            )
                                        }
                                    >
                                        {gioHocList.map((gio) => (
                                            <option key={gio.GioHocId} value={gio.GioHocId}>
                                                {gio.ThuTuGioTrongNgay}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CTableDataCell>

                                <CTableDataCell>
                                    <CFormSelect
                                        value={schedule.SoHieuPhong}
                                        onChange={(e) =>
                                            setSchedules((prev) =>
                                                prev.map((item) =>
                                                    item.ThoiKhoaBieuId === schedule.ThoiKhoaBieuId
                                                        ? { ...item, SoHieuPhong: e.target.value }
                                                        : item
                                                )
                                            )
                                        }
                                    >
                                        {phongHocList.map((phong) => (
                                            <option key={phong.SoHieuPhong} value={phong.SoHieuPhong}>
                                                {phong.TenHienThi}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CTableDataCell>

                                <CTableDataCell>
                                    <CFormSelect
                                        value={schedule.MaNhanSu}
                                        onChange={(e) =>
                                            setSchedules((prev) =>
                                                prev.map((item) =>
                                                    item.ThoiKhoaBieuId === schedule.ThoiKhoaBieuId
                                                        ? { ...item, MaNhanSu: e.target.value }
                                                        : item
                                                )
                                            )
                                        }
                                    >
                                        {nhanSuList.map((nhanSu) => (
                                            <option key={nhanSu.MaNhanhSu} value={nhanSu.MaNhanhSu}>
                                                {nhanSu.HoVaTen}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CTableDataCell>
                                <CTableRow>
                                    <CTableDataCell>
                                        <CFormInput
                                            type="date"
                                            value={formatDateForInput(schedule.TuNgay)}
                                            onChange={(e) =>
                                                setSchedules((prev) =>
                                                    prev.map((item) =>
                                                        item.ThoiKhoaBieuId === schedule.ThoiKhoaBieuId
                                                            ? { ...item, TuNgay: e.target.value }
                                                            : item
                                                    )
                                                )
                                            }
                                        />
                                    </CTableDataCell>

                                    <CTableDataCell>
                                        <CFormInput
                                            type="date"
                                            value={formatDateForInput(schedule.DenNgay)}
                                            onChange={(e) =>
                                                setSchedules((prev) =>
                                                    prev.map((item) =>
                                                        item.ThoiKhoaBieuId === schedule.ThoiKhoaBieuId
                                                            ? { ...item, DenNgay: e.target.value }
                                                            : item
                                                    )
                                                )
                                            }
                                        />
                                    </CTableDataCell>
                                </CTableRow>
                                {/* Tiết kết thúc, Phòng, Giáo viên, Từ ngày, Đến ngày tương tự */}
                                <CTableDataCell>
                                    <CButton
                                        color="warning"
                                        size="sm"
                                        onClick={() => handleUpdateSchedule(schedule)}
                                    >
                                        Cập nhật
                                    </CButton>
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        onClick={() => handleDeleteSchedule(schedule.ThoiKhoaBieuId)}
                                    >
                                        Xóa
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                        <CTableRow>
                            <CTableDataCell>
                                <CTableDataCell>
                                    <CFormSelect
                                        value={newSchedule.ThuTrongTuan}
                                        onChange={(e) =>
                                            setNewSchedule((prev) => ({
                                                ...prev,
                                                ThuTrongTuan: parseInt(e.target.value), // Chuyển giá trị về số nguyên
                                            }))
                                        }
                                    >
                                        {daysOfWeek.map((day) => (
                                            <option key={day.value} value={day.value}>
                                                {day.label}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CTableDataCell>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect
                                    value={newSchedule.GioBatDauId}
                                    onChange={(e) =>
                                        setNewSchedule((prev) => ({ ...prev, GioBatDauId: e.target.value }))
                                    }
                                >
                                    {gioHocList.map((gio) => (
                                        <option key={gio.GioHocId} value={gio.GioHocId}>
                                            {gio.ThuTuGioTrongNgay}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect
                                    value={newSchedule.GioKetThucId}
                                    onChange={(e) =>
                                        setNewSchedule((prev) => ({ ...prev, GioKetThucId: e.target.value }))
                                    }
                                >
                                    {gioHocList.map((gio) => (
                                        <option key={gio.GioHocId} value={gio.GioHocId}>
                                            {gio.ThuTuGioTrongNgay}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect
                                    value={newSchedule.SoHieuPhong}
                                    onChange={(e) =>
                                        setNewSchedule((prev) => ({ ...prev, SoHieuPhong: e.target.value }))
                                    }
                                >
                                    {phongHocList.map((phong) => (
                                        <option key={phong.SoHieuPhong} value={phong.SoHieuPhong}>
                                            {phong.TenHienThi}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect
                                    value={newSchedule.MaNhanSu}
                                    onChange={(e) =>
                                        setNewSchedule((prev) => ({ ...prev, MaNhanSu: e.target.value }))
                                    }
                                >
                                    {nhanSuList.map((nhanSu) => (
                                        <option key={nhanSu.MaNhanhSu} value={nhanSu.MaNhanhSu}>
                                            {nhanSu.HoVaTen}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableRow>
                                <CTableDataCell>
                                    <CFormInput
                                        type="date"
                                        value={newSchedule.TuNgay}
                                        onChange={(e) =>
                                            setNewSchedule((prev) => ({ ...prev, TuNgay: e.target.value }))
                                        }
                                    />
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CFormInput
                                        type="date"
                                        value={newSchedule.DenNgay}
                                        onChange={(e) =>
                                            setNewSchedule((prev) => ({ ...prev, DenNgay: e.target.value }))
                                        }
                                    />
                                </CTableDataCell>
                            </CTableRow>
                            <CTableDataCell>
                                <CButton
                                    color="success"
                                    size="sm"
                                    onClick={() => handleAddSchedule(newSchedule)}
                                >
                                    Thêm
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Đóng
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ScheduleModal;
