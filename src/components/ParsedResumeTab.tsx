import { Briefcase, FolderGit2, GraduationCap, Award, MapPin } from "lucide-react";
import { WorkExperience, Education, Project, Certification } from "../types";

interface ParsedResumeTabProps {
  workExperience: WorkExperience[];
  education: Education[];
  projects?: Project[];
  certifications?: Certification[];
  achievements?: string[];
}

export default function ParsedResumeTab({
  workExperience,
  education,
  projects = [],
  certifications = [],
  achievements = []
}: ParsedResumeTabProps) {
  return (
    <div className="grid lg:grid-cols-3 gap-8" id="resume-view-content">
      {/* Work experience section */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Work Experience
          </h3>

          <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-50">
            {workExperience.map((exp, idx) => (
              <div key={idx} className="relative pl-8 space-y-2">
                {/* timeline marker */}
                <div className="absolute left-1 top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm ring-1 ring-indigo-200"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-base font-bold text-slate-900">{exp.jobTitle}</h4>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full shrink-0 self-start sm:self-auto border border-indigo-100">
                    {exp.duration}
                  </span>
                </div>

                <div className="text-sm font-medium text-gray-600 flex flex-wrap items-center gap-2">
                  <span>{exp.company}</span>
                  {exp.location && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    </>
                  )}
                </div>

                {exp.description && exp.description.length > 0 && (
                  <ul className="space-y-1.5 pt-2 list-disc list-inside text-sm text-gray-600 leading-relaxed pl-1">
                    {exp.description.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Projects section */}
        {projects && projects.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FolderGit2 className="w-5 h-5 text-indigo-600" />
              Key Projects
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">{project.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{project.description}</p>
                  </div>
                  {project.technologiesUsed && project.technologiesUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.technologiesUsed.map((tech, tIdx) => (
                        <span key={tIdx} className="bg-white border border-gray-300 px-2 py-0.5 rounded text-[10px] text-gray-600 font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Education & Certs right column */}
      <div className="space-y-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Education
          </h3>

          <div className="space-y-6">
            {education.map((edu, idx) => (
              <div key={idx} className="space-y-2 border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{edu.degree}</h4>
                  {edu.fieldOfStudy && (
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5">{edu.fieldOfStudy}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  <p className="font-medium text-gray-700">{edu.institution}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {edu.duration && <span>{edu.duration}</span>}
                    {edu.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" />
                          {edu.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications and Achievements */}
        {certifications && certifications.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Award className="w-5 h-5 text-indigo-600" />
              Certifications
            </h3>

            <div className="space-y-4">
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex gap-3 items-start text-xs border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{cert.name}</h4>
                    {cert.issuingOrganization && (
                      <p className="text-gray-500 mt-0.5">{cert.issuingOrganization}</p>
                    )}
                    {cert.issueDate && (
                      <p className="text-gray-400 mt-0.5">Issued: {cert.issueDate}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements && achievements.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Award className="w-5 h-5 text-indigo-600" />
              Honors & Achievements
            </h3>

            <ul className="space-y-2 text-xs text-gray-600 list-disc list-inside">
              {achievements.map((achievement, idx) => (
                <li key={idx} className="leading-relaxed">{achievement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
