import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Send, 
  Sparkles, 
  Download, 
  Copy, 
  Printer, 
  RefreshCw, 
  User as UserIcon, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award, 
  FolderGit2, 
  ChevronRight, 
  Trash2, 
  Settings, 
  Palette, 
  Grid,
  Info,
  Check,
  Zap,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ResumeAnalysisResult } from "../types";

// Type definitions for our Resume Generator
export interface GeneratedResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    links?: string[];
    summary: string;
  };
  skills: string[];
  workExperience: {
    jobTitle: string;
    company: string;
    location?: string;
    duration: string;
    description: string[];
  }[];
  education: {
    degree: string;
    fieldOfStudy?: string;
    institution: string;
    location?: string;
    duration: string;
  }[];
  certifications?: {
    name: string;
    issuingOrganization?: string;
    issueDate?: string;
  }[];
  projects?: {
    title: string;
    description: string;
    technologiesUsed?: string[];
  }[];
}

interface ResumeGeneratorProps {
  analysisResult: ResumeAnalysisResult | null;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

type TemplateStyle = "modern" | "executive" | "tech";

const RESUME_WRITING_INSTRUCTIONS = "You are helping craft a professional, ATS-friendly resume. Prefer concise, achievement-focused bullet points, use strong resume-style wording, quantify results when possible, and structure the content clearly under Summary, Skills, Experience, Education, Projects, and Certifications.";

export const ResumeGenerator: React.FC<ResumeGeneratorProps> = ({ analysisResult }) => {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your **SkillSense Resume Specialist**. I'll help you build or refine a high-converting, ATS-friendly resume with clear, achievement-focused bullet points and polished resume-style wording.\n\nWould you like to:\n1. ⚡ **Import your existing career analysis** as a foundation, then polish it?\n2. 🆕 **Start from scratch** through a quick guided conversation?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  // Resume Draft State
  const [resumeData, setResumeData] = useState<GeneratedResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>("modern");
  const [accentColor, setAccentColor] = useState("#3B82F6"); // Default blue
  const [density, setDensity] = useState<"compact" | "standard" | "spacious">("compact");

  // Pre-configured accent colors
  const ACCENT_COLORS = [
    { name: "Sapphire Blue", value: "#3B82F6" },
    { name: "Emerald Green", value: "#10B981" },
    { name: "Slate Grey", value: "#475569" },
    { name: "Burgundy Red", value: "#991B1B" },
    { name: "Royal Purple", value: "#7C3AED" },
    { name: "Teal Forest", value: "#0F766E" },
  ];

  // Handle importing active career analysis as starting point
  const handleImportAnalysis = () => {
    if (!analysisResult) return;

    const importedData: GeneratedResumeData = {
      personalInfo: {
        fullName: analysisResult.personalInfo.fullName || "Your Full Name",
        email: analysisResult.personalInfo.email || "hello@example.com",
        phone: analysisResult.personalInfo.phone || "+1 (555) 000-0000",
        location: analysisResult.personalInfo.location || "City, State",
        links: analysisResult.personalInfo.links || [],
        summary: analysisResult.personalInfo.summary || "A dedicated professional with a strong track record of success."
      },
      skills: analysisResult.skills?.map(s => s.name) || [],
      workExperience: analysisResult.workExperience?.map(w => ({
        jobTitle: w.jobTitle,
        company: w.company,
        location: w.location || "",
        duration: w.duration || "",
        description: w.description || []
      })) || [],
      education: analysisResult.education?.map(e => ({
        degree: e.degree,
        fieldOfStudy: e.fieldOfStudy || "",
        institution: e.institution,
        location: e.location || "",
        duration: e.duration || ""
      })) || [],
      certifications: analysisResult.certifications?.map(c => ({
        name: c.name,
        issuingOrganization: c.issuingOrganization || "",
        issueDate: c.issueDate || ""
      })) || [],
      projects: analysisResult.projects?.map(p => ({
        title: p.title,
        description: p.description,
        technologiesUsed: p.technologiesUsed || []
      })) || []
    };

    setResumeData(importedData);

    const confirmationMsg: Message = {
      role: "assistant",
      content: "⚡ **Succesfully imported your Career Analysis profile!** I've pre-loaded your current work history, education, skills, and projects.\n\nNow, how would you like to refine this? For example, we could:\n- 🎯 **Target it** for a specific role (e.g. 'Senior Product Manager')\n- ✍️ **Rewrite the summary** to be more compelling\n- 🛠️ **Enhance work experience** with metrics and stronger action verbs\n\nTell me what you'd like to do!",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmationMsg]);
  };

