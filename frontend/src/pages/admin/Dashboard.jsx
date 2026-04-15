import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ShieldAlert, CheckCircle, XCircle, Users, Briefcase, TrendingUp, DollarSign, Calendar, Building, Download } from 'lucide-react';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [usersTab, setUsersTab] = useState('employer');
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab, usersTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'jobs') {
        const res = await fetch('http://localhost:5001/api/jobs');
        if (res.ok) {
           const data = await res.json();
           setJobs(data);
        }
      } else {
        const res = await fetch('http://localhost:5001/api/auth/users');
        if (res.ok) {
           const data = await res.json();
           setUsers(data);
        }
      }
    } catch (err) {
       console.error(err);
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getFilteredUsers = (role) => users.filter(u => u.role === role);

  const exportToCSV = (data, filename, headers) => {
    if (!data || data.length === 0) return;
    const csvRows = [headers.join(',')];
    data.forEach(row => {
      const rowData = headers.map((h, i) => {
        const val = String(row[Object.keys(row)[i]] || '');
        return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
      });
      csvRows.push(rowData.join(','));
    });
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename + '.csv');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const exportJobs = () => {
    const data = jobs.map(j => ({
      title: j.title,
      employer: j.employer_name,
      category: j.category,
      location: j.location,
      salary: j.salary,
      status: j.status,
      created: j.created_at
    }));
    exportToCSV(data, 'jobs_export', ['Title', 'Employer', 'Category', 'Location', 'Salary', 'Status', 'Created']);
  };

  const exportUsers = () => {
    const data = users.map(u => ({
      name: u.name,
      phone: u.phone,
      email: u.email,
      role: u.role
    }));
    exportToCSV(data, 'users_export', ['Name', 'Phone', 'Email', 'Role']);
  };

  const exportMonthlyAnalytics = () => {
    exportToCSV(monthlyData, 'monthly_analytics', ['Month', 'Jobs', 'Revenue']);
  };

  const exportEmployerStats = () => {
    exportToCSV(employerStats, 'employer_stats', ['Employer', 'Jobs', 'Revenue']);
  };

  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const decidedJobs = jobs.filter(j => j.status !== 'pending');

  const totalJobsPosted = jobs.length;
  const approvedJobs = jobs.filter(j => j.status === 'approved').length;
  const totalEmployers = getFilteredUsers('employer').length;
  const totalEmployees = getFilteredUsers('employee').length;

  // Calculate estimated revenue (mock - based on job fees)
  const estimatedRevenue = {
    total: approvedJobs * 500,
    thisMonth: Math.floor(approvedJobs * 500 * 0.3),
    lastMonth: Math.floor(approvedJobs * 500 * 0.25),
  };

  // Monthly breakdown (mock data)
  const monthlyData = [
    { month: 'Apr 2026', jobs: Math.floor(Math.random() * 10) + 5, revenue: Math.floor(Math.random() * 5000) + 2000 },
    { month: 'Mar 2026', jobs: Math.floor(Math.random() * 10) + 3, revenue: Math.floor(Math.random() * 5000) + 1500 },
    { month: 'Feb 2026', jobs: Math.floor(Math.random() * 10) + 4, revenue: Math.floor(Math.random() * 5000) + 1800 },
    { month: 'Jan 2026', jobs: Math.floor(Math.random() * 10) + 2, revenue: Math.floor(Math.random() * 5000) + 1000 },
  ];

  const employersWithJobs = jobs.reduce((acc, job) => {
    const name = job.employer_name || 'Unknown';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const employerStats = Object.entries(employersWithJobs)
    .map(([name, count]) => ({ name, jobs: count, revenue: count * 500 }))
    .sort((a, b) => b.jobs - a.jobs)
    .slice(0, 5);

  const renderUsersTable = () => {
    const filteredUsers = getFilteredUsers(usersTab);
    if (filteredUsers.length === 0) {
      return (
        <div className="text-center py-12 text-muted">
          <p>No {usersTab}s found</p>
        </div>
      );
    }
    return (
      <table className="w-full text-left bg-white rounded-lg shadow-sm overflow-hidden text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-4 font-bold text-gray-700">Name</th>
            <th className="p-4 font-bold text-gray-700">Phone</th>
            <th className="p-4 font-bold text-gray-700">Email</th>
            <th className="p-4 font-bold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-4 font-semibold">{u.name || 'N/A'}</td>
              <td className="p-4 text-gray-600">{u.phone}</td>
              <td className="p-4 text-gray-600">{u.email || 'N/A'}</td>
              <td className="p-4">
                <button className="text-primary hover:underline font-medium text-xs mr-3">View</button>
                <button className="text-danger hover:underline font-medium text-xs">Suspend</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container py-8 page-enter">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldAlert className="text-primary" size={32} /> Admin Center
         </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <TrendingUp size={24} className="mx-auto text-green-600 mb-2" />
          <p className="text-2xl font-bold">₹{estimatedRevenue.total.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </Card>
        <Card className="p-4 text-center">
          <DollarSign size={24} className="mx-auto text-blue-600 mb-2" />
          <p className="text-2xl font-bold">₹{estimatedRevenue.thisMonth.toLocaleString()}</p>
          <p className="text-sm text-gray-500">This Month</p>
        </Card>
        <Card className="p-4 text-center">
          <Briefcase size={24} className="mx-auto text-purple-600 mb-2" />
          <p className="text-2xl font-bold">{approvedJobs}</p>
          <p className="text-sm text-gray-500">Jobs Approved</p>
        </Card>
        <Card className="p-4 text-center">
          <Building size={24} className="mx-auto text-indigo-600 mb-2" />
          <p className="text-2xl font-bold">{totalEmployers}</p>
          <p className="text-sm text-gray-500">Employers</p>
        </Card>
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
        <button 
           className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${activeTab === 'analytics' ? 'bg-indigo-100 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
           onClick={() => setActiveTab('analytics')}
        >
           <TrendingUp size={18} /> Analytics
        </button>
      </div>

      {activeTab === 'jobs' && (
        <button onClick={exportJobs} className="mb-4 px-4 py-2 bg-green-600 text-white rounded font-bold flex items-center gap-1" style={{ width: '130px', height: '38px', justifyContent: 'center', whiteSpace: 'nowrap' }}>
          <Download size={16} /> Export Jobs
        </button>
      )}

      {activeTab === 'users' && (
        <button onClick={exportUsers} className="mb-4 px-4 py-2 bg-green-600 text-white rounded font-bold flex items-center gap-1" style={{ width: '130px', height: '38px', justifyContent: 'center', whiteSpace: 'nowrap' }}>
          <Download size={16} /> Export Users
        </button>
      )}

      {activeTab === 'users' && (
        <div className="flex gap-2 mb-6">
          <button 
             className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${usersTab === 'employer' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
             onClick={() => setUsersTab('employer')}
          >
             Employers ({totalEmployers})
          </button>
          <button 
             className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${usersTab === 'employee' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
             onClick={() => setUsersTab('employee')}
          >
             Employees ({totalEmployees})
          </button>
          <button 
             className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors ${usersTab === 'admin' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}
             onClick={() => setUsersTab('admin')}
          >
             Admins ({getFilteredUsers('admin').length})
          </button>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Calendar size={20} /> Monthly Overview
              </h3>
              <button onClick={exportMonthlyAnalytics} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1">
                <Download size={14} /> Export
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Month</th>
                  <th className="text-right py-2">Jobs</th>
                  <th className="text-right py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{row.month}</td>
                    <td className="text-right">{row.jobs}</td>
                    <td className="text-right font-semibold">₹{row.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Building size={20} /> Top Employers
              </h3>
              <button onClick={exportEmployerStats} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center gap-1">
                <Download size={14} /> Export
              </button>
            </div>
            {employerStats.length === 0 ? (
              <p className="text-muted">No employer data yet</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Employer</th>
                    <th className="text-right py-2">Jobs</th>
                    <th className="text-right py-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {employerStats.map((emp, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2 truncate max-w-[150px]">{emp.name}</td>
                      <td className="text-right">{emp.jobs}</td>
                      <td className="text-right font-semibold">₹{emp.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      )}

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
            ) : activeTab === 'users' ? (
               <div className="overflow-x-auto">
                  {renderUsersTable()}
               </div>
            ) : null
         )}
      </div>
    </div>
  );
};

export default AdminDashboard;