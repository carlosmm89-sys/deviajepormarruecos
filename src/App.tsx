import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import TourDetail from './pages/TourDetail';
import AdminRoute from './components/AdminRoute';
import AdminDestinations from './pages/AdminDestinations';
import AdminTours from './pages/AdminTours';
import AdminSettings from './pages/AdminSettings';
import AdminLeads from './pages/AdminLeads';
import AdminLogin from './pages/AdminLogin';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/tours/:id" element={<TourDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDestinations />} />
              <Route path="destinations" element={<AdminDestinations />} />
              <Route path="tours" element={<AdminTours />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="leads" element={<AdminLeads />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
