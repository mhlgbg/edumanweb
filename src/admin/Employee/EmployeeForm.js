import React, { useState, useEffect } from 'react';
import axios from '../../api/api';
import { useParams } from 'react-router-dom';
import EmployeePersonalInfo from './EmployeePersonalInfo';
import EmployeeJobInfo from './EmployeeJobInfo';
// Import các khối khác khi cần thêm vào
import './EmployeeForm.css';
import { CButton } from '@coreui/react';
import EmployeePayrollInfo from './EmployeePayrollInfo';
import EmployeeEducationAndCertifications from './EmployeeEducationAndCertifications';
import EmployeeWorkExperience from './EmployeeWorkExperience';
import EmployeeAddress from './EmployeeAddress';
import EmployeeRelative from './EmployeeRelative';
import EmployeeChildren from './EmployeeChildren';
import EmploymentHistory from './EmploymentHistory';
import IncomeDecisions from './IncomeDecisions';
import EmployeeEvents from './EmployeeEvents';

const EmployeeForm = () => {
    const { employeeId } = useParams();
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const response = await axios.get(`/employees/${employeeId}`);
            setEmployee(response.data.data);
            console.log('personalInfo ', employee);

        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    return (
        <div className="employee-form-container">
            <div className="section-container">
                <div className="section-header">Thông tin cá nhân</div>
                <div className="section-content">
                    {employee && <EmployeePersonalInfo employeeId={employeeId} personalInfo={employee.personalInfo} />}
                </div>
            </div>
            <div className="section-container">
                <div className="section-header">Sổ địa chỉ</div>
                <div className="section-content">
                    {employee && <EmployeeAddress employeeId={employeeId} addresses={employee.addresses} />}
                </div>
            </div>
            <div className="section-container">
                <div className="section-header">Thông tin người thân</div>
                <div className="section-content">
                    {employee && <EmployeeRelative employeeId={employeeId} relatives={employee.relatives} />}
                </div>
            </div>
            <div className="section-container">
                <div className="section-header">Thông tin về con cái</div>
                <div className="section-content">
                    {employee && <EmployeeChildren employeeId={employeeId} children={employee.children} />}
                </div>
            </div>
            <div className="section-container">
                <div className="section-header">Quá trình làm việc</div>
                <div className="section-content">
                    {employee && <EmploymentHistory employeeId={employeeId} employmentHistory={employee.employmentHistory} />}
                </div>
            </div>
            <div className="section-container">
                <div className="section-header">Quá trình lương</div>
                <div className="section-content">
                    {employee && <IncomeDecisions employeeId={employeeId} incomeDecisions={employee.incomeDecisions} />}
                </div>
            </div>
            
            <div className="section-container">
                <div className="section-header">Thông tin bảo hiểm và lương</div>
                <div className="section-content">
                    <EmployeePayrollInfo employeeId={employeeId} payrollInfo={employee?.payrollInfo} />
                </div>
            </div>
            <div className="section-container">
                <div className="section-header">Bằng cấp và chứng chỉ</div>
                <div className="section-content">
                    <EmployeeEducationAndCertifications
                        employeeId={employeeId}
                        educationAndCertification={employee?.educationAndCertification}
                    />
                </div>
            </div>
            <div className="section-container">
                <div className="section-header">Kinh nghiệm làm việc</div>
                <div className="section-content">
                    <EmployeeWorkExperience
                        employeeId={employeeId}
                        workExperience={employee?.workExperience}
                    />
                </div>
            </div>
            <div className="section-container">
                <div className="section-header">Các sự kiện khác</div>
                <div className="section-content">
                    {employee && <EmployeeEvents employeeId={employeeId} employeeEvents={employee.employeeEvents} />}
                </div>
            </div>
        </div>
    );

};

export default EmployeeForm;
