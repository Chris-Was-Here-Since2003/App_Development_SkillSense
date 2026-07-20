import React, { useState } from "react";
import { X, Lock, Mail, UserPlus, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import { User } from "../types";

interface AccountModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AccountModal({ onClose, onLoginSuccess }: AccountModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (activeTab === "register") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = activeTab === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = activeTab === "register" 
        ? { email, password, fullName: name.trim(), role: "JOB_SEEKER" }
        : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      if (activeTab === "register") {
        // Save the registered name to local storage so we can display it
        localStorage.setItem(`skillsense_name_${email.trim().toLowerCase()}`, name.trim());
        
        setSuccess("Account successfully registered in SQL database!");
        // Switch to login tab after brief delay
        setTimeout(() => {
          setActiveTab("login");
          setPassword("");
          setConfirmPassword("");
          setSuccess(null);
        }, 1500);
      } else {
        // Login success
        const loggedInUser = data.user;
        // Attempt to load saved name
        const savedName = localStorage.getItem(`skillsense_name_${email.trim().toLowerCase()}`);
        if (savedName) {
          localStorage.setItem("skillsense_display_name", savedName);
        } else {
          // Fallback to name from email
          const prefix = email.split("@")[0];
          const capitalized = prefix.charAt(0).toUpperCase() + prefix.slice(1);
          localStorage.setItem("skillsense_display_name", capitalized);
        }

        onLoginSuccess(loggedInUser);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected database authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto" id="auth-modal">
      <div 
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full max-h-[72vh] md:max-h-[68vh] overflow-hidden transform transition-all flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button top right */}
        <button 
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-slate-100 z-50 transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* LEFT BRAND PANEL */}
        <div className="login-brand-panel md:w-[42%] p-3 lg:p-4 flex flex-col justify-between text-white relative">
          <div>
            <div className="brand-logo text-base font-extrabold">
              Skill<span className="text-blue-200">Sense</span>
            </div>
            <div className="brand-tagline text-[8px] uppercase tracking-widest opacity-75 mt-1">
              AI Career Analysis Platform
            </div>
          </div>

          <div className="my-2">
            <h2 className="brand-headline text-xs font-semibold leading-tight">
              Explore your next career path, powered by AI.
            </h2>
            <p className="brand-desc text-[9px] opacity-80 mt-1 leading-relaxed max-w-xs">
              Upload your resume and let our AI guide your next move.
            </p>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="login-form-panel md:w-[58%] p-3 lg:p-4 flex flex-col justify-center">
          {/* Mobile-only logo */}
          <div className="panel-logo md:hidden text-sm font-black text-blue-600 mb-2">
            Skill<span className="text-slate-900">Sense</span>
          </div>

          {/* Tab Switcher */}
          <div className="tab-switcher flex border-b-2 border-slate-100 mb-2" role="tablist">
            <button 
              className={`tab-btn flex-1 py-2 text-xs font-semibold transition-all border-b-2 -mb-[2px] ${
                activeTab === "login" 
                  ? "border-blue-600 text-blue-600 font-bold" 
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
              onClick={() => {
                setActiveTab("login");
                setError(null);
                setSuccess(null);
              }}
              role="tab"
              aria-selected={activeTab === "login"}
            >
              Login
            </button>
            <button 
              className={`tab-btn flex-1 py-2 text-xs font-semibold transition-all border-b-2 -mb-[2px] ${
                activeTab === "register" 
                  ? "border-blue-600 text-blue-600 font-bold" 
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
              onClick={() => {
                setActiveTab("register");
                setError(null);
                setSuccess(null);
              }}
              role="tab"
              aria-selected={activeTab === "register"}
            >
              Register
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-3 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-start gap-2 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-3 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl flex items-start gap-2 text-xs leading-relaxed">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            {activeTab === "register" && (
              <div className="form-group flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  placeholder="Hans Dorego"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            )}

            <div className="form-group flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                placeholder="hans.dorego@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="form-group flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>

            {activeTab === "register" && (
              <div className="form-group flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-md shadow-blue-100 hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 text-[11px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : activeTab === "login" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Login to Account
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="form-switch-text text-center text-[9px] text-slate-400 mt-2">
            {activeTab === "login" ? (
              <>
                Don't have an account?{" "}
                <button 
                  onClick={() => setActiveTab("register")} 
                  className="text-blue-600 font-bold hover:underline"
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button 
                  onClick={() => setActiveTab("login")} 
                  className="text-blue-600 font-bold hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
