import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Key } from 'lucide-react';
import Layout from './Layout';
import { COURSE_DATA } from './Register';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Settings = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [courseData, setCourseData] = useState({ Course: '', Branch: '' });
  
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [courseMsg, setCourseMsg] = useState({ type: '', text: '' });

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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/update-password`, passwordData, config);
      setPasswordMsg({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    }
  };

  const handleCourseSelectionChange = (e) => {
    setCourseData({ 
      ...courseData, 
      Course: e.target.value,
      Branch: '' 
    });
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setCourseMsg({ type: '', text: '' });
    
    if (!courseData.Course || !courseData.Branch) {
      setCourseMsg({ type: 'error', text: 'Please select both a course and a branch' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`${API_URL}/update-course`, courseData, config);
      setStudent({ ...student, Course: res.data.course, Branch: res.data.branch });
      setCourseMsg({ type: 'success', text: 'Course & Branch updated successfully' });
      setCourseData({ Course: '', Branch: '' });
    } catch (err) {
      setCourseMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update course' });
    }
  };

  if (loading) return <div className="loading">Loading settings...</div>;

  const availableBranches = courseData.Course ? COURSE_DATA[courseData.Course] : [];

  return (
    <Layout student={student}>
      <div className="erp-grid">
        {/* Update Course & Branch */}
        <div className="erp-card">
          <div className="card-header-flex">
            <div className="card-header-text" style={{marginBottom: 0}}>
              <BookOpen size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
              Change Program
            </div>
          </div>
          <div className="mt-4">
            {courseMsg.text && (
              <div className={`message ${courseMsg.type}`}>{courseMsg.text}</div>
            )}
            <div className="info-row mb-4">
              <span className="info-label">Current Program:</span>
              <span className="info-value">{student?.Course} - {student?.Branch}</span>
            </div>
            <form onSubmit={handleCourseSubmit} className="course-form">
              <div className="input-group">
                <select
                  value={courseData.Course}
                  onChange={handleCourseSelectionChange}
                  required
                  className="select-dropdown no-icon"
                >
                  <option value="" disabled>Select New Course</option>
                  {Object.keys(COURSE_DATA).map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div className="input-group mt-3">
                <select
                  value={courseData.Branch}
                  onChange={(e) => setCourseData({ ...courseData, Branch: e.target.value })}
                  required
                  disabled={!courseData.Course}
                  className="select-dropdown no-icon"
                >
                  <option value="" disabled>Select New Branch</option>
                  {availableBranches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary mt-3 w-100">Update Program</button>
            </form>
          </div>
        </div>

        {/* Update Password */}
        <div className="erp-card">
          <div className="card-header-flex">
            <div className="card-header-text" style={{marginBottom: 0}}>
              <Key size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/>
              Update Password
            </div>
          </div>
          <div className="mt-4">
            {passwordMsg.text && (
              <div className={`message ${passwordMsg.type}`}>{passwordMsg.text}</div>
            )}
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  required
                />
              </div>
              <div className="input-group mt-3">
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-primary mt-3 w-100">Change Password</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
