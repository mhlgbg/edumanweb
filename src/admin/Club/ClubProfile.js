import React, { useState, useEffect } from 'react';
import { CForm, CFormLabel, CFormInput, CFormSelect, CButton, CAlert, CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react';
import axios from '../../api/api';

const ClubProfile = () => {
    const [clubs, setClubs] = useState([]);
    const [selectedClub, setSelectedClub] = useState('');
    const [clubDetails, setClubDetails] = useState(null);
    const [sports, setSports] = useState([]);
    const [managers, setManagers] = useState([]);  // List of club managers
    const [inviteEmail, setInviteEmail] = useState('');  // Email to invite manager
    const [inviteError, setInviteError] = useState('');
    const [inviteSuccess, setInviteSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchClubsAndSports = async () => {
            try {
                const [clubsResponse, sportsResponse] = await Promise.all([
                    axios.get('/clubs/club-of-users'),
                    axios.get('/sports')
                ]);

                setClubs(clubsResponse.data.clubs || []);
                setSports(sportsResponse.data || []);

                if (clubsResponse.data.clubs && clubsResponse.data.clubs.length > 0) {
                    const firstClubId = clubsResponse.data.clubs[0].clubId._id;
                    setSelectedClub(firstClubId);
                    fetchClubDetails(firstClubId);
                    fetchClubManagers(firstClubId);  // Load managers for the first club
                }
            } catch (err) {
                setError('Lỗi khi tải dữ liệu CLB hoặc môn thể thao.');
            } finally {
                setLoading(false);
            }
        };

        fetchClubsAndSports();
    }, []);

    const fetchClubDetails = async (clubId) => {
        try {
            const response = await axios.get(`/clubs/details/${clubId}`);
            setClubDetails(response.data);  // Lưu chi tiết CLB
        } catch (err) {
            setError('Lỗi khi tải dữ liệu chi tiết CLB.');
        }
    };

    const fetchClubManagers = async (clubId) => {
        try {
            const response = await axios.get(`/clubs/${clubId}/managers`);
            setManagers(response.data);  // Store the list of managers
        } catch (err) {
            setError('Lỗi khi tải danh sách người quản lý.');
        }
    };

    const handleClubChange = (event) => {
        const clubId = event.target.value;
        setSelectedClub(clubId);
        fetchClubDetails(clubId);
        fetchClubManagers(clubId);  // Update the managers list when club changes
    };

    const handleInviteSubmit = async (event) => {
        event.preventDefault();
        setInviteError('');
        setInviteSuccess('');

        try {
            const response = await axios.post(`/clubs/${selectedClub}/invite-manager`, { email: inviteEmail });
            setInviteSuccess(response.data.message);
            fetchClubManagers(selectedClub);  // Refresh the list of managers
        } catch (err) {
            setInviteError(err.response?.data?.message || 'Lỗi khi mời quản lý mới.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setUpdating(true);  // Bắt đầu quá trình cập nhật

        const formData = new FormData();
        formData.append('sportId', event.target.sportId.value);
        formData.append('name', event.target.name.value);
        formData.append('joinCode', event.target.joinCode.value);
        formData.append('uniqueUrl', event.target.uniqueUrl.value);
        formData.append('foundedDate', event.target.foundedDate.value);
        formData.append('operatingHours', event.target.operatingHours.value);
        formData.append('location', event.target.location.value);
        formData.append('president', event.target.president.value);
        formData.append('introduction', event.target.introduction.value);
        formData.append('notes', event.target.notes.value);

        if (event.target.avatar.files[0]) {
            formData.append('avatar', event.target.avatar.files[0]);
        }

        try {
            await axios.put(`/clubs/${selectedClub}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Cập nhật thành công!');
            fetchClubDetails(selectedClub);  // Cập nhật lại chi tiết sau khi thành công
        } catch (err) {
            setError('Lỗi khi cập nhật thông tin CLB.');
        } finally {
            setUpdating(false);  // Kết thúc quá trình cập nhật
        }
    };

    if (loading) {
        return <div>Loading...</div>;  // Hiển thị trong lúc chờ dữ liệu tải
    }

    return (
        <div className="club-management">
            <h2>Câu lạc bộ của tôi</h2>

            {error && <CAlert color="danger">{error}</CAlert>}

            {Array.isArray(clubs) && clubs.length > 0 ? (
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
            ) : (
                <p>Bạn không quản lý câu lạc bộ nào.</p>
            )}

            {clubDetails && (
                <CForm onSubmit={handleSubmit}>
                    <CFormLabel htmlFor="sportId">Môn thể thao</CFormLabel>
                    <CFormSelect id="sportId" name="sportId" defaultValue={clubDetails?.sportId || ''}>
                        {sports.map(sport => (
                            <option key={sport._id} value={sport._id}>
                                {sport.name}
                            </option>
                        ))}
                    </CFormSelect>

                    <CFormLabel htmlFor="name">Tên Câu Lạc Bộ</CFormLabel>
                    <CFormInput id="name" name="name" defaultValue={clubDetails.name} required />

                    <CFormLabel htmlFor="joinCode">Mã tham gia</CFormLabel>
                    <CFormInput id="joinCode" name="joinCode" defaultValue={clubDetails.joinCode} />

                    <CFormLabel htmlFor="uniqueUrl">Đường dẫn duy nhất</CFormLabel>
                    <CFormInput id="uniqueUrl" name="uniqueUrl" defaultValue={clubDetails.uniqueUrl} />

                    <CFormLabel htmlFor="avatar">Ảnh đại diện</CFormLabel>
                    <div>
                        <img src={`${import.meta.env.VITE_API_BASE_URL}/${clubDetails.avatar}`} alt="Club Avatar" style={{ width: '100px', height: '100px' }} />
                    </div>
                    <CFormInput type="file" id="avatar" name="avatar" />

                    <CFormLabel htmlFor="foundedDate">Ngày thành lập</CFormLabel>
                    <CFormInput type="date" id="foundedDate" name="foundedDate" defaultValue={new Date(clubDetails.foundedDate).toISOString().split('T')[0]} required />

                    <CFormLabel htmlFor="operatingHours">Giờ hoạt động</CFormLabel>
                    <CFormInput id="operatingHours" name="operatingHours" defaultValue={clubDetails.operatingHours} />

                    <CFormLabel htmlFor="location">Địa điểm</CFormLabel>
                    <CFormInput id="location" name="location" defaultValue={clubDetails.location} required />

                    <CFormLabel htmlFor="president">Chủ nhiệm</CFormLabel>
                    <CFormInput id="president" name="president" defaultValue={clubDetails.president} required />

                    <CFormLabel htmlFor="introduction">Giới thiệu</CFormLabel>
                    <CFormInput component="textarea" id="introduction" name="introduction" rows={3} defaultValue={clubDetails.introduction} />

                    <CFormLabel htmlFor="notes">Ghi chú</CFormLabel>
                    <CFormInput component="textarea" id="notes" name="notes" rows={3} defaultValue={clubDetails.notes} />

                    <CButton color="primary" type="submit" disabled={updating}>
                        {updating ? 'Đang cập nhật...' : 'Cập nhật'}
                    </CButton>
                </CForm>
            )}

            <h3>Danh sách quản lý CLB</h3>
            {managers.length > 0 ? (
                <CTable>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Họ và Tên</CTableHeaderCell>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableHeaderCell>Điện thoại</CTableHeaderCell>
                            <CTableHeaderCell>Ảnh đại diện</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {managers.map(manager => (
                            <CTableRow key={manager.userId._id}>
                                <CTableDataCell>{manager.userId.fullName}</CTableDataCell>
                                <CTableDataCell>{manager.userId.email}</CTableDataCell>
                                <CTableDataCell>{manager.userId.phoneNumber}</CTableDataCell>
                                <CTableDataCell>
                                    <img src={`${import.meta.env.VITE_API_BASE_URL}/${manager.userId.avatar}`} alt="Avatar" width="50" />
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            ) : (
                <p>Chưa có quản lý nào cho CLB này.</p>
            )}

            <h3>Mời quản lý mới</h3>
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
                <CButton color="primary" type="submit">Mời quản lý</CButton>
            </CForm>            
        </div>
    );
};

export default ClubProfile;
