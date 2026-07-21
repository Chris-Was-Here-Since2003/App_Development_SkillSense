import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { sqlGet, sqlAll, sqlRun } from "./serverDb";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase request size limit for handling base64 PDFs and images
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// --- SQL Account & Firebase-styled Authentication APIs ---

// 1. User Registration Route
app.post("/api/auth/register", async (req, res) => {
  const { email, password, fullName, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await sqlGet<{ user_id: string }>(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // Generate secure password hash using bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate a secure unique UUID v4 for user_id
    const userId = randomUUID();

    // Determine role (defaulting to JOB_SEEKER)
    const userRole = role || "JOB_SEEKER";

    // Determine full name
    const nameToSave = fullName || null;

    // Save to relational SQL table
    await sqlRun(
      "INSERT INTO users (user_id, email, password_hash, role, full_name, del_flg) VALUES (?, ?, ?, ?, ?, 0)",
      [userId, email, passwordHash, userRole, nameToSave]
    );

    res.status(201).json({
      message: "Account registered successfully in SQL database.",
      user: { id: userId, user_id: userId, email, role: userRole, fullName: nameToSave }
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Failed to register account in SQL database." });
  }
});

// 2. User Login Route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Select user from SQL table, filtering out soft-deleted accounts
    const user = await sqlGet<{ user_id: string; email: string; password_hash: string; role: string; full_name: string | null; del_flg: number }>(
      "SELECT user_id, email, password_hash, role, full_name, del_flg FROM users WHERE email = ?",
      [email]
    );

    if (!user || user.del_flg === 1) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare bcrypt hashes
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({
      message: "Logged in successfully.",
      user: { id: user.user_id, user_id: user.user_id, email: user.email, role: user.role, fullName: user.full_name }
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An error occurred during authentication." });
  }
});

// 3. Save Resume to Relational SQL Table
app.post("/api/resumes", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const { name, parsedData } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please register/login first." });
  }
  if (!name || !parsedData) {
    return res.status(400).json({ error: "Resume name and parsed data are required." });
  }

  try {
    // Generate an ID for the resume record
    const resumeId = "resume_" + Math.random().toString(36).substr(2, 9);
    const parsedDataString = JSON.stringify(parsedData);

    // Insert into 'analyses' relational table linking to user_id
    await sqlRun(
      "INSERT INTO analyses (id, user_id, name, parsed_data) VALUES (?, ?, ?, ?)",
      [resumeId, userId, name, parsedDataString]
    );

    res.status(201).json({
      message: "Resume saved to your account successfully.",
      resumeId
    });
  } catch (err: any) {
    console.error("Error saving resume to SQL database:", err);
    res.status(500).json({ error: "Failed to save resume." });
  }
});

// 4. List Resumes Saved under the Relational Account
app.get("/api/resumes", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please register/login first." });
  }

  try {
    // Retrieve rows for this user
    const rows = await sqlAll<{ id: string; name: string; parsed_data: string; created_at: string }>(
      "SELECT id, name, parsed_data, created_at FROM analyses WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    const resumes = rows.map(row => ({
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      parsedData: JSON.parse(row.parsed_data)
    }));

    res.json(resumes);
  } catch (err: any) {
    console.error("Error fetching resumes from SQL database:", err);
    res.status(500).json({ error: "Failed to fetch resumes." });
  }
});

// 5. Delete Resume Saved under the Relational Account
app.delete("/api/resumes/:id", async (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please register/login first." });
  }

  try {
    const result = await sqlRun(
      "DELETE FROM analyses WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Resume not found or not owned by you." });
    }

    res.json({ message: "Resume deleted successfully." });
  } catch (err: any) {
    console.error("Error deleting resume from SQL database:", err);
    res.status(500).json({ error: "Failed to delete resume." });
  }
});


