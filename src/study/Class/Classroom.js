import React, { useEffect, useState } from 'react'
import axios from '../../api/api'
import { useNavigate } from 'react-router-dom'
import './Classroom.css'
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
    CPagination,
    CPaginationItem,
    CButton,
} from '@coreui/react'

const Classroom = () => {
    const [teachingCards, setTeachingCards] = useState([])
    const [totalTeachingCards, setTotalTeachingCards] = useState(0)
    const [page, setPage] = useState(1)
    const [limit] = useState(12)
    const navigate = useNavigate()


    const fetchTeachingCards = async (page) => {
        try {
            const response = await axios.get(`/schedules/teaching-cards`, { params: { page, limit } })
            setTeachingCards(response.data.schedules)
            setTotalTeachingCards(response.data.totalSchedules)
        } catch (error) {
            console.error('Error fetching teaching cards:', error)
        }
    }

    useEffect(() => {
        fetchTeachingCards(page)
    }, [page])

    const handleGoToReport = (scheduleId) => {
        navigate(`/study/class-report/${scheduleId}`)
    }


    const totalPages = Math.ceil(totalTeachingCards / limit)

    return (
        <>
            <CRow className="mt-4">
                {teachingCards.map((card) => (
                    <CCol key={card._id} sm={4}>
                        <CCard className={`mb-4 text-center ${card.status === 'scheduled' ? 'teaching-card-red' : 'teaching-card-green'}`}>
                            <CCardBody>
                                <h5>{card.className}</h5>
                                <p>Teacher: {card.userName}</p>
                                <p>Date: {new Date(card.date).toLocaleDateString()}</p>
                                <p>Time: {card.startHour}:{card.startMinute.toString().padStart(2, '0')}</p>
                                <p>Duration: {card.duration} mins</p>
                                <p>Status: {card.status}</p>
                                {card.status === 'scheduled' && (
                                    <CButton color="primary" onClick={() => handleGoToReport(card._id)}>
                                        Go to Report
                                    </CButton>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            <CPagination align="center" aria-label="Page navigation">
                <CPaginationItem disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</CPaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                    <CPaginationItem key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
                        {i + 1}
                    </CPaginationItem>
                ))}
                <CPaginationItem disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</CPaginationItem>
            </CPagination>
        </>
    )
}

export default Classroom
