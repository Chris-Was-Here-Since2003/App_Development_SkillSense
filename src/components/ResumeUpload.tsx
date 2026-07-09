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
    <div className="w-full max-w-4xl mx-auto space-y-8" id="resume-upload-container">
      {/* Intro section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium">
          <Sparkles className="w-4 h-4 animate-pulse" />
          Next-Gen AI Labor Market Analysis
        </div>
        <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-gray-900">
          Unveil Your Career Trajectory
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your resume to instantly generate a predictive career progression roadmap, visual skill heat map, and 10-year market competitiveness scoring powered by Gemini AI.
        </p>
      </div>

      {/* Main interaction cards */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/50 flex">
          <button
            onClick={() => setPasteMode(false)}
            className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
              !pasteMode
                ? "border-indigo-600 text-indigo-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
            id="tab-file-upload"
          >
            <Upload className="w-4 h-4" />
            Upload Document / Image
          </button>
          <button
            onClick={() => setPasteMode(true)}
            className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-2 ${
              pasteMode
                ? "border-indigo-600 text-indigo-600 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
            id="tab-paste-text"
          >
            <Clipboard className="w-4 h-4" />
            Paste Plain Text
          </button>
        </div>

        <div className="p-8">
          {fileError && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
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
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 ${
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
              <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
                <Upload className="w-8 h-8 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-gray-900">
                  Drag and drop your resume file here
                </p>
                <p className="text-sm text-gray-500">
                  or <span className="text-indigo-600 font-medium">browse local files</span>
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Supports PDF, Plain Text (.txt), and Images (PNG, JPG) up to 10MB
              </p>
            </div>
          ) : (
            /* Paste text zone */
            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div>
                <label htmlFor="pasted-resume" className="block text-sm font-medium text-gray-700 mb-2">
                  Paste raw resume or profile details:
                </label>
                <textarea
                  id="pasted-resume"
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your work experience, education, certifications, and skills details here..."
                  className="w-full rounded-xl border border-gray-300 p-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !pastedText.trim()}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                id="submit-pasted-text"
              >
                <Sparkles className="w-5 h-5" />
                Analyze Pasted Resume Text
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Quick Load Samples */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Or test with a sample profile
          </span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(SAMPLE_RESUMES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => onAnalyze({ isSample: true, sampleName: key })}
              className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-indigo-400 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-200 group flex items-start gap-4"
              id={`sample-button-${key}`}
            >
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  {value.label}
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-normal">
                    Interactive
                  </span>
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
