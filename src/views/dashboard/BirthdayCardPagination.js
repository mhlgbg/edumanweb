import React, { useEffect, useState } from 'react'
import axios from '../../api/api';
import './BirthdayCardPagination.css' // Import the CSS file
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CPagination,
  CPaginationItem,
} from '@coreui/react'

const BirthdayCardPagination = () => {
  const [customers, setCustomers] = useState([])
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(12)

  const fetchBirthdayCustomers = async (page) => {
    try {
      const response = await axios.get(`/customers/birthday-from-aday?page=${page}&limit=${limit}`)
      setCustomers(response.data.customers)
      setTotalCustomers(response.data.totalCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  useEffect(() => {
    fetchBirthdayCustomers(page)
  }, [page])

  const totalPages = Math.ceil(totalCustomers / limit)

  return (
    <>
      <CRow className="mt-4">
        {customers.map((customer) => (
          <CCol key={customer._id} sm={4}>
            <CCard className="mb-4 text-center birthday-card">
              <CCardBody className="birthday-card-body">
                <h5>Happy Birthday {customer.fullName}</h5>
                <p>{customer.companyName || 'N/A'}</p>
                <p>{new Date(customer.birthday).toLocaleDateString('vi-VN')}</p>
                <p>{customer.email}</p>
                <p>{customer.phone}</p>
                
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CPagination align="center" aria-label="Page navigation">
        <CPaginationItem disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </CPaginationItem>

        {Array.from({ length: totalPages }, (_, i) => (
          <CPaginationItem
            key={i + 1}
            active={i + 1 === page}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </CPaginationItem>
        ))}

        <CPaginationItem disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </CPaginationItem>
      </CPagination>
    </>
  )
}

export default BirthdayCardPagination
