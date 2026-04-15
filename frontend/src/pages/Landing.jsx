import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, CheckCircle2, ShieldCheck, MapPin, IndianRupee, Briefcase, ChevronRight, UserPlus, FileText, CheckCircle, User, Clock } from 'lucide-react';
import './employee/HomeLanding.css';

const Landing = ({ user }) => {
  const navigate = useNavigate();
  const isEmployer = user?.role === 'employer';
  const isEmployee = user?.role === 'employee';
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isEmployee) {
      fetchJobs();
    }
  }, [isEmployee]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/jobs?status=approved');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const displayedJobs = jobs.slice(0, 6);

  return (
    <div className="home-page-container page-enter">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <div className="hero-glow hero-glow-alt"></div>
        
        <div className="hero-greeting-chip">
           {isEmployee ? `Welcome back, ${user?.name || user?.phone || 'Applicant'}` : 'Welcome to RozgarDo'}
        </div>

        <h1 className="hero-title">{isEmployee ? "Let's find your next job today." : "Connecting workers with real jobs across India."}</h1>
        <p className="hero-subtitle">
          The unified platform for <strong>Drivers | Helpers | Delivery | Cooks | Cleaners</strong>. Start earning instantly.
        </p>
        {!isEmployer && (
        <div className="hero-cta-group mt-2">
          {isEmployee ? (
            <>
              <button className="hero-btn-primary px-8" onClick={() => document.getElementById('latest-jobs').scrollIntoView({ behavior: 'smooth' })}>
                Find Jobs <ChevronRight size={18} />
              </button>
              <button className="hero-btn-secondary px-8" onClick={() => navigate('/applications')}>
                My Applications
              </button>
            </>
          ) : (
            <button className="hero-btn-primary px-8" onClick={() => navigate('/login')}>
              Get Started <ChevronRight size={18} />
            </button>
          )}
        </div>
        )}
        <div className="hero-trust-line mt-4">
           <ShieldCheck size={18} className="text-primary" /> No agents. Verified jobs only.
        </div>
      </section>


      {/* 2. ABOUT / VALUE SECTION */}
      <section className="value-section">
        <div className="section-container">
          <div className="value-grid">
            <div className="value-card">
               <div className="value-icon-wrapper">
                 <Zap size={32} />
               </div>
               <h3 className="value-title">Find work faster</h3>
               <p className="value-desc">Get verified jobs near you instantly and start earning without delays or endless interviews.</p>
            </div>
            <div className="value-card">
               <div className="value-icon-wrapper green">
                 <CheckCircle2 size={32} />
               </div>
               <h3 className="value-title">Hire instantly</h3>
               <p className="value-desc">Connect with reliable, background-checked workers perfectly suited for your immediate business needs.</p>
            </div>
            <div className="value-card">
               <div className="value-icon-wrapper purple">
                 <ShieldCheck size={32} />
               </div>
               <h3 className="value-title">100% Verified jobs</h3>
               <p className="value-desc">Every employer and job listing goes through rigorous safety checks before reaching your screen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. JOB LISTING (For Logged in Employees) */}
      {isEmployee && (
        <section className="jobs-section" id="latest-jobs">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title flex items-center gap-2 justify-center">
                 Latest Jobs Near You
              </h2>
              <p className="section-subtitle">Discover fresh opportunities posted by trusted companies matching your profile.</p>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted text-lg">Loading active jobs...</div>
            ) : (
              <div className="jobs-list-layer">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                  {displayedJobs.length > 0 ? (
                    displayedJobs.map((job, index) => {
                      const isUrgent = index % 3 === 0;
                      const companyInitial = job.employer_name ? job.employer_name.charAt(0).toUpperCase() : 'C';

                      return (
                        <div key={job.id} className="premium-job-card cursor-pointer flex flex-col justify-between h-full bg-white" onClick={() => navigate(`/jobs/${job.id}`)}>
                          <div className="flex flex-col gap-4">
                             <div className="job-card-header mb-0">
                                <div className="flex items-start gap-3 w-full">
                                   <div className="company-logo-circle">{companyInitial}</div>
                                   <div className="flex-1 min-w-0 pr-2">
                                      <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors job-card-title-fixed">{job.title}</h3>
                                      <p className="text-slate-500 font-medium text-sm mt-1 line-clamp-1 truncate">{job.employer_name}</p>
                                   </div>
                                </div>
                             </div>
                             <div className="flex flex-wrap items-center gap-2 mb-2 min-h-[32px]">
                                <span className="job-badge-category">{job.category}</span>
                                <div className="ml-auto flex items-center">
                                  {isUrgent ? (
                                     <span className="job-badge-urgent">Urgent</span>
                                  ) : (
                                     <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Posted {Math.floor(Math.random() * 5) + 1}d ago</span>
                                  )}
                                </div>
                             </div>
                          </div>
                          <div className="mt-auto">
                             <div className="flex justify-between items-center py-4">
                                <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-sm bg-slate-50 px-3 py-1.5 rounded-full whitespace-nowrap">
                                   <MapPin size={16} className="text-slate-400" /> {job.location}
                                </div>
                                <div className="job-card-salary whitespace-nowrap">
                                   <IndianRupee size={16} /> {job.salary}
                                </div>
                             </div>
                             <div className="job-card-actions pt-4 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                                <Link to={`/jobs/${job.id}`} className="w-full">
                                   <button className="btn-apply-job w-full h-full text-sm">View Details</button>
                                </Link>
                             </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-12 text-center text-muted">
                      <h3 className="text-xl font-medium">No verified jobs at the moment</h3>
                      <p>Check back soon to be the first to apply!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {displayedJobs.length >= 4 && (
               <div className="jobs-show-all-btn">
                 <button className="px-8 shadow-sm" onClick={() => navigate('/all-jobs')} style={{ padding: '0.75rem 2rem', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                   View All Active Jobs
                 </button>
               </div>
            )}
          </div>
        </section>
      )}

      {/* 4. HOW IT WORKS */}
      <section className="steps-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in minutes and find your next opportunity effortlessly.</p>
          </div>
          
          <div className="steps-grid">
             <div className="step-card">
               <div className="step-number">1</div>
               <UserPlus size={40} className="text-primary mb-2 opacity-80" />
               <h3 className="step-title">Create Profile</h3>
               <p className="step-desc">Register securely using your mobile number and set up a verified profile detailing your skills.</p>
             </div>
             <div className="step-card">
               <div className="step-number">2</div>
               <FileText size={40} className="text-primary mb-2 opacity-80" />
               <h3 className="step-title">Find Jobs</h3>
               <p className="step-desc">Browse jobs precisely matched to your location and categories and apply with a single tap.</p>
             </div>
             <div className="step-card">
               <div className="step-number">3</div>
               <CheckCircle size={40} className="text-primary mb-2 opacity-80" />
               <h3 className="step-title">Get Hired</h3>
               <p className="step-desc">Receive direct calls from checked employers instantly and start your new job effortlessly.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="site-footer">
         <div className="footer-content">
            <div className="footer-brand">
               <h2>
                 <ShieldCheck size={28} className="text-primary" /> RozgarDo
               </h2>
               <p>Revolutionizing the blue-collar job market in India. We instantly connect skilled workers with reliable employers bridging the gap without unfair agent fees.</p>
            </div>
            
            <div className="footer-links">
               <h3>Quick Links</h3>
               <ul>
                 <li><Link to="/login">Sign In / Register</Link></li>
                 <li><Link to="/login">Post a Job</Link></li>
               </ul>
            </div>
            
            <div className="footer-links">
               <h3>Support</h3>
               <ul>
                 <li><a href="#">Contact Us</a></li>
                 <li><a href="#">support@rozgardo.in</a></li>
                 <li><a href="#">Terms of Service</a></li>
                 <li><a href="#">Privacy Policy</a></li>
               </ul>
            </div>
         </div>
         
         <div className="footer-bottom">
           © 2026 RozgarDo Technologies. Built for India.
         </div>
      </footer>

    </div>
  );
};

export default Landing;