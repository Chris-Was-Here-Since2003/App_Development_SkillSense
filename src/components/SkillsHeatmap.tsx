import { useState } from "react";
import { BarChart3, Search } from "lucide-react";
import { SkillItem } from "../types";

interface SkillsHeatmapProps {
  skills: SkillItem[];
}

export default function SkillsHeatmap({ skills }: SkillsHeatmapProps) {
  const [skillSearch, setSkillSearch] = useState("");
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<"all" | "technical" | "soft" | "domain">("all");

  // Filter skills based on search term and category selection
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
                          (skill.strengthDescription || "").toLowerCase().includes(skillSearch.toLowerCase());
    const matchesCategory = skillCategoryFilter === "all" || skill.category.toLowerCase() === skillCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Skills Heat Map & Proficiency Profiles
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Categorized breakdown of technical prowess, industry domains, and critical soft skills.
          </p>
        </div>
      </div>

      {/* Filtering Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-[14px]" />
          <input
            type="text"
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            placeholder="Search skills or keywords..."
            className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>
        
        {/* Category filters */}
        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold self-start md:self-auto shrink-0">
          <button
            onClick={() => setSkillCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              skillCategoryFilter === "all" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Skills
          </button>
          <button
            onClick={() => setSkillCategoryFilter("technical")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              skillCategoryFilter === "technical" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Technical
          </button>
          <button
            onClick={() => setSkillCategoryFilter("soft")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              skillCategoryFilter === "soft" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Soft Skills
          </button>
          <button
            onClick={() => setSkillCategoryFilter("domain")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              skillCategoryFilter === "domain" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Domain
          </button>
        </div>
      </div>

      {/* Heat Map Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No matching skills found. Try clearing search or filters.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredSkills.map((skill, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/10 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    skill.category === "technical" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                    skill.category === "soft" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                    "bg-purple-50 text-purple-700 border border-purple-100"
                  }`}>
                    {skill.category}
                  </span>
                  <h4 className="font-semibold text-slate-900 text-sm mt-1">{skill.name}</h4>
                </div>
                <span className="text-base font-extrabold text-indigo-600">{skill.proficiency}%</span>
              </div>

              {/* Bar indicator */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    skill.category === "technical" ? "bg-indigo-600" :
                    skill.category === "soft" ? "bg-emerald-500" :
                    "bg-purple-500"
                  }`}
                  style={{ width: `${skill.proficiency}%` }}
                ></div>
              </div>

              {skill.strengthDescription && (
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{skill.strengthDescription}"
                </p>
              )}

              {skill.scoreJustification && (
                <div className="bg-indigo-50/20 border border-indigo-100/40 p-2.5 rounded-lg space-y-1 mt-auto">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide block">
                    Score Justification
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {skill.scoreJustification}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
