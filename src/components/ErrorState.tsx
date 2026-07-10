import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onReset: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onReset,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-rose-200 rounded-2xl p-8 my-12 shadow-sm text-center space-y-6" id="error-state">
      <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center border border-rose-100">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">Analysis Request Failed</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          {error}
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-left text-gray-500 max-w-md mx-auto space-y-2">
        <span className="font-bold text-slate-800 block">Troubleshooting Steps:</span>
        <ul className="list-disc list-inside space-y-1">
          <li>Make sure your Gemini API Key is configured in the AI Studio environment.</li>
          <li>Ensure the resume is in text-readable format or a high resolution image.</li>
          <li>Test with our ready-to-use sample profiles below to try immediately.</li>
        </ul>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onReset}
          className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 text-sm shadow-sm cursor-pointer border-0"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
};
