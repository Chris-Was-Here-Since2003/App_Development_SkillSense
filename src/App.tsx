import { useState, useEffect } from "react";
import { Sparkles, Database, Lock, X, Check, MessageSquare } from "lucide-react";
import ResumeUpload from "./components/ResumeUpload";
import AnalysisDashboard from "./components/AnalysisDashboard";
import AccountModal from "./components/AccountModal";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomeTab } from "./components/HomeTab";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { JobDetailsModal } from "./components/JobDetailsModal";
import { InterviewChatbot } from "./components/InterviewChatbot";
import { ResumeGenerator } from "./components/ResumeGenerator";
import { ResumeAnalysisResult, User, SavedResume, Job } from "./types";
import { SAMPLE_RESUMES } from "./sampleData";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [resetKey, setResetKey] = useState(0);

  // Core navigation state: "home" | "analysis" | "interview" | "resume"
  const [currentTab, setCurrentTab] = useState<"home" | "analysis" | "interview" | "resume">("home");

  // Job Tracker & UI states
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // SQL Persistence & Authentication States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [isCurrentResumeSaved, setIsCurrentResumeSaved] = useState(false);

  // Auth & Session sync
  useEffect(() => {
    const storedUser = localStorage.getItem("skillsense_user");
    if (storedUser) {
      try { setCurrentUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
    }
  }, []);

  const fetchSavedResumes = async (userId: string) => {
    try {
      const res = await fetch("/api/resumes", { headers: { "x-user-id": userId } });
      if (res.ok) setSavedResumes(await res.json());
    } catch (err) {
      console.error("Failed to load SQL database history:", err);
    }
  };

  useEffect(() => {
    if (currentUser) fetchSavedResumes(currentUser.id);
    else setSavedResumes([]);
    setIsCurrentResumeSaved(false);
  }, [currentUser]);

  // Database actions
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
        body: JSON.stringify({ name: candidateName, parsedData: analysisResult })
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
        headers: { "x-user-id": currentUser.id }
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
    setCurrentTab("analysis");
  };

  // Parsing / AI processing core trigger
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

    if (payload.isSample && payload.sampleName) {
      setTimeout(() => {
        const sample = SAMPLE_RESUMES[payload.sampleName!];
        if (sample) {
          setAnalysisResult(sample.data);
          setCurrentTab("analysis");
        } else {
          setError("Sample profile not found.");
        }
        setIsLoading(false);
      }, 1500);
      return;
    }

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setCurrentTab("analysis");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during resume parsing.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null); setError(null); setIsCurrentResumeSaved(false); setResetKey((prev) => prev + 1); setCurrentTab("analysis");
  };

  const handleLogout = () => {
    setCurrentUser(null); localStorage.removeItem("skillsense_user"); localStorage.removeItem("skillsense_display_name"); setIsCurrentResumeSaved(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#111827] flex flex-col justify-between" id="app-root">
      
      {/* Navbar Widget */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        analysisResult={analysisResult}
        currentUser={currentUser}
        savedResumes={savedResumes}
        handleSelectSavedResume={handleSelectSavedResume}
        handleDeleteSavedResume={handleDeleteSavedResume}
        handleLogout={handleLogout}
        setShowAuthModal={setShowAuthModal}
      />

      {/* Views Port */}
      <main className="flex-1 w-full p-[10%]">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onReset={handleReset} />
        ) : (
          <div>
            {currentTab === "home" ? (
              <HomeTab
                currentUser={currentUser}
                analysisResult={analysisResult}
                setCurrentTab={setCurrentTab}
                setSelectedJob={setSelectedJob}
              />
            ) : currentTab === "interview" ? (
              <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 gap-5 shadow-md">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3 mb-2">
                        <MessageSquare className="w-7 h-7 text-emerald-600" />
                        AI Interview Coaching Room
                      </h2>
                      <p className="text-sm text-slate-600 font-medium">
                        Practice professional mock interviews, master behavioral questions with STAR feedback, and prepare tailored questions.
                      </p>
                    </div>
                  </div>
                  <InterviewChatbot analysisResult={analysisResult} />
                </div>
              </div>
            ) : currentTab === "resume" ? (
              <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <ResumeGenerator analysisResult={analysisResult} />
              </div>
            ) : (
              <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
                {analysisResult ? (
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
                  <div className="py-10 bg-white border border-slate-200 rounded-3xl shadow-sm p-6 md:p-12">
                    <ResumeUpload key={resetKey} onAnalyze={handleAnalyze} isLoading={isLoading} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Widget */}
      <Footer />

      {/* Job Details Modal Overlay */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <AccountModal 
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            localStorage.setItem("skillsense_user", JSON.stringify(user));
          }}
        />
      )}
    </div>
  );
}
