import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';

// --- Lazy Loading (Code Splitting) ---
const Home = lazy(() => import('./pages/Home'));
const Destinations = lazy(() => import('./pages/Destinations'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const TourDetail = lazy(() => import('./pages/TourDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostDetail = lazy(() => import('./pages/BlogPost'));
const Tours = lazy(() => import('./pages/Tours'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminDestinations = lazy(() => import('./pages/AdminDestinations'));
const AdminTours = lazy(() => import('./pages/AdminTours'));
const AdminBlog = lazy(() => import('./pages/AdminBlog'));
const AdminBlogEdit = lazy(() => import('./pages/AdminBlogEdit'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminLeads = lazy(() => import('./pages/AdminLeads'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminTourEdit = lazy(() => import('./pages/AdminTourEdit'));

// Minimal loading fallback for lazy routes
const PageLoader = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <Router>
            <Layout>
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
            </Layout>
      </Router>
      </CurrencyProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
