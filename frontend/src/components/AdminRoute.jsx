import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // FIX: Added '|| null' to prevent parsing errors on empty localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;

  // Check both if userInfo exists AND if they have admin privileges
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute;