import { useState } from "react";
import { Compass, Sparkles, Lightbulb } from "lucide-react";
import { CareerProgression, PredictedRole } from "../types";

interface CareerProgressionRoadmapProps {
  careerProgression: CareerProgression;
}

export default function CareerProgressionRoadmap({ careerProgression }: CareerProgressionRoadmapProps) {
  const [selectedPathwayIdx, setSelectedPathwayIdx] = useState<number>(0);
  const [selectedPredictedRoleIdx, setSelectedPredictedRoleIdx] = useState<number>(0);

  // Gracefully normalize career progression to pathways structure supporting legacy or standard results
  const pathways = careerProgression.pathways || ((careerProgression as any).predictedRoles ? [{
    pathwayName: "Primary Career Track",
    description: "The main predicted progression roadmap based on current skills and background.",
    predictedRoles: (careerProgression as any).predictedRoles
  }] : []);

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand?.toLowerCase()) {
      case "high":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "moderate":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "low":
        return "bg-slate-50 text-slate-700 border-slate-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            Predictive Career Progression Roadmap
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            AI-simulated advancement pathways detailing alternative corporate trajectories.
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full self-start">
          {pathways.length} Paths Available (Max 5)
        </span>
      </div>

      {/* Pathway selection tabs */}
      {pathways.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Choose Pathway Option:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pathways.map((path: any, idx: number) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedPathwayIdx(idx);
                  setSelectedPredictedRoleIdx(0);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer ${
                  selectedPathwayIdx === idx
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-[1.01]"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800"
                }`}
                id={`btn-pathway-tab-${idx}`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedPathwayIdx === idx ? "bg-white text-indigo-700" : "bg-indigo-100 text-indigo-700"}`}>
                    {idx + 1}
                  </span>
                  <span className="line-clamp-1">{path.pathwayName}</span>
                </div>
                {path.description && (
                  <p className={`text-[10px] leading-snug line-clamp-2 mt-1 ${selectedPathwayIdx === idx ? "text-indigo-100 font-light" : "text-gray-500"}`}>
                    {path.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pathway Horizontal/Vertical Visual Timeline */}
      {pathways[selectedPathwayIdx] ? (
        <div className="flex flex-col space-y-6 pt-2">
          
          {/* Horizontal nodes for timeline navigation */}
          <div className="relative flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 overflow-x-auto gap-4">
            <div className="absolute left-6 right-6 top-[28px] h-[2px] bg-gray-200 z-0"></div>
            
            {pathways[selectedPathwayIdx].predictedRoles.map((role: PredictedRole, idx: number) => {
              const isSelected = selectedPredictedRoleIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPredictedRoleIdx(idx)}
                  className="relative z-10 flex flex-col items-center focus:outline-none group cursor-pointer shrink-0"
                  id={`btn-career-node-${idx}`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all ${
                    isSelected 
                      ? "bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100" 
                      : "bg-white border-gray-300 text-gray-500 group-hover:border-indigo-400 group-hover:text-indigo-600"
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-[10px] md:text-xs font-semibold mt-1 bg-white px-2 py-0.5 rounded-full border ${
                    isSelected ? "text-indigo-700 border-indigo-200 shadow-sm" : "text-gray-500 border-transparent"
                  }`}>
                    {role.timeframe}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Info Card for selected role */}
          {pathways[selectedPathwayIdx].predictedRoles[selectedPredictedRoleIdx] && (() => {
            const activeRole = pathways[selectedPathwayIdx].predictedRoles[selectedPredictedRoleIdx];
            return (
              <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-6 space-y-4 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100/60 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                      Predicted Step {selectedPredictedRoleIdx + 1} ({activeRole.timeframe})
                    </span>
                    <h4 className="text-lg font-bold text-slate-900">{activeRole.roleTitle}</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(activeRole.transitionDifficulty)}`}>
                      Difficulty: {activeRole.transitionDifficulty}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDemandColor(activeRole.marketDemand)}`}>
                      Market Demand: {activeRole.marketDemand}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {activeRole.description}
                </p>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Prerequisite Skills to Master:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeRole.requiredSkillsToAcquire.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="bg-white border border-indigo-200 text-indigo-800 text-xs px-2.5 py-1 rounded-md font-medium shadow-sm hover:border-indigo-400 transition-all"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Executive Outlook summary card */}
          {careerProgression.outlookSummary && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Executive Outlook Summary</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">{careerProgression.outlookSummary}</p>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm">
          No career pathways predicted.
        </div>
      )}
    </div>
  );
}
