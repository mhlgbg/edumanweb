import React, { useState, useEffect } from 'react';
import { CForm, CFormLabel, CFormInput, CFormSelect, CButton, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CAlert, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react';
import axios from '../../api/api';  // API helper

const ClubMemberManagement = () => {
    const [clubs, setClubs] = useState([]);
    const [selectedClub, setSelectedClub] = useState('');
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');
    const [inviteError, setInviteError] = useState('');
    const [inviteSuccess, setInviteSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await axios.get('/clubs/club-of-users');
                const userClubs = response.data.clubs;
                if (userClubs.length === 0) {
                    setError("Bạn không được quản trị CLB nào.");
                } else {
                    setClubs(userClubs);
                    setSelectedClub(userClubs[0].clubId._id);
                    fetchMembers(userClubs[0].clubId._id);
                }
            } catch (err) {
                setError("Lỗi khi tải dữ liệu CLB.");
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    const fetchMembers = async (clubId) => {
        try {
            const response = await axios.get(`/club-members/${clubId}/members`);
            setMembers(response.data);
        } catch (err) {
            setError("Lỗi khi tải dữ liệu thành viên.");
        }
    };

    const handleClubChange = (event) => {
        setSelectedClub(event.target.value);
        fetchMembers(event.target.value);
    };

    const handleApproveMember = async (memberId) => {
        if (window.confirm("Bạn có chắc chắn muốn duyệt thành viên này?")) {
            try {
                await axios.put(`/club-members/${memberId}/approve`);
                fetchMembers(selectedClub);
            } catch (err) {
                setError("Lỗi khi duyệt thành viên.");
            }
        }
    };

    const handleRejectMember = async (memberId) => {
        if (window.confirm("Bạn có chắc chắn muốn từ chối thành viên này?")) {
            try {
                await axios.put(`/club-members/${memberId}/reject`);
                fetchMembers(selectedClub);
            } catch (err) {
                setError("Lỗi khi từ chối thành viên.");
            }
        }
    };

    const handleEditMember = (member) => {
        setEditingMember(member);
        setShowModal(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const payload = {
                nick: event.target.nick.value,
            };
            await axios.put(`/club-members/${editingMember._id}/edit-nick`, payload);
            fetchMembers(selectedClub);
            setShowModal(false);
        } catch (err) {
            setError("Lỗi khi sửa thông tin thành viên.");
        }
    };

    const handleInviteSubmit = async (event) => {
        if (window.confirm("Bạn có chắc chắn muốn mời thành viên này?")) {
            event.preventDefault();
            setInviteError('');
            setInviteSuccess('');

            try {
                const response = await axios.post(`/club-members/${selectedClub}/invite`, { email: inviteEmail });
                if (response.data.success) {
                    setInviteSuccess(response.data.message);
                    fetchMembers(selectedClub);
                } else {
                    setInviteError(response.data.message);
                }
            } catch (err) {
                setInviteError("Lỗi khi mời người dùng tham gia CLB.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="club-member-management">
            <h2>Quản lý thành viên CLB</h2>

            {error && <CAlert color="danger">{error}</CAlert>}

            <CForm>
                <CFormLabel htmlFor="clubSelect">Chọn Câu Lạc Bộ</CFormLabel>
                <CFormSelect id="clubSelect" value={selectedClub} onChange={handleClubChange}>
                    {clubs.map(club => (
                        <option key={club.clubId._id} value={club.clubId._id}>
                            {club.clubId.name}
                        </option>
                    ))}
                </CFormSelect>
            </CForm>

            {members.length > 0 ? (
                <CTable striped bordered hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Nick</CTableHeaderCell>
                            <CTableHeaderCell>Họ và Tên</CTableHeaderCell>
                            <CTableHeaderCell>Điện thoại</CTableHeaderCell>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableHeaderCell>Ảnh đại diện</CTableHeaderCell>
                            <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                            <CTableHeaderCell>Hành động</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {members.map(member => (
                            <CTableRow key={member._id}>
                                <CTableDataCell>{member.nickInClub}</CTableDataCell>
                                <CTableDataCell>{member.userId.fullName}</CTableDataCell>
                                <CTableDataCell>{member.userId.phoneNumber}</CTableDataCell>
                                <CTableDataCell>{member.userId.email}</CTableDataCell>
                                <CTableDataCell>
                                    <img src={`${import.meta.env.VITE_API_BASE_URL}/${member.userId.avatar}`} alt="Avatar" width="100" />
                                </CTableDataCell>
                                <CTableDataCell>{member.status}</CTableDataCell>
                                <CTableDataCell>
                                    {member.status === 'draft' && (
                                        <>
                                            <CButton color="success" onClick={() => handleApproveMember(member._id)}>Duyệt</CButton>
                                            <CButton color="danger" onClick={() => handleRejectMember(member._id)} className="ml-2">Từ chối</CButton>
                                        </>
                                    )}
                                    {member.status === 'approved' && (
                                        <CButton color="danger" onClick={() => handleRejectMember(member._id)}>Từ chối</CButton>
                                    )}
                                    {member.status === 'rejected' && (
                                        <CButton color="success" onClick={() => handleApproveMember(member._id)}>Duyệt</CButton>
                                    )}
                                    <CButton color="warning" onClick={() => handleEditMember(member)} className="ml-2">Sửa nick</CButton>                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            ) : (
                <p>Không có thành viên nào trong CLB này.</p>
            )}

            <CModal visible={showModal} onClose={() => setShowModal(false)} backdrop="static">
                <CModalHeader closeButton>
                    <h5>Sửa Nick Thành Viên</h5>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleSubmit}>
                        <CFormLabel htmlFor="nick">Nick</CFormLabel>
                        <CFormInput type="text" id="nick" defaultValue={editingMember?.nick || ''} required />
                        <CButton color="primary" type="submit">Cập nhật</CButton>
                    </CForm>
                </CModalBody>
            </CModal>

            <h3>Mời người dùng tham gia CLB</h3>
            {inviteError && <CAlert color="danger">{inviteError}</CAlert>}
            {inviteSuccess && <CAlert color="success">{inviteSuccess}</CAlert>}
            <CForm onSubmit={handleInviteSubmit}>
                <CFormLabel htmlFor="inviteEmail">Nhập email người dùng:</CFormLabel>
                <CFormInput
                    type="email"
                    id="inviteEmail"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                />
                <CButton color="primary" type="submit">Mời tham gia CLB</CButton>
            </CForm>
        </div>
    );
};

export default ClubMemberManagement;
