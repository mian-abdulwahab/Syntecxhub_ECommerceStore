import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  return userInfo && userInfo.isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute;