import { Job } from "./types";

export const DEFAULT_JOBS: Job[] = [
  {
    id: "job-recom-1",
    title: "Data Analyst",
    company: "Google Philippines",
    location: "Taguig, Metro Manila",
    logoLetter: "G",
    logoBg: "bg-red-50 text-red-600",
    type: "Full-time",
    experience: "Mid Level",
    skills: ["Python", "SQL", "Data Analysis"],
    salary: "₱75,000 – ₱110,000",
    postedDate: "2 hours ago",
    description: "Google is looking for a Data Analyst to join our decision support and business intelligence team. In this role, you will analyze large datasets, build dashboard structures, and present key business performance findings to leaders.",
    responsibilities: [
      "Extract and clean data from distributed warehouses using SQL.",
      "Build interactive dashboard reports to support executive decisions.",
      "Analyze business metrics trends and identify growth opportunities."
    ]
  },
  {
    id: "job-recom-2",
    title: "Backend Developer",
    company: "Accenture PH",
    location: "Cebu City",
    logoLetter: "A",
    logoBg: "bg-purple-50 text-purple-600",
    type: "Full-time",
    experience: "Mid Level",
    skills: ["Node.js", "PostgreSQL", "REST API", "TypeScript"],
    salary: "₱55,000 – ₱85,000",
    postedDate: "5 hours ago",
    description: "Accenture is hiring a Backend Developer to build scalable enterprise APIs and microservices. You will collaborate with client partners, design modular schemas, and optimize pipeline deployments.",
    responsibilities: [
      "Develop secure, high-throughput RESTful and GraphQL APIs.",
      "Optimize relational database queries and PostgreSQL data structures.",
      "Implement automated unit and integration test coverage."
    ]
  },
  {
    id: "job-recom-3",
    title: "Software Engineer",
    company: "Symph Co.",
    location: "Cebu City",
    logoLetter: "S",
    logoBg: "bg-blue-50 text-blue-600",
    type: "Full-time",
    experience: "Mid Level",
    skills: ["JavaScript", "React", "Git", "TypeScript"],
    salary: "₱45,000 – ₱70,000",
    postedDate: "8 hours ago",
    description: "Symph is seeking a Software Engineer to join our product development studio. We build rapid prototypes and digital products for startups and enterprises using modern React, Node, and collaborative workflows.",
    responsibilities: [
      "Collaborate with designers to implement pixel-perfect user interfaces.",
      "Participate in daily standups and agile sprint plannings.",
      "Build highly responsive client-side routing and state managers."
    ]
  },
  {
    id: "job-recom-4",
    title: "IT Support Specialist",
    company: "IBM Philippines",
    location: "Quezon City",
    logoLetter: "I",
    logoBg: "bg-indigo-50 text-indigo-600",
    type: "Full-time",
    experience: "Entry Level",
    skills: ["Networking", "Linux", "Troubleshooting"],
    salary: "₱30,000 – ₱45,000",
    postedDate: "1 day ago",
    description: "IBM Philippines is recruiting an IT Support Specialist to provide critical technical systems troubleshooting and infrastructure support.",
    responsibilities: [
      "Troubleshoot server and client operating system configurations.",
      "Monitor corporate networks, firewalls, and active directories.",
      "Document system failures and escalate complex issues."
    ]
  },
  {
    id: "job-recom-5",
    title: "Cloud Engineer",
    company: "Cloudstaff PH",
    location: "Remote",
    logoLetter: "C",
    logoBg: "bg-orange-50 text-orange-600",
    type: "Remote",
    experience: "Senior Level",
    skills: ["AWS", "Docker", "CI/CD", "Kubernetes"],
    salary: "₱90,000 – ₱140,000",
    postedDate: "1 day ago",
    description: "Cloudstaff is looking for an experienced Cloud Engineer to manage our distributed AWS setups and container orchestration setups.",
    responsibilities: [
      "Manage AWS container workloads using ECS, EKS, and Fargate.",
      "Establish automated continuous deployment pipelines.",
      "Monitor system uptime, resource utilization, and cost metrics."
    ]
  },
  {
    id: "job-recom-6",
    title: "QA Engineer",
    company: "TechSource Inc.",
    location: "Makati, Metro Manila",
    logoLetter: "T",
    logoBg: "bg-teal-50 text-teal-600",
    type: "Full-time",
    experience: "Entry Level",
    skills: ["Testing", "Selenium", "Jira"],
    salary: "₱35,000 – ₱50,000",
    postedDate: "2 days ago",
    description: "TechSource Inc. is hiring a QA Engineer to automate user behavior testing and maintain quality control metrics.",
    responsibilities: [
      "Write automated end-to-end regression tests using Selenium.",
      "Perform thorough manual exploratory testing on web releases.",
      "Report, track, and document software bugs in Jira boards."
    ]
  }
];

export const RECENT_JOBS: Job[] = [
  {
    id: "job-recent-1",
    title: "Frontend Developer",
    company: "Nexus Digital PH",
    location: "Cebu City",
    logoLetter: "N",
    logoBg: "bg-emerald-50 text-emerald-600",
    type: "Full-time",
    experience: "Mid Level",
    skills: ["React", "CSS", "HTML", "TypeScript"],
    salary: "₱35,000 – ₱55,000",
    postedDate: "2 hours ago",
    description: "Nexus Digital is building high-performance marketing web systems. We need a frontend developer who loves smooth micro-interactions and atomic layouts.",
    responsibilities: [
      "Implement responsive user interfaces using React and modern CSS.",
      "Optimize sites for high score on Lighthouse audits.",
      "Work alongside design leads to establish unified component systems."
    ]
  },
  {
    id: "job-recent-2",
    title: "UI/UX Designer",
    company: "CreativeHub Co.",
    location: "Remote",
    logoLetter: "C",
    logoBg: "bg-pink-50 text-pink-600",
    type: "Remote",
    experience: "Senior Level",
    skills: ["Figma", "Wireframing", "UI Design"],
    salary: "₱30,000 – ₱50,000",
    postedDate: "5 hours ago",
    description: "CreativeHub needs a Senior UI/UX Designer to own product experience maps from early user stories to high-fidelity clickable Figma specifications.",
    responsibilities: [
      "Conduct user research interviews and extract interaction maps.",
      "Build high-fidelity layouts, interactions, and prototype mockups.",
      "Handoff clear assets and style guides to engineering squads."
    ]
  },
  {
    id: "job-recent-3",
    title: "Data Analyst",
    company: "Analytics Corp",
    location: "Manila",
    logoLetter: "A",
    logoBg: "bg-cyan-50 text-cyan-600",
    type: "Hybrid",
    experience: "Senior Level",
    skills: ["Tableau", "Excel", "SQL"],
    salary: "₱40,000 – ₱60,000",
    postedDate: "8 hours ago",
    description: "Analytics Corp provides customized consulting reports for agricultural operations. We need a generalist data expert to build reports.",
    responsibilities: [
      "Prepare automated report templates using Excel and Tableau.",
      "Conduct exploratory SQL queries across commercial data silos.",
      "Verify system metrics accuracy and document dashboard definitions."
    ]
  },
  {
    id: "job-recent-4",
    title: "Backend Developer",
    company: "DevForce Solutions",
    location: "Davao City",
    logoLetter: "D",
    logoBg: "bg-violet-50 text-violet-600",
    type: "Full-time",
    experience: "Senior Level",
    skills: ["Python", "Django", "PostgreSQL"],
    salary: "₱38,000 – ₱58,000",
    postedDate: "1 day ago",
    description: "DevForce delivers custom logistics pipelines. Join us as a backend specialist to orchestrate geolocation matching systems.",
    responsibilities: [
      "Design server-side logic in Python and Django frameworks.",
      "Deploy optimized PostgreSQL triggers and transaction sequences.",
      "Establish secure third-party billing connections and APIs."
    ]
  }
];
