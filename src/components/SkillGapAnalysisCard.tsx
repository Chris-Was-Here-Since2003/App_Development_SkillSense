import { ShieldAlert, Lightbulb, Sparkles, BookOpen, GraduationCap, Award, FolderGit2, ExternalLink } from "lucide-react";
import { SkillGapAnalysis, SkillGap } from "../types";

interface SkillGapAnalysisCardProps {
  skillGapAnalysis: SkillGapAnalysis;
}

const getRecommendationUrl = (type: "course" | "cert" | "book" | "project", name: string) => {
  const query = encodeURIComponent(name);
  if (type === "course") {
    if (name.toLowerCase().includes("coursera")) {
      return `https://www.coursera.org/search?query=${query}`;
    }
    if (name.toLowerCase().includes("freecodecamp")) {
      return `https://www.freecodecamp.org/`;
    }
    if (name.toLowerCase().includes("scrimba")) {
      return "https://scrimba.com/";
    }
    if (name.toLowerCase().includes("codecademy")) {
      return `https://www.codecademy.com/search?query=${query}`;
    }
    if (name.toLowerCase().includes("kodekloud")) {
      return `https://kodekloud.com/`;
    }
    if (name.toLowerCase().includes("bytebytego")) {
      return "https://bytebytego.com/";
    }
    return `https://www.google.com/search?q=${query}+online+course`;
  }
  if (type === "cert") {
    if (name.includes("AWS Certified Cloud Practitioner")) {
      return "https://aws.amazon.com/certification/certified-cloud-practitioner/";
    }
    if (name.includes("Google Cloud Associate Cloud Engineer")) {
      return "https://cloud.google.com/learn/certification/associate-cloud-engineer";
    }
    if (name.includes("Certified Kubernetes Administrator")) {
      return "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/";
    }
    if (name.includes("Docker Certified Associate")) {
      return "https://training.mirantis.com/certification/dca-certification/";
    }
    if (name.includes("Meta Front-End Developer")) {
      return "https://www.coursera.org/professional-certificates/meta-front-end-developer";
    }
    if (name.includes("Google Professional Machine Learning Engineer")) {
      return "https://cloud.google.com/learn/certification/machine-learning-engineer";
    }
    if (name.includes("TensorFlow Developer")) {
      return "https://www.tensorflow.org/certificate";
    }
    return `https://www.google.com/search?q=${query}+certification+exam`;
  }
  if (type === "book") {
    return `https://www.google.com/search?tbm=bks&q=${query}`;
  }
  if (type === "project") {
    return `https://github.com/search?q=${query}`;
  }
  return `https://www.google.com/search?q=${query}`;
};

