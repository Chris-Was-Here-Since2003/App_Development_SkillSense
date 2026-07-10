import React from "react";
import { Job, ResumeAnalysisResult } from "../types";

interface JobCardProps {
  job: Job;
  analysisResult: ResumeAnalysisResult | null;
  onViewDetails: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  analysisResult,
  onViewDetails,
}) => {
  // Calculate dynamic match percentage
  const getSkillsIntersection = (jobSkills: string[]) => {
    if (!analysisResult) return { intersection: [], percentage: 0 };
    const mySkills = analysisResult.skills.map(s => s.name.toLowerCase());
    
    // Find skill matches
    const intersection = jobSkills.filter(js => 
      mySkills.some(ms => ms.includes(js.toLowerCase()) || js.toLowerCase().includes(ms))
    );
    
    // Match score formula: base 55% + dynamic percentage
    const ratio = jobSkills.length > 0 ? (intersection.length / jobSkills.length) : 0;
    const percentage = Math.round(55 + ratio * 43); // scaled beautifully between 55% and 98%
    
    return { intersection, percentage };
  };

  const { intersection, percentage } = getSkillsIntersection(job.skills);

  const displayedScore = analysisResult 
    ? percentage 
    : (job.id === "job-recom-1" ? 92 
       : job.id === "job-recom-2" ? 88 
       : job.id === "job-recom-3" ? 85 
       : job.id === "job-recom-4" ? 81 
       : job.id === "job-recom-5" ? 78 
       : 75);

  return (
    <article className="job-card bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-blue-100 hover:shadow-md transition-all flex flex-col gap-4">
      <div className="job-card-top flex justify-between items-start">
        <div className={`company-logo w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${job.logoBg}`} aria-hidden="true">
          {job.logoLetter}
        </div>
        <span className={`match-badge text-[11px] font-bold px-2.5 py-1 rounded-full text-white ${
          displayedScore >= 85 ? "bg-emerald-500" : "bg-blue-500"
        }`}>
          {displayedScore}% Match
        </span>
      </div>

      <div>
        <h3 className="job-title text-base font-bold text-slate-900 leading-snug">{job.title}</h3>
        <p className="company-name text-xs text-slate-500 mt-0.5">{job.company}</p>
      </div>

      <div className="job-location text-xs text-slate-500 flex items-center gap-1">
        <span>📍 {job.location}</span>
        <span className="text-slate-300">•</span>
        <span>💼 {job.type}</span>
      </div>

      {/* Match bar */}
      <div className="match-bar-wrap flex flex-col gap-1">
        <div className="match-bar-label flex justify-between text-[11px] font-semibold text-slate-400">
          <span>Skills Match</span>
          <span className="text-emerald-500 font-bold">{displayedScore}%</span>
        </div>
        <div className="match-bar-track h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="match-bar-fill h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
            style={{ width: `${displayedScore}%`, transition: "width 1s ease-in-out" }}
          ></div>
        </div>
      </div>

      <div className="skills-row flex flex-wrap gap-1">
        {job.skills.map((skill, index) => {
          const isMatched = analysisResult && intersection.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()));
          return (
            <span 
              key={index} 
              className={`skill-tag text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                isMatched 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-blue-50 text-blue-600 border-blue-100"
              }`}
            >
              {isMatched && "✓ "}{skill}
            </span>
          );
        })}
      </div>

      <div className="job-card-actions flex gap-2 mt-auto pt-2">
        <button 
          onClick={() => onViewDetails(job)}
          className="btn-view w-full bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer text-center"
        >
          View Details
        </button>
      </div>
    </article>
  );
};
