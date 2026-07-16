import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  RefreshCw, 
  User, 
  Bot, 
  HelpCircle, 
  BookOpen, 
  CheckCircle, 
  Play, 
  Briefcase, 
  FileText, 
  ChevronRight,
  UserCheck,
  ChevronDown,
  Search,
  Check
} from "lucide-react";
import { ResumeAnalysisResult } from "../types";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface InterviewChatbotProps {
  analysisResult: ResumeAnalysisResult | null;
}

// Preset tracks for the interview coach
const PRESET_TRACKS = [
  {
    id: "behavioral",
    name: "Behavioral & STAR Prep",
    description: "Focus on soft skills, teamwork, and problem solving using Situation, Task, Action, and Result.",
    icon: HelpCircle,
    color: "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100/50",
    initialPrompt: "I want to practice behavioral interview questions. Please start our mock interview by asking me a typical behavioral question, and guide me on how to answer using the STAR method."
  },
  {
    id: "frontend",
    name: "Frontend Engineering",
    description: "Practice React, JavaScript, CSS, system design, state management, and modern web architectures.",
    icon: Sparkles,
    color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/50",
    initialPrompt: "I am preparing for a Frontend Engineer interview. Please start a mock interview asking technical or conceptual frontend questions one-by-one."
  },
  {
    id: "backend",
    name: "Backend & Systems",
    description: "Practice databases, system design, API design, security, scalability, and algorithms.",
    icon: BookOpen,
    color: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100/50",
    initialPrompt: "I am preparing for a Backend & System Design interview. Please start a mock interview asking technical questions about microservices, databases, API design, or scale."
  },
  {
    id: "product",
    name: "Product & Strategy",
    description: "Focus on metric analysis, product thinking, strategic prioritization, and stakeholder communication.",
    icon: Briefcase,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/50",
    initialPrompt: "I am preparing for a Product Manager / Tech Strategy interview. Please start our mock interview asking about product sense, prioritization frameworks, or product launch metrics."
  }
];

// Popular tech roles to recommend
const POPULAR_ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Developer",
  "Mobile Developer (iOS/Android)",
  "DevOps / SRE Specialist",
  "Data Scientist / AI Engineer",
  "Product Manager",
  "UX/UI Designer",
  "System Architect",
  "Cloud Engineer",
  "QA Automation Engineer",
  "Cybersecurity Engineer",
  "Data Engineer"
];