const getFallbackRecommendations = (skillName: string) => {
  const normalized = skillName.toLowerCase();
  let courses = ["freeCodeCamp Academy", "Codecademy Tutorials", "Coursera Professional Certificates", "YouTube Curated Playlists"];
  let certs = [`Industry ${skillName} Certification`];
  let books = [`Mastering ${skillName}`, `Official ${skillName} Documentation Guide`];
  let projects = [`Full-stack ${skillName} Application`, `Open-source Contribution Project`];

  if (normalized.includes("react")) {
    courses = ["Scrimba React Professional Bootcamp", "freeCodeCamp Advanced React & Redux", "Coursera Meta Front-End Developer Certificate", "YouTube React Tutorials (Net Ninja, Joy of React)"];
    certs = ["Meta Front-End Developer Professional Certificate"];
    books = ["The Road to React by Robin Wieruch", "React Key Concepts by Maximilian Schwarzmüller"];
    projects = ["E-commerce Product Dashboard with Context State", "Interactive Kanban Board App", "Personal Developer Portfolio Site"];
  } else if (normalized.includes("cloud") || normalized.includes("aws") || normalized.includes("gcp") || normalized.includes("azure")) {
    courses = ["Coursera Cloud Computing Basics", "A Cloud Guru Solutions Architect Path", "freeCodeCamp Cloud Practitioner Course", "Official Google Cloud Training Suite"];
    certs = ["AWS Certified Cloud Practitioner", "Google Cloud Associate Cloud Engineer"];
    books = ["Cloud Architecture Patterns by Bill Wilder", "Designing Data-Intensive Applications by Martin Kleppmann"];
    projects = ["Serverless Static Web App Hosting", "CI/CD Pipeline Deployment Automation", "Multi-region Cloud Resource Infrastructure Blueprint"];
  } else if (normalized.includes("python") || normalized.includes("data science") || normalized.includes("machine learning") || normalized.includes("ai")) {
    courses = ["DeepLearning.AI Machine Learning Specialization", "Kaggle Micro-courses for Data Science", "Coursera Python for Everybody Specialization", "freeCodeCamp Deep Learning Foundations"];
    certs = ["Google Professional Machine Learning Engineer", "TensorFlow Developer Certificate"];
    books = ["Hands-On Machine Learning with Scikit-Learn and TensorFlow by Aurélien Géron", "Python for Data Analysis by Wes McKinney"];
    projects = ["Predictive Real-Estate Market Dashboard", "Computer Vision Image Classification Web App", "Custom NLP Text Summarizer Chatbot"];
  } else if (normalized.includes("typescript") || normalized.includes("javascript")) {
    courses = ["TypeScript Deep Dive Tutorial Series", "freeCodeCamp Advanced TypeScript Foundations", "Codecademy Learn TypeScript", "YouTube Playlists (Matt Pocock TS Tips)"];
    certs = ["W3Schools Javascript / TypeScript Developer Certification"];
    books = ["Effective TypeScript by Dan Vanderkam", "You Don't Know JS Yet by Kyle Simpson"];
    projects = ["Type-safe Express API Gateway Middleware", "Command-line Interactive Utility with strict type safety", "Complex Custom React State Engine Library"];
  } else if (normalized.includes("docker") || normalized.includes("kubernetes") || normalized.includes("devops")) {
    courses = ["KodeKloud Certified Kubernetes Administrator (CKA)", "freeCodeCamp DevOps Engineering Foundations", "Coursera Continuous Integration", "YouTube TechWorld with Nana DevOps Blueprint"];
    certs = ["Certified Kubernetes Administrator (CKA)", "Docker Certified Associate (DCA)"];
    books = ["The DevOps Handbook by Gene Kim", "Kubernetes Up & Running by Kelsey Hightower"];
    projects = ["Multi-container Application Orchestration with Docker Compose", "Kubernetes Cluster Configuration with Helm Charts", "Automated GitHub Actions CI/CD pipeline with linting & tests"];
  } else if (normalized.includes("sql") || normalized.includes("database") || normalized.includes("postgresql")) {
    courses = ["Stanford Online Databases & SQL", "Codecademy Learn SQL", "freeCodeCamp SQL & Relational Databases Mastery", "YouTube SQL Query Optimization Tutorials"];
    certs = ["Oracle Database SQL Certified Associate", "PostgreSQL Associate Certification"];
    books = ["Database Internals by Alex Petrov", "SQL Practice Problems by Sylvia Moestl Vasilik"];
    projects = ["Relational E-commerce DB design and query optimization", "Custom PostgreSQL client helper library", "SQL Injection Vulnerability Analyzer Tool"];
  } else if (normalized.includes("system design") || normalized.includes("architecture")) {
    courses = ["ByteByteGo System Design Academy by Alex Xu", "Pragmatic System Design Course", "YouTube System Design Primer"];
    certs = ["TOGAF Enterprise Architect Certification"];
    books = ["System Design Interview by Alex Xu", "Designing Data-Intensive Applications by Martin Kleppmann"];
    projects = ["Design and Document a High-availability Scalable Chat Application", "Write and benchmark a distributed caching system"];
  }

  return { courses, certifications: certs, books, projects };
};

