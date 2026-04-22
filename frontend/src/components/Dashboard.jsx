import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Layout from './Layout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_URL}/me`, config);
        setStudent(res.data);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <Layout student={student}>
      <div className="erp-grid">
        
        {/* Welcome Card */}
        <div className="erp-card welcome-card">
          <div className="card-header-text">Welcome</div>
          <h2>{student?.Name}</h2>
          <div className="info-row mt-4">
            <span className="info-label">Your Registration No. :</span>
            <span className="info-value">{student?.RegistrationNo || '202401100300263'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Your Roll No. :</span>
            <span className="info-value">{student?.RollNo || '2400291520262'}</span>
          </div>
          <div className="mt-3 text-right">
             <Link to="/settings" className="settings-link">Edit Settings</Link>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="erp-card">
          <div className="card-header-text">Attendance</div>
          <div className="attendance-chart-container">
            <div className="donut-chart">
               <div className="donut-inner">87.0%</div>
            </div>
            <div className="chart-legend">
               <span className="legend-item"><span className="dot present"></span> Present</span>
               <span className="legend-item"><span className="dot absent"></span> Absent</span>
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="erp-card performance-card">
          <div className="card-header-text">Performance</div>
          <div className="cgpa-display">
            8.03 CGPA
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="erp-card">
          <div className="card-header-text">Upcoming Classes</div>
          <div className="list-container">
            <div className="list-item">
              <div className="list-item-left">
                <strong>CS206L - THEORY</strong>
                <span className="room">Room: H-509</span>
              </div>
              <div className="list-item-right">
                <span className="date">23/04/2026</span>
                <span className="time">10:50 AM - 11:40 AM</span>
              </div>
            </div>
            <div className="list-item">
              <div className="list-item-left">
                <strong>AI309E - BLENDED</strong>
                <span className="room">Room: H-605</span>
              </div>
              <div className="list-item-right">
                <span className="date">23/04/2026</span>
                <span className="time">11:40 AM - 12:30 PM</span>
              </div>
            </div>
            <div className="list-item">
              <div className="list-item-left">
                <strong>AI104B - BLENDED</strong>
                <span className="room">Room: H-509</span>
              </div>
              <div className="list-item-right">
                <span className="date">23/04/2026</span>
                <span className="time">01:30 PM - 02:20 PM</span>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn-success">Show All</button>
          </div>
        </div>

        {/* Recent Published Results */}
        <div className="erp-card">
          <div className="card-header-text">Recent Published Results</div>
          <div className="table-responsive">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Course</th>
                  <th>Component</th>
                  <th>Grade</th>
                  <th>Result</th>
                  <th>Exam Type</th>
                </tr>
              </thead>
              <tbody>
                 {/* Empty State */}
              </tbody>
            </table>
            <div className="empty-state">
               <Search size={48} className="empty-icon" />
               <p>No Record found</p>
            </div>
          </div>
        </div>

        {/* Upcoming Examinations */}
        <div className="erp-card">
          <div className="card-header-text">Upcoming Examinations</div>
          <div className="list-container examination-list">
            <div className="exam-item">
              <strong>AI308B-BLENDED-CIE-MSE2-</strong>
              <span>23/04/2026 : 10:00 AM TO 12:00 PM</span>
            </div>
            <div className="exam-item">
              <strong>AI104B-BLENDED-CIE-MSE2-</strong>
              <span>24/04/2026 : 10:00 AM TO 12:00 PM</span>
            </div>
            <div className="exam-item">
              <strong>HS113L-THEORY-CIE-CA2-</strong>
              <span>25/04/2026 : 01:30 PM TO 03:00 PM</span>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn-success">Show All</button>
          </div>
        </div>
        
        {/* Current Registered Courses */}
        <div className="erp-card full-width">
           <div className="card-header-flex">
              <div className="card-header-text" style={{marginBottom: 0}}>Current Registered Courses</div>
              <div className="search-box">
                <input type="text" placeholder="Search" />
                <Search size={16} />
              </div>
           </div>
           <div className="table-header-dark mt-3">
              <span>S.No.</span>
              <span>Course Code</span>
              <span>Course Name</span>
              <span>Register Date</span>
           </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
