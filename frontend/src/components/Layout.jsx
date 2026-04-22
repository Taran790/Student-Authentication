import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  CalendarCheck, 
  Settings, 
  ClipboardList, 
  Calculator, 
  ListTodo, 
  Bed, 
  LogOut,
  Home,
  Bell,
  Menu,
  X
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, text, to, active }) => (
  <Link to={to} className={`sidebar-item ${active ? 'active' : ''}`}>
    <Icon size={20} className="sidebar-icon" />
    <span>{text}</span>
    <span className="chevron">›</span>
  </Link>
);

const Layout = ({ children, student }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, text: 'Dashboard', to: '/dashboard' },
    { icon: FolderOpen, text: 'Admission', to: '#' },
    { icon: CalendarCheck, text: 'Attendance', to: '#' },
    { icon: Settings, text: 'Course', to: '#' },
    { icon: ClipboardList, text: 'Exam', to: '#' },
    { icon: Calculator, text: 'Finance', to: '#' },
    { icon: ListTodo, text: 'Feedback Form', to: '#' },
    { icon: Bed, text: 'Hostel Management', to: '#' },
    { icon: Settings, text: 'My Registered Courses', to: '#' },
  ];

  return (
    <div className="erp-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {/* Logo Placeholder */}
          <div className="logo-placeholder">
            <span className="logo-text">UNIVERSITY</span>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <div className="sidebar-nav">
          {navItems.map((item, index) => (
            <SidebarItem 
              key={index} 
              icon={item.icon} 
              text={item.text} 
              to={item.to}
              active={location.pathname === item.to}
            />
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="topbar-logo">
              <span className="brand-primary">KIET</span>
              <span className="brand-secondary">GROUP OF INSTITUTIONS</span>
            </div>
          </div>
          
          <div className="topbar-right">
            <button className="icon-btn"><Home size={20} /></button>
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="user-profile">
              <span className="welcome-text">Welcome <span className="username">{student?.Name?.toUpperCase()}</span></span>
              <div className="avatar">
                {student?.Name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <div className="page-header">
            <h2>{navItems.find(item => item.to === location.pathname)?.text || 'Dashboard'}</h2>
          </div>
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

export default Layout;
