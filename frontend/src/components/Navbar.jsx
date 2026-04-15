import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, UserCircle, LogOut, Menu, X, User, Settings, Shield, CreditCard, ChevronDown } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const getNavLinks = () => {
    if (!user) return [];
    if (user.role === 'employee') {
      return [
        { to: '/', label: 'Home' },
        { to: '/all-jobs', label: 'All Jobs' },
        { to: '/applications', label: 'My Applications' },
      ];
    } else if (user.role === 'employer') {
      return [
        { to: '/employer', label: 'Dashboard' },
        { to: '/employer/post-job', label: 'Post Job' },
      ];
    } else if (user.role === 'admin') {
      return [{ to: '/admin', label: 'Dashboard' }];
    }
    return [];
  };

  const navLinks = getNavLinks();

  const getRoleLabel = () => {
    if (!user) return '';
    if (user.role === 'employee') return 'Job Seeker';
    if (user.role === 'employer') return 'Employer';
    if (user.role === 'admin') return 'Administrator';
    return user.role;
  };

  const navLinkStyle = (path) => ({
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: isActive(path) ? 700 : 500,
    color: isActive(path) ? '#4F46E5' : '#374151',
    borderBottom: isActive(path) ? '2px solid #4F46E5' : '2px solid transparent',
    paddingBottom: '0.25rem',
    transition: 'color 0.2s, border-color 0.2s',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  const dropdownItemStyle = {
    display: 'flex', alignItems: 'center', gap: '0.625rem',
    padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
    fontSize: '0.85rem', fontWeight: 500, color: '#374151',
    cursor: 'pointer', textDecoration: 'none',
    transition: 'background 0.15s', border: 'none',
    background: 'none', width: '100%', textAlign: 'left',
    fontFamily: 'inherit',
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase color="#4F46E5" size={26} />
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#0F172A' }}>
            Rozgar<span style={{ color: '#4F46E5' }}>Do</span>
          </span>
        </Link>

        {/* Right side */}
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>

              {/* Desktop nav links */}
              <div className="navbar-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={navLinkStyle(link.to)}
                    onMouseEnter={(e) => {
                      if (!isActive(link.to)) {
                        e.currentTarget.style.color = '#4F46E5';
                        e.currentTarget.style.borderBottomColor = '#C7D2FE';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(link.to)) {
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.borderBottomColor = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="navbar-desktop-links" style={{ width: '1px', height: '28px', background: '#E5E7EB' }} />

              {/* Profile trigger + dropdown */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdownOpen(prev => !prev)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: profileDropdownOpen ? '#EEF2FF' : '#F8FAFC',
                    padding: '0.375rem 0.75rem 0.375rem 0.5rem',
                    borderRadius: '9999px',
                    border: `1px solid ${profileDropdownOpen ? '#C7D2FE' : '#E5E7EB'}`,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!profileDropdownOpen) {
                      e.currentTarget.style.background = '#EEF2FF';
                      e.currentTarget.style.borderColor = '#C7D2FE';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!profileDropdownOpen) {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }
                  }}
                >
                  {/* Avatar circle */}
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.75rem',
                  }}>
                    {(user.name || user.phone || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="navbar-desktop-links" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap', display: 'inline' }}>
                    {user.name || user.phone}
                  </span>
                  <ChevronDown size={14} color="#94A3B8" style={{
                    transition: 'transform 0.2s',
                    transform: profileDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  }} />
                </button>

                {/* Dropdown */}
                {profileDropdownOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
                    width: '240px', background: 'white',
                    borderRadius: '0.75rem', border: '1px solid #E5E7EB',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.04)',
                    padding: '0.5rem',
                    zIndex: 200,
                    animation: 'dropdownFade 150ms ease-out',
                  }}>

                    {/* User info header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem', marginBottom: '0.25rem',
                      borderBottom: '1px solid #F1F5F9', paddingBottom: '0.875rem',
                    }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '1rem', flexShrink: 0,
                      }}>
                        {(user.name || user.phone || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.name || user.phone}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 500 }}>
                          {getRoleLabel()}
                        </div>
                      </div>
                    </div>

                    {/* Section 1 */}
                    <Link to="/profile" style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <User size={16} color="#64748B" /> My Profile
                    </Link>
                    <Link to="/settings" style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <Settings size={16} color="#64748B" /> Settings
                    </Link>

                    {/* Divider */}
                    <div style={{ height: '1px', background: '#F1F5F9', margin: '0.375rem 0.5rem' }} />

                    {/* Section 2 */}
                    <button style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <Shield size={16} color="#64748B" /> Security
                    </button>
                    <button style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <CreditCard size={16} color="#64748B" /> Billing Plan
                    </button>

                    {/* Divider */}
                    <div style={{ height: '1px', background: '#F1F5F9', margin: '0.375rem 0.5rem' }} />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      style={{
                        ...dropdownItemStyle,
                        color: '#DC2626',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={16} color="#DC2626" /> Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="navbar-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  display: 'none', background: 'none', border: 'none',
                  cursor: 'pointer', padding: '0.25rem', color: '#374151',
                }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile dropdown */}
            {mobileMenuOpen && (
              <div className="navbar-mobile-menu" style={{
                position: 'absolute', top: '64px', left: 0, right: 0,
                background: 'white', borderBottom: '1px solid #E5E7EB',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '1rem 1.5rem',
                display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 99,
              }}>
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      textDecoration: 'none', fontSize: '0.95rem',
                      fontWeight: isActive(link.to) ? 700 : 500,
                      color: isActive(link.to) ? '#4F46E5' : '#374151',
                      padding: '0.6rem 0', borderBottom: '1px solid #F1F5F9',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}
                  style={{ textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, color: '#374151', padding: '0.6rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #F1F5F9' }}
                >
                  <UserCircle size={18} color="#94A3B8" /> My Profile
                </Link>
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  style={{ ...dropdownItemStyle, color: '#DC2626', padding: '0.6rem 0', borderRadius: 0 }}
                >
                  <LogOut size={16} color="#DC2626" /> Logout
                </button>
              </div>
            )}
          </>
        ) : (
          location.pathname !== '/login' && location.pathname !== '/home' && location.pathname !== '/test' ? (
            <Link to="/login" style={{ textDecoration: 'none', fontWeight: 600, color: '#4F46E5', fontSize: '0.9rem' }}>
              Sign In
            </Link>
          ) : null
        )}
      </div>

      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 768px) {
          .navbar-desktop-links { display: none !important; }
          .navbar-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .navbar-mobile-menu { display: none !important; }
          .navbar-mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
