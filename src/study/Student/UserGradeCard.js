import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CPagination, CPaginationItem } from '@coreui/react';
import axios from '../../api/api';

const UserGradeCard = () => {
    const [grades, setGrades] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await axios.get('/user-grade/user-grades', {
                    params: {
                        page: currentPage,
                        limit: 10
                    }
                });
                setGrades(response.data.grades);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách phiếu điểm:', error);
            }
        };

        fetchGrades();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <h4>Phiếu Điểm Của Tôi</h4>
            <div className="card-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {grades.map(grade => (
                    <CCard key={grade._id} style={{ width: '300px' }}>
                        <CCardHeader>
                            <strong>{new Date(grade.assessmentDate).toLocaleDateString()}</strong>
                        </CCardHeader>
                        <CCardBody>
                            <p><strong>Tên bài kiểm tra:</strong> {grade.assessmentName}</p>
                            <p><strong>Điểm:</strong> {grade.score} / {grade.maxScore}</p>
                            <p><strong>Nhận xét:</strong> {grade.comment || 'Không có nhận xét'}</p>
                        </CCardBody>
                    </CCard>
                ))}
            </div>
            <CPagination align="center" className="mt-4">
                {[...Array(totalPages).keys()].map(page => (
                    <CPaginationItem
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </CPaginationItem>
                ))}
            </CPagination>
        </div>
    );
};

export default UserGradeCard;
