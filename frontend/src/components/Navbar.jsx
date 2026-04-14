import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, UserCircle, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 shadow-sm">
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="flex items-center gap-2">
          <Briefcase className="text-primary" size={28} />
          <span className="font-bold text-xl tracking-tight">Rozgar<span className="text-primary">Do</span></span>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex gap-4 font-medium text-sm">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              {user.role === 'employee' && (
                <>
                  <Link to="/applications" className="hover:text-primary transition-colors">Applications</Link>
                </>
              )}
              {user.role === 'employer' && (
                <>
                  <Link to="/employer" className="hover:text-primary transition-colors">Dashboard</Link>
                  <Link to="/employer/post-job" className="hover:text-primary transition-colors">Post Job</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-primary transition-colors">Dashboard</Link>
              )}
            </div>
            
            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                <Link to="/profile" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <UserCircle className="text-gray-400" size={20} />
                  <span className="text-sm font-semibold">{user.name || user.phone}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-danger transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
          </div>
        ) : location.pathname !== '/login' && location.pathname !== '/home' && location.pathname !== '/test' ? (
           <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
              Sign In
           </Link>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;

