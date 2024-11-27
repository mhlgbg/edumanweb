import React from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardTitle, CImage } from '@coreui/react';
import { logo } from 'src/assets/brand/logo'

const customerInfo = {
  name: 'Nguyễn Thành Nam',
  birthDate: '11 tháng 10 năm 1978',
  companyName: 'Công ty Cổ phần Giải pháp Siêu Việt',
  website: 'http://sieuviet.vn',
  senderDepartment: 'Bộ phận Chăm sóc Khách hàng',
  senderName: 'Nguyễn Thanh Loan'
};

const BirthdayCard = () => {
  return (
    <CContainer
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: 'linear-gradient(to right, #ffecd2, #fcb69f)',
        padding: '20px'
      }}
    >
      <CRow className="w-100 justify-content-center">
        <CCol md={8}>
          <CCard className="shadow-lg" style={{ borderRadius: '15px', backgroundColor: '#ffffffee', backdropFilter: 'blur(5px)' }}>
            <CCardBody className="p-5">
              {/* Logo và thông tin công ty */}
              <div className="text-center mb-3">
                <CImage
                  src='/images/logo.png'
                  alt="Logo Siêu Việt"
                  className="mb-3"
                  style={{ width: '80px' }}
                />
                <h4 className="text-primary" style={{ fontWeight: 'bold' }}>{customerInfo.companyName}</h4>
                <p>
                  <a href={customerInfo.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-muted">
                    {customerInfo.website}
                  </a>
                </p>
              </div>

              {/* Lời chúc mừng sinh nhật */}
              <CCardTitle
                className="text-center text-uppercase mb-4"
                style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d94e34' }}
              >
                Chúc mừng sinh nhật!
              </CCardTitle>

              <div className="text-center mb-4">
                <p style={{ fontSize: '1.2rem' }}>
                  Kính gửi Ông/Bà: <strong>{customerInfo.name}</strong> <br />
                  Sinh ngày: {customerInfo.birthDate}
                </p>
                <p className="fst-italic text-muted">
                  Kính chúc Ông/Bà một ngày sinh nhật vui vẻ và tràn đầy yêu thương! <br />
                  Chúc Ông/Bà luôn mạnh khỏe, hạnh phúc và đạt nhiều thành công trong cuộc sống cũng như công việc. <br />
                  Công ty chúng tôi trân trọng sự đồng hành của Ông/Bà, chúc cho mọi điều tốt đẹp luôn đến với Ông/Bà.
                </p>
              </div>

              {/* Ký tên */}
              <div className="text-end mt-5">
                <p className="mb-1">{customerInfo.senderDepartment}</p>
                <p className="fw-bold">{customerInfo.senderName}</p>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default BirthdayCard;
