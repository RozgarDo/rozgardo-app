import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import EmployeeHome from './pages/employee/Home';
import Profile from './pages/Profile';
import JobDetails from './pages/employee/JobDetails';
import Applications from './pages/employee/Applications';
import AllJobs from './pages/employee/AllJobs';
import EmployerDashboard from './pages/employer/Dashboard';
import PostJob from './pages/employer/PostJob';
import AdminDashboard from './pages/admin/Dashboard';
import Landing from './pages/Landing';
import TestPage from './pages/TestPage';
import Settings from './pages/Settings';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [user, setUser] = useState(null);

  // Mock checking local storage for logged in user at startup
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = '/login';
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      console.log("Redirecting to login: User not authenticated");
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      console.warn(`Access Denied. User role '${user.role}' lacks permission for this route. Allowed roles: ${allowedRoles.join(', ')}`);
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
<Route path="/home" element={<Landing user={user} />} />

            {/* Root - Landing (Coming Soon) or redirect for admin */}
            <Route path="/" element={user?.role === 'admin' ? <Navigate to="/admin" /> : <Landing user={user} />} />
            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['employee', 'employer', 'admin']}>
                <Profile user={user} setUser={handleLogin} />
              </ProtectedRoute>
            } />
            <Route path="/profile-setup" element={
              <ProtectedRoute allowedRoles={['employee', 'employer', 'admin']}>
                <Profile user={user} setUser={handleLogin} />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['employee', 'employer', 'admin']}>
                <Settings user={user} />
              </ProtectedRoute>
            } />
            <Route path="/jobs/:id" element={
              <ProtectedRoute allowedRoles={['employee']}>
                <JobDetails user={user} />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute allowedRoles={['employee']}>
                <Applications user={user} />
              </ProtectedRoute>
            } />
            <Route path="/all-jobs" element={
              <ProtectedRoute allowedRoles={['employee']}>
                <AllJobs user={user} />
              </ProtectedRoute>
            } />

            {/* Employer Routes */}
            <Route path="/employer" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerDashboard user={user} />
              </ProtectedRoute>
            } />
            <Route path="/employer/post-job" element={
              <ProtectedRoute allowedRoles={['employer']}>
                <PostJob user={user} />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard user={user} />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
