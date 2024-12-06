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

const ScheduleByRoom = ({ hocKiId, selectedDate }) => {
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
      fetchRoomSchedule();
    }
  }, [hocKiId]);

  const fetchRoomSchedule = async () => {
    try {
      const response = await axios.get(`/schedules/by-semester`, {
        params: { HocKiId: hocKiId, NgayCanLay: selectedDate },
      });
      setScheduleData(response.data);
    } catch (error) {
      console.error("Error fetching room schedule:", error);
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

  // Nhóm dữ liệu theo phòng
  const groupByRoom = (data) => {
    return data.reduce((acc, item) => {
      const { SoHieuPhong } = item;
      if (!acc[SoHieuPhong]) {
        acc[SoHieuPhong] = {
          SoHieuPhong,
          LichHoc: [],
        };
      }
      acc[SoHieuPhong].LichHoc.push(item);
      return acc;
    }, {});
  };

  const renderScheduleByRoom = () => {
    const groupedData = groupByRoom(scheduleData);

    return Object.values(groupedData).map((room) => (
      <div key={room.SoHieuPhong} className="room-schedule">
        <h5>Phòng: {room.SoHieuPhong}</h5>
        <CTable bordered hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell style={{ width: "10%" }}>Thứ</CTableHeaderCell>
              <CTableHeaderCell style={{ width: "10%" }}>Tiết</CTableHeaderCell>
              <CTableHeaderCell style={{ width: "15%" }}>Tên lớp</CTableHeaderCell>
              <CTableHeaderCell style={{ width: "20%" }}>Môn học</CTableHeaderCell>
              <CTableHeaderCell style={{ width: "15%" }}>Giảng viên</CTableHeaderCell>
              <CTableHeaderCell style={{ width: "15%" }}>Từ ngày</CTableHeaderCell>
              <CTableHeaderCell style={{ width: "15%" }}>Đến ngày</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {daysOfWeek.map((day, index) => {
              const daySchedule = room.LichHoc.filter(
                (item) => item.ThuTrongTuan === index + 2 // Thứ hai = 2, Chủ nhật = 8
              );

              return (
                <React.Fragment key={`day-${index}`}>
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
                          <CTableDataCell>{lesson.TietHoc}</CTableDataCell>
                          <CTableDataCell>{lesson.TenLop}</CTableDataCell>
                          <CTableDataCell>{lesson.TenHocPhan}</CTableDataCell>
                          <CTableDataCell>{lesson.GiangVien}</CTableDataCell>
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
      <h4>Thời khóa biểu theo phòng</h4>
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
        renderScheduleByRoom()
      ) : (
        <p>Không có dữ liệu thời khóa biểu.</p>
      )}
    </div>
  );
};

export default ScheduleByRoom;
