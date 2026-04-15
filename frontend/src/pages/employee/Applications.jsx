import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Card from '../../components/Card';
import { IndianRupee, MapPin, X, Briefcase, Calendar, Clock, AlertCircle } from 'lucide-react';

const Applications = ({ user }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (selectedApp) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedApp]);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/applications/employee/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setApps(data);
      } else {
        throw new Error('Failed to fetch applications');
      }
    } catch (err) {
      console.error('Fetch Applications Error:', err);
      // Don't set mock data, just let it fail so we can see the empty state/error
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  const closeDrawer = useCallback(() => {
    setSelectedApp(null);
  }, []);

  const getStatusBadge = (status) => {
    const map = {
      applied: { label: 'Applied', cls: 'badge-applied' },
      shortlisted: { label: 'Shortlisted', cls: 'badge-shortlisted' },
      interview: { label: 'Interview Scheduled', cls: 'badge-interview' },
      rejected: { label: 'Rejected', cls: 'badge-rejected' },
      selected: { label: 'Selected', cls: 'badge-selected' },
    };
    const info = map[status] || { label: status, cls: '' };
    return <span className={`badge ${info.cls}`}>{info.label}</span>;
  };

  const stepperSteps = ['applied', 'shortlisted', 'interview', 'selected'];

  const renderStepper = (currentStatus) => {
    if (currentStatus === 'rejected') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: '#FEF2F2', color: '#B91C1C', borderRadius: '0.75rem', border: '1px solid #FECACA' }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>This application was not moved forward.</span>
        </div>
      );
    }

    const statusIdx = stepperSteps.indexOf(currentStatus);
    const progressPct = (Math.max(statusIdx, 0) / (stepperSteps.length - 1)) * 100;

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginTop: '1rem', marginBottom: '0.5rem' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px', background: '#E2E8F0', transform: 'translateY(-50%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, width: `${progressPct}%`, height: '2px', background: '#4F46E5', transform: 'translateY(-50%)', zIndex: 0 }} />
        {stepperSteps.map((step, idx) => {
          const done = idx <= statusIdx;
          return (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', zIndex: 1, background: 'white', padding: '0 0.5rem' }}>
              <div style={{
                width: '1.5rem', height: '1.5rem', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.625rem', fontWeight: 700,
                border: `2px solid ${done ? '#4F46E5' : '#CBD5E1'}`,
                background: done ? '#4F46E5' : 'white',
                color: done ? 'white' : '#94A3B8',
              }}>
                {done ? '\u2713' : idx + 1}
              </div>
              <span style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', color: done ? '#4F46E5' : '#94A3B8' }}>
                {step === 'interview' ? 'Interview' : step}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const isOpen = selectedApp !== null;

  return (
    <>
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px)' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Applications</h1>
          <p style={{ color: '#6B7280', fontSize: '1.125rem', marginBottom: '2rem' }}>Track the status of the jobs you've applied for.</p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
          ) : apps.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' }}>No applications yet</h3>
              <p>Jobs you apply for will appear here.</p>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {apps.map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  style={{
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#4F46E5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>{app.jobs?.title}</h3>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Briefcase size={14} /> {app.jobs?.employer_name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {app.jobs?.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><IndianRupee size={14} /> {app.jobs?.salary}/mo</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>Status</span>
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Portal: Overlay + Drawer rendered directly into document.body */}
      {createPortal(
        <>
          {/* Overlay */}
          {isOpen && (
            <div
              onClick={closeDrawer}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(15, 23, 42, 0.55)',
                zIndex: 99998,
              }}
            />
          )}

          {/* Drawer */}
          {isOpen && selectedApp && (
            <div
              style={{
                position: 'fixed',
                top: 0, right: 0, bottom: 0,
                width: '450px',
                maxWidth: '100vw',
                background: 'white',
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
                borderTopLeftRadius: '1rem',
                borderBottomLeftRadius: '1rem',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #F1F5F9',
                background: '#F8FAFC',
                borderTopLeftRadius: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4338CA', background: '#EEF2FF', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', display: 'inline-block', marginBottom: '0.75rem' }}>
                    {selectedApp.jobs?.category || 'Active Job'}
                  </div>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3, marginBottom: '0.5rem' }}>{selectedApp.jobs?.title}</h2>
                  <p style={{ color: '#64748B', fontWeight: 500, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Briefcase size={15} /> {selectedApp.jobs?.employer_name}
                  </p>
                </div>
                <button
                  onClick={closeDrawer}
                  style={{
                    padding: '0.5rem',
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  <X size={18} color="#64748B" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Stepper */}
                <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontSize: '0.7rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Application Track</h3>
                  {renderStepper(selectedApp.status)}
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <InfoTile icon={<MapPin size={20} color="#94A3B8" />} label="Location" value={selectedApp.jobs?.location} />
                  <InfoTile icon={<IndianRupee size={20} color="#059669" />} label="Salary" value={`\u20b9${selectedApp.jobs?.salary}/mo`} />
                  <InfoTile icon={<Clock size={20} color="#6366F1" />} label="Job Type" value="Full-time" />
                  <InfoTile icon={<Calendar size={20} color="#D97706" />} label="Applied On" value="12 Apr 2026" />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9' }} />

                {/* Description */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>Job Description</h3>
                  <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.7, background: '#F8FAFC', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                    {selectedApp.jobs?.description || `We are actively hiring a reliable ${selectedApp.jobs?.title} to join ${selectedApp.jobs?.employer_name}. Immediate joiners preferred. Location: ${selectedApp.jobs?.location}.`}
                  </p>
                  <h4 style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.875rem', marginBottom: '0.75rem' }}>Requirements:</h4>
                  <ul style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.8, paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                    <li>Relevant prior experience in a similar role.</li>
                    <li>Verified identification (Aadhar card required).</li>
                    <li>Ability to work standard hours with punctuality.</li>
                    <li>Good communication and teamwork skills.</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '1.25rem 1.5rem',
                borderTop: '1px solid #F1F5F9',
                background: 'white',
                display: 'flex',
                gap: '0.75rem',
                borderBottomLeftRadius: '1rem',
              }}>
                <button style={{ flex: 1, padding: '0.75rem', background: '#FEF2F2', color: '#DC2626', fontWeight: 700, border: '1px solid #FECACA', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  Withdraw
                </button>
                <button style={{ flex: 1, padding: '0.75rem', background: '#4F46E5', color: 'white', fontWeight: 700, border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79,70,229,0.25)' }}>
                  Contact Employer
                </button>
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </>
  );
};

const InfoTile = ({ icon, label, value }) => (
  <div style={{
    padding: '1rem', borderRadius: '0.75rem', border: '1px solid #F1F5F9',
    background: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    display: 'flex', flexDirection: 'column', gap: '0.25rem',
  }}>
    {icon}
    <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.5rem' }}>{label}</span>
    <span style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.875rem' }}>{value}</span>
  </div>
);

export default Applications;
