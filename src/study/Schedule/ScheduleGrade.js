import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import {
    CButton, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CFormLabel
} from '@coreui/react';

const ScheduleGrade = ({ scheduleId, grades }) => {
    const [gradeList, setGradeList] = useState(grades || []);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [showGradeModal, setShowGradeModal] = useState(false);
    const [newGrade, setNewGrade] = useState({ assessmentName: '', scores: [] });

    useEffect(() => {
        fetchGrades();
    }, [grades]);

    const fetchGrades = async () => {
        try {
            const response = await axios.get(`/class-report/${scheduleId}/grades`);
            setGradeList(response.data.grades);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    /*const handleAddGrade = async () => {
        try {
            await axios.post(`/class-report/${scheduleId}/grades`, newGrade);
            fetchGrades();
            setShowGradeModal(false);
            setNewGrade({ assessmentName: '', scores: [] });
        } catch (error) {
            console.error('Error adding grade:', error);
        }
    };*/

    const handleAddGrade = async () => {
        try {
            await axios.post(`/class-report/${scheduleId}/grades`, {
                assessmentName: newGrade.assessmentName,
                maxScore: newGrade.maxScore,
                scores: newGrade.scores,
            });
            fetchGrades();
            setShowGradeModal(false);
            setNewGrade({ assessmentName: '', maxScore: '', scores: [] });
        } catch (error) {
            console.error('Error adding grade:', error);
        }
    };

    const handleDeleteGrade = async (assessmentName) => {
        if (window.confirm("Are you sure you want to delete this grade?")) {
            try {
                await axios.delete(`/class-report/${scheduleId}/grades/${assessmentName}`);
                fetchGrades();
            } catch (error) {
                console.error('Error deleting grade:', error);
            }
        }
    };

    const handleEnterScores = async (grade) => {
        try {
            const response = await axios.get(`/class-report/${scheduleId}/grades/${grade.assessmentName}`);
            const fetchedGrade = response.data.grade;
            setSelectedGrade({
                ...fetchedGrade,
                scores: fetchedGrade.scores || []  // Đảm bảo scores luôn là một mảng
            });
        } catch (error) {
            console.error('Error fetching grade scores:', error);
        }
    };

    /*const handleFetchStudents = async () => {
        if (selectedGrade) {
            try {
                const response = await axios.post(`/class-report/${scheduleId}/grades/${selectedGrade.assessmentName}/fetch-students`);
                setSelectedGrade(response.data.grade);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        }
    };*/
    const handleFetchStudents = async () => {
        if (selectedGrade) {
            try {
                // Thêm các học sinh chưa có vào danh sách điểm cho đầu điểm này
                await axios.post(`/class-report/${scheduleId}/grades/${selectedGrade.assessmentName}/fetch-students`);
                
                // Sau khi cập nhật, tải lại dữ liệu điểm của đầu điểm để hiển thị danh sách đầy đủ
                await handleEnterScores(selectedGrade); 
    
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        }
    };

    const handleScoreChange = (userId, newScore, newComment) => {
        setSelectedGrade((prevGrade) => ({
            ...prevGrade,
            scores: prevGrade.scores.map((s) =>
                s.userId._id === userId ? { ...s, score: newScore, comment: newComment } : s
            ),
        }));
    };

    const handleSaveScores = async () => {
        try {
            const scoresToUpdate = selectedGrade.scores; // Chỉ lấy scores từ selectedGrade
            await axios.put(`/class-report/${scheduleId}/grades/${selectedGrade.assessmentName}`, { scores: scoresToUpdate });
            alert('Scores saved successfully!');
        } catch (error) {
            console.error('Error saving scores:', error);
        }
    };

    return (
        <div className="grade-section">

            <CTable striped hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Assessment Name</CTableHeaderCell>
                        <CTableHeaderCell>Max Score</CTableHeaderCell> {/* Hiển thị maxScore */}
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {gradeList.map((grade) => (
                        <CTableRow key={grade.assessmentName}>
                            <CTableDataCell>{grade.assessmentName}</CTableDataCell>
                            <CTableDataCell>{grade.maxScore}</CTableDataCell> {/* Hiển thị giá trị maxScore */}
                            <CTableDataCell>
                                <CButton color="info" onClick={() => handleEnterScores(grade)}>Enter Scores</CButton>
                                <CButton color="danger" onClick={() => handleDeleteGrade(grade.assessmentName)}>Delete</CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
            <CButton color="primary" onClick={() => setShowGradeModal(true)}>Add Grade</CButton>

            {/* Modal to Add New Grade */}
            <CModal visible={showGradeModal} onClose={() => setShowGradeModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Add New Grade</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Assessment Name</CFormLabel>
                    <CFormInput
                        value={newGrade.assessmentName}
                        onChange={(e) => setNewGrade({ ...newGrade, assessmentName: e.target.value })}
                    />
                    <CFormLabel>Max Score</CFormLabel>
                    <CFormInput
                        type="number"
                        value={newGrade.maxScore}
                        onChange={(e) => setNewGrade({ ...newGrade, maxScore: e.target.value })}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowGradeModal(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={handleAddGrade}>Save</CButton>
                </CModalFooter>
            </CModal>

            {/* Score Entry */}
            {selectedGrade && (
                <div className="score-entry">
                    <h5>Scores for {selectedGrade.assessmentName} / ({selectedGrade.maxScore})</h5>
                    <CButton color="secondary" onClick={handleFetchStudents}>Fetch Students</CButton>
                    <CTable striped hover>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Student</CTableHeaderCell>
                                <CTableHeaderCell>Score</CTableHeaderCell>
                                <CTableHeaderCell>Comment</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {selectedGrade.scores.map((score) => (
                                <CTableRow key={score.userId._id}>
                                    <CTableDataCell>{score.userId.fullName}</CTableDataCell>
                                    <CTableDataCell>
                                        <CFormInput
                                            type="number"
                                            value={score.score ? score.score : ''}
                                            onChange={(e) => handleScoreChange(score.userId._id, e.target.value, score.comment)}
                                        />
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        <CFormInput
                                            type="text"
                                            value={score.comment}
                                            onChange={(e) => handleScoreChange(score.userId._id, score.score, e.target.value)}
                                        />
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                    <CButton color="success" onClick={handleSaveScores}>Save Scores</CButton>
                </div>
            )}
        </div>
    );
};

export default ScheduleGrade;
