import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import ResidentDashboard from './pages/ResidentDashboard';
import Complaints from './pages/Complaints';
import Notices from './pages/Notices';
import Payments from './pages/Payments';
import Visitors from './pages/Visitors';
import Events from './pages/Events';
import Residents from './pages/Residents';
import Staff from './pages/Staff';
import Flats from './pages/Flats';
import Profile from './pages/Profile';
import LostFound from './pages/LostFound';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Landing />;
  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/resident/dashboard'} replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/resident/dashboard" element={<ResidentDashboard />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/visitors" element={<Visitors />} />
              <Route path="/events" element={<Events />} />
              <Route path="/residents" element={<ProtectedRoute adminOnly><Residents /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute adminOnly><Staff /></ProtectedRoute>} />
              <Route path="/flats" element={<ProtectedRoute adminOnly><Flats /></ProtectedRoute>} />
              <Route path="/lost-found" element={<LostFound />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
