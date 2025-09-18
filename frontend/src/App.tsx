import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import PurchasePage from './pages/PurchasePage';
import PaymentConfirmationPage from './pages/PaymentConfirmationPage';
import ConsultationPage from './pages/ConsultationPage';
import WinnersPage from './pages/WinnersPage';
import TermsPage from './pages/TermsPage';

// Admin
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import ActivitiesManagement from './admin/pages/ActivitiesManagement';
import OrdersManagement from './admin/pages/OrdersManagement';
import BankAccountsManagement from './admin/pages/BankAccountsManagement';
import WinnersManagement from './admin/pages/WinnersManagement';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="activities" element={<ActivitiesManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="bank-accounts" element={<BankAccountsManagement />} />
            <Route path="winners" element={<WinnersManagement />} />
            <Route path="settings" element={<div>Configuración (Próximamente)</div>} />
          </Route>
          
          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/comprar/:rifaId" element={<PurchasePage />} />
                  <Route path="/pago-confirmacion/:orderNumber" element={<PaymentConfirmationPage />} />
                  <Route path="/consultar" element={<ConsultationPage />} />
                  <Route path="/ganadores" element={<WinnersPage />} />
                  <Route path="/terminos" element={<TermsPage />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppFloat />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