// Lazy initializer for Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getGeminiApiKey(): string | undefined {
  const vercelApiKey = process.env.GEMINI_API_KEY?.trim();
  if (vercelApiKey && vercelApiKey !== "MY_GEMINI_API_KEY") {
    return vercelApiKey;
  }

  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const parsedEnv = dotenv.parse(fs.readFileSync(envPath, "utf8"));
    const localApiKey = parsedEnv.GEMINI_API_KEY?.trim();
    if (localApiKey && localApiKey !== "MY_GEMINI_API_KEY") {
      return localApiKey;
    }
  }

  return undefined;
}

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured. Please add it in Vercel environment variables or in the local .env file."
      );
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Structured schema for detailed resume analysis and career prediction
const RESUME_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        links: { type: Type.ARRAY, items: { type: Type.STRING } },
        summary: { type: Type.STRING, description: "Professional executive summary" }
      },
      required: ["fullName"]
    },
    workExperience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          jobTitle: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          duration: { type: Type.STRING, description: "e.g., Jan 2021 - Present" },
          description: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key duties and achievements as bullet points" }
        },
        required: ["jobTitle", "company"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING, description: "e.g., Bachelor of Science" },
          fieldOfStudy: { type: Type.STRING, description: "e.g., Computer Science" },
          institution: { type: Type.STRING },
          location: { type: Type.STRING },
          duration: { type: Type.STRING }
        },
        required: ["degree", "institution"]
      }
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING, description: "technical, soft, or domain" },
          proficiency: { type: Type.INTEGER, description: "Proficiency score from 1 to 100 based on experience depth" },
          strengthDescription: { type: Type.STRING, description: "Brief explanation of how this skill manifests" },
          scoreJustification: { type: Type.STRING, description: "Detailed justification of why this specific score (1-100) was given, reference relevant resume facts" }
        },
        required: ["name", "category", "proficiency", "strengthDescription", "scoreJustification"]
      }
    },
    certifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          issuingOrganization: { type: Type.STRING },
          issueDate: { type: Type.STRING }
        },
        required: ["name"]
      }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          technologiesUsed: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description"]
      }
    },
    achievements: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    careerProgression: {
      type: Type.OBJECT,
      properties: {
        currentCareerStage: { type: Type.STRING, description: "e.g., Entry, Mid-Level, Senior, Lead, Executive" },
        outlookSummary: { type: Type.STRING, description: "A detailed narrative of future career growth outlook" },
        pathways: {
          type: Type.ARRAY,
          description: "An array of 3 to 5 distinct, highly customized alternative career pathways suited for this candidate (e.g. Expert Specialist, Tech Leadership, Product Management, Entrepreneur/Consultant)",
          items: {
            type: Type.OBJECT,
            properties: {
              pathwayName: { type: Type.STRING, description: "The specific title of this career pathway option" },
              description: { type: Type.STRING, description: "A summary explaining the focus, core strengths, and rationale behind this pathway" },
              predictedRoles: {
                type: Type.ARRAY,
                description: "3 sequential future roles representing growth: 1-2 years (short term), 3-4 years (mid term), and 5+ years (long term)",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    roleTitle: { type: Type.STRING },
                    timeframe: { type: Type.STRING, description: "e.g., 1-2 years, 3-4 years, 5+ years" },
                    transitionDifficulty: { type: Type.STRING, description: "Low, Medium, or High" },
                    marketDemand: { type: Type.STRING, description: "Low, Moderate, or High" },
                    requiredSkillsToAcquire: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific skills the candidate must develop to reach this role" },
                    description: { type: Type.STRING, description: "Brief description of the role, why it fits their trajectory, and how they get there" }
                  },
                  required: ["roleTitle", "timeframe", "transitionDifficulty", "marketDemand", "requiredSkillsToAcquire", "description"]
                }
              }
            },
            required: ["pathwayName", "description", "predictedRoles"]
          }
        }
      },
      required: ["currentCareerStage", "outlookSummary", "pathways"]
    },
    competitivenessScores: {
      type: Type.OBJECT,
      properties: {
        fiveYearsAgo: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Estimate of competitiveness 5 years ago out of 100" },
            marketTrendContext: { type: Type.STRING, description: "Analysis of market and technology trends 5 years ago, and how this profile aligned back then" }
          },
          required: ["score", "marketTrendContext"]
        },
        today: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Estimate of competitiveness today out of 100" },
            marketTrendContext: { type: Type.STRING, description: "Analysis of the current job market demand, prevailing stacks/trends, and this resume's current fit" }
          },
          required: ["score", "marketTrendContext"]
        },
        fiveYearsFuture: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Estimate of competitiveness 5 years from now out of 100" },
            marketTrendContext: { type: Type.STRING, description: "Projections of industry evolution, emerging frameworks/AI tools, automation index, and potential obsolescence risk" }
          },
          required: ["score", "marketTrendContext"]
        }
      },
      required: ["fiveYearsAgo", "today", "fiveYearsFuture"]
    },
    skillGapAnalysis: {
      type: Type.OBJECT,
      properties: {
        gaps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              skillName: { type: Type.STRING },
              type: { type: Type.STRING, description: "missing (essential skills needed now), emerging (emerging trends), or critical (immediate priority)" },
              priority: { type: Type.STRING, description: "Low, Medium, or High" },
              impactDescription: { type: Type.STRING, description: "Why this gap is holding back competitiveness or career scaling" },
              actionableRecommendation: { type: Type.STRING, description: "Concrete recommendation: specific certifications, project ideas, tools, or courses to fill this gap" },
              learningRecommendations: {
                type: Type.OBJECT,
                description: "Highly structured learning path recommendation resources for this specific missing skill",
                properties: {
                  courses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific curated online courses or platforms (e.g. freeCodeCamp, Codecademy, Coursera, YouTube playlists)" },
                  certifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific industry-recognized certifications" },
                  books: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Highly regarded books, documentation resources, or manuals" },
                  projects: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Highly detailed hands-on project ideas to build to master this skill" }
                },
                required: ["courses", "certifications", "books", "projects"]
              }
            },
            required: ["skillName", "type", "priority", "impactDescription", "actionableRecommendation", "learningRecommendations"]
          }
        },
        strategicAdvice: { type: Type.STRING, description: "High-level personal coaching advice for future-proofing their career." }
      },
      required: ["gaps", "strategicAdvice"]
    }
  },
  required: [
    "personalInfo",
    "workExperience",
    "education",
    "skills",
    "careerProgression",
    "competitivenessScores",
    "skillGapAnalysis"
  ]
};

