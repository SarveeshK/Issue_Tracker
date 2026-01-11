import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();

    // In a real app complexity, we might wait for "loading" state of AuthContext
    // But for this scaffold, simple check is consistent.

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
