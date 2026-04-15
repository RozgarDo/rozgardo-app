import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus, Phone, Lock, Mail } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' or 'password'
  const [otpSent, setOtpSent] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Route after login based on role constraints
  const routeUser = (user) => {
      onLogin(user);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'employer') navigate('/employer');
      else navigate(user.name ? '/' : '/profile-setup');
  };

  const handleSendOtp = async () => {
     setError('');
     setMessage('');
     try {
       const res = await fetch('http://localhost:5001/api/auth/send-otp', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ phone: loginId })
       });
       if (res.ok) {
           const data = await res.json();
           setOtpSent(true);
           setMessage(data.message);
           setTimeLeft(30);
       } else {
           if (res.status === 404) {
               setError('Mobile number not found. Please register.');
               setIsRegistering(true);
           } else {
               const data = await res.json();
               throw new Error(data.message || 'Failed to send OTP');
           }
       }
     } catch (err) {
       console.error(err);
       setError('Login service unavailable fallback. Mocking OTP.');
       setOtpSent(true);
       setMessage('OTP Sent. Use 123456');
       setTimeLeft(30);
     }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    let finalOtp = Array.isArray(otp) ? otp.join('') : otp;

    try {
      const endpoint = isRegistering ? 'http://localhost:5001/api/auth/register' : 'http://localhost:5001/api/auth/login';
      let body = isRegistering 
          ? { phone: loginId, role, name: '', skills: '', location: '', password } 
          : { loginId, type: authMethod, password, otp: finalOtp };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Authentication failed');
      }

      routeUser(data.user);
      
      } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'Login failed. Please check your credentials or network.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  if (isRegistering) {
     return (
        <div className="login-page-container">
          <div className="login-card">
            <div className="login-header">
                <div className="login-icon-container">
                   <UserPlus size={24} />
                </div>
                <h1 className="login-title">Create Account</h1>
                <p className="login-subtitle">Join RozgarDo today</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="login-form-group">
                   <label className="login-label">Mobile Number</label>
                   <div className="login-input-wrapper">
                      <Phone className="login-input-icon" />
                      <input 
                         type="tel" 
                         className={`login-input ${error && !loginId ? 'error' : ''}`}
                         placeholder="+91..."
                         value={loginId}
                         onChange={(e) => setLoginId(e.target.value)}
                         required
                      />
                   </div>
                </div>
                
                <div className="login-form-group">
                   <label className="login-label">Create Password (Optional)</label>
                   <div className="login-input-wrapper">
                      <Lock className="login-input-icon" />
                      <input 
                         type="password"
                         className="login-input"
                         placeholder="Enter secure password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                      />
                   </div>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                   <label className="text-xs font-semibold text-gray-700">I am a...</label>
                   <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                         <input type="radio" name="role" value="employee" checked={role === 'employee'} onChange={(e) => setRole(e.target.value)} className="accent-primary" /> Looking for Job
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                         <input type="radio" name="role" value="employer" checked={role === 'employer'} onChange={(e) => setRole(e.target.value)} className="accent-primary" /> Hiring
                      </label>
                   </div>
                </div>

                {error && <div className="login-message error">{error}</div>}
                
                <button type="submit" className="login-btn-submit">Register</button>
                
                <p className="login-footer-text">
                   Already have an account? 
                   <button type="button" className="login-register-link" onClick={() => setIsRegistering(false)}>Login</button>
                </p>
            </form>
          </div>
        </div>
     );
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
            <div className="login-icon-container">
               <ShieldCheck size={28} />
            </div>
            <h1 className="login-title">Login</h1>
            <p className="login-subtitle">Access your RozgarDo account</p>
        </div>

        {/* Auth Method Tabs */}
        <div className="login-toggle-container">
           <button 
              type="button"
              className={`login-toggle-btn ${authMethod === 'otp' ? 'active' : 'inactive'}`}
              onClick={() => { setAuthMethod('otp'); setOtpSent(false); setError(''); setMessage(''); setOtp(['','','','','','']); }}
           >
              Login via OTP
           </button>
           <button 
              type="button"
              className={`login-toggle-btn ${authMethod === 'password' ? 'active' : 'inactive'}`}
              onClick={() => { setAuthMethod('password'); setError(''); setMessage(''); }}
           >
              Login via Password
           </button>
        </div>

        <form onSubmit={authMethod === 'otp' && !otpSent ? (e) => { e.preventDefault(); handleSendOtp(); } : handleSubmit} className="flex flex-col gap-3 form-fade-enter">
          
          <div className="login-form-group">
             <label className="login-label">
                {authMethod === 'otp' ? "Mobile Number" : "Mobile / Email ID"}
             </label>
             <div className="login-input-wrapper">
                {authMethod === 'otp' ? (
                   <Phone className="login-input-icon" />
                ) : (
                   <Mail className="login-input-icon" />
                )}
                <input 
                   type={authMethod === 'otp' ? "tel" : "text"}
                   className={`login-input ${error && !(Array.isArray(otp) ? otp.join('') : '') ? 'error' : ''}`}
                   placeholder={authMethod === 'otp' ? "+91..." : "Enter Mobile or Email"}
                   value={loginId}
                   onChange={(e) => setLoginId(e.target.value)}
                   disabled={otpSent}
                   required
                />
             </div>
          </div>

          {authMethod === 'password' && (
             <div className="login-form-group form-fade-enter">
                <label className="login-label">Password</label>
                <div className="login-input-wrapper">
                   <Lock className="login-input-icon" />
                   <input 
                      type="password"
                      className="login-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                   />
                </div>
             </div>
          )}

          {authMethod === 'otp' && otpSent && (
             <div className="login-form-group form-fade-enter">
                <label className="login-label">Enter OTP</label>
                <div className="otp-inputs-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => otpRefs.current[index] = el}
                      type="text"
                      maxLength={1}
                      className="otp-box"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                <div className="resend-text-container">
                  Didn't receive OTP?
                  <button 
                    type="button" 
                    className="resend-link" 
                    onClick={handleSendOtp}
                    disabled={timeLeft > 0}
                  >
                    {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend'}
                  </button>
                </div>
             </div>
          )}

          {message && <div className="login-message success mt-1">{message}</div>}
          {error && <div className="login-message error mt-1">{error}</div>}

          <button type="submit" className="login-btn-submit">
            {authMethod === 'otp' ? (otpSent ? 'Verify & Login' : 'Get OTP') : 'Login'}
          </button>

          <p className="login-footer-text">
             New to RozgarDo? 
             <button type="button" className="login-register-link" onClick={() => setIsRegistering(true)}>
                Register for Free
             </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
