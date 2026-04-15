import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Globe, MapPin, Eye, EyeOff, Trash2, UserX,
  ArrowLeft, MessageSquare, Mail, Smartphone, Save, Check
} from 'lucide-react';

const Settings = ({ user }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    sms: true,
    whatsapp: true,
    email: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'English',
    jobAlerts: 'Daily',
    locationPref: user?.location || '',
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    hideContact: false,
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // Mock save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Styles
  const cardStyle = {
    background: 'white', borderRadius: '1rem', border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '1.5rem', marginBottom: '1.5rem',
  };
  const sectionTitleStyle = {
    fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
  };
  const rowStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.875rem 0', borderBottom: '1px solid #F8FAFC',
  };
  const rowLabelStyle = {
    display: 'flex', alignItems: 'center', gap: '0.625rem',
  };
  const rowTextStyle = { fontSize: '0.9rem', fontWeight: 600, color: '#1E293B' };
  const rowSubStyle = { fontSize: '0.75rem', color: '#94A3B8', fontWeight: 400, marginTop: '0.125rem' };
  const selectStyle = {
    padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem',
    fontSize: '0.85rem', background: '#F8FAFC', fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
  };
  const inputStyle = {
    padding: '0.5rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem',
    fontSize: '0.85rem', background: '#F8FAFC', fontFamily: 'inherit', outline: 'none', width: '180px',
  };
  const dangerBtnStyle = {
    padding: '0.6rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.85rem',
    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
  };

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px)' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#4F46E5', fontWeight: 600, fontSize: '0.875rem',
          marginBottom: '1rem', padding: 0, fontFamily: 'inherit',
        }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>Settings</h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Manage your notifications, preferences, and account.</p>
      </div>

      {/* Success banner */}
      {saved && (
        <div style={{
          padding: '0.875rem 1rem', borderRadius: '0.75rem', marginBottom: '1.5rem',
          fontSize: '0.875rem', fontWeight: 600, background: '#F0FDF4', color: '#166534',
          border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <Check size={16} /> Settings saved successfully!
        </div>
      )}

      {/* === NOTIFICATION SETTINGS === */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}><Bell size={20} color="#4F46E5" /> Notification Settings</h3>

        <div style={rowStyle}>
          <div style={rowLabelStyle}>
            <Smartphone size={18} color="#64748B" />
            <div><div style={rowTextStyle}>SMS Alerts</div><div style={rowSubStyle}>Receive job alerts via text message</div></div>
          </div>
          <Toggle checked={notifications.sms} onChange={() => toggleNotification('sms')} />
        </div>

        <div style={rowStyle}>
          <div style={rowLabelStyle}>
            <MessageSquare size={18} color="#25D366" />
            <div><div style={rowTextStyle}>WhatsApp Alerts</div><div style={rowSubStyle}>Get updates on WhatsApp</div></div>
          </div>
          <Toggle checked={notifications.whatsapp} onChange={() => toggleNotification('whatsapp')} />
        </div>

        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <div style={rowLabelStyle}>
            <Mail size={18} color="#64748B" />
            <div><div style={rowTextStyle}>Email Notifications</div><div style={rowSubStyle}>Weekly job digest and updates</div></div>
          </div>
          <Toggle checked={notifications.email} onChange={() => toggleNotification('email')} />
        </div>
      </div>

      {/* === PREFERENCES === */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}><Globe size={20} color="#4F46E5" /> Preferences</h3>

        <div style={rowStyle}>
          <div style={rowLabelStyle}>
            <Globe size={18} color="#64748B" />
            <div><div style={rowTextStyle}>Language</div><div style={rowSubStyle}>App display language</div></div>
          </div>
          <select value={preferences.language} onChange={e => setPreferences(p => ({ ...p, language: e.target.value }))} style={selectStyle}>
            <option>English</option><option>Hindi</option><option>Marathi</option><option>Bengali</option><option>Tamil</option>
          </select>
        </div>

        <div style={rowStyle}>
          <div style={rowLabelStyle}>
            <Bell size={18} color="#64748B" />
            <div><div style={rowTextStyle}>Job Alert Frequency</div><div style={rowSubStyle}>How often you receive job recommendations</div></div>
          </div>
          <select value={preferences.jobAlerts} onChange={e => setPreferences(p => ({ ...p, jobAlerts: e.target.value }))} style={selectStyle}>
            <option>Instant</option><option>Daily</option><option>Weekly</option><option>Never</option>
          </select>
        </div>

        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <div style={rowLabelStyle}>
            <MapPin size={18} color="#64748B" />
            <div><div style={rowTextStyle}>Location Preference</div><div style={rowSubStyle}>Preferred job search area</div></div>
          </div>
          <input
            value={preferences.locationPref}
            onChange={e => setPreferences(p => ({ ...p, locationPref: e.target.value }))}
            placeholder="e.g., Mumbai"
            style={inputStyle}
          />
        </div>
      </div>

      {/* === PRIVACY SETTINGS === */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}><Eye size={20} color="#4F46E5" /> Privacy Settings</h3>

        <div style={rowStyle}>
          <div style={rowLabelStyle}>
            <Eye size={18} color="#64748B" />
            <div><div style={rowTextStyle}>Show Profile to Employers</div><div style={rowSubStyle}>Employers can discover your profile</div></div>
          </div>
          <Toggle checked={privacy.showProfile} onChange={() => togglePrivacy('showProfile')} />
        </div>

        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <div style={rowLabelStyle}>
            <EyeOff size={18} color="#64748B" />
            <div><div style={rowTextStyle}>Hide Contact Details</div><div style={rowSubStyle}>Phone and email hidden from listings</div></div>
          </div>
          <Toggle checked={privacy.hideContact} onChange={() => togglePrivacy('hideContact')} />
        </div>
      </div>

      {/* === ACCOUNT SETTINGS === */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}><UserX size={20} color="#DC2626" /> Account Settings</h3>

        <div style={rowStyle}>
          <div style={rowLabelStyle}>
            <UserX size={18} color="#64748B" />
            <div><div style={rowTextStyle}>Deactivate Account</div><div style={rowSubStyle}>Temporarily hide your account. You can reactivate anytime.</div></div>
          </div>
          <button
            style={{ ...dangerBtnStyle, background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FDE68A'}
            onMouseLeave={e => e.currentTarget.style.background = '#FEF3C7'}
          >
            Deactivate
          </button>
        </div>

        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <div style={rowLabelStyle}>
            <Trash2 size={18} color="#DC2626" />
            <div><div style={rowTextStyle}>Delete Account</div><div style={rowSubStyle}>Permanently delete all your data. This cannot be undone.</div></div>
          </div>
          <button
            style={{ ...dangerBtnStyle, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
            onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Global Save */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{
          padding: '0.7rem 1.5rem', background: 'white', color: '#374151',
          border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontWeight: 600,
          fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Cancel
        </button>
        <button onClick={handleSave} style={{
          padding: '0.7rem 1.75rem', background: '#4F46E5', color: 'white',
          border: 'none', borderRadius: '0.5rem', fontWeight: 700,
          fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          boxShadow: '0 4px 12px rgba(79,70,229,0.2)',
        }}>
          <Save size={16} /> Save Settings
        </button>
      </div>
    </div>
  );
};

// Toggle switch component
const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    style={{
      width: '44px', height: '24px', borderRadius: '12px',
      background: checked ? '#4F46E5' : '#CBD5E1',
      border: 'none', cursor: 'pointer', position: 'relative',
      transition: 'background 0.2s', flexShrink: 0,
    }}
  >
    <div style={{
      width: '18px', height: '18px', borderRadius: '50%', background: 'white',
      position: 'absolute', top: '3px',
      left: checked ? '23px' : '3px',
      transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    }} />
  </button>
);

export default Settings;
