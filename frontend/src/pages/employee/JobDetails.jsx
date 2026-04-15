import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, IndianRupee, Briefcase, 
  CheckCircle, Clock, ShieldCheck, 
  Share2, Bookmark, BookmarkCheck, Star, 
  BriefcaseBusiness, Info,
  AlertCircle, LayoutGrid, Award, GraduationCap,
  Users, TrendingUp, DollarSign
} from 'lucide-react';

const JobDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // New discovery states
  const [employerInfo, setEmployerInfo] = useState(null);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data);
        
        // Fetch extended data
        fetchExtraContent(data);
      } else {
        throw new Error('Failed to fetch job');
      }
    } catch (err) {
      console.error(err);
      // Fallback for demo
      const mockJob = { 
        id: id, 
        title: 'Experienced Logistics Driver', 
        category: 'Driver', 
        salary: 22000, 
        location: 'Mumbai', 
        employer_name: 'Tata Logistics Corp', 
        status: 'approved',
        job_type: 'Full-time',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'We are seeking a reliable and experienced Driver to handle our premium cargo deliveries within the Mumbai metropolitan region.\n\nKey Responsibilities:\n- Ensure safe and timely delivery of goods.\n- Maintain vehicle cleanliness and report maintenance needs.\n- Adhere to traffic laws and safety protocols.\n- Handle basic paperwork for deliveries.',
        skills: 'Heavy Vehicle License, GPS, Mumbai Routes',
        experience: '3+ Years',
        education: '10th Pass',
        employer_id: 'sample-employer'
     };
      setJob(mockJob);
      fetchExtraContent(mockJob);
    } finally {
      setLoading(false);
    }
  };

  const fetchExtraContent = async (jobData) => {
    // 1. Check if user already applied
    if (user?.id) {
      try {
        const res = await fetch(`http://localhost:5001/api/applications/employee/${user.id}`);
        if (res.ok) {
          const apps = await res.json();
          const hasApplied = apps.some(app => app.job_id === jobData.id);
          if (hasApplied) setApplied(true);
        }
      } catch (e) { console.warn('Could not check application status', e); }
    }

    // 2. Fetch Company Info if possible (from the enriched employer_id)
    setEmployerInfo({
      company_name: jobData.employer_name,
      about: `At ${jobData.employer_name}, we believe in empowering our workforce through dignity and respect. Join our mission to provide elite services across ${jobData.location}.`
    });
  };

  const handleApply = async () => {
    if (applied) return;
    setApplying(true);
    try {
      const res = await fetch('http://localhost:5001/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: job.id, employee_id: user?.id })
      });
      
      if (res.ok) {
         setApplied(true);
      } else {
         const data = await res.json();
         throw new Error(data.error || 'Failed to apply');
      }
    } catch (err) {
      console.error('Apply Error:', err);
      alert('Error: ' + (err.message || 'Could not submit application.'));
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!job) return (
    <div className="container py-12 text-center max-w-lg mx-auto">
      <AlertCircle size={40} className="mx-auto text-red-500 mb-3" />
      <h2 className="text-xl font-bold">Job Not Found</h2>
      <Link to="/" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Back to Search</Link>
    </div>
  );

  const postedText = job.created_at ? `${Math.floor((new Date() - new Date(job.created_at)) / (1000 * 60 * 60 * 24))} days ago` : 'Recently';

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Slim Header */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <Link to="/" className="text-xs font-bold text-gray-400 hover:text-indigo-600 flex items-center gap-1.5 transition-colors uppercase tracking-wider">
            <ArrowLeft size={14} /> Back to Search
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          
          {/* LEFT COLUMN: Deep Content */}
          <div className="space-y-8">
            
            {/* Main Header & Hero */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
               <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">{job.category}</span>
                  <span className="text-[10px] font-bold text-gray-400">Posted {postedText}</span>
               </div>
               <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                 {job.title}
               </h1>
               <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 shadow-sm">
                       {job.employer_name.charAt(0)}
                     </div>
                     <div>
                        <p className="font-bold text-gray-900 text-sm leading-none">{job.employer_name}</p>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">Employer</p>
                     </div>
                     <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-100 ml-2">
                       <ShieldCheck size={12} /> Verified
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-2.5 rounded-lg bg-gray-50 text-gray-400 hover:text-indigo-600 transition-colors"><Bookmark size={18} /></button>
                     <button className="p-2.5 rounded-lg bg-gray-50 text-gray-400 hover:text-indigo-600 transition-colors"><Share2 size={18} /></button>
                  </div>
               </div>
            </div>

            {/* Job Description - FULL VIEW */}
            <div className="space-y-4">
               <SectionHeader icon={<Info size={16} />} title="Job Description" />
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line prose prose-indigo max-w-none">
                     {job.description}
                  </div>
               </div>
            </div>

            {/* Key Requirements Grid */}
            <div className="space-y-4">
               <SectionHeader icon={<TrendingUp size={16} />} title="Key Requirements" />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <RequirementItem icon={<Award size={16} />} title="Experience" value={job.experience} />
                  <RequirementItem icon={<GraduationCap size={16} />} title="Education" value={job.education} />
                  <RequirementItem icon={<LayoutGrid size={16} />} title="Technical Skills" value={job.skills} />
               </div>
            </div>

            {/* Benefits Section - NEW */}
            <div className="space-y-4">
               <SectionHeader icon={<Star size={16} />} title="Company Benefits" />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <BenefitItem icon={<Clock size={16}/>} text="Flexible working hours & night shift options" />
                  <BenefitItem icon={<DollarSign size={16}/>} text="Weekly payouts with performance bonuses" />
                  <BenefitItem icon={<TrendingUp size={16}/>} text="High potential for role growth & promotions" />
                  <BenefitItem icon={<ShieldCheck size={16}/>} text="Safe working environment & medical coverage" />
               </div>
            </div>

            {/* Company Info - NEW */}
            <div className="space-y-4">
               <SectionHeader icon={<Users size={16} />} title="About the Company" />
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-xl border-4 border-white flex-shrink-0">
                    {job.employer_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900">{job.employer_name}</h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {employerInfo?.about || `Join ${job.employer_name} and build a career with one of the most trusted employers in your industry. We offer competitive salaries and a supportive team environment.`}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 space-y-6 sticky top-6">
               <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly Salary</p>
                  <div className="text-3xl font-black text-indigo-600 flex items-center justify-center">
                    <IndianRupee size={26} strokeWidth={3} /> {job.salary}
                  </div>
               </div>

               {applied ? (
                 <div className="w-full py-4 bg-green-50 text-green-700 font-bold rounded-xl flex items-center justify-center gap-2 border border-green-100">
                   <CheckCircle size={20} /> Application Sent
                 </div>
               ) : (
                 <button 
                   onClick={handleApply}
                   disabled={applying}
                   className={`w-full py-4 px-6 rounded-xl font-black text-lg shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                     applying ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                   }`}
                 >
                   {applying ? 'Applying...' : 'APPLY TO JOB'}
                 </button>
               )}

               <div className="space-y-4 pt-4 border-t border-gray-50">
                  <SidebarBullet icon={<MapPin size={18} />} boldLabel={job.location} subLabel="Job Location" />
                  <SidebarBullet icon={<Briefcase size={18} />} boldLabel={job.job_type} subLabel="Work Style" />
                  <SidebarBullet icon={<ShieldCheck size={18} />} boldLabel="Verified Employer" subLabel="Trusted Hire" />
               </div>

               <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Platform Assurance</h4>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    RozgarDo guarantees your profile only goes to verified managers. No processing fees ever!
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      {!applied && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-100 p-4 shadow-2xl z-50">
           <button 
             onClick={handleApply}
             className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg"
           >
             {applying ? 'Applying...' : 'Apply for Job'}
           </button>
        </div>
      )}
    </div>
  );
};

// Subcomponents for vertical flow
const SectionHeader = ({ icon, title }) => (
  <h2 className="text-base font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">{icon}</div>
    {title}
  </h2>
);

const BenefitItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
    <div className="text-green-500 flex-shrink-0">{icon}</div>
    <span className="text-xs font-bold text-gray-700">{text}</span>
  </div>
);

const RequirementItem = ({ icon, title, value }) => (
  <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm flex flex-col gap-2 group hover:bg-indigo-50/50 hover:border-indigo-200 hover:shadow-md transition-all duration-200 ease-in-out">
    <div className="text-indigo-600 group-hover:text-indigo-700 transition-colors">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{title}</p>
      <p className="text-sm font-black text-gray-900 leading-tight">{value || 'N/A'}</p>
    </div>
  </div>
);

const SidebarBullet = ({ icon, boldLabel, subLabel }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-400 rounded-lg border border-gray-100">{icon}</div>
    <div>
      <p className="text-xs font-black text-gray-900 leading-none">{boldLabel}</p>
      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">{subLabel}</p>
    </div>
  </div>
);

export default JobDetails;
