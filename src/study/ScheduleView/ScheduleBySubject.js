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

const ScheduleBySubject = ({ hocKiId, selectedDate }) => {
    const [scheduleData, setScheduleData] = useState([]);

    useEffect(() => {
        if (hocKiId) {
            fetchScheduleBySubject();
        }
    }, [hocKiId]);

    const fetchScheduleBySubject = async () => {
        try {
            const response = await axios.get(`/schedules/by-semester`, {
                params: { HocKiId: hocKiId, NgayCanLay: selectedDate },
            });
            setScheduleData(response.data);
        } catch (error) {
            console.error("Error fetching schedule by subject:", error);
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

    // Nhóm dữ liệu theo môn học
    const groupBySubject = (data) => {
        return data.reduce((acc, item) => {
            const { TenHocPhan } = item;
            if (!acc[TenHocPhan]) {
                acc[TenHocPhan] = {
                    TenHocPhan,
                    LichHoc: [],
                };
            }
            acc[TenHocPhan].LichHoc.push(item);
            return acc;
        }, {});
    };

    const renderScheduleBySubject = () => {
        const groupedData = groupBySubject(scheduleData);

        return Object.values(groupedData).map((subject) => (
            <div key={subject.TenHocPhan} className="subject-schedule">
                <h5>Môn học: {subject.TenHocPhan}</h5>
                <CTable bordered hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell style={{ width: "10%" }}>Thứ</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: "10%" }}>Tiết</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: "15%" }}>Phòng</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: "15%" }}>Tên lớp</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: "20%" }}>Giảng viên</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: "15%" }}>Từ ngày</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: "15%" }}>Đến ngày</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {subject.LichHoc.map((lesson, idx) => (
                            <CTableRow key={idx}>
                                <CTableDataCell>
                                    {lesson.ThuTrongTuan === 8
                                        ? "Chủ nhật"
                                        : `Thứ ${lesson.ThuTrongTuan}`}
                                </CTableDataCell>
                                <CTableDataCell>{lesson.TietHoc}</CTableDataCell>
                                <CTableDataCell>{lesson.SoHieuPhong}</CTableDataCell>
                                <CTableDataCell>{lesson.TenLop}</CTableDataCell>
                                <CTableDataCell>{lesson.GiangVien}</CTableDataCell>
                                <CTableDataCell>{formatDate(lesson.TuNgay)}</CTableDataCell>
                                <CTableDataCell>{formatDate(lesson.DenNgay)}</CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </div>
        ));
    };

    return (
        <div>
            <h4>Thời khóa biểu theo môn học</h4>
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
                renderScheduleBySubject()
            ) : (
                <p>Không có dữ liệu thời khóa biểu.</p>
            )}
        </div>
    );
};

export default ScheduleBySubject;
