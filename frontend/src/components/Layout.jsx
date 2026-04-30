import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileWarning, FileText, LogOut, ShieldAlert } from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="GÉANT" className="sidebar-logo" />
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
            <LayoutDashboard size={20} />
            <span>Tableau de bord</span>
          </NavLink>
          
          <NavLink to="/employees" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Users size={20} />
            <span>Employés</span>
          </NavLink>
          
          <NavLink to="/declaration" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <FileWarning size={20} />
            <span>Déclarer Accident</span>
          </NavLink>
          
          <NavLink to="/accidents" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <FileText size={20} />
            <span>Dossiers Accidents</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">Gestion des Accidents de Travail</div>
          <div className="topbar-user">
            <div className="user-avatar">
              {user?.role === 'Admin' ? 'A' : 'RH'}
            </div>
            <div className="user-info">
              <span className="user-role">{user?.role || 'Utilisateur'}</span>
            </div>
          </div>
        </header>
        
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
