import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, BookOpen, GitBranch } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const COURSE_DATA = {
  'B.Tech': ['Computer Science', 'Mechanical', 'Civil', 'Electrical', 'Electronics'],
  'M.Tech': ['AI & Data Science', 'Software Engineering', 'VLSI', 'Thermal Engineering'],
  'BBA': ['Finance', 'Marketing', 'Human Resources', 'International Business'],
  'MBA': ['Finance', 'Marketing', 'Operations', 'Business Analytics'],
  'B.Sc': ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
};

const Register = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    Course: '',
    Branch: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCourseChange = (e) => {
    const selectedCourse = e.target.value;
    setFormData({ 
      ...formData, 
      Course: selectedCourse,
      Branch: '' // Reset branch when course changes
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.Course || !formData.Branch) {
      setError('Please select both a course and a branch');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/register`, formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const availableBranches = formData.Course ? COURSE_DATA[formData.Course] : [];

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our student platform today</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <div className="input-icon"><UserPlus size={18} /></div>
            <input
              type="text"
              name="Name"
              placeholder="Full Name"
              value={formData.Name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon"><Mail size={18} /></div>
            <input
              type="email"
              name="Email"
              placeholder="Email Address"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon"><Lock size={18} /></div>
            <input
              type="password"
              name="Password"
              placeholder="Password"
              value={formData.Password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon"><BookOpen size={18} /></div>
            <select
              name="Course"
              value={formData.Course}
              onChange={handleCourseChange}
              required
              className="select-dropdown"
            >
              <option value="" disabled>Select Course</option>
              {Object.keys(COURSE_DATA).map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <div className="input-icon"><GitBranch size={18} /></div>
            <select
              name="Branch"
              value={formData.Branch}
              onChange={handleChange}
              required
              disabled={!formData.Course}
              className="select-dropdown"
            >
              <option value="" disabled>Select Branch</option>
              {availableBranches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
