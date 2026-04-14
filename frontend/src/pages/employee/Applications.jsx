import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { IndianRupee, MapPin } from 'lucide-react';

const Applications = ({ user }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

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
      console.error(err);
      // MOCK DATA
      setApps([
         { id: 101, status: 'applied', jobs: { title: 'Delivery Executive', employer_name: 'Zomato', location: 'Pune', salary: 18000 } },
         { id: 102, status: 'shortlisted', jobs: { title: 'Office Helper', employer_name: 'TechPark Inc', location: 'Mumbai', salary: 12000 } },
         { id: 103, status: 'rejected', jobs: { title: 'Security Guard', employer_name: 'SafeShield', location: 'Delhi', salary: 15000 } },
         { id: 104, status: 'interview', jobs: { title: 'Personal Driver', employer_name: 'Mr. Sharma', location: 'Mumbai', salary: 20000 } },
         { id: 105, status: 'selected', jobs: { title: 'Head Chef', employer_name: 'Taj Hotel', location: 'Mumbai', salary: 45000 } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
       case 'applied': return <span className="badge badge-applied">Applied</span>;
       case 'shortlisted': return <span className="badge badge-shortlisted">Shortlisted</span>;
       case 'interview': return <span className="badge badge-interview">Interview Scheduled</span>;
       case 'rejected': return <span className="badge badge-rejected">Rejected</span>;
       case 'selected': return <span className="badge badge-selected">Selected</span>;
       default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="container py-8 page-enter">
       <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-muted text-lg mb-8">Track the status of the jobs you've applied for.</p>

           {loading ? (
              <div className="text-center py-12">Loading...</div>
           ) : apps.length === 0 ? (
              <Card className="text-center py-12 text-muted">
                 <h3 className="text-xl font-medium mb-2">No applications yet</h3>
                 <p>Jobs you apply for will appear here.</p>
              </Card>
           ) : (
              <div className="flex flex-col gap-4">
                 {apps.map(app => (
                    <Card key={app.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-6 hover:border-primary transition-colors">
                       <div className="mb-4 sm:mb-0">
                          <h3 className="text-lg font-bold mb-1">{app.jobs?.title}</h3>
                          <p className="text-sm font-medium text-gray-600 mb-2">{app.jobs?.employer_name}</p>
                          <div className="flex items-center gap-4 text-xs text-muted font-medium">
                             <span className="flex items-center gap-1"><MapPin size={14} /> {app.jobs?.location}</span>
                             <span className="flex items-center gap-1"><IndianRupee size={14} /> {app.jobs?.salary}/mo</span>
                          </div>
                       </div>
                       <div className="flex sm:flex-col items-center sm:items-end gap-2 justify-between">
                          <span className="text-xs text-gray-400 font-medium">Status</span>
                          {getStatusBadge(app.status)}
                       </div>
                    </Card>
                 ))}
              </div>
           )}
       </div>
    </div>
  );
};

export default Applications;
