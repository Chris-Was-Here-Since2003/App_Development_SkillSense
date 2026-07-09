import { useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { CompetitivenessScores } from "../types";

interface CompetitivenessScoresCardProps {
  competitivenessScores: CompetitivenessScores;
}

export default function CompetitivenessScoresCard({ competitivenessScores }: CompetitivenessScoresCardProps) {
  const [selectedEpoch, setSelectedEpoch] = useState<"fiveYearsAgo" | "today" | "fiveYearsFuture">("today");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Market Competitiveness Scores
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Evaluation based on labor economics, tech stack popularity, and automation models.
          </p>
        </div>
        {/* Epoch switches */}
        <div className="flex bg-gray-100 p-1 rounded-lg shrink-0 text-xs font-semibold">
          <button
            onClick={() => setSelectedEpoch("fiveYearsAgo")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              selectedEpoch === "fiveYearsAgo" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            5 Years Ago
          </button>
          <button
            onClick={() => setSelectedEpoch("today")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              selectedEpoch === "today" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Today (2026)
          </button>
          <button
            onClick={() => setSelectedEpoch("fiveYearsFuture")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              selectedEpoch === "fiveYearsFuture" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            5 Years Future
          </button>
        </div>
      </div>

      {/* Spark Chart / Interactive Graphic */}
      <div className="grid md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            {selectedEpoch === "fiveYearsAgo" ? "Competitiveness Score (2021)" : selectedEpoch === "today" ? "Competitiveness Score (2026)" : "Projected Score (2031)"}
          </div>
          
          {/* Gauge indicator */}
          <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-gray-200 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-indigo-600 fill-none transition-all duration-1000"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * competitivenessScores[selectedEpoch].score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-3xl font-sans font-extrabold text-gray-900 flex flex-col items-center justify-center">
              <span>{competitivenessScores[selectedEpoch].score}</span>
              <span className="text-[10px] text-gray-400 font-normal uppercase tracking-wider">out of 100</span>
            </div>
          </div>

          <div className="mt-4 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            {competitivenessScores[selectedEpoch].score >= 85 ? "Excellent Alignment" : competitivenessScores[selectedEpoch].score >= 70 ? "Strong Alignment" : "Needs Upskilling"}
          </div>
        </div>

        {/* Explanation text */}
        <div className="md:col-span-8 space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Labor & Technology Trend Context
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed bg-indigo-50/20 border border-indigo-100/50 p-4 rounded-xl">
              {competitivenessScores[selectedEpoch].marketTrendContext}
            </p>
          </div>

          {/* 3-Epoch Quick timeline switcher visual */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button 
              onClick={() => setSelectedEpoch("fiveYearsAgo")}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                selectedEpoch === "fiveYearsAgo" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-200 hover:border-indigo-200"
              }`}
            >
              <div className="text-xs opacity-80 font-medium">5 Years Ago</div>
              <div className="text-lg font-bold">{competitivenessScores.fiveYearsAgo.score}%</div>
            </button>
            <button 
              onClick={() => setSelectedEpoch("today")}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                selectedEpoch === "today" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-200 hover:border-indigo-200"
              }`}
            >
              <div className="text-xs opacity-80 font-medium">Today</div>
              <div className="text-lg font-bold">{competitivenessScores.today.score}%</div>
            </button>
            <button 
              onClick={() => setSelectedEpoch("fiveYearsFuture")}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                selectedEpoch === "fiveYearsFuture" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-200 hover:border-indigo-200"
              }`}
            >
              <div className="text-xs opacity-80 font-medium">5 Yrs Future</div>
              <div className="text-lg font-bold">{competitivenessScores.fiveYearsFuture.score}%</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
