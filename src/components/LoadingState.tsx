import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const LOADING_PHRASES = [
  "Parsing resume document structures...",
  "Extracting work experience timelines and metrics...",
  "Categorizing technical, soft, and domain skill vectors...",
  "Accessing real-time 2026 labor market statistics...",
  "Simulating 2031 technological automation and stack disruption indices...",
  "Running multi-epoch career trajectory models...",
  "Assembling strategic gap analysis and professional coach recommendations...",
  "Wrapping visual dashboard parameters..."
];

export const LoadingState: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto text-center space-y-8 py-24 px-4" id="loading-state">
      <div className="relative inline-flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <Sparkles className="w-8 h-8 text-blue-600 absolute animate-pulse" />
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900">Analyzing Your Potential...</h3>
        <p className="text-sm text-gray-500 min-h-[40px] font-mono transition-all duration-300">
          {LOADING_PHRASES[phraseIndex]}
        </p>
      </div>

      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-500" 
          style={{ width: `${((phraseIndex + 1) / LOADING_PHRASES.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
