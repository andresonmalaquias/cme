import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Páginas
import Login from '../pages/Login/Login.js';
import User from '../pages/User/User.js';
import Material from '../pages/Material/Material.js';

import Nav from '../components/Nav/Nav.js';

// Componente para rotas públicas
const PublicRoute = ({ children }) => {
  return children;
};

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  // Lógica de autenticação será adicionada depois
  const isAuthenticated = true; // Temporário para teste
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const userPermissions = ['user_access', 'material_access'];


const AppRoutes = () => {
  return (
    <Router>
      <Nav userPermissions={userPermissions} />
      <Routes>
        {/* Rota Padrão (Login) */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rota Pública */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Rotas Protegidas */}
        <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/material" element={<ProtectedRoute><Material /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
