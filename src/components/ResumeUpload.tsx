import React, { useState, useRef, useEffect } from "react";
import { Upload, FileText, Sparkles, Clipboard, AlertCircle } from "lucide-react";
import { SAMPLE_RESUMES } from "../sampleData";

interface ResumeUploadProps {
  onAnalyze: (payload: { textData?: string; fileData?: string; mimeType?: string; isSample?: boolean; sampleName?: string }) => void;
  isLoading: boolean;
}

export default function ResumeUpload({ onAnalyze, isLoading }: ResumeUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Explicitly reset all local states and file input elements on component mount
    setIsDragOver(false);
    setPasteMode(false);
    setPastedText("");
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFile = (file: File) => {
    setFileError(null);
    const validMimeTypes = ["application/pdf", "text/plain", "image/png", "image/jpeg", "image/jpg"];
    
    // Check file type or extension (for safety)
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isValidType = validMimeTypes.includes(file.type) || ["pdf", "txt", "png", "jpg", "jpeg"].includes(fileExtension || "");
    
    if (!isValidType) {
      setFileError("Unsupported file type. Please upload a PDF, Plain Text file (.txt), or an Image (PNG/JPG). For DOCX, please copy and paste the text using the option below.");
      return;
    }

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File is too large. Please upload a file smaller than 10MB.");
      return;
    }

    const reader = new FileReader();

    if (file.type === "text/plain" || fileExtension === "txt") {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          onAnalyze({ textData: text });
        }
      };
      reader.readAsText(file);
    } else {
      // PDF or Image -> Convert to Base64 and send
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Extract the raw base64 data from the data URL
        const commaIdx = result.indexOf(",");
        if (commaIdx !== -1) {
          const base64Data = result.substring(commaIdx + 1);
          const detectedMime = file.type || (fileExtension === "pdf" ? "application/pdf" : `image/${fileExtension}`);
          onAnalyze({ fileData: base64Data, mimeType: detectedMime });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) {
      return;
    }
    onAnalyze({ textData: pastedText });
  };

  return (
    <div className="w-full px-1 sm:px-2 lg:px-3" id="resume-upload-container">
      <div className="max-w-5xl mx-auto space-y-2 sm:space-y-3 py-1 sm:py-2 lg:py-2">
      {/* Intro section */}
      <div className="text-center space-y-1 sm:space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] sm:text-[11px] font-bold shadow-sm">
          <Sparkles className="w-5 h-5 animate-pulse" />
          Next-Gen AI Labor Market Analysis
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-gray-900 leading-tight">
          Unveil Your Career Trajectory
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
          Upload your resume to instantly generate a predictive career progression roadmap, visual skill heat map, and 10-year market competitiveness scoring powered by Gemini AI.
        </p>
      </div>

      {/* Main interaction cards */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row">
          <button
            onClick={() => setPasteMode(false)}
            className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-extrabold border-b-2 sm:border-b-0 sm:border-r transition-all flex items-center justify-center gap-2 hover:shadow-sm ${
              !pasteMode
                ? "border-indigo-600 text-indigo-600 bg-white shadow-sm"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
            }`}
            id="tab-file-upload"
          >
            <Upload className="w-5 h-5" />
            Upload Document / Image
          </button>
          <button
            onClick={() => setPasteMode(true)}
            className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-extrabold border-b-2 sm:border-b-0 transition-all flex items-center justify-center gap-2 hover:shadow-sm ${
              pasteMode
                ? "border-indigo-600 text-indigo-600 bg-white shadow-sm"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
            }`}
            id="tab-paste-text"
          >
            <Clipboard className="w-5 h-5" />
            Paste Plain Text
          </button>
        </div>

        <div className="p-2.5 sm:p-3 lg:p-4">
          {fileError && (
            <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2 font-medium">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
              <div>{fileError}</div>
            </div>
          )}

          {!pasteMode ? (
            /* File Upload Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 sm:space-y-3 ${
                isDragOver
                  ? "border-indigo-500 bg-indigo-50/40"
                  : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50/40"
              }`}
              id="drag-drop-zone"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt,image/png,image/jpeg,image/jpg"
                className="hidden"
              />
              <div className="p-3 sm:p-4 bg-indigo-50 rounded-full text-indigo-600 shadow-md">
                <Upload className="w-6 sm:w-8 h-6 sm:h-8 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  Drag and drop your resume file here
                </p>
                <p className="text-[11px] sm:text-xs text-gray-600 font-medium">
                  or <span className="text-indigo-600 font-bold">browse local files</span>
                </p>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                Supports PDF, Plain Text (.txt), and Images (PNG, JPG) up to 10MB
              </p>
            </div>
          ) : (
            /* Paste text zone */
            <form onSubmit={handlePasteSubmit} className="space-y-2">
              <div>
                <label htmlFor="pasted-resume" className="block text-xs font-bold text-gray-900 mb-1.5">
                  Paste raw resume or profile details:
                </label>
                <textarea
                  id="pasted-resume"
                  rows={4}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your work experience, education, certifications, and skills details here..."
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-mono leading-relaxed"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !pastedText.trim()}
                className="w-full bg-indigo-600 text-white py-2 px-3 rounded-lg font-bold text-xs hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                id="submit-pasted-text"
              >
                <Sparkles className="w-6 h-6" />
                Analyze Pasted Resume Text
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