// API Endpoint to analyze a resume
app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { textData, fileData, mimeType } = req.body;

    if (!textData && !fileData) {
      return res.status(400).json({ error: "No resume data provided. Please upload a file or paste text." });
    }

    const ai = getGenAI();

    let prompt = `
      You are an expert technical recruiter, executive career coach, and labor market economist.
      Analyze the provided resume and perform a deep evaluation. You must output a JSON object following the specified schema.

      Make sure to:
      1. Parse all standard fields: work experience, education, skills, certifications, projects, and achievements. Ensure values are accurate to the input.
      2. Predict multiple alternative career pathways (minimum of 3, maximum of 5, e.g. Technical Specialist track, Management/Leadership track, Product/Strategy hybrid track, and Entrepreneurship/Consulting track). Each pathway must have a clear title, description of its focus, and exactly 3 sequential future roles over 1-2 years (short term), 3-4 years (mid term), and 5+ years (long term). Describe each role, transition difficulty, market demand, and skills to acquire.
      3. Categorize key technical and soft skills into a skills heat map with explicit proficiency ratings (1 to 100), descriptions of strength, and a detailed justification of why that specific score (1 to 100) was given based on their years of experience, projects, or level of responsibility shown in the resume.
      4. Compute a competitiveness score (0 to 100) for three specific epochs:
         - 5 Years Ago (circa 2021)
         - Today (2026)
         - 5 Years in the Future (circa 2031)
         In corporate labor economics context, analyze technological disruption, AI growth, automation risk, and stack shifts for each epoch and provide context.
      5. Perform a Skill Gap Analysis identifying missing/emerging skills with highly customized, practical recommendations. For each missing or critical skill gap, provide detailed 'learningRecommendations' detailing:
         - Curated courses or learning platforms (such as freeCodeCamp, Codecademy, Coursera, or YouTube playlists).
         - Reputable, industry-recognized certifications.
         - High-quality, specific books or documentation resources.
         - Practical, concrete project ideas the candidate can build to demonstrate and master the skill.
    `;

    let contents: any;

    if (fileData && mimeType) {
      // Base64 file input (PDF or Image)
      contents = [
        {
          inlineData: {
            mimeType: mimeType,
            data: fileData,
          },
        },
        prompt
      ];
    } else {
      // Plain text resume input
      contents = `${prompt}\n\nResume Text:\n${textData}`;
    }

    // Call the model (we use gemini-2.5-flash as the default reliable model)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESUME_ANALYSIS_SCHEMA,
        temperature: 0.2, // Low temperature for higher accuracy in parsing
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No analysis output received from Gemini API.");
    }

    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({
      error: error.message || "An internal error occurred during resume analysis.",
    });
  }
});

