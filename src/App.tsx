import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import TourDetail from './pages/TourDetail';
import Wishlist from './pages/Wishlist';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPost';
import Tours from './pages/Tours';
import CollectionPage from './pages/CollectionPage';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminDestinations from './pages/AdminDestinations';
import AdminTours from './pages/AdminTours';
import AdminBlog from './pages/AdminBlog';
import AdminBlogEdit from './pages/AdminBlogEdit';
import AdminSettings from './pages/AdminSettings';
import AdminLeads from './pages/AdminLeads';
import AdminLogin from './pages/AdminLogin';
import AdminTourEdit from './pages/AdminTourEdit';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:id" element={<TourDetail />} />
            <Route path="/coleccion/:categorySlug" element={<CollectionPage />} />
            <Route path="/favoritos" element={<Wishlist />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="destinations" element={<AdminDestinations />} />
              <Route path="tours" element={<AdminTours />} />
              <Route path="tours/new" element={<AdminTourEdit />} />
              <Route path="tours/:id" element={<AdminTourEdit />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="blog/new" element={<AdminBlogEdit />} />
              <Route path="blog/:id" element={<AdminBlogEdit />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="leads" element={<AdminLeads />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
      </CurrencyProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