export const InterviewChatbot: React.FC<InterviewChatbotProps> = ({ analysisResult }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your **SkillSense AI Interview Coach**. 🤖\n\nI can help you ace your upcoming interviews! Choose one of the core practice tracks below, or let's start a custom session tailored to your profile.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  
  // Custom job context state
  const [customRole, setCustomRole] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [useResumeContext, setUseResumeContext] = useState(!!analysisResult);

  // Dropdown UI states
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);



  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRolesDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Parse recommended roles from resume analysis
  const getRecommendedRoles = () => {
    const rolesSet = new Set<string>();
    
    if (analysisResult) {
      // 1. Current & past roles from work experience
      analysisResult.workExperience?.forEach(w => {
        if (w.jobTitle) rolesSet.add(w.jobTitle.trim());
      });
      // 2. Future predicted transition roles from pathways
      analysisResult.careerProgression?.pathways?.forEach(p => {
        p.predictedRoles?.forEach(r => {
          if (r.roleTitle) rolesSet.add(r.roleTitle.trim());
        });
      });
    }
    
    return Array.from(rolesSet).filter(Boolean);
  };



  // Sync state if analysisResult changes
  useEffect(() => {
    if (analysisResult) {
      setUseResumeContext(true);
    }
  }, [analysisResult]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawContent = textToSend || input;
    if (!rawContent.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: rawContent,
      timestamp: new Date()
    };

    // Append user message
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) {
      setInput("");
    }
    setIsLoading(true);

    try {
      // Build the prompt context payload
      const payloadMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const jobContext = customRole || customCompany ? {
        title: customRole || "Target Position",
        company: customCompany || "Target Company",
        skills: [],
        description: ""
      } : null;

      const resumeContext = useResumeContext && analysisResult ? analysisResult : null;

      const response = await fetch("/api/chat-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: payloadMessages,
          jobContext,
          resumeContext
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with Interview Coach API");
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply || "I encountered an error formulating a reply. Please try again.",
        timestamp: new Date()
      }]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I had trouble connecting to the AI Coach service. Please check your internet connection or verify your API key settings, and try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startTrack = (trackId: string, initialPrompt: string) => {
    setSelectedTrack(trackId);
    setMessages([
      {
        role: "assistant",
        content: `Excellent! You've started the **${PRESET_TRACKS.find(t => t.id === trackId)?.name}** track. I will ask questions, evaluate your answers with detailed constructive critiques, and guide you towards high-impact responses. Let's begin!`,
        timestamp: new Date()
      }
    ]);
    handleSendMessage(initialPrompt);
  };

  const handleResetChat = () => {
    setSelectedTrack(null);
    setMessages([
      {
        role: "assistant",
        content: "Hello! I am your **SkillSense AI Interview Coach**. 🤖\n\nI can help you ace your upcoming interviews! Choose one of the core practice tracks below, or let's start a custom session tailored to your profile.",
        timestamp: new Date()
      }
    ]);
    setInput("");
    setIsLoading(false);
  };

  return (
    <div className="interview-coach-container bg-white border border-[#E5E7EB] rounded-2xl shadow-lg grid grid-cols-1 lg:grid-cols-5 overflow-hidden h-[calc(100vh-18rem)] min-h-[600px]" id="interview-coach">
      
      {/* Left Sidebar: Options & Configs */}
      <div className="lg:col-span-1 border-r border-[#E5E7EB] bg-slate-50/50 p-6 sm:p-7 lg:p-8 flex flex-col gap-7 sm:gap-9 overflow-y-auto max-h-screen">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-blue-600">💡 Configuration</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
            Customize the AI's persona, context, and focus to perfectly simulate your actual upcoming interview.
          </p>

          <div className="space-y-7">
            {/* Resume Context Option */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={useResumeContext} 
                  disabled={!analysisResult}
                  onChange={(e) => setUseResumeContext(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                  Inject analyzed resume context
                </span>
              </label>
              {!analysisResult && (
                <p className="text-[10px] text-slate-400 italic mt-1">
                  (Please upload and analyze a resume first to enable this)
                </p>
              )}
              {analysisResult && useResumeContext && (
                <div className="mt-1.5 flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1 text-[10px] text-blue-700 font-semibold">
                  <UserCheck className="w-3.5 h-3.5" />
                  Tailored to {analysisResult.personalInfo.fullName}
                </div>
              )}
            </div>

            {/* Custom target role with Autocomplete Dropdown */}
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">🎯 Target Role</label>
              <div className="relative">
                <input 
                  type="text"
                  value={customRole}
                  onChange={(e) => {
                    setCustomRole(e.target.value);
                    setShowRolesDropdown(true);
                  }}
                  onFocus={() => setShowRolesDropdown(true)}
                  placeholder="e.g. Senior React Developer"
                  className="w-full text-xs pl-8 pr-8 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowRolesDropdown(!showRolesDropdown);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-0.5"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Roles Dropdown List */}
              {showRolesDropdown && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto py-1">
                  {/* Recommended From Resume section */}
                  {analysisResult && getRecommendedRoles().length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 px-3 py-1.5 bg-slate-50 uppercase tracking-wider">
                        ✨ Recommended from Resume
                      </div>
                      {getRecommendedRoles()
                        .filter(role => role.toLowerCase().includes(customRole.toLowerCase()))
                        .map((role) => {
                          const isSelected = customRole.toLowerCase() === role.toLowerCase();
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => {
                                setCustomRole(role);
                                setShowRolesDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                isSelected 
                                  ? "bg-blue-50 text-blue-700 font-bold" 
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <span className="truncate">{role}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                            </button>
                          );
                        })}
                      {getRecommendedRoles().filter(role => role.toLowerCase().includes(customRole.toLowerCase())).length === 0 && (
                        <div className="text-[11px] text-slate-400 italic px-3 py-2">
                          No matching roles in resume
                        </div>
                      )}
                    </div>
                  )}

                  {/* Popular Roles section */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 px-3 py-1.5 bg-slate-50 uppercase tracking-wider border-t border-slate-100">
                      🔥 Popular Tech Roles
                    </div>
                    {POPULAR_ROLES
                      .filter(role => 
                        role.toLowerCase().includes(customRole.toLowerCase()) &&
                        !getRecommendedRoles().some(r => r.toLowerCase() === role.toLowerCase())
                      )
                      .map((role) => {
                        const isSelected = customRole.toLowerCase() === role.toLowerCase();
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              setCustomRole(role);
                              setShowRolesDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected 
                                ? "bg-blue-50 text-blue-700 font-bold" 
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span className="truncate">{role}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                          </button>
                        );
                      })}
                    {POPULAR_ROLES.filter(role => 
                      role.toLowerCase().includes(customRole.toLowerCase()) &&
                      !getRecommendedRoles().some(r => r.toLowerCase() === role.toLowerCase())
                    ).length === 0 && (
                      <div className="text-[11px] text-slate-400 italic px-3 py-2">
                        No matching popular roles
                      </div>
                    )}
                  </div>

                  {/* Prompt to use custom typed text if no perfect match */}
                  {customRole && !POPULAR_ROLES.some(r => r.toLowerCase() === customRole.toLowerCase()) && 
                   !getRecommendedRoles().some(r => r.toLowerCase() === customRole.toLowerCase()) && (
                    <div className="p-2 border-t border-slate-100 bg-blue-50/30">
                      <button
                        type="button"
                        onClick={() => setShowRolesDropdown(false)}
                        className="w-full text-[11px] text-blue-700 font-bold text-left hover:underline cursor-pointer"
                      >
                        Keep typed: "{customRole}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Custom Target Company */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">🏢 Company Name</label>
              <input 
                type="text"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                placeholder="e.g. Google, Stripe"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-200 pt-7">
          <button
            onClick={handleResetChat}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors bg-white hover:shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Practice Session
          </button>
        </div>
      </div>

      {/* Right Content: Chat & Tracks */}
      <div className="lg:col-span-4 flex flex-col h-full overflow-hidden bg-white">
        
        {/* Chat Messages Port */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-9 space-y-7 min-h-[350px]">
          
          {/* Preset tracks overlay inside chat if no track is selected yet and conversation is empty/initial */}
          {!selectedTrack && messages.length === 1 && (
            <div className="mb-9 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {PRESET_TRACKS.map((track) => {
                const IconComponent = track.icon;
                return (
                  <button
                    key={track.id}
                    onClick={() => startTrack(track.id, track.initialPrompt)}
                    className={`text-left p-6 rounded-2xl border border-[#E5E7EB] cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl hover:border-blue-200 flex items-start gap-5 ${track.color}`}
                  >
                    <div className="p-3.5 rounded-xl bg-white/80 shrink-0 border border-current/10 shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-extrabold text-slate-900 leading-tight">{track.name}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {track.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {messages.map((message, idx) => {
            const isAI = message.role === "assistant";
            return (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  isAI ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                }`}>
                  {isAI ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl p-6 sm:p-7 leading-relaxed text-sm ${
                  isAI 
                    ? "bg-slate-50 border border-slate-100 text-slate-800" 
                    : "bg-blue-600 text-white shadow-md shadow-blue-100"
                }`}>
                  <div className="space-y-2.5 text-xs md:text-sm">
                    {/* Convert simple markdown headings and list items to cleaner layouts */}
                    {message.content.split("\n").map((line, i) => {
                      if (!line.trim()) {
                        return <div key={i} className="h-1" />;
                      }
                      
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return <strong key={i} className="block text-slate-900 font-extrabold text-base mt-2.5 mb-1.5 leading-tight">{line.replaceAll("**", "")}</strong>;
                      }
                      if (line.startsWith("- ") || line.startsWith("* ")) {
                        return (
                          <div key={i} className="flex gap-1.5 pl-2 py-0.5">
                            <span className={isAI ? "text-blue-500 font-bold" : "text-white"}>•</span>
                            <span className="leading-relaxed">{line.substring(2)}</span>
                          </div>
                        );
                      }
                      
                      // Handle inline bold formatting more robustly
                      const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(p => p !== '');
                      return (
                        <p key={i} className="leading-relaxed">
                          {parts.map((part, pIdx) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return <strong key={pIdx} className={isAI ? "text-slate-900 font-bold" : "text-white font-extrabold"}>{part.replaceAll("**", "")}</strong>;
                            }
                            return <span key={pIdx}>{part}</span>;
                          })}
                        </p>
                      );
                    })}
                  </div>
                  
                  {/* Timestamp */}
                  <span className={`block text-[9px] mt-2 text-right ${isAI ? "text-slate-400" : "text-blue-200"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Loader chunk */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="rounded-2xl p-4 bg-slate-50 border border-slate-100 text-slate-500 font-mono text-xs flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>AI Interview Coach is typing advice...</span>
              </div>
            </div>
          )}

        </div>

        {/* Action Suggestion Chips above input */}
        <div className="px-6 py-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider self-center mr-1">Quick prompts:</span>
          
          <button
            onClick={() => handleSendMessage("Ask me a common behavioral interview question.")}
            disabled={isLoading}
            className="text-[11px] bg-white hover:bg-blue-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer"
          >
            📋 Get behavioral question
          </button>

          <button
            onClick={() => handleSendMessage("What is the STAR method and how can I use it to structure my answers?")}
            disabled={isLoading}
            className="text-[11px] bg-white hover:bg-blue-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer"
          >
            🚀 Explain STAR method
          </button>

          {analysisResult && (
            <button
              onClick={() => handleSendMessage("Based on my resume, what are the most likely interview questions recruiters will ask?")}
              disabled={isLoading}
              className="text-[11px] bg-white hover:bg-blue-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer"
            >
              📄 Questions for my resume
            </button>
          )}

          <button
            onClick={() => handleSendMessage("Can you give me 3 hard technical questions for system architecture?")}
            disabled={isLoading}
            className="text-[11px] bg-white hover:bg-blue-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer"
          >
            💻 System Arch questions
          </button>
        </div>

        {/* Input Box Area */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 border-t border-[#E5E7EB] bg-white flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={
              selectedTrack 
                ? "Type your answer or practice response here..." 
                : "Type custom interview question prep requests or chat..."
            }
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-sm text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl shadow-md cursor-pointer transition-colors border-0 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </div>

    </div>
  );
};