// Structured schema for detailed resume generation
const RESUME_GENERATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        links: { type: Type.ARRAY, items: { type: Type.STRING } },
        summary: { type: Type.STRING, description: "Professional resume executive summary showcasing top value proposition" }
      },
      required: ["fullName", "email"]
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of key technical, soft, or tool skills"
    },
    workExperience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          jobTitle: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          duration: { type: Type.STRING, description: "e.g., Jan 2021 - Present" },
          description: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key accomplishments and tasks as high-impact bullet points using action verbs" }
        },
        required: ["jobTitle", "company"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          fieldOfStudy: { type: Type.STRING },
          institution: { type: Type.STRING },
          location: { type: Type.STRING },
          duration: { type: Type.STRING }
        },
        required: ["degree", "institution"]
      }
    },
    certifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          issuingOrganization: { type: Type.STRING },
          issueDate: { type: Type.STRING }
        },
        required: ["name"]
      }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING, description: "Description of what was built, objectives, and metrics" },
          technologiesUsed: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description"]
      }
    }
  },
  required: ["personalInfo", "skills", "workExperience", "education"]
};

// API Endpoint for Interactive Resume Consultation Chatbot
app.post("/api/chat-resume-builder", async (req, res) => {
  try {
    const { messages, currentDraft } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGenAI();

    let systemInstruction = `You are a highly skilled AI Resume Consultant and Professional Writer named SkillSense Resume Specialist.
Your mission is to help the user build or refine a spectacular, professional resume that showcases their skills and experience.

CRITICAL INSTRUCTIONS:
1. Speak in a helpful, professional, and consultative tone.
2. If the user wants to start from scratch, ask them friendly questions ONE by ONE in a logical sequence to gather info:
   - Topic 1: Full name and contact info (Email, Phone, Location, Portfolio links).
   - Topic 2: Target job title and a brief career goal/summary.
   - Topic 3: Key skills (technical and soft).
   - Topic 4: Work experience (roles, companies, durations, and key achievements/responsibilities).
   - Topic 5: Education and Certifications.
   - Topic 6: Projects (title, technologies used, and description).
3. Do not show them a g
iant questionnaire or dump all questions at once. Ask one focused question, wait for their reply, provide brief positive validation/enhancement, and ask the next.
4. When they provide a basic description of their work tasks, suggest how to rephrase them into high-impact accomplishment bullets using strong action verbs (e.g. 'Led', 'Optimized', 'Designed', 'Architected') and measurable results where possible.
5. If they already have an active resume draft loaded, offer to rewrite sections, add specific tailored experience, optimize for ATS keywords, or suggest layout strategies.
6. Keep your responses crisp, professional, and well-structured with markdown. Include a progress indicator at the end of your replies (e.g., "[Progress: Contact Info 1/5]" or "[Progress: Polishing 5/5]") to help them feel the momentum!
7. Let them know they can click the "Generate Beautiful Resume" button anytime they are ready to compile their details into a formatted resume template!
`;

    if (currentDraft) {
      systemInstruction += `\n\nActive Resume Draft Context:\n${JSON.stringify(currentDraft, null, 2)}`;
    }

    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text;
    res.json({ reply });
  } catch (error: any) {
    console.error("Resume builder chat error:", error);
    res.status(500).json({
      error: error.message || "Failed to communicate with AI Resume Specialist.",
    });
  }
});

