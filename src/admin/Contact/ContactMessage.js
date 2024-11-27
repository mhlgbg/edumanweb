import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
} from '@coreui/react';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchContactMessages();
  }, [currentPage]);

  const fetchContactMessages = async () => {
    try {
      const response = await axios.get(`/contacts/?page=${currentPage}&limit=10`);
      setMessages(response.data.messages);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h2>Contact Messages</h2>

      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Phone</CTableHeaderCell>
            <CTableHeaderCell>Company</CTableHeaderCell>
            <CTableHeaderCell>Address</CTableHeaderCell>
            <CTableHeaderCell>Message</CTableHeaderCell>
            <CTableHeaderCell>Date Sent</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {messages.map((message, index) => (
            <CTableRow key={message._id}>
              <CTableDataCell>{(currentPage - 1) * 10 + index + 1}</CTableDataCell>
              <CTableDataCell>{message.name}</CTableDataCell>
              <CTableDataCell>{message.email}</CTableDataCell>
              <CTableDataCell>{message.phone}</CTableDataCell>
              <CTableDataCell>{message.company || 'N/A'}</CTableDataCell>
              <CTableDataCell>{message.address || 'N/A'}</CTableDataCell>
              <CTableDataCell>{message.message}</CTableDataCell>
              <CTableDataCell>{new Date(message.createdAt).toLocaleString()}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination>
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

export default ContactMessages;
