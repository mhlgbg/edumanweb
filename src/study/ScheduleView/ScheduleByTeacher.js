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

const ScheduleByTeacher = ({ hocKiId, selectedDate }) => {
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
        if (hocKiId && selectedDate) {
            fetchTeacherSchedule();
        }
    }, [hocKiId, selectedDate]);

    const fetchTeacherSchedule = async () => {
        try {
            const response = await axios.get(`/schedules/by-semester`, {
                params: { HocKiId: hocKiId, NgayCanLay: selectedDate },
            });
            setScheduleData(response.data);
        } catch (error) {
            console.error("Error fetching teacher schedule:", error);
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

    // Nhóm dữ liệu theo giáo viên
    /*const groupByTeacher = (data) => {
        return data.reduce((acc, item) => {
            const { MaNhanhSu, HoVaTen } = item;
            if (!acc[MaNhanhSu]) {
                acc[MaNhanhSu] = {
                    MaNhanhSu,
                    HoVaTen,
                    LichHoc: [],
                };
            }
            acc[MaNhanhSu].LichHoc.push(item);
            return acc;
        }, {});
    };*/
    const groupByTeacher = (data) => {
        return data.reduce((acc, item) => {
            const { MaGiangVien, GiangVien } = item; // Đúng với tên cột từ API
            if (!acc[MaGiangVien]) {
                acc[MaGiangVien] = {
                    MaGiangVien,
                    GiangVien,
                    LichHoc: [],
                };
            }
            acc[MaGiangVien].LichHoc.push(item);
            return acc;
        }, {});
    };

    const renderScheduleByTeacher = () => {
        const groupedData = groupByTeacher(scheduleData);
    
        return Object.values(groupedData).map((teacher) => (
            <div key={teacher.MaGiangVien} className="teacher-schedule">
                <h5>
                    {teacher.GiangVien} (Số lớp: {teacher.LichHoc.length})
                </h5>
                <CTable bordered hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell style={{ width: "10%" }}>Thứ</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: "15%" }}>Phòng</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: "10%" }}>Tiết</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: "20%" }}>Tên môn</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: "15%" }}>Từ ngày</CTableHeaderCell>
                            <CTableHeaderCell style={{ width: "15%" }}>Đến ngày</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {daysOfWeek.map((day, index) => {
                            const daySchedule = teacher.LichHoc.filter(
                                (item) => item.ThuTrongTuan === index + 2 // Thứ hai = 2, Chủ nhật = 8
                            );
    
                            return (
                                <React.Fragment key={`header-${index}`}>
                                    {daySchedule.length > 0 && (
                                        <>
                                            <CTableRow>
                                                <CTableDataCell
                                                    rowSpan={daySchedule.length + 1}
                                                    style={{
                                                        verticalAlign: "middle",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {day}
                                                </CTableDataCell>
                                            </CTableRow>
                                            {daySchedule.map((lesson, idx) => (
                                                <CTableRow key={`${index}-${idx}`}>
                                                    <CTableDataCell>{lesson.SoHieuPhong}</CTableDataCell>
                                                    <CTableDataCell>{lesson.TietHoc}</CTableDataCell>
                                                    <CTableDataCell>{lesson.TenHocPhan}</CTableDataCell>
                                                    <CTableDataCell>{formatDate(lesson.TuNgay)}</CTableDataCell>
                                                    <CTableDataCell>{formatDate(lesson.DenNgay)}</CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </CTableBody>
                </CTable>
            </div>
        ));
    };

    return (
        <div>
            <h4>Thời khóa biểu theo giáo viên</h4>
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
                renderScheduleByTeacher()
            ) : (
                <p>Không có dữ liệu thời khóa biểu.</p>
            )}
        </div>
    );
};

export default ScheduleByTeacher;