  // Chat message submission
  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isChatLoading) return;

    const userMsg: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat-resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: RESUME_WRITING_INSTRUCTIONS },
            ...[...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
          ],
          currentDraft: resumeData
        })
      });

      if (!response.ok) throw new Error("Failed to get chatbot response");

      const data = await response.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ I ran into an issue connecting to the server. Please check your internet connection and try again.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Compile the conversational inputs into a structured resume JSON object
  const handleCompileResume = async () => {
    setIsCompiling(true);
    try {
      const response = await fetch("/api/generate-resume-from-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: RESUME_WRITING_INSTRUCTIONS },
            ...messages.map(m => ({ role: m.role, content: m.content }))
          ],
          currentDraft: resumeData
        })
      });

      if (!response.ok) throw new Error("Compilation failed");

      const data = await response.json();
      setResumeData(data);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "🎉 **Spectacular!** I have processed our conversation history and generated a highly polished, professional resume draft for you on the right.\n\nYou can now:\n- Switch between different styled layouts (**Slate Modern**, **Executive Minimal**, **Tech Clean**).\n- Choose a custom accent color.\n- Copy the draft, or use your browser's Print option to save it as a high-quality PDF!",
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error(err);
      alert("Failed to compile structured resume. Please continue chatting or try again.");
    } finally {
      setIsCompiling(false);
    }
  };

  // Copy plain text/markdown resume to clipboard
  const handleCopyToClipboard = () => {
    if (!resumeData) return;

    let text = `${resumeData.personalInfo.fullName.toUpperCase()}\n`;
    text += `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}\n`;
    if (resumeData.personalInfo.links && resumeData.personalInfo.links.length > 0) {
      text += `${resumeData.personalInfo.links.join(" | ")}\n`;
    }
    text += `\nSUMMARY\n${resumeData.personalInfo.summary}\n\n`;

    text += `SKILLS\n${resumeData.skills.join(", ")}\n\n`;

    text += `EXPERIENCE\n`;
    resumeData.workExperience.forEach(w => {
      text += `${w.jobTitle} - ${w.company} (${w.duration})\n`;
      if (w.location) text += `${w.location}\n`;
      w.description.forEach(desc => {
        text += `- ${desc}\n`;
      });
      text += `\n`;
    });

    text += `EDUCATION\n`;
    resumeData.education.forEach(e => {
      text += `${e.degree} in ${e.fieldOfStudy || ""} - ${e.institution} (${e.duration})\n`;
      if (e.location) text += `${e.location}\n`;
      text += `\n`;
    });

    if (resumeData.certifications && resumeData.certifications.length > 0) {
      text += `CERTIFICATIONS\n`;
      resumeData.certifications.forEach(c => {
        text += `${c.name} ${c.issuingOrganization ? `by ${c.issuingOrganization}` : ""} ${c.issueDate ? `(${c.issueDate})` : ""}\n`;
      });
      text += `\n`;
    }

    if (resumeData.projects && resumeData.projects.length > 0) {
      text += `PROJECTS\n`;
      resumeData.projects.forEach(p => {
        text += `${p.title}\n`;
        text += `${p.description}\n`;
        if (p.technologiesUsed && p.technologiesUsed.length > 0) {
          text += `Technologies: ${p.technologiesUsed.join(", ")}\n`;
        }
        text += `\n`;
      });
    }

    navigator.clipboard.writeText(text);
    alert("Resume copied to clipboard successfully!");
  };

  // Print function which leverages print CSS styling
  const handlePrint = () => {
    window.print();
  };

  // Spacing density options that affect page-budget allocation
  // Default is compact to keep the preview on a single page when possible,
  // while allowing the user to switch to standard or spacious for more breathing room.
  const getDensityStyles = () => {
    switch (density) {
      case "compact":
        return {
          padding: "p-6 md:p-8",
          sectionMargin: "mb-3",
          itemSpacing: "space-y-1.5",
          listSpacing: "space-y-0.5",
          fontSizeModifier: "text-[11px] leading-normal",
          sectionTitleMargin: "mt-4 mb-2",
          headerPadding: "pb-4 mb-4",
          maxCapacity: 135, // Packs more content on a single page
        };
      case "spacious":
        return {
          padding: "p-10 md:p-14",
          sectionMargin: "mb-6",
          itemSpacing: "space-y-4",
          listSpacing: "space-y-1.5",
          fontSizeModifier: "text-xs md:text-sm leading-relaxed",
          sectionTitleMargin: "mt-8 mb-4",
          headerPadding: "pb-8 mb-8",
          maxCapacity: 85, // Spans pages more eagerly
        };
      case "standard":
      default:
        return {
          padding: "p-8 md:p-12",
          sectionMargin: "mb-4",
          itemSpacing: "space-y-3",
          listSpacing: "space-y-1",
          fontSizeModifier: "text-xs leading-relaxed",
          sectionTitleMargin: "mt-6 mb-3",
          headerPadding: "pb-6 mb-6",
          maxCapacity: 110, // Default balanced capacity
        };
    }
  };

  interface PaginatedPageContent {
    pageIndex: number;
    showHeader: boolean;
    showSummary: boolean;
    workExperience: GeneratedResumeData["workExperience"];
    skills: GeneratedResumeData["skills"];
    projects: NonNullable<GeneratedResumeData["projects"]>;
    education: GeneratedResumeData["education"];
    certifications: NonNullable<GeneratedResumeData["certifications"]>;
  }

  // Smart packing algorithm that splits sections and elements across multiple pages.
  // It prefers the compact budget first and only uses additional pages when content is too dense.
  const getPaginatedPages = (data: GeneratedResumeData): PaginatedPageContent[] => {
    const pages: PaginatedPageContent[] = [];
    const d = getDensityStyles();
    const maxCap = d.maxCapacity;

    const createEmptyPage = (index: number): PaginatedPageContent => ({
      pageIndex: index,
      showHeader: index === 0,
      showSummary: false,
      workExperience: [],
      skills: [],
      projects: [],
      education: [],
      certifications: []
    });

    let currentPage = createEmptyPage(0);
    let currentCapacityUsed = 0;

    // 1. Header (always on page 1, takes some structural room)
    if (currentPage.showHeader) {
      currentCapacityUsed += 15;
    }

    // Helper to start a new page if the next section exceeds page-height limit
    const allocateOrBreak = (weight: number) => {
      if (currentCapacityUsed + weight > maxCap) {
        pages.push(currentPage);
        currentPage = createEmptyPage(pages.length);
        currentCapacityUsed = 0;
        return true;
      }
      return false;
    };

    // 2. Summary profile
    if (data.personalInfo.summary) {
      const summaryText = data.personalInfo.summary;
      const summaryWeight = 10 + Math.ceil(summaryText.length / 100) * 3;
      
      allocateOrBreak(summaryWeight);
      currentPage.showSummary = true;
      currentCapacityUsed += summaryWeight;
    }

    // 3. Work Experience items (can break item-by-item)
    if (data.workExperience && data.workExperience.length > 0) {
      data.workExperience.forEach((exp) => {
        const bulletsWeight = exp.description.reduce((acc, bullet) => acc + 2 + Math.ceil(bullet.length / 80) * 1.5, 0);
        const expWeight = 10 + bulletsWeight;

        allocateOrBreak(expWeight);
        currentPage.workExperience.push(exp);
        currentCapacityUsed += expWeight;
      });
    }

    // 4. Skills
    if (data.skills && data.skills.length > 0) {
      const skillsWeight = 8 + Math.ceil(data.skills.length / 6) * 3;
      allocateOrBreak(skillsWeight);
      currentPage.skills = data.skills;
      currentCapacityUsed += skillsWeight;
    }

    // 5. Projects
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach((proj) => {
        const projWeight = 10 + Math.ceil(proj.description.length / 120) * 3;
        allocateOrBreak(projWeight);
        currentPage.projects.push(proj);
        currentCapacityUsed += projWeight;
      });
    }

    // 6. Education items
    if (data.education && data.education.length > 0) {
      data.education.forEach((edu) => {
        const eduWeight = 8;
        allocateOrBreak(eduWeight);
        currentPage.education.push(edu);
        currentCapacityUsed += eduWeight;
      });
    }

    // 7. Certifications
    if (data.certifications && data.certifications.length > 0) {
      data.certifications.forEach((cert) => {
        const certWeight = 5;
        allocateOrBreak(certWeight);
        currentPage.certifications.push(cert);
        currentCapacityUsed += certWeight;
      });
    }

    // Push final page
    pages.push(currentPage);
    return pages;
  };

  // Inline styling options for the selected template.
  // The compact density remains the default, but the user can switch to a broader style if needed.
  const getTemplateStyles = () => {
    const d = getDensityStyles();
    switch (selectedTemplate) {
      case "executive":
        return {
          fontFamily: "'Playfair Display', Georgia, serif",
          containerClass: `bg-white ${d.padding} text-slate-900 border border-slate-100 max-w-4xl mx-auto shadow-sm text-sm leading-relaxed`,
          headerClass: `text-center border-b border-slate-200 ${d.headerPadding}`,
          sectionTitleClass: `text-xs uppercase tracking-widest font-bold text-slate-800 border-b border-slate-200 pb-1.5 ${d.sectionTitleMargin} flex items-center gap-2`,
        };
      case "tech":
        return {
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          containerClass: `bg-white ${d.padding} text-slate-900 border border-slate-200 max-w-4xl mx-auto shadow-sm text-xs leading-normal`,
          headerClass: `border-b-2 border-dashed border-slate-200 ${d.headerPadding}`,
          sectionTitleClass: `text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-1 ${d.sectionTitleMargin} flex items-center gap-1.5`,
        };
      case "modern":
      default:
        return {
          fontFamily: "'Inter', sans-serif",
          containerClass: `bg-white ${d.padding} text-slate-800 border border-slate-100 max-w-4xl mx-auto shadow-sm text-xs leading-relaxed`,
          headerClass: `border-b-2 ${d.headerPadding}`,
          sectionTitleClass: `text-sm font-bold border-b pb-1 ${d.sectionTitleMargin} flex items-center gap-2`,
        };
    }
  };

  const style = getTemplateStyles();
  const densityStyle = getDensityStyles();

  return (
    <div className="min-h-screen bg-slate-50/50 py-4 px-3 sm:px-4 lg:px-6">
      {/* Hidden print stylesheet rules injected specifically for seamless PDF saving */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .resume-page-break {
            page-break-after: always;
            break-after: page;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .resume-page-break:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-200 pb-2 mb-3 gap-2">
          <div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              Interactive Co-Pilot
            </div>
            <h1 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
              AI Resume Generator
            </h1>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xl">
              Collaborate with an expert resume consultant to dynamically write, format, and optimize your resume for high ATS compatibility.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {analysisResult && (
              <button
                onClick={handleImportAnalysis}
                className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all border border-blue-100 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                Import Profile
              </button>
            )}
            <button
              onClick={() => {
                setResumeData({
                  personalInfo: {
                    fullName: "Alex Rivera",
                    email: "alex.rivera@example.com",
                    phone: "+1 (555) 432-8765",
                    location: "San Francisco, CA",
                    links: ["github.com/alexrivera", "linkedin.com/in/alexrivera"],
                    summary: "Versatile Frontend Engineer with 4+ years of professional experience building responsive, user-centric web applications. Expert in React, TypeScript, and performance optimization with a strong focus on clean design principles."
                  },
                  skills: ["React.js", "TypeScript", "Tailwind CSS", "Next.js", "GraphQL", "Jest", "CI/CD", "Web Performance"],
                  workExperience: [
                    {
                      jobTitle: "Senior Frontend Engineer",
                      company: "Innovate Tech",
                      duration: "Mar 2023 - Present",
                      location: "San Francisco, CA",
                      description: [
                        "Architected and developed complex high-performance dashboard interfaces using React and state management.",
                        "Optimized overall web application load speeds by 35% through image caching, code splitting, and bundle reduction.",
                        "Mentored and provided code review for a multidisciplinary engineering squad of 5 junior developers."
                      ]
                    },
                    {
                      jobTitle: "Software Engineer",
                      company: "Launchpad Studio",
                      duration: "Jun 2021 - Feb 2023",
                      location: "Austin, TX",
                      description: [
                        "Built robust UI systems using Tailwind CSS and React, serving over 150k monthly active platform users.",
                        "Collaborated closely with visual designers to execute flawless Figma design translations into component libraries."
                      ]
                    }
                  ],
                  education: [
                    {
                      degree: "B.S. in Computer Science",
                      institution: "University of Texas at Austin",
                      duration: "2017 - 2021"
                    }
                  ],
                  certifications: [
                    {
                      name: "AWS Certified Developer",
                      issuingOrganization: "Amazon Web Services",
                      issueDate: "2024"
                    }
                  ],
                  projects: [
                    {
                      title: "Smart Analytics Engine",
                      description: "Real-time client telemetry visualization platform processing over 2M structured events daily.",
                      technologiesUsed: ["React", "D3.js", "Node.js", "Redis"]
                    }
                  ]
                });
                setMessages(prev => [
                  ...prev,
                  {
                    role: "assistant",
                    content: "⚡ Loaded a pre-formatted **Sample Resume** for you on the right! Feel free to ask me to make rewrites, expand bullets, or add new items.",
                    timestamp: new Date()
                  }
                ]);
              }}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] px-3 py-1.5 rounded-xl transition-all cursor-pointer border border-slate-200"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Load Sample
            </button>
          </div>
        </div>

        {/* Main Grid: Left is Consultation Chat, Right is Resume Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Chat Panel: 5 columns on large screen */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[540px] overflow-hidden">
            {/* Header */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center shrink-0 border border-purple-200">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    SkillSense Specialist
                    <span className="inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Active Consulting Session</p>
                </div>
              </div>

              {resumeData && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your active resume?")) {
                      setResumeData(null);
                    }
                  }}
                  className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                  title="Clear Active Draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, index) => {
                const isAI = msg.role === "assistant";
                return (
                  <div
                    key={index}
                    className={`flex ${isAI ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`max-w-[85%] flex gap-2.5 ${isAI ? "flex-row" : "flex-row-reverse"}`}>
                      {isAI && (
                        <div className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center border border-purple-100 shrink-0 mt-0.5 text-xs font-bold">
                          AI
                        </div>
                      )}
                      <div>
                        <div
                          className={`p-3 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-line ${
                            isAI 
                              ? "bg-slate-100 text-slate-800 rounded-tl-none" 
                              : "bg-blue-600 text-white rounded-tr-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="block text-[9px] text-slate-400 mt-1 px-1 text-right">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2.5 items-center">
                    <div className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center border border-purple-100 shrink-0 text-xs font-bold animate-pulse">
                      AI
                    </div>
                    <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                      Specialist is composing recommendations...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Shortcuts */}
            <div className="px-3 py-2 bg-slate-50/50 border-t border-slate-100 flex flex-wrap gap-1.5 shrink-0">
              {messages.length === 1 && (
                <>
                  <button
                    onClick={() => {
                      if (analysisResult) {
                        handleImportAnalysis();
                      } else {
                        handleSendMessage(undefined, "I want to start from scratch and build a new resume.");
                      }
                    }}
                    className="text-[10px] bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 text-slate-600 hover:text-purple-700 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                  >
                    {analysisResult ? "⚡ Import Analysis Profile" : "🆕 Start from Scratch"}
                  </button>
                  <button
                    onClick={() => handleSendMessage(undefined, "Can you show me a sample layout first?")}
                    className="text-[10px] bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 text-slate-600 hover:text-purple-700 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                  >
                    📖 Show Sample
                  </button>
                </>
              )}
              {messages.length > 1 && (
                <>
                  <button
                    onClick={() => handleSendMessage(undefined, "Can you draft a strong Summary statement focusing on tech leadership?")}
                    className="text-[10px] bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 text-slate-600 hover:text-blue-700 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    ✍️ Draft Summary
                  </button>
                  <button
                    onClick={() => handleSendMessage(undefined, "How can I rewrite my experience bullets to include metrics?")}
                    className="text-[10px] bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 text-slate-600 hover:text-blue-700 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    📊 Add Metrics
                  </button>
                  <button
                    onClick={() => handleSendMessage(undefined, "Suggest the top 10 core soft & hard skills for Frontend/Fullstack devs.")}
                    className="text-[10px] bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 text-slate-600 hover:text-blue-700 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    🛠️ Tech Skills
                  </button>
                </>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your background details, ask to rewrite, etc..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={isChatLoading}
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-xl transition-all cursor-pointer disabled:bg-purple-300 flex items-center justify-center shrink-0"
                disabled={isChatLoading || !inputMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Action Bar */}
            <div className="p-3 bg-purple-50 border-t border-purple-100 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="text-[10px] text-purple-800 font-semibold">Done chatting? Let's compile.</span>
              </div>
              <button
                onClick={handleCompileResume}
                disabled={isCompiling}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isCompiling ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Compiling...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    Compile & Preview
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel: 7 columns on large screen */}
          <div className="lg:col-span-7 flex flex-col gap-1.5">
            
            {/* Quick Design controls */}
            {resumeData && (
              <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Palette className="w-3.5 h-3.5" />
                        Layout Theme
                      </span>
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                        <button
                          onClick={() => setSelectedTemplate("modern")}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            selectedTemplate === "modern" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Slate Modern
                        </button>
                        <button
                          onClick={() => setSelectedTemplate("executive")}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            selectedTemplate === "executive" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Executive Minimal
                        </button>
                        <button
                          onClick={() => setSelectedTemplate("tech")}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            selectedTemplate === "tech" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          Tech Clean
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Grid className="w-3.5 h-3.5" />
                        Page Budget / Density
                      </span>
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                        <button
                          onClick={() => setDensity("compact")}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            density === "compact" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          }`}
                          title="Packs more details onto each page using tight margins"
                        >
                          Compact
                        </button>
                        <button
                          onClick={() => setDensity("standard")}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            density === "standard" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          }`}
                          title="Standard balanced spacing"
                        >
                          Standard
                        </button>
                        <button
                          onClick={() => setDensity("spacious")}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            density === "spacious" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          }`}
                          title="Spans pages more eagerly with larger, highly readable layouts"
                        >
                          Spacious
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Palette className="w-3.5 h-3.5" />
                        Accent Color
                      </span>
                      <div className="flex items-center gap-1.5">
                        {ACCENT_COLORS.map((c) => (
                          <button
                             key={c.value}
                             onClick={() => setAccentColor(c.value)}
                             className="w-5.5 h-5.5 rounded-full border-2 transition-all cursor-pointer relative flex items-center justify-center shrink-0"
                             style={{ 
                               backgroundColor: c.value,
                               borderColor: accentColor === c.value ? "#000000" : "transparent"
                             }}
                             title={c.name}
                          >
                             {accentColor === c.value && (
                               <Check className="w-3 h-3 text-white font-black" />
                             )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyToClipboard}
                      className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-all border border-slate-200 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                      title="Copy plain-text to Clipboard"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center gap-1 text-[11px] font-bold shadow-sm cursor-pointer"
                      title="Save as PDF or Print"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Export PDF
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Document preview viewport */}
            <div className="bg-slate-200 p-2 sm:p-3 rounded-2xl overflow-y-auto max-h-[500px] border border-slate-300 shadow-inner flex flex-col justify-start">
              
              <AnimatePresence mode="wait">
                {resumeData ? (
                  <div className="printable-area flex flex-col gap-6 w-full" id="resume-document">
                    {getPaginatedPages(resumeData).map((page, pageIdx, allPages) => (
                      <motion.div
                        key={`${selectedTemplate}-${accentColor}-${pageIdx}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className={`${style.containerClass} resume-page-break relative min-h-[650px] pb-16`}
                        style={{ fontFamily: style.fontFamily }}
                      >
                        
                        {/* Header */}
                        {page.showHeader && (
                          <div className={style.headerClass} style={{ borderColor: selectedTemplate === "modern" ? accentColor : undefined }}>
                            {selectedTemplate === "modern" ? (
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                                <div>
                                  <h2 className="text-2xl font-black tracking-tight" style={{ color: accentColor }}>
                                    {resumeData.personalInfo.fullName}
                                  </h2>
                                  <p className="text-slate-500 text-xs font-semibold mt-1">
                                    {resumeData.personalInfo.email} &bull; {resumeData.personalInfo.phone} &bull; {resumeData.personalInfo.location}
                                  </p>
                                </div>
                                {resumeData.personalInfo.links && resumeData.personalInfo.links.length > 0 && (
                                  <div className="text-[10px] text-slate-400 font-medium flex flex-wrap gap-x-2 md:text-right">
                                    {resumeData.personalInfo.links.map((link, idx) => (
                                      <span key={idx} className="hover:underline">
                                        {link}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : selectedTemplate === "tech" ? (
                              <div>
                                <div className="flex justify-between items-start">
                                  <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900">
                                    // {resumeData.personalInfo.fullName}
                                  </h2>
                                  <span className="text-[10px] text-emerald-600 font-mono">STATUS: COMPILED</span>
                                </div>
                                <div className="text-slate-500 font-mono text-[10px] mt-2 space-y-0.5">
                                  <div><span className="text-slate-400">CONTACT_EMAIL :</span> {resumeData.personalInfo.email}</div>
                                  <div><span className="text-slate-400">CONTACT_PHONE :</span> {resumeData.personalInfo.phone}</div>
                                  <div><span className="text-slate-400">LOCATION      :</span> {resumeData.personalInfo.location}</div>
                                  {resumeData.personalInfo.links && resumeData.personalInfo.links.length > 0 && (
                                    <div><span className="text-slate-400">PORTFOLIOS    :</span> {resumeData.personalInfo.links.join(", ")}</div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              // Executive
                              <div>
                                <h2 className="text-2xl font-normal text-slate-900 tracking-wide font-serif">
                                  {resumeData.personalInfo.fullName}
                                </h2>
                                <p className="text-slate-500 text-xs font-serif italic mt-1.5">
                                  {resumeData.personalInfo.location} &bull; {resumeData.personalInfo.email} &bull; {resumeData.personalInfo.phone}
                                </p>
                                {resumeData.personalInfo.links && resumeData.personalInfo.links.length > 0 && (
                                  <div className="text-[10px] text-slate-500 tracking-wide mt-2 space-x-3">
                                    {resumeData.personalInfo.links.map((link, idx) => (
                                      <span key={idx} className="hover:underline">
                                        {link}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Executive Summary */}
                        {page.showSummary && resumeData.personalInfo.summary && (
                          <div className={densityStyle.sectionMargin}>
                            <div className={style.sectionTitleClass} style={{ color: selectedTemplate === "modern" ? accentColor : undefined }}>
                              {selectedTemplate === "modern" && <FileText className="w-3.5 h-3.5 shrink-0" />}
                              {selectedTemplate === "tech" && <span className="text-[9px] text-slate-400">&gt;</span>}
                              Professional Profile
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium">
                              {resumeData.personalInfo.summary}
                            </p>
                          </div>
                        )}

                        {/* Work Experience */}
                        {page.workExperience && page.workExperience.length > 0 && (
                          <div className={densityStyle.sectionMargin}>
                            <div className={style.sectionTitleClass} style={{ color: selectedTemplate === "modern" ? accentColor : undefined }}>
                              {selectedTemplate === "modern" && <Briefcase className="w-3.5 h-3.5 shrink-0" />}
                              {selectedTemplate === "tech" && <span className="text-[9px] text-slate-400">&gt;</span>}
                              Work Experience {pageIdx > 0 && <span className="text-[10px] font-normal text-slate-400 lowercase italic">(continued)</span>}
                            </div>
                            <div className={densityStyle.itemSpacing}>
                              {page.workExperience.map((exp, idx) => (
                                <div key={idx} className="group">
                                  <div className="flex justify-between items-start font-bold text-slate-800">
                                    <div>
                                      <span className="text-slate-950 font-bold">{exp.jobTitle}</span>
                                      <span className="text-slate-400 font-normal"> at </span>
                                      <span style={{ color: selectedTemplate === "modern" ? accentColor : undefined }}>{exp.company}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-semibold shrink-0">{exp.duration}</span>
                                  </div>
                                  {exp.location && (
                                    <span className="block text-[10px] text-slate-400 font-medium italic mt-0.5">{exp.location}</span>
                                  )}
                                  <ul className={`list-disc list-outside pl-4 mt-2 ${densityStyle.listSpacing} text-slate-600 font-medium`}>
                                    {exp.description.map((bullet, bulletIdx) => (
                                      <li key={bulletIdx}>{bullet}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Key Skills */}
                        {page.skills && page.skills.length > 0 && (
                          <div className={densityStyle.sectionMargin}>
                            <div className={style.sectionTitleClass} style={{ color: selectedTemplate === "modern" ? accentColor : undefined }}>
                              {selectedTemplate === "modern" && <Code className="w-3.5 h-3.5 shrink-0" />}
                              {selectedTemplate === "tech" && <span className="text-[9px] text-slate-400">&gt;</span>}
                              Skills & Competencies
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {page.skills.map((skill, idx) => (
                                <span 
                                  key={idx} 
                                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${
                                    selectedTemplate === "tech" 
                                      ? "bg-slate-50 border-slate-200 text-slate-800 font-mono" 
                                      : "bg-slate-50/50 border-slate-100 text-slate-700"
                                  }`}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Projects */}
                        {page.projects && page.projects.length > 0 && (
                          <div className={densityStyle.sectionMargin}>
                            <div className={style.sectionTitleClass} style={{ color: selectedTemplate === "modern" ? accentColor : undefined }}>
                              {selectedTemplate === "modern" && <FolderGit2 className="w-3.5 h-3.5 shrink-0" />}
                              {selectedTemplate === "tech" && <span className="text-[9px] text-slate-400">&gt;</span>}
                              Key Projects {pageIdx > 0 && page.workExperience.length === 0 && <span className="text-[10px] font-normal text-slate-400 lowercase italic">(continued)</span>}
                            </div>
                            <div className={densityStyle.itemSpacing}>
                              {page.projects.map((proj, idx) => (
                                <div key={idx}>
                                  <div className="flex justify-between items-start">
                                    <h4 className="text-slate-900 font-bold">{proj.title}</h4>
                                    {proj.technologiesUsed && proj.technologiesUsed.length > 0 && (
                                      <div className="flex gap-1">
                                        {proj.technologiesUsed.map((tech, tIdx) => (
                                          <span key={tIdx} className="text-[9px] text-slate-400 font-mono border border-slate-100 px-1 rounded">
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-slate-600 font-medium mt-1 leading-normal">{proj.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education */}
                        {page.education && page.education.length > 0 && (
                          <div className={densityStyle.sectionMargin}>
                            <div className={style.sectionTitleClass} style={{ color: selectedTemplate === "modern" ? accentColor : undefined }}>
                              {selectedTemplate === "modern" && <GraduationCap className="w-3.5 h-3.5 shrink-0" />}
                              {selectedTemplate === "tech" && <span className="text-[9px] text-slate-400">&gt;</span>}
                              Education History
                            </div>
                            <div className={densityStyle.itemSpacing}>
                              {page.education.map((edu, idx) => (
                                <div key={idx} className="flex justify-between items-start">
                                  <div>
                                    <span className="text-slate-900 font-bold">{edu.degree}</span>
                                    {edu.fieldOfStudy && (
                                      <span className="text-slate-600 font-medium"> in {edu.fieldOfStudy}</span>
                                    )}
                                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{edu.institution}</div>
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-semibold shrink-0">{edu.duration}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Certifications */}
                        {page.certifications && page.certifications.length > 0 && (
                          <div className={densityStyle.sectionMargin}>
                            <div className={style.sectionTitleClass} style={{ color: selectedTemplate === "modern" ? accentColor : undefined }}>
                              {selectedTemplate === "modern" && <Award className="w-3.5 h-3.5 shrink-0" />}
                              {selectedTemplate === "tech" && <span className="text-[9px] text-slate-400">&gt;</span>}
                              Certifications
                            </div>
                            <ul className={`list-disc list-outside pl-4 ${densityStyle.listSpacing} text-slate-600 font-medium`}>
                              {page.certifications.map((cert, idx) => (
                                <li key={idx}>
                                  <span className="font-bold text-slate-800">{cert.name}</span>
                                  {cert.issuingOrganization && (
                                    <span className="text-slate-500"> &bull; {cert.issuingOrganization}</span>
                                  )}
                                  {cert.issueDate && <span className="text-slate-400 font-normal"> ({cert.issueDate})</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Footer page number indicator */}
                        {allPages.length > 1 && (
                          <div className="absolute bottom-4 left-0 right-0 px-8 md:px-12 flex justify-between items-center text-[10px] text-slate-400 font-medium font-sans border-t border-slate-100 pt-3 mt-6 print:absolute print:bottom-4">
                            <span>{resumeData.personalInfo.fullName} &bull; Resume</span>
                            <span>Page {pageIdx + 1} of {allPages.length}</span>
                          </div>
                        )}

                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Empty State
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md mx-auto my-12"
                  >
                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-100">
                      <FileText className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Your Resume Draft is Empty</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Start chatting with our AI Resume Specialist on the left, or load a sample resume to immediately see the design preview and format options.
                    </p>

                    <div className="mt-6 flex flex-col gap-2">
                      {analysisResult && (
                        <button
                          onClick={handleImportAnalysis}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          <Zap className="w-4 h-4" />
                          Import from Career Analysis
                        </button>
                      )}
                      <button
                        onClick={() => handleSendMessage(undefined, "Let's start building a new resume from scratch!")}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                      >
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                        Start Guided Tour
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
