import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AppNavbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar browse-navbar">
      <Link to="/browse" className="auth-logo">
        ▶ StreamNova
      </Link>
      <div className="nav-buttons">
        <Link to="/browse" className="nav-link">
          Accueil
        </Link>
        <Link to="/profile" className="nav-link">
          Profil
        </Link>
        <button type="button" onClick={handleLogout} className="btn-logout">
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default AppNavbar;
