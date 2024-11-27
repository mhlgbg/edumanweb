import React, { useEffect, useState } from 'react';
import axios from '../../api/api';
import { CCard, CCardBody, CCardTitle } from '@coreui/react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CustomerStatistics = () => {
  const [stats, setStats] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);

  useEffect(() => {
    fetchCustomerStatistics();
  }, []);

  const fetchCustomerStatistics = async () => {
    try {
      const response = await axios.get('/customers/customer-statistics');
      setStats(response.data.stats);
      setTotalCustomers(response.data.totalCustomers);
      setUniqueUsers(response.data.uniqueUsers);
    } catch (error) {
      console.error('Error fetching customer statistics:', error);
    }
  };

  const data = {
    labels: stats.map(stat => stat.fullName),
    datasets: [
      {
        label: 'Number of Customers Created',
        data: stats.map(stat => stat.customer_count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      }
    ]
  };

  return (
    <div>
      <CCard>
        <CCardBody>
          <CCardTitle>Customer Creation Statistics</CCardTitle>
          <p>Total Customers: {totalCustomers}</p>
          <p>Unique Users who created customers: {uniqueUsers}</p>
          <Bar data={data} />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CustomerStatistics;
