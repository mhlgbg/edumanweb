import React, { useState, useEffect } from 'react';
import { CForm, CFormLabel, CFormInput, CFormSelect, CButton, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CAlert, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react';
import axios from '../../api/api';  // API helper

const ClubPracticeSessionManagement = () => {
    const [clubs, setClubs] = useState([]);
    const [selectedClub, setSelectedClub] = useState('');
    const [practiceSessions, setPracticeSessions] = useState([]);
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [showAddMatchForm, setShowAddMatchForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [editingMatch, setEditingMatch] = useState(null);
    const [sessionId, setSessionId] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [matchToDelete, setMatchToDelete] = useState(null);

    const [newMatch, setNewMatch] = useState({
        team1Nick1: '',
        team1Nick2: '',
        team2Nick1: '',
        team2Nick2: '',
        team1Score: '',
        team2Score: '',
    });

    const [newSession, setNewSession] = useState({
        name: '',
        practiceDate: '',
        notes: '',
    });

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await axios.get('/clubs/club-of-users');
                const userClubs = response.data.clubs;

                if (userClubs.length === 0) {
                    setError("Bạn không được quản trị CLB nào, vui lòng liên hệ Chủ nhiệm để được cấp quyền.");
                } else {
                    setClubs(userClubs);
                    setSelectedClub(userClubs[0].clubId._id);
                    fetchPracticeSessions(userClubs[0].clubId._id, 1);
                }
            } catch (err) {
                setError("Lỗi khi tải danh sách câu lạc bộ.");
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const fetchPracticeSessions = async (clubId, page) => {
        try {
            const response = await axios.get(`/practice-sessions/${clubId}/practices?page=${page}&limit=20`);
            setPracticeSessions(response.data.sessions);
        } catch (err) {
            setError("Lỗi khi tải dữ liệu buổi tập luyện.");
        }
    };

    const fetchMatches = async (practiceSessionId) => {
        try {
            const response = await axios.get(`/matches/${practiceSessionId}/matches-of-practice`);
            setMatches(response.data.matches);
        } catch (err) {
            setError("Lỗi khi tải danh sách trận đấu.");
        }
    };

    const handleShowMatches = (sessionId) => {
        setSessionId(sessionId);
        fetchMatches(sessionId);
        setShowMatchModal(true);
    };

    const handleAddMatch = async () => {
        const payload = {
            practiceSessionId: sessionId,
            team1: [newMatch.team1Nick1, newMatch.team1Nick2],
            team2: [newMatch.team2Nick1, newMatch.team2Nick2],
            team1Score: newMatch.team1Score,
            team2Score: newMatch.team2Score,
        };

        try {
            await axios.post('/matches/add_match_to_practice', payload);
            setNewMatch({
                team1Nick1: '',
                team1Nick2: '',
                team2Nick1: '',
                team2Nick2: '',
                team1Score: '',
                team2Score: '',
            });
            fetchMatches(sessionId);
        } catch (err) {
            setError("Lỗi khi thêm trận đấu.");
        }
    };

    const handleDeleteMatch = async () => {
        try {
            await axios.delete(`/matches/${matchToDelete.matchId}`);
            setShowDeleteModal(false);
            fetchMatches(sessionId);
        } catch (err) {
            setError("Lỗi khi xóa trận đấu.");
        }
    };

    const openDeleteModal = (match) => {
        setMatchToDelete(match);
        setShowDeleteModal(true);
    };

    const handleEditMatch = async () => {
        if (!editingMatch || !editingMatch._id) {
            setError("Không thể xác định trận đấu để chỉnh sửa.");
            return;
        }

        const payload = {
            team1: [newMatch.team1Nick1, newMatch.team1Nick2],
            team2: [newMatch.team2Nick1, newMatch.team2Nick2],
            team1Score: newMatch.team1Score,
            team2Score: newMatch.team2Score,
        };

        try {
            await axios.put(`/matches/edit-match-of-practice/${editingMatch._id}`, payload);
            setEditingMatch(null);
            fetchMatches(sessionId);
        } catch (err) {
            setError("Lỗi khi chỉnh sửa trận đấu.");
        }
    };

    const handleOpenEditMatch = (match) => {
        setEditingMatch({ ...match, _id: match.matchId });
        setNewMatch({
            team1Nick1: match.team1[0]?.nickInClub || '',
            team1Nick2: match.team1[1]?.nickInClub || '',
            team2Nick1: match.team2[0]?.nickInClub || '',
            team2Nick2: match.team2[1]?.nickInClub || '',
            team1Score: match.finalScore.team1Total,
            team2Score: match.finalScore.team2Total,
        });
        setShowAddMatchForm(true);
    };

    const handleAddSession = () => {
        setEditingSession(null);
        setNewSession({ name: '', practiceDate: '', notes: '' });
        setShowModal(true);
    };

    const handleEditSession = (session) => {
        setEditingSession(session);
        setNewSession({
            name: session.name,
            practiceDate: session.practiceDate,
            notes: session.notes,
        });
        setShowModal(true);
    };

    const handleDeleteSession = async (sessionId) => {
        try {
            await axios.delete(`/practice-sessions/${sessionId}`);
            fetchPracticeSessions(selectedClub, 1);
        } catch (err) {
            setError("Lỗi khi xóa buổi tập luyện.");
        }
    };

    const handleSaveSession = async (event) => {
        event.preventDefault();
        const formData = {
            name: newSession.name,
            practiceDate: newSession.practiceDate,
            clubId: selectedClub,
            notes: newSession.notes,
        };

        try {
            if (editingSession) {
                await axios.put(`/practice-sessions/${editingSession._id}`, formData);
            } else {
                await axios.post('/practice-sessions', formData);
            }
            setShowModal(false);
            fetchPracticeSessions(selectedClub, 1);
        } catch (err) {
            setError("Lỗi khi lưu buổi tập luyện.");
        }
    };

    return (
        <div>
            <h2>Quản lý buổi tập luyện</h2>

            {error && <CAlert color="danger">{error}</CAlert>}

            <CButton color="primary" className="my-3" onClick={handleAddSession}>
                Thêm buổi tập luyện mới
            </CButton>

            <CTable striped bordered hover>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Tên buổi tập luyện</CTableHeaderCell>
                        <CTableHeaderCell>Ngày tập luyện</CTableHeaderCell>
                        <CTableHeaderCell>Ghi chú</CTableHeaderCell>
                        <CTableHeaderCell>Hành động</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {practiceSessions.map(session => (
                        <CTableRow key={session._id}>
                            <CTableDataCell>{session.name}</CTableDataCell>
                            <CTableDataCell>{new Date(session.practiceDate).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>{session.notes}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="primary" onClick={() => handleShowMatches(session._id)}>
                                    Nhập kết quả trận đấu
                                </CButton>{' '}
                                <CButton color="warning" onClick={() => handleEditSession(session)}>
                                    Sửa
                                </CButton>{' '}
                                <CButton color="danger" onClick={() => handleDeleteSession(session._id)}>
                                    Xóa
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            {/* Modal thêm/sửa buổi tập luyện */}
            <CModal visible={showModal} onClose={() => setShowModal(false)} backdrop="static">
                <CModalHeader closeButton>
                    <h5>{editingSession ? 'Sửa buổi tập luyện' : 'Thêm buổi tập luyện mới'}</h5>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSaveSession}>
                        <CFormLabel htmlFor="name">Tên buổi tập luyện</CFormLabel>
                        <CFormInput
                            type="text"
                            value={newSession.name}
                            onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                            required
                        />
                        <CFormLabel htmlFor="practiceDate">Ngày tập luyện</CFormLabel>
                        <CFormInput
                            type="date"
                            value={newSession.practiceDate ? new Date(newSession.practiceDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => setNewSession({ ...newSession, practiceDate: e.target.value })}
                            required
                        />
                        <CFormLabel htmlFor="notes">Ghi chú</CFormLabel>
                        <CFormInput
                            component="textarea"
                            value={newSession.notes}
                            onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                        />
                        <CButton color="primary" type="submit">
                            {editingSession ? 'Cập nhật' : 'Thêm mới'}
                        </CButton>
                    </CForm>
                </CModalBody>
            </CModal>

            {/* Modal hiển thị danh sách trận đấu */}
            <CModal visible={showMatchModal} onClose={() => setShowMatchModal(false)} size="lg" backdrop="static">
                <CModalHeader closeButton>
                    <h5>Danh sách trận đấu</h5>
                </CModalHeader>
                <CModalBody>
                    <CButton color="success" onClick={() => setShowAddMatchForm(true)}>Thêm mới trận đấu</CButton>
                    <CTable striped bordered hover>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Team 1</CTableHeaderCell>
                                <CTableHeaderCell>Team 2</CTableHeaderCell>
                                <CTableHeaderCell>Điểm Team 1</CTableHeaderCell>
                                <CTableHeaderCell>Điểm Team 2</CTableHeaderCell>
                                <CTableHeaderCell>Hành động</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {matches.map(match => (
                                <CTableRow key={match._id}>
                                    <CTableDataCell>{match.team1.map(player => player.nickInClub).join(', ')}</CTableDataCell>
                                    <CTableDataCell>{match.team2.map(player => player.nickInClub).join(', ')}</CTableDataCell>
                                    <CTableDataCell>{match.finalScore.team1Total}</CTableDataCell>
                                    <CTableDataCell>{match.finalScore.team2Total}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton color="warning" onClick={() => handleOpenEditMatch(match)}>Sửa</CButton>
                                        <CButton color="danger" onClick={() => openDeleteModal(match)}>Xóa</CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>

                    {/* Form thêm/sửa trận đấu */}
                    {showAddMatchForm && (
                        <CForm>
                            <CFormLabel>Nick 1 Team 1</CFormLabel>
                            <CFormInput
                                type="text"
                                value={newMatch.team1Nick1}
                                onChange={(e) => setNewMatch({ ...newMatch, team1Nick1: e.target.value })}
                            />
                            <CFormLabel>Nick 2 Team 1</CFormLabel>
                            <CFormInput
                                type="text"
                                value={newMatch.team1Nick2}
                                onChange={(e) => setNewMatch({ ...newMatch, team1Nick2: e.target.value })}
                            />
                            <CFormLabel>Nick 1 Team 2</CFormLabel>
                            <CFormInput
                                type="text"
                                value={newMatch.team2Nick1}
                                onChange={(e) => setNewMatch({ ...newMatch, team2Nick1: e.target.value })}
                            />
                            <CFormLabel>Nick 2 Team 2</CFormLabel>
                            <CFormInput
                                type="text"
                                value={newMatch.team2Nick2}
                                onChange={(e) => setNewMatch({ ...newMatch, team2Nick2: e.target.value })}
                            />
                            <CFormLabel>Điểm Team 1</CFormLabel>
                            <CFormInput
                                type="text"
                                value={newMatch.team1Score}
                                onChange={(e) => setNewMatch({ ...newMatch, team1Score: e.target.value })}
                            />
                            <CFormLabel>Điểm Team 2</CFormLabel>
                            <CFormInput
                                type="text"
                                value={newMatch.team2Score}
                                onChange={(e) => setNewMatch({ ...newMatch, team2Score: e.target.value })}
                            />
                            <CButton color="primary" onClick={editingMatch ? handleEditMatch : handleAddMatch}>
                                {editingMatch ? 'Cập nhật' : 'Ghi lại'}
                            </CButton>
                        </CForm>
                    )}
                </CModalBody>
            </CModal>

            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)} backdrop="static">
                <CModalHeader closeButton>
                    <h5>Xác nhận xóa trận đấu</h5>
                </CModalHeader>
                <CModalBody>
                    Bạn có chắc chắn muốn xóa trận đấu này không? Hành động này không thể hoàn tác.
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                        Hủy
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteMatch}>
                        Xóa
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ClubPracticeSessionManagement;
