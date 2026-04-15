import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircle, Pencil, X, MapPin, Phone, Mail, Briefcase,
  FileText, Star, ChevronDown, Loader2, Check, Camera, Trash2, Plus
} from 'lucide-react';

const SECTION = { NONE: '', PERSONAL: 'personal', SKILLS: 'skills', EXPERIENCE: 'experience', PREFERENCES: 'preferences' };

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  // Global edit mode or section-specific edit
  const [editingSection, setEditingSection] = useState(SECTION.NONE);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const isEmployer = user?.role === 'employer';
  const [formData, setFormData] = useState({
    first_name: user?.first_name || user?.name?.split(' ')[0] || '',
    last_name: user?.last_name || user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.city_state || user?.location || '',
    country: user?.country || 'India',
    bio: user?.bio || '',
    photo_url: user?.photo_url || '',
    company_name: user?.company_name || '',
    company_description: user?.company_description || '',
    skills: isEmployer ? [] : (user?.skills ? (typeof user.skills === 'string' ? user.skills.split(',').map(s => s.trim()) : user.skills) : ['Driving', 'Cooking']),
    experience: isEmployer ? [] : (user?.experience || [
      { title: 'Delivery Executive', company: 'Zomato', duration: '2 years' },
    ]),
    resume_name: user?.resume_name || '',
    job_type: user?.job_type || 'Full-time',
    preferred_location: user?.preferred_location || '',
    expected_salary: user?.expected_salary || '',
  });

  const [newSkill, setNewSkill] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setMessage({ type: 'error', text: 'Image must be under 2MB' }); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => { setFormData(prev => ({ ...prev, photo_url: reader.result })); setUploading(false); };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, s] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const updateExperience = (idx, field, value) => {
    setFormData(prev => {
      const exp = [...prev.experience];
      exp[idx] = { ...exp[idx], [field]: value };
      return { ...prev, experience: exp };
    });
  };

  const addExperience = () => {
    setFormData(prev => ({ ...prev, experience: [...prev.experience, { title: '', company: '', duration: '' }] }));
  };

  const removeExperience = (idx) => {
    setFormData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));
  };

  // Profile completion
  const completionPct = useMemo(() => {
    const fields = [formData.first_name, formData.last_name, formData.email, formData.phone, formData.location, formData.bio, formData.photo_url, formData.skills.length > 0 ? 'yes' : '', formData.experience.length > 0 ? 'yes' : '', formData.expected_salary];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    const updatedData = { ...formData, name: `${formData.first_name} ${formData.last_name}`.trim(), skills: formData.skills.join(', ') };
    try {
      const res = await fetch(`http://localhost:5001/api/auth/profile/${user.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) { setUser(data.user); localStorage.setItem('user', JSON.stringify(data.user)); setMessage({ type: 'success', text: 'Profile updated successfully!' }); }
      else throw new Error(data.error || 'Failed');
    } catch (err) {
      console.error(err);
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage({ type: 'success', text: 'Profile updated!' });
    } finally {
      setLoading(false);
      setEditingSection(SECTION.NONE);
    }
  };

  const cancelEdit = () => { setEditingSection(SECTION.NONE); setMessage({ type: '', text: '' }); };
  const isEditing = (section) => editingSection === section;

  // Styles
  const cardStyle = {
    background: 'white', borderRadius: '1rem', border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '1.5rem', position: 'relative',
  };
  const editBtnStyle = {
    position: 'absolute', top: '1.25rem', right: '1.25rem',
    background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '0.5rem',
    padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s',
  };
  const labelStyle = { fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' };
  const valueStyle = { fontSize: '0.95rem', fontWeight: 600, color: '#0F172A' };
  const inputStyle = {
    width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.5rem',
    fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', background: '#F8FAFC',
  };
  const tagStyle = {
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    padding: '0.35rem 0.75rem', borderRadius: '9999px',
    fontSize: '0.8rem', fontWeight: 600, background: '#EEF2FF', color: '#4338CA',
    border: '1px solid #C7D2FE',
  };
  const primaryBtnStyle = {
    padding: '0.6rem 1.5rem', background: '#4F46E5', color: 'white', border: 'none',
    borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
    fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.35rem',
  };
  const ghostBtnStyle = {
    padding: '0.6rem 1.5rem', background: 'white', color: '#374151',
    border: '1px solid #E2E8F0', borderRadius: '0.5rem', fontWeight: 600,
    fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>My Profile</h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Manage your personal information and preferences.</p>
        </div>
        {editingSection === SECTION.NONE ? (
          <button onClick={() => setEditingSection(SECTION.PERSONAL)} style={primaryBtnStyle}>
            <Pencil size={15} /> Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={cancelEdit} style={ghostBtnStyle}>Cancel</button>
            <button onClick={handleSave} disabled={loading} style={primaryBtnStyle}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Success / Error */}
      {message.text && (
        <div style={{
          padding: '0.875rem 1rem', borderRadius: '0.75rem', marginBottom: '1.5rem',
          fontSize: '0.875rem', fontWeight: 600,
          background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2',
          color: message.type === 'success' ? '#166534' : '#991B1B',
          border: `1px solid ${message.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
        }}>
          {message.text}
        </div>
      )}

      {/* Profile Completion */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Profile Completion</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: completionPct === 100 ? '#059669' : '#4F46E5' }}>{completionPct}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${completionPct}%`, height: '100%', background: completionPct === 100 ? '#059669' : 'linear-gradient(to right, #4F46E5, #6366F1)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
        </div>
        {completionPct < 100 && (
          <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.5rem' }}>Complete your profile to get better job matches.</p>
        )}
      </div>

      {/* === SECTION 1: AVATAR + PERSONAL INFO === */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {editingSection !== SECTION.PERSONAL && (
          <button style={editBtnStyle} onClick={() => setEditingSection(SECTION.PERSONAL)}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}

        {/* Avatar row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: formData.photo_url ? 'transparent' : 'linear-gradient(135deg, #4F46E5, #6366F1)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #E5E7EB', position: 'relative' }}>
            {formData.photo_url ? (
              <img src={formData.photo_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1.75rem' }}>{(formData.first_name || 'U').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{formData.first_name} {formData.last_name}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>{user?.role === 'employer' ? 'Employer' : 'Job Seeker'}</div>
          </div>
          {isEditing(SECTION.PERSONAL) && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
              <button onClick={() => fileInputRef.current?.click()} style={{ ...ghostBtnStyle, padding: '0.4rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Camera size={14} /> Change
              </button>
              {formData.photo_url && (
                <button onClick={() => setFormData(p => ({ ...p, photo_url: '' }))} style={{ ...ghostBtnStyle, padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Info fields */}
        {isEditing(SECTION.PERSONAL) ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><div style={labelStyle}>First Name</div><input name="first_name" value={formData.first_name} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Last Name</div><input name="last_name" value={formData.last_name} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Email</div><input name="email" value={formData.email} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Phone</div><input name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} /></div>
            <div><div style={labelStyle}>Location</div><input name="location" value={formData.location} onChange={handleChange} style={inputStyle} /></div>
            <div>
              <div style={labelStyle}>Country</div>
              <select name="country" value={formData.country} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="India">India</option><option value="USA">USA</option><option value="UK">UK</option><option value="Canada">Canada</option>
              </select>
            </div>
            {isEmployer ? (
              <>
                <div><div style={labelStyle}>Company Name</div><input name="company_name" value={formData.company_name} onChange={handleChange} style={inputStyle} placeholder="Your company name" /></div>
                <div><div style={labelStyle}>Company Description</div><textarea name="company_description" value={formData.company_description} onChange={handleChange} rows={3} placeholder="Describe your company..." style={{ ...inputStyle, resize: 'none', minHeight: '80px' }} /></div>
              </>
            ) : (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={labelStyle}>Bio</div>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Tell us about yourself..." style={{ ...inputStyle, resize: 'none', minHeight: '80px' }} />
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem' }}>
            <InfoField icon={<Mail size={15} color="#94A3B8" />} label="Email" value={formData.email || 'Not set'} missing={!formData.email} />
            <InfoField icon={<Phone size={15} color="#94A3B8" />} label="Phone" value={formData.phone || 'Not set'} missing={!formData.phone} />
            <InfoField icon={<MapPin size={15} color="#94A3B8" />} label="Location" value={formData.location ? `${formData.location}, ${formData.country}` : 'Not set'} missing={!formData.location} />
            <InfoField icon={<Briefcase size={15} color="#94A3B8" />} label="Role" value={user?.role === 'employer' ? 'Employer' : 'Job Seeker'} />
            {formData.bio && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={labelStyle}>Bio</div>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>{formData.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* === COMPANY INFO SECTION (for employers) === */}
      {isEmployer && (
        <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
          {editingSection !== SECTION.PERSONAL && (
            <button style={editBtnStyle} onClick={() => setEditingSection(SECTION.PERSONAL)}
              onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
              onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
            ><Pencil size={15} color="#64748B" /></button>
          )}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={18} color="#4F46E5" /> Company Details
          </h3>
          {editingSection === SECTION.PERSONAL ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div><div style={labelStyle}>Company Name</div><input name="company_name" value={formData.company_name} onChange={handleChange} style={inputStyle} placeholder="Your company name" /></div>
              <div><div style={labelStyle}>Company Description</div><textarea name="company_description" value={formData.company_description} onChange={handleChange} rows={4} placeholder="Describe your company..." style={{ ...inputStyle, resize: 'none', minHeight: '100px' }} /></div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <InfoField icon={<Briefcase size={15} color="#94A3B8" />} label="Company Name" value={formData.company_name || 'Not set'} missing={!formData.company_name} />
              {formData.company_description && (
                <div>
                  <div style={labelStyle}>Description</div>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>{formData.company_description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!isEmployer && (
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {editingSection !== SECTION.SKILLS && (
          <button style={editBtnStyle} onClick={() => setEditingSection(SECTION.SKILLS)}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Star size={18} color="#4F46E5" /> Skills
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: isEditing(SECTION.SKILLS) ? '1rem' : 0 }}>
          {formData.skills.length > 0 ? formData.skills.map(skill => (
            <span key={skill} style={tagStyle}>
              {skill}
              {isEditing(SECTION.SKILLS) && (
                <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <X size={13} color="#4338CA" />
                </button>
              )}
            </span>
          )) : (
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic' }}>No skills added yet.</span>
          )}
        </div>
        {isEditing(SECTION.SKILLS) && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Add a skill..." style={{ ...inputStyle, flex: 1 }} />
            <button onClick={addSkill} style={{ ...primaryBtnStyle, padding: '0.5rem 1rem' }}><Plus size={16} /> Add</button>
          </div>
        )}
      </div>
      )}

      {!isEmployer && (
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {editingSection !== SECTION.EXPERIENCE && (
          <button style={editBtnStyle} onClick={() => setEditingSection(SECTION.EXPERIENCE)}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={18} color="#4F46E5" /> Experience
        </h3>
        {formData.experience.length > 0 ? formData.experience.map((exp, idx) => (
          <div key={idx} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid #F1F5F9', marginBottom: '0.75rem', position: 'relative' }}>
            {isEditing(SECTION.EXPERIENCE) ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div><div style={labelStyle}>Job Title</div><input value={exp.title} onChange={e => updateExperience(idx, 'title', e.target.value)} style={inputStyle} /></div>
                  <div><div style={labelStyle}>Company</div><input value={exp.company} onChange={e => updateExperience(idx, 'company', e.target.value)} style={inputStyle} /></div>
                  <div><div style={labelStyle}>Duration</div><input value={exp.duration} onChange={e => updateExperience(idx, 'duration', e.target.value)} style={inputStyle} /></div>
                </div>
                <button onClick={() => removeExperience(idx)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={14} color="#DC2626" />
                </button>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{exp.title || 'Untitled Role'}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>{exp.company} &middot; {exp.duration}</div>
              </>
            )}
          </div>
        )) : (
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic' }}>No experience added yet.</p>
        )}
        {isEditing(SECTION.EXPERIENCE) && (
          <button onClick={addExperience} style={{ ...ghostBtnStyle, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem' }}>
            <Plus size={15} /> Add Experience
          </button>
        )}
      </div>
      )}

      {!isEmployer && (
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        {editingSection !== SECTION.PREFERENCES && (
          <button style={editBtnStyle} onClick={() => setEditingSection(SECTION.PREFERENCES)}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
          ><Pencil size={15} color="#64748B" /></button>
        )}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={18} color="#4F46E5" /> Job Preferences
        </h3>
        {isEditing(SECTION.PREFERENCES) ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={labelStyle}>Job Type</div>
              <select name="job_type" value={formData.job_type} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option>
              </select>
            </div>
            <div><div style={labelStyle}>Preferred Location</div><input name="preferred_location" value={formData.preferred_location} onChange={handleChange} placeholder="e.g., Mumbai" style={inputStyle} /></div>
            <div><div style={labelStyle}>Expected Salary (monthly)</div><input name="expected_salary" value={formData.expected_salary} onChange={handleChange} placeholder="e.g., 25000" style={inputStyle} /></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem' }}>
            <InfoField label="Job Type" value={formData.job_type} />
            <InfoField label="Preferred Location" value={formData.preferred_location || 'Not set'} missing={!formData.preferred_location} />
            <InfoField label="Expected Salary" value={formData.expected_salary ? `Rs. ${formData.expected_salary}/mo` : 'Not set'} missing={!formData.expected_salary} />
          </div>
        )}
      </div>
      )}

      {/* Bottom save bar (when any section is being edited) */}
      {editingSection !== SECTION.NONE && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1.5rem 0' }}>
          <button onClick={cancelEdit} style={ghostBtnStyle}>Cancel</button>
          <button onClick={handleSave} disabled={loading} style={primaryBtnStyle}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
            Save Changes
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// Small helper for view-mode fields
const InfoField = ({ icon, label, value, missing }) => (
  <div>
    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
      {icon} {label}
    </div>
    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: missing ? '#CBD5E1' : '#0F172A', fontStyle: missing ? 'italic' : 'normal' }}>
      {value}
    </div>
  </div>
);

export default Profile;
