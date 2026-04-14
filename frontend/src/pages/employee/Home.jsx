import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Search, MapPin, IndianRupee, Briefcase } from 'lucide-react';

const Home = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/jobs?status=approved');
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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (job.employer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? job.category === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-8 page-enter">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
           <h1 className="text-3xl font-bold mb-2">Find Your Next Job</h1>
           <p className="text-muted text-lg">Browse active opportunities waiting for you.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
           <div className="flex-1 md:w-64 relative">
             <Input 
               placeholder="Search job title, company, location..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               containerStyle={{ paddingLeft: '0' }}
             />
           </div>
           
           <select 
             className="px-4 py-2 border border-gray-200 rounded-md outline-none focus:border-primary transition-colors bg-white font-medium"
             value={category}
             onChange={(e) => setCategory(e.target.value)}
           >
              <option value="">All Categories</option>
              <option value="Driver">Driver</option>
              <option value="Cook">Cook</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Helper">Helper</option>
              <option value="Security">Security</option>
           </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted text-lg">Loading jobs...</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <Card key={job.id} hoverEffect={true} className="flex flex-col h-full bg-white">
               <div className="mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-blue-50 px-3 py-1 rounded-full mb-3 inline-block">
                     {job.category}
                  </span>
                  <h3 className="text-xl font-bold line-clamp-2 mb-1">{job.title}</h3>
                  <p className="text-muted flex items-center gap-1 font-medium text-sm mt-2">
                     <Briefcase size={16} /> {job.employer_name}
                  </p>
               </div>
               
               <div className="flex justify-between items-center py-4 border-t border-b border-gray-100 mb-6 mt-auto">
                  <div className="flex items-center gap-2 text-gray-600 font-medium">
                     <MapPin size={18} className="text-gray-400" /> {job.location}
                  </div>
                  <div className="flex items-center gap-1 font-bold text-gray-800">
                     <IndianRupee size={16} /> {job.salary}/mo
                  </div>
               </div>

               <Link to={`/jobs/${job.id}`} className="w-full">
                 <Button className="w-full">View Details</Button>
               </Link>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium">No jobs found</h3>
            <p>No approved jobs are available right now. Check back soon!</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default Home;
