import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Employees = lazy(() => import('./pages/Employees'));
const Accidents = lazy(() => import('./pages/Accidents'));
const Declaration = lazy(() => import('./pages/Declaration'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="loading-screen">Chargement...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const LoadingFallback = () => (
  <div className="loading-screen">Chargement de la page...</div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="accidents" element={<Accidents />} />
            <Route path="declaration" element={<Declaration />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
