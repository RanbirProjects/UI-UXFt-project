import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BuyerOnboarding from './pages/onboarding/BuyerOnboarding';
import SellerOnboarding from './pages/onboarding/SellerOnboarding';
import Dashboard from './pages/Dashboard';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import BuyerProfile from './pages/buyer/BuyerProfile';
import SellerProfile from './pages/seller/SellerProfile';
import Matches from './pages/Matches';
import Deals from './pages/Deals';
import Settings from './pages/Settings';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={<Layout />}>
        <Route path="/onboarding/buyer" element={
          user && user.userType === 'buyer' && !user.onboardingCompleted 
            ? <BuyerOnboarding /> 
            : <Navigate to="/dashboard" />
        } />
        <Route path="/onboarding/seller" element={
          user && user.userType === 'seller' && !user.onboardingCompleted 
            ? <SellerOnboarding /> 
            : <Navigate to="/dashboard" />
        } />
        
        <Route path="/dashboard" element={
          user ? <Dashboard /> : <Navigate to="/login" />
        } />
        
        <Route path="/buyer" element={
          user && user.userType === 'buyer' ? <BuyerDashboard /> : <Navigate to="/dashboard" />
        } />
        <Route path="/seller" element={
          user && user.userType === 'seller' ? <SellerDashboard /> : <Navigate to="/dashboard" />
        } />
        
        <Route path="/profile" element={
          user ? (
            user.userType === 'buyer' ? <BuyerProfile /> : <SellerProfile />
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/matches" element={
          user ? <Matches /> : <Navigate to="/login" />
        } />
        
        <Route path="/deals" element={
          user ? <Deals /> : <Navigate to="/login" />
        } />
        
        <Route path="/settings" element={
          user ? <Settings /> : <Navigate to="/login" />
        } />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
