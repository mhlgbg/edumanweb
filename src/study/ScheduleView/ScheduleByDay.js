import React, { useState, useEffect } from "react";
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CButton,
    CTableDataCell,
} from "@coreui/react";
import axios from "../../api/api";

const ScheduleByDay = ({ hocKiId, selectedDate }) => {
    const [scheduleData, setScheduleData] = useState([]);
    const daysOfWeek = [
        "Thứ hai",
        "Thứ ba",
        "Thứ tư",
        "Thứ năm",
        "Thứ sáu",
        "Thứ bảy",
        "Chủ nhật",
    ];

    useEffect(() => {
        if (hocKiId) {
            fetchScheduleByDay();
        }
    }, [hocKiId]);

    const fetchScheduleByDay = async () => {
        try {
            const response = await axios.get(`/schedules/by-semester`, {
                params: { HocKiId: hocKiId, NgayCanLay: selectedDate },
            });
            setScheduleData(response.data);
        } catch (error) {
            console.error("Error fetching schedule by day:", error);
        }
    };

    // Hàm định dạng ngày theo dd/MM/yyyy
    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, "0")}/${String(
            d.getMonth() + 1
        ).padStart(2, "0")}/${d.getFullYear()}`;
    };

    // Nhóm dữ liệu theo thứ
    const groupByDay = (data) => {
        return data.reduce((acc, item) => {
            const { ThuTrongTuan } = item;
            if (!acc[ThuTrongTuan]) {
                acc[ThuTrongTuan] = [];
            }
            acc[ThuTrongTuan].push(item);
            return acc;
        }, {});
    };

    const renderScheduleByDay = () => {
        const groupedData = groupByDay(scheduleData);

        return daysOfWeek.map((day, index) => {
            const daySchedule = groupedData[index + 2] || []; // Thứ hai = 2, Chủ nhật = 8

            return (
                <div key={`day-${index}`} className="day-schedule">
                    <h5>{day}</h5>
                    {daySchedule.length > 0 ? (
                        <CTable bordered hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell style={{ width: "15%" }}>Phòng</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "10%" }}>Tiết</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "15%" }}>Tên lớp</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "20%" }}>Môn học</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "20%" }}>Giảng viên</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "10%" }}>Từ ngày</CTableHeaderCell>
                                    <CTableHeaderCell style={{ width: "10%" }}>Đến ngày</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {daySchedule.map((lesson, idx) => (
                                    <CTableRow key={`${index}-${idx}`}>
                                        <CTableDataCell>{lesson.SoHieuPhong}</CTableDataCell>
                                        <CTableDataCell>{lesson.TietHoc}</CTableDataCell>
                                        <CTableDataCell>{lesson.TenLop}</CTableDataCell>
                                        <CTableDataCell>{lesson.TenHocPhan}</CTableDataCell>
                                        <CTableDataCell>{lesson.GiangVien}</CTableDataCell>
                                        <CTableDataCell>{formatDate(lesson.TuNgay)}</CTableDataCell>
                                        <CTableDataCell>{formatDate(lesson.DenNgay)}</CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    ) : (
                        <p>Không có lịch học</p>
                    )}
                </div>
            );
        });
    };

    return (
        <div>
            <h4>Thời khóa biểu theo thứ</h4>
            <CButton
                color="primary"
                onClick={() => {
                    axios
                        .get(`/exports/schedules/excel`, {
                            params: { HocKiId: hocKiId },
                            responseType: "blob",
                        })
                        .then((response) => {
                            const url = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute(
                                "download",
                                `Thoikhoabieu_HocKi_${hocKiId}.xlsx`
                            );
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        })
                        .catch((error) => {
                            console.error("Error exporting schedule:", error);
                            alert("Lỗi khi xuất thời khóa biểu");
                        });
                }}
            >
                Xuất Excel
            </CButton>
            {scheduleData.length > 0 ? (
                renderScheduleByDay()
            ) : (
                <p>Không có dữ liệu thời khóa biểu.</p>
            )}
        </div>
    );
};

export default ScheduleByDay;
