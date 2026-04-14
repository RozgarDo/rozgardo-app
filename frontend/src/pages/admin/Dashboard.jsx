import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ShieldAlert, CheckCircle, XCircle, Users, Briefcase } from 'lucide-react';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'jobs') {
        const res = await fetch('http://localhost:5001/api/jobs');
        if (res.ok) {
           const data = await res.json();
           setJobs(data);
        } else { throw new Error('Failed to fetch jobs'); }
      } else {
        const res = await fetch('http://localhost:5001/api/auth/users');
        if (res.ok) {
           const data = await res.json();
           setUsers(data);
        } else { throw new Error('Failed to fetch users'); }
      }
    } catch (err) {
       console.error(err);
       if (activeTab === 'jobs') setJobs([]);
       else setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
         setJobs(jobs.map(job => job.id === id ? { ...job, status } : job));
      } else { throw new Error('Failed to update status'); }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const decidedJobs = jobs.filter(j => j.status !== 'pending');

  return (
    <div className="container py-8 page-enter">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldAlert className="text-primary" size={32} /> Admin Center
         </h1>
      </div>

      <div className="flex gap-4 mb-8 pb-4 border-b border-gray-200">
         <button 
            className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${activeTab === 'jobs' ? 'bg-indigo-100 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('jobs')}
         >
            <Briefcase size={18} /> Moderate Jobs
         </button>
         <button 
            className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${activeTab === 'users' ? 'bg-indigo-100 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('users')}
         >
            <Users size={18} /> Manage Users
         </button>
      </div>

      <div>
         {loading ? <p className="text-center py-12 text-muted text-lg">Loading data...</p> : (
            activeTab === 'jobs' ? (
               <div className="flex flex-col gap-4">
                  {pendingJobs.length > 0 && <h2 className="text-xl font-bold mb-2">Pending Approval ({pendingJobs.length})</h2>}
                  {pendingJobs.length === 0 && (
                     <Card className="py-12 text-center text-muted">
                        <CheckCircle size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-medium">All caught up!</h3>
                        <p>No pending job postings to review.</p>
                     </Card>
                  )}
                  {pendingJobs.map(job => (
                     <Card key={job.id} className="border-l-4 border-warning flex flex-col md:flex-row justify-between md:items-center">
                        <div className="mb-4 md:mb-0">
                           <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                           <p className="text-muted font-medium mb-1">{job.employer_name}</p>
                           <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-semibold">{job.category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Button variant="outline" className="text-danger border-danger hover:bg-red-50" onClick={() => handleJobAction(job.id, 'rejected')}>
                              <XCircle size={18} className="mr-2" /> Reject
                           </Button>
                           <Button className="bg-success hover:bg-emerald-600 hover:text-white text-white border-none" onClick={() => handleJobAction(job.id, 'approved')}>
                              <CheckCircle size={18} className="mr-2" /> Approve
                           </Button>
                        </div>
                     </Card>
                  ))}
                  
                  {decidedJobs.length > 0 && <h2 className="text-xl font-bold mt-8 mb-4">Past Decisions</h2>}
                  {decidedJobs.map(job => (
                     <Card key={job.id} className={`flex flex-col md:flex-row justify-between md:items-center p-4 bg-gray-50 border-l-4 ${job.status === 'approved' ? 'border-success' : 'border-danger'}`}>
                        <div className="mb-2 md:mb-0">
                           <h3 className="font-bold">{job.title}</h3>
                           <p className="text-sm text-gray-500">{job.employer_name}</p>
                        </div>
                        <span className={`badge badge-${job.status}`}>{job.status}</span>
                     </Card>
                  ))}
               </div>
            ) : (
               <div className="overflow-x-auto">
                  <table className="w-full text-left bg-white rounded-lg shadow-sm overflow-hidden text-sm">
                     <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                           <th className="p-4 font-bold text-gray-700">Role</th>
                           <th className="p-4 font-bold text-gray-700">Name</th>
                           <th className="p-4 font-bold text-gray-700">Phone</th>
                           <th className="p-4 font-bold text-gray-700">Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {users.map(u => (
                           <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="p-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                     ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                                       u.role === 'employer' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                     {u.role}
                                  </span>
                              </td>
                              <td className="p-4 font-semibold">{u.name || 'N/A'}</td>
                              <td className="p-4 text-gray-600">{u.phone}</td>
                              <td className="p-4">
                                 <button className="text-primary hover:underline font-medium text-xs mr-3">View Details</button>
                                 <button className="text-danger hover:underline font-medium text-xs">Suspend</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )
         )}
      </div>
    </div>
  );
};

export default AdminDashboard;
