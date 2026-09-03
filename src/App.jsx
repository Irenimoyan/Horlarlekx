import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Loader from './components/Loader';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TeamPage from './pages/TeamPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CareersPage from './pages/CareersPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import RequestQuotePage from './pages/RequestQuotePage';

// Admin Auth & Pages
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectForm from './pages/admin/AdminProjectForm';
import AdminTeam from './pages/admin/AdminTeam';
import AdminTeamForm from './pages/admin/AdminTeamForm';
import AdminMedia from './pages/admin/AdminMedia';
import AdminAdministrators from './pages/admin/AdminAdministrators';
import AdminSettings from './pages/admin/AdminSettings';

import { SpeedInsights } from '@vercel/speed-insights/react';

// Scroll to top helper on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainAppLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && isLoading && (
        <Loader onFinish={() => setIsLoading(false)} />
      )}

      <div className={isAdminRoute ? "min-h-screen bg-navy-950" : "min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-brand-orange selection:text-white"}>
        
        {/* Render public Navbar only on non-admin routes */}
        {!isAdminRoute && <Navbar />}

        <main className={isAdminRoute ? "" : "flex-grow"}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/quote" element={<RequestQuotePage />} />

            {/* Admin Authentication & Management Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/projects" element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            } />

            <Route path="/admin/projects/new" element={
              <ProtectedRoute>
                <AdminProjectForm />
              </ProtectedRoute>
            } />

            <Route path="/admin/projects/edit/:id" element={
              <ProtectedRoute>
                <AdminProjectForm />
              </ProtectedRoute>
            } />

            <Route path="/admin/team" element={
              <ProtectedRoute>
                <AdminTeam />
              </ProtectedRoute>
            } />

            <Route path="/admin/team/new" element={
              <ProtectedRoute>
                <AdminTeamForm />
              </ProtectedRoute>
            } />

            <Route path="/admin/team/edit/:id" element={
              <ProtectedRoute>
                <AdminTeamForm />
              </ProtectedRoute>
            } />

            <Route path="/admin/media" element={
              <ProtectedRoute>
                <AdminMedia />
              </ProtectedRoute>
            } />

            <Route path="/admin/administrators" element={
              <ProtectedRoute>
                <AdminAdministrators />
              </ProtectedRoute>
            } />

            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            } />

            {/* Fallback route */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        {/* Render public Footer and WhatsAppFloat only on non-admin routes */}
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <WhatsAppFloat />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SpeedInsights />
        <ScrollToTop />
        <MainAppLayout />
      </AuthProvider>
    </Router>
  );
}
