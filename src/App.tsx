import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Brain, 
  Compass, 
  HelpCircle, 
  RefreshCw, 
  AlertCircle, 
  TrendingUp, 
  Info,
  LogOut,
  User as UserIcon,
  History,
  Trash2,
  Clock,
  Database,
  Lock,
  ChevronDown,
  Bell,
  Briefcase,
  Search,
  MapPin,
  CheckCircle2,
  X,
  FileText,
  Calendar,
  Check
} from "lucide-react";
import ResumeUpload from "./components/ResumeUpload";
import AnalysisDashboard from "./components/AnalysisDashboard";
import AccountModal from "./components/AccountModal";
import { ResumeAnalysisResult, User, SavedResume, Job } from "./types";
import { SAMPLE_RESUMES } from "./sampleData";
import { DEFAULT_JOBS, RECENT_JOBS } from "./jobsData";
import { JobCard } from "./components/JobCard";
import { RecentJobCard } from "./components/RecentJobCard";
import { JobDetailsModal } from "./components/JobDetailsModal";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [resetKey, setResetKey] = useState(0);

  // Core navigation state: "home" | "analysis"
  const [currentTab, setCurrentTab] = useState<"home" | "analysis">("home");

  // Job Search, Filters, Applications & Details
  const [jobSearch, setJobSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>(["job-recent-3"]); // Default seeded history
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplySuccess, setShowApplySuccess] = useState<string | null>(null);

  // Authentication & SQL Relational Database States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [isCurrentResumeSaved, setIsCurrentResumeSaved] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const loadingPhrases = [
    "Parsing resume document structures...",
    "Extracting work experience timelines and metrics...",
    "Categorizing technical, soft, and domain skill vectors...",
    "Accessing real-time 2026 labor market statistics...",
    "Simulating 2031 technological automation and stack disruption indices...",
    "Running multi-epoch career trajectory models...",
    "Assembling strategic gap analysis and professional coach recommendations...",
    "Wrapping visual dashboard parameters..."
  ];

  // Read current user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("skillsense_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
      } catch (e) {
        console.error("Error reading stored user session:", e);
      }
    }
  }, []);

  // Fetch saved analyses when user logs in or switches
  const fetchSavedResumes = async (userId: string) => {
    try {
      const response = await fetch("/api/resumes", {
        headers: {
          "x-user-id": userId
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSavedResumes(data);
      }
    } catch (err) {
      console.error("Failed to load SQL database history:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchSavedResumes(currentUser.id);
    } else {
      setSavedResumes([]);
    }
    setIsCurrentResumeSaved(false);
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("skillsense_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("skillsense_user");
    localStorage.removeItem("skillsense_display_name");
    setShowHistoryDropdown(false);
    setIsCurrentResumeSaved(false);
  };

  // SQL Persistence Handlers
  const handleSaveCurrentAnalysis = async () => {
    if (!currentUser || !analysisResult) return;
    setIsSavingResume(true);
    try {
      const candidateName = analysisResult.personalInfo.fullName || "Resume Analysis";
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id
        },
        body: JSON.stringify({
          name: candidateName,
          parsedData: analysisResult
        })
      });

      if (response.ok) {
        setIsCurrentResumeSaved(true);
        fetchSavedResumes(currentUser.id);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save analysis.");
      }
    } catch (err) {
      console.error("SQL Save analysis failed:", err);
    } finally {
      setIsSavingResume(false);
    }
  };

  const handleDeleteSavedResume = async (resumeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    if (!confirm("Are you sure you want to delete this saved analysis from your SQL database?")) return;

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": currentUser.id
        }
      });

      if (response.ok) {
        setSavedResumes((prev) => prev.filter((r) => r.id !== resumeId));
        setIsCurrentResumeSaved(false);
      } else {
        alert("Failed to delete analysis.");
      }
    } catch (err) {
      console.error("Delete saved resume failed:", err);
    }
  };

  const handleSelectSavedResume = (resume: SavedResume) => {
    setAnalysisResult(resume.parsedData);
    setIsCurrentResumeSaved(true);
    setShowHistoryDropdown(false);
    setCurrentTab("analysis"); // Go directly to analysis view to visualize selected resume
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 3000);
    } else {
      setLoadingPhraseIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async (payload: {
    textData?: string;
    fileData?: string;
    mimeType?: string;
    isSample?: boolean;
    sampleName?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setIsCurrentResumeSaved(false);

    // Short-circuit if it is a sample
    if (payload.isSample && payload.sampleName) {
      setTimeout(() => {
        const sample = SAMPLE_RESUMES[payload.sampleName!];
        if (sample) {
          setAnalysisResult(sample.data);
          setCurrentTab("analysis"); // switch to analysis view upon successful upload
        } else {
          setError("Sample not found.");
        }
        setIsLoading(false);
      }, 1500);
      return;
    }

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textData: payload.textData,
          fileData: payload.fileData,
          mimeType: payload.mimeType,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
      setCurrentTab("analysis"); // switch to analysis view upon successful upload
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during resume parsing. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setIsCurrentResumeSaved(false);
    setResetKey((prev) => prev + 1);
    setCurrentTab("analysis"); // Stay in the upload zone
  };

  // Get dynamic name of current user
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

  // Handle job applications
  const handleApplyJob = (jobId: string, jobTitle: string) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs(prev => [...prev, jobId]);
    }
    setShowApplySuccess(jobTitle);
    setTimeout(() => {
      setShowApplySuccess(null);
    }, 4000);
  };

  // Dynamic filter lists
  const allJobs = [...DEFAULT_JOBS, ...RECENT_JOBS];
  
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

  // Calculate Profile Completion
  const getProfileCompletion = () => {
    if (analysisResult) return "100%";
    if (currentUser) return "60%";
    return "40%";
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col justify-between" id="app-root">
      
      {/* ================================================
           TOP NAVIGATION BAR (from design)
           ================================================ */}
      <nav className="navbar flex items-center justify-between bg-white px-6 md:px-8 h-16 sticky top-0 z-50 border-b border-[#E5E7EB] shadow-sm">
        
        {/* Left: Logo */}
        <div className="nav-left flex items-center">
          <button 
            onClick={() => setCurrentTab("home")} 
            className="logo text-xl font-extrabold tracking-tight text-blue-600 hover:opacity-90 transition-opacity cursor-pointer border-0 bg-transparent flex items-center gap-1.5"
            aria-label="SkillSense Home"
          >
            <Brain className="w-5 h-5 text-blue-600" />
            Skill<span className="text-[#1E3A8A]">Sense</span>
          </button>
        </div>

        {/* Center: Nav Links */}
        <div className="nav-center hidden md:flex items-center gap-1">
          <button 
            onClick={() => setCurrentTab("home")}
            className={`nav-link px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer ${
              currentTab === "home" 
                ? "bg-[#DBEAFE] text-blue-600 font-bold" 
                : "text-slate-500 hover:bg-[#DBEAFE]/40 hover:text-blue-600"
            }`}
          >
            Home
          </button>
          
          <button 
            onClick={() => setCurrentTab("analysis")}
            className={`nav-link px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === "analysis" 
                ? "bg-[#DBEAFE] text-blue-600 font-bold" 
                : "text-slate-500 hover:bg-[#DBEAFE]/40 hover:text-blue-600"
            }`}
          >
            {analysisResult ? (
              <>
                <Sparkles className="w-4 h-4 text-amber-500" />
                AI Career Analysis
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-blue-500" />
                Upload & Analysis
              </>
            )}
          </button>

        </div>

        {/* Right: Actions (Notifications + User profile + SQL history) */}
        <div className="nav-right flex items-center gap-4">
          
          {/* SQL Account & History */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowHistoryDropdown(!showHistoryDropdown);
                  setShowNotifDropdown(false);
                }}
                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-all border border-slate-200 cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-slate-500" />
                SQL History ({savedResumes.length})
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showHistoryDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SQL analyses</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">SQLite3</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {savedResumes.length === 0 ? (
                      <div className="px-4 py-4 text-center text-xs text-gray-400 font-medium">
                        No saved analyses in database.
                      </div>
                    ) : (
                      savedResumes.map((resume) => (
                        <div
                          key={resume.id}
                          onClick={() => handleSelectSavedResume(resume)}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50/50 flex items-center justify-between gap-3 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                        >
                          <div className="min-w-0">
                            <span className="block text-xs font-bold text-slate-800 truncate">
                              {resume.name}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                              <Clock className="w-3 h-3 text-gray-300" />
                              {new Date(resume.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleDeleteSavedResume(resume.id, e)}
                            className="text-gray-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowHistoryDropdown(false);
              }}
              className="notif-btn p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative cursor-pointer" 
              aria-label="Notifications"
            >
              🔔
              <span className="notif-badge absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">3</span>
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-[#DBEAFE]/30">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">AI Career Notifications</span>
                  <span className="text-[10px] text-blue-600 font-semibold">Active Alerts</span>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="p-3 hover:bg-slate-50 text-xs text-slate-700 leading-relaxed">
                    <p className="font-semibold text-slate-900 mb-0.5">🤖 AI Match Alert</p>
                    Google Philippines updated requirements for <span className="font-bold text-blue-600">Data Analyst</span>. Your score is now 92%!
                    <span className="block text-[10px] text-slate-400 mt-1">2 hours ago</span>
                  </div>
                  <div className="p-3 hover:bg-slate-50 text-xs text-slate-700 leading-relaxed">
                    <p className="font-semibold text-slate-900 mb-0.5">📈 Labor Market Trend</p>
                    Python and AWS skills are seeing a <span className="font-bold text-emerald-600">15% demand surge</span> in Metro Cebu.
                    <span className="block text-[10px] text-slate-400 mt-1">5 hours ago</span>
                  </div>
                  <div className="p-3 hover:bg-slate-50 text-xs text-slate-700 leading-relaxed">
                    <p className="font-semibold text-slate-900 mb-0.5">💼 Recruiter Screening</p>
                    <span className="font-bold text-purple-600">CreativeHub Co.</span> viewed your profile and requested scheduling details.
                    <span className="block text-[10px] text-slate-400 mt-1">1 day ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Avatar Widget */}
          {currentUser ? (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div 
                onClick={handleLogout}
                className="avatar w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-sm cursor-pointer transition-colors shadow-sm"
                title={`${currentUser.email} - Click to Sign Out`}
                aria-label="User profile, click to sign out"
              >
                {getUserDisplayName().substring(0, 2).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="hidden lg:block text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-100 hover:shadow-blue-200 transition-all cursor-pointer border-0"
            >
              <UserIcon className="w-3.5 h-3.5" />
              My Account
            </button>
          )}

        </div>
      </nav>

      {/* Toast Alert for Job Application success */}
      {showApplySuccess && (
        <div className="fixed bottom-6 right-6 z-[100] bg-slate-950 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-slide-up max-w-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <Check className="w-4.5 h-4.5 font-bold" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Application Sent!</h4>
            <p className="text-xs text-slate-400 mt-0.5">Applied to {showApplySuccess}. Saved in SQL database!</p>
          </div>
          <button onClick={() => setShowApplySuccess(null)} className="ml-auto text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================================================
           MAIN VIEWS PORT
           ================================================ */}
      <main className="flex-1 w-full p-[10%]">
        {isLoading ? (
          /* Custom Loading Screen */
          <div className="w-full max-w-lg mx-auto text-center space-y-8 py-24 px-4" id="loading-state">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
              <Sparkles className="w-8 h-8 text-blue-600 absolute animate-pulse" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">Analyzing Your Potential...</h3>
              <p className="text-sm text-gray-500 min-h-[40px] font-mono transition-all duration-300">
                {loadingPhrases[loadingPhraseIndex]}
              </p>
            </div>

            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${((loadingPhraseIndex + 1) / loadingPhrases.length) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="w-full max-w-2xl mx-auto bg-white border border-rose-200 rounded-2xl p-8 my-12 shadow-sm text-center space-y-6" id="error-state">
            <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center border border-rose-100">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Analysis Request Failed</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                {error}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-left text-gray-500 max-w-md mx-auto space-y-2">
              <span className="font-bold text-slate-800 block">Troubleshooting Steps:</span>
              <ul className="list-disc list-inside space-y-1">
                <li>Make sure your Gemini API Key is configured in the AI Studio environment.</li>
                <li>Ensure the resume is in text-readable format or a high resolution image.</li>
                <li>Test with our ready-to-use sample profiles below to try immediately.</li>
              </ul>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 text-sm shadow-sm cursor-pointer border-0"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        ) : (
          /* Render Active View Tab */
          <div>
            {currentTab === "home" && (
              /* ================================================
                   HOME / PORTAL DASHBOARD (styled exactly like mockup)
                   ================================================ */
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
                          isApplied={appliedJobs.includes(job.id)}
                          analysisResult={analysisResult}
                          onViewDetails={setSelectedJob}
                          onApply={handleApplyJob}
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
                          isApplied={appliedJobs.includes(job.id)}
                          onViewDetails={setSelectedJob}
                          onApply={handleApplyJob}
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
                        <div className="insight-icon text-xl mb-1">📋</div>
                        <div className="insight-value text-2xl font-black text-blue-600">{appliedJobs.length}</div>
                        <div className="insight-label text-[10px] text-slate-500 font-semibold mt-1">Applications Submitted</div>
                      </div>

                      <div className="insight-card bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                        <div className="insight-icon text-xl mb-1">📅</div>
                        <div className="insight-value text-2xl font-black text-blue-600">4</div>
                        <div className="insight-label text-[10px] text-slate-500 font-semibold mt-1">Interview Invites</div>
                      </div>

                      <div className="insight-card bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                        <div className="insight-icon text-xl mb-1">👤</div>
                        <div className="insight-value text-2xl font-black text-blue-600">{getProfileCompletion()}</div>
                        <div className="insight-label text-[10px] text-slate-500 font-semibold mt-1">Profile Completion</div>
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

                </div>{/* end bottom-grid */}

              </div>
            )}

            {currentTab === "analysis" && (
              /* ================================================
                   ANALYSIS VIEW (Upload panel or detailed analysis)
                   ================================================ */
              <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
                {analysisResult ? (
                  /* Primary Analysis Dashboard */
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Career Diagnostics</h2>
                        <p className="text-xs text-slate-500">Interactive strategic labor model assessment</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleReset}
                          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Clear & Upload New
                        </button>

                        {currentUser ? (
                          isCurrentResumeSaved ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                              Saved to SQL Db ✓
                            </span>
                          ) : (
                            <button
                              onClick={handleSaveCurrentAnalysis}
                              disabled={isSavingResume}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Database className="w-3.5 h-3.5" />
                              {isSavingResume ? "Saving..." : "Save to SQL Account"}
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => setShowAuthModal(true)}
                            className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 cursor-pointer"
                          >
                            <Lock className="w-3 h-3 text-slate-400" />
                            Sign In to Save
                          </button>
                        )}
                      </div>
                    </div>

                    <AnalysisDashboard 
                      data={analysisResult} 
                      onReset={handleReset} 
                      currentUser={currentUser}
                      onSave={handleSaveCurrentAnalysis}
                      isSaving={isSavingResume}
                      isSaved={isCurrentResumeSaved}
                      onTriggerLogin={() => setShowAuthModal(true)}
                    />
                  </div>
                ) : (
                  /* Modern Upload View with drag and drop or sample files selection */
                  <div className="py-10 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 md:p-12">
                    <ResumeUpload key={resetKey} onAnalyze={handleAnalyze} isLoading={isLoading} />
                  </div>
                )}
              </div>
            )}


          </div>
        )}
      </main>

      {/* ================================================
           FOOTER (styled exactly like mockup)
           ================================================ */}
      <footer className="home-footer text-slate-400 mt-12 bg-[#1E3A8A]">
        <div className="footer-grid max-w-[1200px] mx-auto px-4 md:px-6 py-12 grid grid-cols-2 lg:grid-cols-5 gap-8">
          
          <div className="col-span-2 space-y-4">
            <div className="logo text-white text-2xl font-black">
              Skill<span className="text-blue-300">Sense</span>
            </div>
            <p className="text-sm text-slate-300 max-w-xs leading-relaxed">
              AI-powered job matching that connects the right talent with the right opportunity.
            </p>
          </div>

          <div className="footer-col space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">About SkillSense</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div className="footer-col space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Report a Bug</a></li>
            </ul>
          </div>

          <div className="footer-col space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom border-t border-white/10 py-6 text-center text-xs text-slate-300/60">
          © 2026 SkillSense — Group Tung Tung Sahur | [CS/IT] 3105N App Development
        </div>
      </footer>

      {/* ================================================
           JOB DETAILS DIALOG MODAL (Premium Interactive overlay)
           ================================================ */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          isApplied={appliedJobs.includes(selectedJob.id)}
          onClose={() => setSelectedJob(null)}
          onApply={handleApplyJob}
        />
      )}

      {/* Account Auth Modal Overlay */}
      {showAuthModal && (
        <AccountModal 
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

    </div>
  );
}