// API Endpoint to compile fully structured resume from chatbot history
app.post("/api/generate-resume-from-chat", async (req, res) => {
  try {
    const { messages, currentDraft } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGenAI();

    let prompt = `
      You are an expert executive resume writer.
      Analyze the provided chat conversation history (where a candidate has been discussing their professional details, contact info, experience, skills, projects, and goals) and any partial draft.
      Extract, synthesize, and format all facts into a single perfectly polished professional resume.
      
      CRITICAL EDITING DIRECTIONS:
      1. Correct all spelling, grammar, and sentence structures.
      2. Rewrite plain work experience sentences into highly professional, high-impact resume bullet points using action verbs (e.g., "Led modern migration", "Engineered backend APIs", "Optimized DB query times by 40%").
      3. Organize skills cleanly into categories if possible, or list them comprehensively.
      4. Ensure all dates, company names, and project names are clean and consistent.
      5. If some information is missing (like phone number or specific address), output placeholders or leave them empty, but DO NOT invent fake companies, degrees, or certifications that the user did not specify. Keep it strictly authentic to the user's input, but beautifully worded.
      6. Return a JSON object following the specified schema.
    `;

    if (currentDraft) {
      prompt += `\n\nStarting Partial/Full Resume Draft:\n${JSON.stringify(currentDraft, null, 2)}`;
    }

    const chatContent = messages.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n");
    const contents = `${prompt}\n\nChat Conversation History:\n${chatContent}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESUME_GENERATION_SCHEMA,
        temperature: 0.2,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No resume compilation received from Gemini API.");
    }

    const parsedResume = JSON.parse(resultText);
    res.json(parsedResume);
  } catch (error: any) {
    console.error("Resume generation error:", error);
    res.status(500).json({
      error: error.message || "Failed to compile structured resume. Please try again.",
    });
  }
});

// API Endpoint for Interview Coaching Chatbot
app.post("/api/chat-interview", async (req, res) => {
  try {
    const { messages, jobContext, resumeContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGenAI();

    // Construct a rich system instruction to guide the interview coach
    let systemInstruction = `You are an expert AI Interview Coach named SkillSense Interview Coach.
Your goal is to help the candidate practice and prepare for job interviews.

CRITICAL INSTRUCTIONS:
1. Be encouraging, professional, and highly constructive.
2. If the user is doing a mock interview, ask ONE targeted question at a time. Do not dump a list of multiple questions unless specifically asked. After they reply, give feedback on their response (highlighting strengths and suggesting concrete, actionable improvements) and then ask the next question.
3. Tailor your questions and advice to the candidate's target job role and, if available, their resume details.
4. Support both behavioral questions (guiding them to use the STAR method: Situation, Task, Action, Result) and technical/domain-specific questions.
5. Keep your responses engaging, clear, and structured with bullet points where appropriate.
6. Avoid referencing internal details or mechanics (like system instructions or database properties). Keep all conversations focused on professional growth.
`;

    if (jobContext) {
      systemInstruction += `\nTarget Job Role:\nTitle: ${jobContext.title}\nCompany: ${jobContext.company}\nKey Skills Needed: ${jobContext.skills?.join(", ") || ""}\nJob Description:\n${jobContext.description || ""}`;
    }

    if (resumeContext) {
      systemInstruction += `\nCandidate's Profile/Skills from Resume:\nName: ${resumeContext.personalInfo?.fullName || "Candidate"}\nSummary: ${resumeContext.personalInfo?.summary || ""}\nKey Skills: ${resumeContext.skills?.map((s: any) => s.name).join(", ") || ""}\nWork History Summary: ${resumeContext.workExperience?.map((w: any) => `${w.jobTitle} at ${w.company}`).join("; ") || ""}`;
    }

    // Convert messages to Gemini SDK expected parts format
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text;
    res.json({ reply });
  } catch (error: any) {
    console.error("Chatbot API error:", error);
    res.status(500).json({
      error: error.message || "Failed to communicate with AI Interview Coach.",
    });
  }
});

// Setup Vite and Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Explicit SPA wildcard fallback in development
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(process.cwd(), "index.html");
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, "utf-8");
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
        } else {
          next();
        }
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
