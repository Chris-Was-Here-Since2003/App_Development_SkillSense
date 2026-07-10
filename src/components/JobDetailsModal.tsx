import React from "react";
import { X } from "lucide-react";
import { Job } from "../types";

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto" id="job-detail-modal">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden transform transition-all flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start gap-4 pr-12 bg-slate-50/50">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm shrink-0 ${job.logoBg}`}>
            {job.logoLetter}
          </div>
          <div>
            <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mb-1">
              {job.type}
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-snug">{job.title}</h3>
            <p className="text-xs text-slate-500 font-semibold">{job.company}</p>
          </div>

          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          
          {/* Job Metadata Bar */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Salary</span>
              <span className="text-xs font-extrabold text-emerald-600">{job.salary || "Negotiable"}</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location</span>
              <span className="text-xs font-bold text-slate-800">{job.location}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience</span>
              <span className="text-xs font-bold text-slate-800">{job.experience}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">About the Role</h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Key Responsibilities</h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 leading-relaxed pl-1">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="font-medium">{resp}</li>
              ))}
            </ul>
          </div>

          {/* Skills required */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Key Skills Required</h4>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm border-0 transition-colors cursor-pointer shadow-md shadow-blue-100"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
