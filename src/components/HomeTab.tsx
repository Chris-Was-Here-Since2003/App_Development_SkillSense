import React, { useState } from "react";
import { Search, Briefcase, Clock } from "lucide-react";
import { User, ResumeAnalysisResult, Job } from "../types";
import { DEFAULT_JOBS, RECENT_JOBS } from "../jobsData";
import { JobCard } from "./JobCard";
import { RecentJobCard } from "./RecentJobCard";

interface HomeTabProps {
  currentUser: User | null;
  analysisResult: ResumeAnalysisResult | null;
  setCurrentTab: (tab: "home" | "analysis") => void;
  setSelectedJob: (job: Job) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  currentUser,
  analysisResult,
  setCurrentTab,
  setSelectedJob,
}) => {
  // Local state for Search & Filters
  const [jobSearch, setJobSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterExperience, setFilterExperience] = useState("");

  const getUserDisplayName = () => {
    if (analysisResult?.personalInfo?.fullName) {
      return analysisResult.personalInfo.fullName;
    }
    const savedName = localStorage.getItem("skillsense_display_name");
    if (savedName) return savedName;
    if (currentUser) {
      const prefix = currentUser.email.split("@")[0];
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return "Hans"; // Default fallback matching mockup
  };

  const getProfileCompletion = () => {
    if (analysisResult) return "100%";
    if (currentUser) return "60%";
    return "40%";
  };

  // Job filtering logic
  const filteredRecommendedJobs = DEFAULT_JOBS.filter(job => {
    const matchesSearch = jobSearch === "" || 
      job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(jobSearch.toLowerCase()));
    
    const matchesLoc = filterLocation === "" || 
      job.location.toLowerCase().includes(filterLocation.toLowerCase()) ||
      (filterLocation === "Remote" && job.location.toLowerCase().includes("remote"));

    const matchesType = filterType === "" || job.type === filterType;
    const matchesExp = filterExperience === "" || job.experience === filterExperience;

    return matchesSearch && matchesLoc && matchesType && matchesExp;
  });

  const filteredRecentJobs = RECENT_JOBS.filter(job => {
    const matchesSearch = jobSearch === "" || 
      job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(jobSearch.toLowerCase()));
    
    const matchesLoc = filterLocation === "" || 
      job.location.toLowerCase().includes(filterLocation.toLowerCase()) ||
      (filterLocation === "Remote" && job.location.toLowerCase().includes("remote"));

    const matchesType = filterType === "" || job.type === filterType;
    const matchesExp = filterExperience === "" || job.experience === filterExperience;

    return matchesSearch && matchesLoc && matchesType && matchesExp;
  });

  return (
    <div className="dashboard-main max-w-[1200px] mx-auto px-4 md:px-6 py-8">
      {/* HERO BANNER SECTION */}
      <section className="hero-section rounded-2xl p-8 md:p-12 mb-8 text-white relative overflow-hidden" aria-label="Welcome Banner">
        <div className="hero-text relative z-10 max-w-xl">
          <h1 className="text-3xl md:text-4xl font-extrabold font-sans leading-tight">
            Welcome Back, {getUserDisplayName()}! 👋
          </h1>
          <p className="text-sm md:text-base opacity-90 mt-3 leading-relaxed">
            Find your next career opportunity with AI-powered recommendations tailored to your skills and experience.
          </p>
          <div className="hero-buttons flex gap-3 mt-6 flex-wrap">
            <button 
              onClick={() => setCurrentTab("analysis")}
              className="btn-hero-primary bg-white text-blue-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-95 transition-opacity cursor-pointer border-0 shadow-sm"
            >
              📄 Upload Resume
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById("recommended-jobs-list");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-hero-outline bg-transparent text-white border border-white/60 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/10 hover:border-white transition-all cursor-pointer"
            >
              Browse Jobs
            </button>
          </div>
        </div>
        <div className="hero-illustration hidden md:flex items-center justify-center text-5xl bg-white/10 rounded-2xl w-40 h-28 shrink-0 absolute right-12 top-1/2 -translate-y-1/2 z-10" aria-hidden="true">
          💼
        </div>
      </section>

      {/* SEARCH & FILTERS SECTION */}
      <section className="search-section bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm mb-8" aria-label="Job Search">
        <div className="search-row flex flex-col md:flex-row gap-3 items-center">
          
          {/* Search query input */}
          <div className="search-input-wrap flex-2 relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              className="search-input w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-blue-600 focus:bg-white transition-all"
              placeholder="Search jobs, skills, or companies..."
              aria-label="Search jobs, skills, or companies" 
            />
          </div>

          {/* Location dropdown */}
          <div className="w-full md:w-auto md:flex-1">
            <select 
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="search-select w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm cursor-pointer outline-none focus:border-blue-600"
              aria-label="Filter by location"
            >
              <option value="">📍 Location</option>
              <option value="Cebu City">Cebu City</option>
              <option value="Manila">Manila</option>
              <option value="Davao">Davao</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Job Type dropdown */}
          <div className="w-full md:w-auto md:flex-1">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="search-select w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm cursor-pointer outline-none focus:border-blue-600"
              aria-label="Filter by job type"
            >
              <option value="">💼 Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Experience Level dropdown */}
          <div className="w-full md:w-auto md:flex-1">
            <select 
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className="search-select w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm cursor-pointer outline-none focus:border-blue-600"
              aria-label="Filter by experience level"
            >
              <option value="">📊 Experience</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>
          </div>

          {/* Search Reset/Action Button */}
          <button 
            onClick={() => {
              setJobSearch("");
              setFilterLocation("");
              setFilterType("");
              setFilterExperience("");
            }}
            className="w-full md:w-auto bg-[#DBEAFE] text-blue-600 hover:bg-blue-100 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer border-0"
          >
            Clear
          </button>
        </div>
      </section>

      {/* AI RECOMMENDED JOBS SECTION */}
      <section className="ai-jobs-section mb-10" id="recommended-jobs-list" aria-label="AI Recommended Jobs">
        <div className="section-header flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🤖 Recommended For You</span>
            {analysisResult && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold uppercase">
                Live AI Scoring Match Active
              </span>
            )}
          </h2>
          <span className="text-xs text-slate-400">
            Showing {filteredRecommendedJobs.length} matches
          </span>
        </div>

        {filteredRecommendedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No recommended jobs matching your filter criteria.</p>
            <p className="text-xs mt-1">Try adjusting the search query or drop filter values.</p>
          </div>
        ) : (
          <div className="jobs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecommendedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                analysisResult={analysisResult}
                onViewDetails={setSelectedJob}
              />
            ))}
          </div>
        )}
      </section>

      {/* RECENTLY POSTED SECTION */}
      <section className="recent-jobs-section mb-10" aria-label="Recently Posted Jobs">
        <div className="section-header flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-slate-900">🕐 Recently Posted</h2>
        </div>

        {filteredRecentJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No recently posted jobs matching your filters.</p>
          </div>
        ) : (
          <div className="recent-jobs-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredRecentJobs.map((job) => (
              <RecentJobCard
                key={job.id}
                job={job}
                onViewDetails={setSelectedJob}
              />
            ))}
          </div>
        )}
      </section>

      {/* BOTTOM GRID: CAREER INSIGHTS + RESUME STATUS */}
      <div className="bottom-grid grid grid-cols-1 lg:grid-cols-2 gap-6" id="applications-section">
        {/* CAREER INSIGHTS */}
        <section className="insights-section bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" aria-label="Career Insights">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">📊 Career Insights</h2>
          <div className="insights-cards grid grid-cols-3 gap-3">
            <div className="insight-card bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
              <div className="insight-icon text-xl mb-1">🤖</div>
              <div className="insight-value text-2xl font-black text-blue-600">{filteredRecommendedJobs.length}</div>
              <div className="insight-label text-[10px] text-slate-500 font-semibold mt-1">AI Job Matches</div>
            </div>

            <div className="insight-card bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
              <div className="insight-icon text-xl mb-1">🚀</div>
              <div className="insight-value text-2xl font-black text-blue-600">{analysisResult ? 4 : 2}</div>
              <div className="insight-label text-[10px] text-slate-500 font-semibold mt-1">Simulated Paths</div>
            </div>

            <div className="insight-card bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
              <div className="insight-icon text-xl mb-1">👤</div>
              <div className="insight-value text-2xl font-black text-blue-600">{getProfileCompletion()}</div>
              <div className="insight-label text-[10px] text-slate-500 font-semibold mt-1">Profile Readiness</div>
            </div>
          </div>
        </section>

        {/* RESUME STATUS CARD */}
        <section className="resume-section bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" aria-label="Resume Status">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">📄 Resume Status</h2>

          {analysisResult ? (
            <div className="resume-card bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="resume-status-row flex items-center gap-3 mb-4">
                <div className="resume-icon w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-lg">
                  📄
                </div>
                <div className="resume-status-text">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {analysisResult.personalInfo.fullName || "Resume Uploaded"}
                  </h4>
                  <div className="status-check text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <span>✓ Analyzed by AI</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-normal">{analysisResult.personalInfo.email}</span>
                  </div>
                </div>
              </div>

              <div className="detected-skills-label text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                Skills Detected:
              </div>
              <div className="detected-skills flex flex-wrap gap-1 mb-4">
                {analysisResult.skills.slice(0, 8).map((skill, idx) => (
                  <span key={idx} className="skill-tag text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    {skill.name}
                  </span>
                ))}
                {analysisResult.skills.length > 8 && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    +{analysisResult.skills.length - 8} more
                  </span>
                )}
              </div>

              <button 
                onClick={() => setCurrentTab("analysis")}
                className="btn-update-resume w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors border-0 cursor-pointer"
              >
                Update Resume / Re-Analyze
              </button>
            </div>
          ) : (
            <div className="resume-card bg-slate-50 border border-slate-100 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2 text-slate-400">📁</div>
              <h4 className="text-sm font-bold text-slate-800">No Resume Analyzed Yet</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 max-w-xs mx-auto">
                Upload your resume to instantly unlock personal skill heatmaps, competitive index, and precise matching!
              </p>
              <button 
                onClick={() => setCurrentTab("analysis")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors border-0 cursor-pointer shadow-sm shadow-blue-100"
              >
                Upload Resume Now
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
