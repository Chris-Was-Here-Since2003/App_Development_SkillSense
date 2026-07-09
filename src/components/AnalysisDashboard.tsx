import { useState } from "react";
import { 
  Compass, 
  FileCheck, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  Database, 
  Lock, 
  CheckCircle2 
} from "lucide-react";
import { ResumeAnalysisResult, User } from "../types";
import CompetitivenessScoresCard from "./CompetitivenessScoresCard";
import CareerProgressionRoadmap from "./CareerProgressionRoadmap";
import SkillsHeatmap from "./SkillsHeatmap";
import SkillGapAnalysisCard from "./SkillGapAnalysisCard";
import ParsedResumeTab from "./ParsedResumeTab";

interface AnalysisDashboardProps {
  data: ResumeAnalysisResult;
  onReset: () => void;
  currentUser?: User | null;
  onSave?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
  onTriggerLogin?: () => void;
}

export default function AnalysisDashboard({ 
  data, 
  onReset, 
  currentUser = null, 
  onSave, 
  isSaving = false, 
  isSaved = false, 
  onTriggerLogin 
}: AnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<"insights" | "resume">("insights");

  const { 
    personalInfo, 
    workExperience, 
    education, 
    skills, 
    certifications, 
    projects, 
    achievements, 
    careerProgression, 
    competitivenessScores, 
    skillGapAnalysis 
  } = data;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-16" id="analysis-dashboard">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
            id="btn-back-to-upload"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resume Upload
          </button>

          <span className="hidden sm:inline text-gray-300">|</span>

          {currentUser ? (
            isSaved ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved to Account SQL Db ✓
              </span>
            ) : (
              <button
                onClick={onSave}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                <Database className="w-3.5 h-3.5" />
                {isSaving ? "Saving to SQL Database..." : "Save Analysis to SQL Database"}
              </button>
            )
          ) : (
            <button
              onClick={onTriggerLogin}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-gray-400" />
              Sign In to Save Analysis
            </button>
          )}
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "insights"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            id="tab-btn-insights"
          >
            <Compass className="w-4 h-4" />
            AI Career Insights
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "resume"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            id="tab-btn-resume"
          >
            <FileCheck className="w-4 h-4" />
            Parsed Resume Data
          </button>
        </div>
      </div>

      {/* Main header block */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-10 text-white border border-slate-800 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Intelligence Profile
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight">{personalInfo.fullName}</h2>
            {personalInfo.summary && (
              <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light">
                {personalInfo.summary}
              </p>
            )}

            {/* Contacts bar */}
            <div className="flex flex-wrap gap-4 text-xs md:text-sm text-gray-400 pt-2">
              {personalInfo.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>

            {/* Links bar */}
            {personalInfo.links && personalInfo.links.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {personalInfo.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.startsWith("http") ? link : `https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white hover:underline transition-colors bg-white/5 px-2.5 py-1 rounded-md border border-white/10"
                  >
                    <span>{link}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Current Status Badge */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl md:w-64 backdrop-blur-sm space-y-2 shrink-0">
            <span className="text-xs text-indigo-300 font-semibold tracking-wide block uppercase">
              Current Career Stage
            </span>
            <div className="text-xl font-bold text-white">
              {careerProgression.currentCareerStage || "Determining..."}
            </div>
            <div className="h-[1px] bg-white/10 my-2"></div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              Ready for upskilling analysis
            </div>
          </div>
        </div>
      </div>

      {activeTab === "insights" ? (
        /* INSIGHTS TAB */
        <div className="grid lg:grid-cols-3 gap-8" id="insights-view-content">
          {/* LEFT 2 COLUMNS: Scores & Career Progression & Skills Heatmap */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Market Competitiveness Scores Card */}
            <CompetitivenessScoresCard competitivenessScores={competitivenessScores} />

            {/* 2. Predictive Career Progression Roadmap Card */}
            <CareerProgressionRoadmap careerProgression={careerProgression} />

            {/* 3. Skills Heat Map & Proficiency Profiles Card */}
            <SkillsHeatmap skills={skills} />
          </div>

          {/* RIGHT SIDEBAR COLUMN: Gaps & Actionable Recommendations */}
          <div className="space-y-8">
            {/* 4. Skill Gap & Urgency Index Card */}
            <SkillGapAnalysisCard skillGapAnalysis={skillGapAnalysis} />
          </div>
        </div>
      ) : (
        /* PARSED RESUME DATA TAB */
        <ParsedResumeTab 
          workExperience={workExperience}
          education={education}
          projects={projects}
          certifications={certifications}
          achievements={achievements}
        />
      )}
    </div>
  );
}
