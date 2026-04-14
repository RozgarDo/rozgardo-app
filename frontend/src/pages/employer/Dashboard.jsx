import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Plus, Users, MapPin, Briefcase } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

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

  const handleUpdateApplicantStatus = async (appId, status) => {
    try {
      const res = await fetch(`http://localhost:5001/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
         setApplicants(applicants.map(app => app.id === appId ? { ...app, status } : app));
      } else { throw new Error('Failed to update status'); }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-8 page-enter">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
         <div>
            <h1 className="text-3xl font-bold mb-1">Employer Dashboard</h1>
            <p className="text-muted">Manage your job postings and applicants.</p>
         </div>
         <Link to="/employer/post-job">
           <Button className="flex items-center gap-2">
              <Plus size={18} /> Post New Job
           </Button>
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left panel: Job list */}
         <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Briefcase size={20} /> My Jobs ({jobs.length})</h2>
            {loading ? <p>Loading...</p> : jobs.length === 0 ? <p className="text-muted">No jobs posted yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {jobs.map(job => (
                     <div
                         key={job.id}
                         className={`rounded-lg border overflow-hidden transition-all cursor-pointer ${selectedJob === job.id ? 'border-primary shadow-md' : 'border-gray-200 hover:border-primary bg-white'}`}
                         onClick={() => handleViewApplicants(job)}
                     >
                         {/* Card body */}
                         <div className={`p-5 ${selectedJob === job.id ? 'bg-indigo-50' : 'bg-white'}`}>
                             <div className="flex justify-between items-start gap-2 mb-3">
                                 <h3 className="font-bold text-sm leading-tight">{job.title}</h3>
                                 <span className={`badge badge-${job.status} flex-shrink-0`} style={{fontSize: '0.6rem', padding: '2px 8px'}}>{job.status}</span>
                             </div>
                             <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={11}/>{job.location}</p>
                         </div>
                         {/* Uniform full-width button strip */}
                         <div className={`text-center py-2 text-xs font-semibold border-t transition-colors ${selectedJob === job.id ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-primary border-gray-200 hover:bg-indigo-50'}`}>
                             {selectedJob === job.id ? '▲ Viewing Applicants' : '▼ View Applicants'}
                         </div>
                     </div>
                  ))}
              </div>
            )}
         </div>

         {/* Right panel: Applicants for selected job */}
         <div className="lg:col-span-2" style={{borderLeft: '1px solid #e5e7eb', paddingLeft: '2rem'}}>
            {!selectedJob ? (
               <Card className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted">
                  <Users size={64} className="text-gray-200 mb-4" />
                  <h3 className="text-xl font-medium">Select a job to view its applicants</h3>
                  <p className="text-sm mt-2">Click on any job from the left panel</p>
               </Card>
            ) : (
               <div className="page-enter">
                  <h2 className="text-xl font-bold mb-1">
                     Applicants for: <span className="text-primary">{selectedJobTitle}</span>
                  </h2>
                  <p className="text-sm text-muted mb-6">{applicants.length} applicant(s) found</p>

                  {applicantsLoading ? (
                     <p className="text-center py-8 text-muted">Loading applicants...</p>
                  ) : applicants.length === 0 ? (
                     <Card className="py-12 text-center text-muted bg-gray-50">
                        <Users size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="font-medium">No applicants yet for this position.</p>
                     </Card>
                  ) : (
                     <div className="flex flex-col gap-4">
                        {applicants.map(app => (
                           <Card key={app.id} className="p-6 border-l-4" style={{borderLeftColor: app.status === 'selected' ? 'var(--color-success)' : app.status === 'rejected' ? 'var(--color-danger)' : 'var(--color-primary)'}}>
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                 <div>
                                    <h3 className="text-lg font-bold mb-1">{app.users?.name || 'Applicant'}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                                       <p className="text-sm text-gray-600 flex items-center gap-1">📞 {app.users?.phone}</p>
                                       {app.users?.email && <p className="text-sm text-gray-600 flex items-center gap-1">✉️ {app.users?.email}</p>}
                                       {app.users?.languages && <p className="text-sm text-gray-600 flex items-center gap-1">🌐 {app.users?.languages}</p>}
                                    </div>
                                    <p className="text-sm font-medium text-gray-800 bg-gray-100 inline-block px-3 py-1 rounded-md">
                                       <span className="text-gray-500">Skills:</span> {app.users?.skills || 'Not specified'}
                                    </p>
                                 </div>
                                 
                                 <div className="flex flex-col items-end gap-3 text-sm">
                                    <span className={`badge badge-${app.status} px-3 py-1 text-sm`}>
                                       {app.status}
                                    </span>
                                    
                                    <select 
                                       className="border rounded-md p-2 text-sm bg-white min-w-[160px]"
                                       value={app.status}
                                       onChange={(e) => handleUpdateApplicantStatus(app.id, e.target.value)}
                                    >
                                       <option value="applied">Applied</option>
                                       <option value="shortlisted">Shortlist</option>
                                       <option value="interview">Call for Interview</option>
                                       <option value="selected">Select & Hire</option>
                                       <option value="rejected">Reject</option>
                                    </select>
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

export default Dashboard;
