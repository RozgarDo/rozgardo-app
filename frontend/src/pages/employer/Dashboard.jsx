import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { 
  Plus, Users, MapPin, Briefcase, 
  ChevronDown, Check, Clock, UserCheck, 
  XCircle, AlertCircle, Loader2
} from 'lucide-react';

const Dashboard = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [updatingAppId, setUpdatingAppId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchEmployerJobs = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/jobs?employer_id=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplicants = async (job) => {
    if (selectedJob === job.id) {
      setSelectedJob(null);
      setSelectedJobTitle('');
      setApplicants([]);
      return;
    }
    setSelectedJob(job.id);
    setSelectedJobTitle(job.title);
    setApplicantsLoading(true);
    setApplicants([]);
    
    try {
      const res = await fetch(`http://localhost:5001/api/applications/job/${job.id}`);
      if (res.ok) {
        const data = await res.json();
        setApplicants(data);
      } else { throw new Error('Failed to fetch applicants'); }
    } catch (err) {
      console.error(err);
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    const originalStatus = applicants.find(a => a.id === appId)?.status;
    
    console.log(`[Status Update] Attempting to change Application ${appId} to: "${newStatus}"`);

    // 1. Optimistic Update
    setApplicants(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
    setUpdatingAppId(appId);

    try {
      const res = await fetch(`http://localhost:5001/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();

      if (res.ok) {
        console.log(`[Status Update] Successfully updated to: "${newStatus}"`);
        setToast({ message: `Status updated to ${newStatus}`, type: 'success' });
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('[Status Update Error]:', err);
      // 2. Revert on failure
      setApplicants(prev => prev.map(app => 
        app.id === appId ? { ...app, status: originalStatus } : app
      ));
      setToast({ message: `Error: ${err.message}`, type: 'error' });
    } finally {
      setUpdatingAppId(null);
    }
  };

  return (
    <div className="container py-8 page-enter relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-8 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300 ${
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
         <div>
            <h1 className="text-3xl font-black mb-1">Employer Dashboard</h1>
            <p className="text-muted">Manage your job postings and applicants.</p>
         </div>
         <Link to="/employer/post-job">
           <Button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100 transition-all">
              <Plus size={18} /> Post New Job
           </Button>
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left panel: Job list */}
         <div className="lg:col-span-1">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2"><Briefcase size={20} /> My Jobs ({jobs.length})</h2>
            {loading ? <p>Loading...</p> : jobs.length === 0 ? <p className="text-muted">No jobs posted yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {jobs.map(job => (
                     <div
                         key={job.id}
                         className={`rounded-2xl border-2 overflow-hidden transition-all cursor-pointer ${selectedJob === job.id ? 'border-indigo-600 shadow-xl scale-[1.02]' : 'border-gray-100 hover:border-indigo-200 bg-white shadow-sm'}`}
                         onClick={() => handleViewApplicants(job)}
                     >
                         <div className={`p-5 ${selectedJob === job.id ? 'bg-indigo-50/50' : 'bg-white'}`}>
                             <div className="flex justify-between items-start gap-2 mb-3">
                                 <h3 className="font-black text-sm leading-tight text-gray-900">{job.title}</h3>
                                 <span className={`badge badge-${job.status} flex-shrink-0`}>{job.status}</span>
                             </div>
                             <p className="text-xs text-gray-500 font-bold flex items-center gap-1"><MapPin size={11}/>{job.location}</p>
                         </div>
                         <div className={`text-center py-2.5 text-[10px] uppercase tracking-widest font-black border-t transition-colors ${selectedJob === job.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-indigo-600 border-gray-100 hover:bg-indigo-50'}`}>
                             {selectedJob === job.id ? 'Viewing Applicants' : 'View Applicants'}
                         </div>
                     </div>
                  ))}
              </div>
            )}
         </div>

         {/* Right panel: Applicants for selected job */}
         <div className="lg:col-span-2 min-h-[500px]">
            {!selectedJob ? (
               <Card className="h-full flex flex-col items-center justify-center text-muted bg-white border-dashed border-2 border-gray-200">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Users size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-black text-gray-800">Select a job to view applicants</h3>
                  <p className="text-sm mt-2 text-gray-400">Manage your pipeline and hire the best talent</p>
               </Card>
            ) : (
               <div className="page-enter">
                  <header className="mb-8">
                    <h2 className="text-2xl font-black text-gray-900 leading-none">
                       Applicants for <span className="text-indigo-600">{selectedJobTitle}</span>
                    </h2>
                    <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">{applicants.length} candidates in pipeline</p>
                  </header>

                  {applicantsLoading ? (
                     <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                        <Loader2 size={40} className="animate-spin text-indigo-600 mb-4" />
                        <p className="font-black text-sm tracking-widest uppercase">Fetching candidates...</p>
                     </div>
                  ) : applicants.length === 0 ? (
                     <Card className="py-20 text-center bg-gray-50 border-gray-100 rounded-3xl">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-6">
                          <Users size={30} className="text-gray-200" />
                        </div>
                        <p className="font-black text-gray-800">No applicants yet for this position.</p>
                        <p className="text-xs text-gray-400 mt-1">Check back later or promote your job posting.</p>
                     </Card>
                  ) : (
                     <div className="flex flex-col gap-6">
                        {applicants.map(app => (
                           <Card key={app.id} className="p-6 border-gray-100 hover:border-indigo-100 transition-all hover:shadow-lg rounded-3xl group">
                              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                                 <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{app.users?.name || 'Applicant'}</h3>
                                      <span className={`badge badge-${app.status} px-3 py-1 text-[10px]`}>
                                         {app.status === 'selected' ? 'HIRED' : app.status}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mb-4">
                                       <ContactItem icon="📞" text={app.users?.phone} />
                                       {app.users?.email && <ContactItem icon="✉️" text={app.users?.email} />}
                                       {app.users?.languages && <ContactItem icon="🌐" text={app.users?.languages} />}
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Skills:</span> 
                                       <span className="text-xs font-black text-gray-800">{app.users?.skills || 'Not specified'}</span>
                                    </div>
                                 </div>
                                 
                                 <div className="lg:text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Update Application Status</p>
                                    <StatusDropdown 
                                      currentStatus={app.status === 'selected' ? 'hired' : app.status} 
                                      isLoading={updatingAppId === app.id}
                                      onChange={(s) => handleStatusChange(app.id, s)} 
                                    />
                                 </div>
                              </div>
                           </Card>
                        ))}
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

// --- Subcomponents ---

const ContactItem = ({ icon, text }) => (
  <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
    <span>{icon}</span> {text}
  </p>
);

const StatusDropdown = ({ currentStatus, onChange, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const statusOptions = [
    { label: "Applied", value: "applied" },
    { label: "Shortlist", value: "shortlisted" },
    { label: "Call for Interview", value: "interview" },
    { label: "Select & Hire", value: "hired" },
    { label: "Reject", value: "rejected" },
  ];

  return (
    <div className="relative inline-block text-left w-full sm:w-[200px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${
          isOpen ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
        }`}
      >
        <span className="flex items-center gap-2">
          {isLoading ? <Loader2 size={14} className="animate-spin text-indigo-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
          {currentStatus}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-full origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="py-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors hover:bg-gray-50 ${
                    currentStatus === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600'
                  }`}
                >
                  <span className="text-current">
                    {option.value === 'shortlisted' && <Check size={14} />}
                    {option.value === 'interview' && <Users size={14} />}
                    {option.value === 'hired' && <UserCheck size={14} />}
                    {option.value === 'rejected' && <XCircle size={14} />}
                    {option.value === 'applied' && <Clock size={14} />}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