export default function SkillGapAnalysisCard({ skillGapAnalysis }: SkillGapAnalysisCardProps) {
  const getGapPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getGapTypeBadge = (type: string) => {
    switch (type?.toLowerCase()) {
      case "critical":
        return "bg-rose-100 text-rose-900 font-bold border-rose-300";
      case "missing":
        return "bg-amber-100 text-amber-900 font-medium border-amber-200";
      case "emerging":
        return "bg-purple-100 text-purple-900 font-medium border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-600" />
          Skill Gap & Urgency Index
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Identification of critical skills missing for 2031 future market competitiveness.
        </p>
      </div>

      {/* List of Gaps */}
      <div className="space-y-4">
        {skillGapAnalysis.gaps.map((gap: SkillGap, idx: number) => {
          const recs = gap.learningRecommendations || getFallbackRecommendations(gap.skillName);
          return (
            <div 
              key={idx} 
              className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-3 relative hover:border-indigo-300 transition-all"
            >
              {/* Header line */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{gap.skillName}</h4>
                  <div className="flex gap-1.5 items-center mt-1">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${getGapTypeBadge(gap.type)}`}>
                      {gap.type}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${getGapPriorityColor(gap.priority)}`}>
                      Priority: {gap.priority}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                <strong className="text-slate-800 font-semibold">Impact: </strong>{gap.impactDescription}
              </p>

              {/* Action recommendations box */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-950 flex gap-2 items-start">
                <Lightbulb className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-indigo-900 mb-0.5">Actionable Recommendation:</strong>
                  {gap.actionableRecommendation}
                </div>
              </div>

              {/* Learning recommendations box */}
              {recs && (
                <div className="border-t border-gray-200/60 pt-3 mt-3 space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                    Recommended Learning Pathway
                  </span>
                  <div className="space-y-3 text-xs">
                    {/* Courses */}
                    {recs.courses && recs.courses.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>Courses & Platforms:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pl-5">
                          {recs.courses.map((course, cIdx) => (
                            <a 
                              key={cIdx} 
                              href={getRecommendationUrl("course", course)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-700 hover:text-indigo-800 border border-indigo-100 hover:border-indigo-200 text-[10px] px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
                            >
                              <span>{course}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {recs.certifications && recs.certifications.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
                          <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Certifications:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pl-5">
                          {recs.certifications.map((cert, cIdx) => (
                            <a 
                              key={cIdx} 
                              href={getRecommendationUrl("cert", cert)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-700 hover:text-emerald-800 border border-emerald-100 hover:border-emerald-200 text-[10px] px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
                            >
                              <span>{cert}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Books */}
                    {recs.books && recs.books.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
                          <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Books & Documentation:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pl-5">
                          {recs.books.map((book, bIdx) => (
                            <a 
                              key={bIdx} 
                              href={getRecommendationUrl("book", book)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-amber-50/70 hover:bg-amber-100/80 text-amber-700 hover:text-amber-800 border border-amber-100 hover:border-amber-200 text-[10px] px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
                            >
                              <span>{book}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {recs.projects && recs.projects.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
                          <FolderGit2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span>Practice Projects:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pl-5">
                          {recs.projects.map((proj, pIdx) => (
                            <a 
                              key={pIdx} 
                              href={getRecommendationUrl("project", proj)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-purple-50/70 hover:bg-purple-100/80 text-purple-700 hover:text-purple-800 border border-purple-100 hover:border-purple-200 text-[10px] px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
                            >
                              <span>{proj}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Strategic career advice block */}
      {skillGapAnalysis.strategicAdvice && (
        <div className="bg-indigo-950 text-indigo-100 rounded-xl p-5 space-y-3 border border-indigo-900">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-bounce" />
            Professional Coach Strategic Advice
          </h4>
          <p className="text-xs leading-relaxed text-indigo-100/90 font-light">
            {skillGapAnalysis.strategicAdvice}
          </p>
        </div>
      )}
    </div>
  );
}
