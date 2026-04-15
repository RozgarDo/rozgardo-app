import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, Briefcase, ShieldCheck } from 'lucide-react';

const JobCard = ({ job, compact = false }) => {
  const initial = job.employer_name ? job.employer_name.charAt(0).toUpperCase() : 'C';

  if (compact) {
    return (
      <Link 
        to={`/jobs/${job.id}`}
        className="block bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-indigo-100 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {job.title}
            </h4>
            <p className="text-[10px] text-gray-500 truncate">{job.employer_name}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 font-medium">
          <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
          <span className="text-green-600 font-bold">₹{job.salary}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/jobs/${job.id}`}
      className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all flex flex-col justify-between h-full group"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100 shadow-sm">
              {initial}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                {job.title}
              </h3>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">{job.employer_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[9px] font-bold border border-green-100">
            <ShieldCheck size={10} /> Verified
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[9px] font-bold uppercase tracking-wider border border-gray-100">
            {job.category}
          </span>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold uppercase tracking-wider border border-indigo-100">
            {job.job_type || 'Full Time'}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
          <MapPin size={12} className="text-gray-300" />
          {job.location}
        </div>
        <div className="flex items-center gap-0.5 text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
          <IndianRupee size={12} strokeWidth={3} />
          {job.salary}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
