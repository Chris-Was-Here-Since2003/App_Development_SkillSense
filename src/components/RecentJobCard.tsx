import React from "react";
import { Job } from "../types";

interface RecentJobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
}

export const RecentJobCard: React.FC<RecentJobCardProps> = ({
  job,
  onViewDetails,
}) => {
  return (
    <article className="recent-job-card bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-blue-100 transition-all flex flex-col justify-between">
      <div>
        <span className="job-type-badge inline-block bg-blue-50 text-blue-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mb-3">
          {job.type}
        </span>
        <h3 className="job-title text-sm font-bold text-slate-900 leading-snug">{job.title}</h3>
        <p className="company-name text-xs text-slate-500 mt-1">{job.company}</p>
        
        <div className="job-meta flex items-center gap-1.5 text-[11px] text-slate-400 mt-3 mb-2">
          <span>📍 {job.location}</span>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-50 pt-3">
        <div className="salary text-xs font-extrabold text-emerald-600 mb-1">{job.salary}</div>
        <div className="posted-date text-[10px] text-slate-400">Posted {job.postedDate}</div>
        
        <div className="mt-3">
          <button 
            onClick={() => onViewDetails(job)}
            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg border-0 transition-colors text-center"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
};
