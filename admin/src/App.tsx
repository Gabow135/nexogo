import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ActivitiesManagement from './pages/ActivitiesManagement';
import OrdersManagement from './pages/OrdersManagement';
import LuckyNumbersView from './pages/LuckyNumbersView';
import WinnersManagement from './pages/WinnersManagement';
import BankAccountsManagement from './pages/BankAccountsManagement';
import './App.css';

// Protected Route component
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AdminLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="activities" element={<ActivitiesManagement />} />
                <Route path="activities/:id/lucky-numbers" element={<LuckyNumbersView />} />
                <Route path="orders" element={<OrdersManagement />} />
                <Route path="winners" element={<WinnersManagement />} />
                <Route path="banks" element={<BankAccountsManagement />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;