import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ArrowLeft, MapPin, IndianRupee, Briefcase, CheckCircle } from 'lucide-react';

const JobDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data);
      } else {
        throw new Error('Failed to fetch job');
      }
    } catch (err) {
      console.error(err);
      // MOCK DATA FOR DEMO
      setJob({ 
         id: parseInt(id), 
         title: 'Experienced Driver needed', 
         category: 'Driver', 
         salary: 15000, 
         location: 'Mumbai', 
         employer_name: 'Tata Motors Corp', 
         status: 'approved',
         created_at: new Date().toISOString(),
         description: 'Looking for a reliable and experienced driver with a valid commercial license. Responsibilities include safe transport of company executives, vehicle maintenance, and adhering to strict schedules.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await fetch('http://localhost:5001/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: job.id, employee_id: user.id })
      });
      
      if (res.ok) {
         setApplied(true);
      } else {
         const data = await res.json();
         throw new Error(data.error || 'Failed to apply');
      }
    } catch (err) {
      console.error(err);
      // MOCK APPLICATION
      setTimeout(() => setApplied(true), 1000);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="container py-12 text-center">Loading...</div>;
  if (!job) return <div className="container py-12 text-center text-danger">Job not found</div>;

  return (
    <div className="container py-8 page-enter">
       <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Jobs
          </Link>

          <Card className="p-8">
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-gray-100">
                <div>
                  <span className="badge badge-approved mb-4">{job.category}</span>
                  <h1 className="text-3xl font-bold mb-3">{job.title}</h1>
                  <p className="text-xl text-gray-700 font-medium flex items-center gap-2">
                     <Briefcase size={22} className="text-gray-400" /> {job.employer_name}
                  </p>
                </div>
                
                <div className="flex flex-col gap-4 min-w-[200px]">
                   <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                      <IndianRupee className="text-primary" />
                      <div>
                        <p className="text-sm text-muted">Salary</p>
                        <p className="font-bold text-lg">{job.salary}/month</p>
                      </div>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                      <MapPin className="text-primary" />
                      <div>
                        <p className="text-sm text-muted">Location</p>
                        <p className="font-bold text-lg">{job.location}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="mb-10">
                <h3 className="text-xl font-bold mb-4">Job Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                   {job.description || "The employer hasn't provided a full description yet. The role primarily involves duties associated with the job title."}
                </p>
             </div>

             <div className="flex justify-center md:justify-end">
                {applied ? (
                   <div className="flex items-center gap-2 text-success font-bold text-lg bg-green-50 px-6 py-3 rounded-md">
                      <CheckCircle /> Application Submitted!
                   </div>
                ) : (
                   <Button 
                     size="lg" 
                     className="w-full md:w-auto min-w-[200px]" 
                     onClick={handleApply}
                     disabled={applying}
                   >
                      {applying ? 'Applying...' : 'Apply Now'}
                   </Button>
                )}
             </div>
          </Card>
       </div>
    </div>
  );
};

export default JobDetails;
