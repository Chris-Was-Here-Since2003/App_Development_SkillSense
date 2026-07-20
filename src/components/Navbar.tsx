import React, { useState, useEffect } from "react";
import { 
  Brain, 
  Sparkles, 
  Compass, 
  History, 
  ChevronDown, 
  Clock, 
  Trash2, 
  LogOut, 
  User as UserIcon,
  MessageSquare,
  FileText
} from "lucide-react";
import { User, SavedResume, ResumeAnalysisResult } from "../types";

interface NavbarProps {
  currentTab: "home" | "analysis" | "interview" | "resume";
  setCurrentTab: (tab: "home" | "analysis" | "interview" | "resume") => void;
  analysisResult: ResumeAnalysisResult | null;
  currentUser: User | null;
  savedResumes: SavedResume[];
  handleSelectSavedResume: (resume: SavedResume) => void;
  handleDeleteSavedResume: (resumeId: string, e: React.MouseEvent) => void;
  handleLogout: () => void;
  setShowAuthModal: (show: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  analysisResult,
  currentUser,
  savedResumes,
  handleSelectSavedResume,
  handleDeleteSavedResume,
  handleLogout,
  setShowAuthModal,
}) => {
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Close dropdowns on outside clicks can be handled or kept simple
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
    return "John"; // Default fallback matching mockup
  };

  return (
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

        <button 
          onClick={() => setCurrentTab("interview")}
          className={`nav-link px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            currentTab === "interview" 
              ? "bg-[#DBEAFE] text-blue-600 font-bold" 
              : "text-slate-500 hover:bg-[#DBEAFE]/40 hover:text-blue-600"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-600 animate-pulse" />
          AI Interview Coach
        </button>

        <button 
          onClick={() => setCurrentTab("resume")}
          className={`nav-link px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            currentTab === "resume" 
              ? "bg-[#DBEAFE] text-blue-600 font-bold" 
              : "text-slate-500 hover:bg-[#DBEAFE]/40 hover:text-blue-600"
          }`}
        >
          <FileText className="w-4 h-4 text-purple-600 animate-pulse" />
          AI Resume Builder
        </button>
      </div>

      {/* Right: Actions */}
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
                        onClick={() => {
                          handleSelectSavedResume(resume);
                          setShowHistoryDropdown(false);
                        }}
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
  );
};
