export interface PersonalInfo {
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: string[];
  summary?: string;
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  location?: string;
  duration?: string;
  description?: string[];
}

export interface Education {
  degree: string;
  fieldOfStudy?: string;
  institution: string;
  location?: string;
  duration?: string;
}

export interface SkillItem {
  name: string;
  category: string; // "technical", "soft", or "domain"
  proficiency: number; // 1-100
  strengthDescription?: string;
  scoreJustification?: string;
}

export interface Certification {
  name: string;
  issuingOrganization?: string;
  issueDate?: string;
}

export interface Project {
  title: string;
  description: string;
  technologiesUsed?: string[];
}

export interface PredictedRole {
  roleTitle: string;
  timeframe: string; // e.g., "1-2 years", "3-4 years", "5+ years"
  transitionDifficulty: string; // "Low" | "Medium" | "High"
  marketDemand: string; // "Low" | "Moderate" | "High"
  requiredSkillsToAcquire: string[];
  description: string;
}

export interface CareerPathway {
  pathwayName: string;
  description: string;
  predictedRoles: PredictedRole[];
}

export interface CareerProgression {
  currentCareerStage: string;
  outlookSummary: string;
  pathways: CareerPathway[];
}

export interface EpochScore {
  score: number;
  marketTrendContext: string;
}

export interface CompetitivenessScores {
  fiveYearsAgo: EpochScore;
  today: EpochScore;
  fiveYearsFuture: EpochScore;
}

export interface LearningRecommendations {
  courses?: string[];
  certifications?: string[];
  books?: string[];
  projects?: string[];
}

export interface SkillGap {
  skillName: string;
  type: string; // "missing", "emerging", or "critical"
  priority: string; // "Low", "Medium", "High"
  impactDescription: string;
  actionableRecommendation: string;
  learningRecommendations?: LearningRecommendations;
}

export interface SkillGapAnalysis {
  gaps: SkillGap[];
  strategicAdvice: string;
}

export interface ResumeAnalysisResult {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: SkillItem[];
  certifications?: Certification[];
  projects?: Project[];
  achievements?: string[];
  careerProgression: CareerProgression;
  competitivenessScores: CompetitivenessScores;
  skillGapAnalysis: SkillGapAnalysis;
}

export interface User {
  id: string;
  email: string;
}

export interface SavedResume {
  id: string;
  name: string;
  createdAt: string;
  parsedData: ResumeAnalysisResult;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  logoLetter: string;
  logoBg: string;
  type: string;
  experience: string;
  skills: string[];
  salary: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
}

