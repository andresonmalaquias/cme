import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './Nav.css';

const Nav = ({ userPermissions }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = AuthService.getAccessToken();
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login'); 
  };

  return (
    <nav className="nav">
      <ul className="nav-list">
        {/* Rota para Usuários - Apenas para quem tem permissão */}
        {userPermissions?.includes('user_access') && (
          <li className="nav-item">
            <Link to="/user" className="nav-link">Usuários</Link>
          </li>
        )}

        {/* Rota para Materiais - Apenas para quem tem permissão */}
        {userPermissions?.includes('material_access') && (
          <li className="nav-item">
            <Link to="/material" className="nav-link">Materiais</Link>
          </li>
        )}

        {isLoggedIn && (
          <li className="nav-item logout">
            <button className="nav-link logout-button" onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
