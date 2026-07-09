import { ResumeAnalysisResult } from "./types";

export const SAMPLE_RESUMES: Record<string, { label: string; description: string; data: ResumeAnalysisResult }> = {
  softwareEngineer: {
    label: "Software Engineer → AI & Architecture",
    description: "Full-Stack developer with 4 years of React and Node.js experience looking to scale into AI and Systems Architecture.",
    data: {
      personalInfo: {
        fullName: "Alex Rivera",
        email: "alex.rivera@example.com",
        phone: "+1 (555) 342-9011",
        location: "San Francisco, CA",
        links: ["linkedin.com/in/alex-rivera-dev", "github.com/arivera-codes"],
        summary: "Versatile Full-Stack Engineer with 4+ years of professional experience building scalable web applications. Proficient in TypeScript, React, Node.js, and PostgreSQL. Passionate about transitioning into Machine Learning engineering and distributed systems architecture."
      },
      workExperience: [
        {
          jobTitle: "Senior Full-Stack Engineer",
          company: "SaaSify Metrics",
          location: "San Francisco, CA",
          duration: "2023 - Present",
          description: [
            "Led a team of 4 engineers to rebuild the analytics dashboard, improving initial load times by 42% using Next.js and code splitting.",
            "Designed and implemented a real-time event ingestion API handling over 10 million daily events using Node.js and Redis.",
            "Mentored junior developers, established modern CI/CD practices, and implemented comprehensive unit testing to achieve 85% test coverage."
          ]
        },
        {
          jobTitle: "Full-Stack Developer",
          company: "InnovateTech Lab",
          location: "Austin, TX",
          duration: "2021 - 2023",
          description: [
            "Developed and maintained critical responsive user interfaces using React, Redux, and Tailwind CSS.",
            "Built modular RESTful APIs using Express and integrated secure third-party authentication services.",
            "Optimized database queries in PostgreSQL, reducing average query response times by 30%."
          ]
        }
      ],
      education: [
        {
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          institution: "University of Texas at Austin",
          location: "Austin, TX",
          duration: "2017 - 2021"
        }
      ],
      skills: [
        { name: "TypeScript", category: "technical", proficiency: 92, strengthDescription: "Architected clean web systems, generic abstractions, and robust backend models.", scoreJustification: "Assigned 92% due to 4+ years of active design, typing complex asynchronous flows, and library orchestration without strict guidance." },
        { name: "React / Next.js", category: "technical", proficiency: 90, strengthDescription: "Expert in hooks, context API, state managers, and server components.", scoreJustification: "Assigned 90% because of successful leadership in rebuilding dashboard pages and mastering advanced state lifecycle behaviors." },
        { name: "Node.js", category: "technical", proficiency: 85, strengthDescription: "Highly skilled in microservices, Express APIs, stream handling, and event-driven backends.", scoreJustification: "Assigned 85% reflecting proven capabilities in designing real-time telemetry APIs and integrating fast Redis microservices." },
        { name: "PostgreSQL", category: "technical", proficiency: 80, strengthDescription: "Proficient in database design, indexing strategies, complex joins, and JSONB queries.", scoreJustification: "Assigned 80% due to clear optimization history, reducing database queries by 30% via schema redesigns and custom indices." },
        { name: "Redis", category: "technical", proficiency: 75, strengthDescription: "Used for caching layer, session storage, and rate limiting in production.", scoreJustification: "Assigned 75% as they have successfully deployed caching for high-scale microservices but have not dealt with clustering or sentinel configs." },
        { name: "System Architecture", category: "technical", proficiency: 70, strengthDescription: "Good grasp of horizontal scaling, API gateways, load balancers, and caching.", scoreJustification: "Assigned 70% reflecting a strong theoretical understanding and practical API designs, with minor gaps in global multi-cloud setups." },
        { name: "Collaboration", category: "soft", proficiency: 88, strengthDescription: "Experienced leading cross-functional teams, managing sprints, and collaborating with UX.", scoreJustification: "Assigned 88% based on their active leadership of a 4-engineer team and successful alignment with design specialists." },
        { name: "Problem Solving", category: "soft", proficiency: 94, strengthDescription: "Excellent algorithmic thinking, code optimization, and debug automation.", scoreJustification: "Assigned 94% due to outstanding achievements in system-wide performance tuning (Next.js loads improved by 42%)." },
        { name: "Machine Learning (Basic)", category: "technical", proficiency: 40, strengthDescription: "Familiar with basic model training concepts, tokenization, and vector embeddings.", scoreJustification: "Assigned 40% because of introductory exposure, with a solid foundational interest but lacking formal model development experience." }
      ],
      certifications: [
        { name: "AWS Certified Developer – Associate", issuingOrganization: "Amazon Web Services", issueDate: "2023" }
      ],
      projects: [
        {
          title: "TelemetryStream Engine",
          description: "High-throughput log analysis pipeline processing telemetry packets with minimal overhead.",
          technologiesUsed: ["Node.js", "Redis", "Docker", "TimescaleDB"]
        }
      ],
      achievements: [
        "Received the Innovation of the Year award at SaaSify Metrics for inventing an intelligent request batching protocol.",
        "Graduated with honors, Computer Science Department, UT Austin."
      ],
      careerProgression: {
        currentCareerStage: "Senior (Mid-Senior Level)",
        outlookSummary: "Alex is in an excellent position to scale. His high competence in core full-stack Engineering provides a stable foundation. However, to transition into AI and Systems Architecture, he must acquire structured experience in distributed streaming and deep learning frameworks, pivoting from pure feature development to system modeling.",
        pathways: [
          {
            pathwayName: "AI & ML Systems Route",
            description: "Pivot towards machine learning operations, neural network integrations, and building intelligent autonomous agents.",
            predictedRoles: [
              {
                roleTitle: "Senior AI Integration Developer",
                timeframe: "1-2 years",
                transitionDifficulty: "Low",
                marketDemand: "High",
                requiredSkillsToAcquire: ["LangChain / LlamaIndex", "Vector Databases (Pinecone, Chroma)", "Prompt Engineering"],
                description: "Integrate LLMs and deep learning models into SaaS products. Focus on semantic search pipelines, caching, and building conversational agents."
              },
              {
                roleTitle: "AI Systems Architect",
                timeframe: "3-4 years",
                transitionDifficulty: "Medium",
                marketDemand: "High",
                requiredSkillsToAcquire: ["Python (PyTorch/numpy)", "Model Quantization & Distillation", "CUDA Basics"],
                description: "Bridge system design with AI capabilities. Focus on building performant server-side AI architectures, optimizing GPU/inference costs, and custom embeddings."
              },
              {
                roleTitle: "Director of AI Engineering",
                timeframe: "5+ years",
                transitionDifficulty: "High",
                marketDemand: "High",
                requiredSkillsToAcquire: ["Technical Leadership", "AI Safety & Ethics", "AI Budgeting & GPU Economics"],
                description: "Steer corporate technological direction. Lead engineering groups developing bespoke AI micro-services, oversee high-budget cloud resources, and align enterprise goals with AI feasibility."
              }
            ]
          },
          {
            pathwayName: "Enterprise Cloud Architecture Route",
            description: "Scale into high-availability distributed systems, container orchestration, and multi-tenant enterprise architectures.",
            predictedRoles: [
              {
                roleTitle: "Staff Systems Engineer",
                timeframe: "1-2 years",
                transitionDifficulty: "Low",
                marketDemand: "High",
                requiredSkillsToAcquire: ["Docker & Kubernetes", "gRPC", "Distributed Caching"],
                description: "Step into higher systems oversight. Focus on infrastructure-as-code, orchestration, API latency optimizations, and high-availability database replication layers."
              },
              {
                roleTitle: "Principal Cloud Architect",
                timeframe: "3-4 years",
                transitionDifficulty: "Medium",
                marketDemand: "High",
                requiredSkillsToAcquire: ["Terraform", "Multi-region Failover Strategies", "Cloud Security (AWS/GCP)"],
                description: "Architect secure, multi-tenant global infrastructures. Design systems capable of zero-downtime upgrades, global horizontal scaling, and modern edge-networking."
              },
              {
                roleTitle: "VP of Infrastructure & Platform",
                timeframe: "5+ years",
                transitionDifficulty: "High",
                marketDemand: "Moderate",
                requiredSkillsToAcquire: ["Enterprise Security Compliance", "Cost Optimization at Scale", "Strategic Vendor Management"],
                description: "Manage the entire platform division, driving SLA compliance, cloud vendor negotiations, and technical roadmaps for dev-experience and reliability."
              }
            ]
          }
        ]
      },
      competitivenessScores: {
        fiveYearsAgo: {
          score: 55,
          marketTrendContext: "In 2021, as a fresh graduate, competition for junior web roles was fierce, but the massive tech bull-run was in full swing, offering solid entry points for standard JavaScript/React profiles."
        },
        today: {
          score: 82,
          marketTrendContext: "Today in 2026, web developers are highly commoditized, but Alex's specialized skills in microservices, backend event handling, and modern architecture elevate him significantly above generic front-end peers."
        },
        fiveYearsFuture: {
          score: 95,
          marketTrendContext: "By 2031, AI-native integration, GPU budgeting, and vector data engineering will be mandatory for top engineers. If Alex gains these skills as predicted, his competitiveness score climbs to an elite tier."
        }
      },
      skillGapAnalysis: {
        gaps: [
          {
            skillName: "AI Pipeline Engineering (RAG, Vector DBs)",
            type: "missing",
            priority: "High",
            impactDescription: "Essential for building custom intelligence solutions rather than just wrappers. The current market heavily favors engineers who understand semantic search and embeddings.",
            actionableRecommendation: "Build an open-source tool that indexes markdown notebooks into ChromaDB and performs conversational searches using Gemini API. Master LangChain or LlamaIndex."
          },
          {
            skillName: "Distributed Systems Orchestration (Kubernetes)",
            type: "emerging",
            priority: "Medium",
            impactDescription: "Crucial for Staff/Architect level. Complex AI nodes require robust scheduling and autoscaling to manage costs and workloads.",
            actionableRecommendation: "Complete the Certified Kubernetes Administrator (CKA) course. Practice deploying a multi-node express cluster locally using Minikube."
          },
          {
            skillName: "Python Scientific Stack",
            type: "critical",
            priority: "High",
            impactDescription: "While JS has some ML libraries, the overwhelming majority of commercial model research, training, and data manipulation is standard in Python.",
            actionableRecommendation: "Rewrite your database ETL scripts in Python using Pandas. Take a hands-on course in NumPy and PyTorch basics."
          }
        ],
        strategicAdvice: "Your web engineering baseline is exceptionally strong. Do not abandon it. Instead, position yourself as a 'Systems Builder' who can uniquely deploy, scale, and connect AI models to robust client interfaces. This combination of system engineering and AI engineering is rare and highly valued."
      }
    }
  },
  marketingSpecialist: {
    label: "Marketing Manager → Business Data Analyst",
    description: "Marketing professional with 5 years of brand strategy and campaign experience pivoting to SQL, Python, and BI reporting.",
    data: {
      personalInfo: {
        fullName: "Sarah Chen",
        email: "sarah.chen@example.com",
        phone: "+1 (555) 893-4412",
        location: "New York, NY",
        links: ["linkedin.com/in/sarahchen-marketing"],
        summary: "Data-driven Marketing Manager with 5 years of experience leading multi-channel acquisition campaigns. Expertise in user acquisition, digital analytics, and brand positioning. Self-taught in SQL and Tableau, currently pivoting to full-time Business Intelligence and Growth Analytics."
      },
      workExperience: [
        {
          jobTitle: "Growth Marketing Manager",
          company: "Aura Commerce",
          location: "New York, NY",
          duration: "2022 - Present",
          description: [
            "Managed $1.2M annual marketing budget, driving 35% Year-over-Year subscriber growth.",
            "Wrote custom SQL queries to extract cohort retention data, bypassing data bottle-necks and improving campaign ROI by 18%.",
            "Designed automated multi-channel reporting dashboards in Tableau, saving 8 hours of manual weekly reporting for the executive team."
          ]
        },
        {
          jobTitle: "Marketing Coordinator",
          company: "Pulse Media Agency",
          location: "Boston, MA",
          duration: "2020 - 2022",
          description: [
            "Coordinated digital advertising campaigns across Meta, Google, and LinkedIn with positive returns.",
            "Utilized Google Analytics to identify high-bounce landing pages, collaborating with design to boost conversion rates by 4%."
          ]
        }
      ],
      education: [
        {
          degree: "Bachelor of Business Administration",
          fieldOfStudy: "Marketing & Analytics",
          institution: "Boston University",
          location: "Boston, MA",
          duration: "2016 - 2020"
        }
      ],
      skills: [
        { name: "Digital Campaign Strategy", category: "domain", proficiency: 90, strengthDescription: "Deep expertise in cost-per-acquisition (CPA) models, channel attribution, and funnel optimization.", scoreJustification: "Assigned 90% due to 5+ years of active campaign stewardship, leading metrics growth and optimizing marketing ROIs by 18%." },
        { name: "SQL", category: "technical", proficiency: 65, strengthDescription: "Able to write SELECT, JOIN, GROUP BY, and common table expressions (CTEs) for cohort analyses.", scoreJustification: "Assigned 65% reflecting solid competence in basic to intermediate SQL querying and cohort data extraction, but lacks advanced windowing/stored procedures experience." },
        { name: "Tableau / BI Tools", category: "technical", proficiency: 75, strengthDescription: "Built interactive corporate dashboards, data sources, and automated alerts.", scoreJustification: "Assigned 75% for custom dashboard development that streamlined reporting, saving weekly manual hours for leadership." },
        { name: "Google Analytics 4", category: "technical", proficiency: 85, strengthDescription: "Advanced user of custom dimensions, event tracking, and funnel explorations.", scoreJustification: "Assigned 85% given daily experience tracking subscriber acquisitions, designing funnels, and optimizing user journeys." },
        { name: "Communication & Pitching", category: "soft", proficiency: 95, strengthDescription: "Masterful at translating cold quantitative charts into compelling stories for executive sponsors.", scoreJustification: "Assigned 95% due to exceptional presentation skills, demonstrated by securing campaign budget approvals and reporting directly to C-suite." },
        { name: "Analytical Thinking", category: "soft", proficiency: 88, strengthDescription: "Data-first mindset, always isolating variables, conducting A/B tests, and verifying sample sizes.", scoreJustification: "Assigned 88% due to systematic optimization of campaign funnels using quantitative tests rather than aesthetic intuition." },
        { name: "Python (Data Science)", category: "technical", proficiency: 30, strengthDescription: "Familiar with Jupyter Notebooks, basic Pandas dataframes, and Matplotlib plotting.", scoreJustification: "Assigned 30% due to introductory level; understands basic syntax and can manipulate small tables, but cannot build complex ML pipelines yet." }
      ],
      certifications: [
        { name: "Google Analytics Individual Qualification (GAIQ)", issuingOrganization: "Google", issueDate: "2021" },
        { name: "Tableau Desktop Certified Associate", issuingOrganization: "Tableau", issueDate: "2024" }
      ],
      projects: [
        {
          title: "Aura Cohort Retention Studio",
          description: "A custom SQL analytics pipeline showing subscriber decay patterns across 12 distinct signup cohorts.",
          technologiesUsed: ["SQL", "Tableau", "PostgreSQL"]
        }
      ],
      achievements: [
        "Led marketing campaign that generated over $500k in net-new revenue within 6 months.",
        "Graduated Magna Cum Laude from Boston University Business School."
      ],
      careerProgression: {
        currentCareerStage: "Mid-Level Specialist",
        outlookSummary: "Sarah is leveraging a powerful hybrid advantage: she has domain expertise in marketing/sales AND growing analytical skills. This makes her infinitely more useful as a Business Intelligence or Growth Analyst than a pure math grad who has never run a campaign, because she knows exactly what the business metrics mean.",
        pathways: [
          {
            pathwayName: "Growth Analytics Track",
            description: "Deep dive into statistical testing, data warehousing, BI tools, and data modeling to drive corporate growth.",
            predictedRoles: [
              {
                roleTitle: "Growth Data Analyst",
                timeframe: "1-2 years",
                transitionDifficulty: "Low",
                marketDemand: "High",
                requiredSkillsToAcquire: ["Advanced SQL (Window functions)", "Basic Python (Pandas/Seaborn)", "A/B Testing Statistics"],
                description: "Step into a dedicated analytics seat. Manage user cohort analysis, design and evaluate rigorous growth A/B experiments, and report conversion statistics directly to the VP of Growth."
              },
              {
                roleTitle: "Analytics Engineering Lead",
                timeframe: "3-4 years",
                transitionDifficulty: "Medium",
                marketDemand: "High",
                requiredSkillsToAcquire: ["dbt (Data Build Tool)", "Data Warehousing (Snowflake/BigQuery)", "Git & Version Control"],
                description: "Own the data transformation layer. Transition from querying raw databases to modeling robust, clean data structures, building dbt models, and setting up reliable data pipelines."
              },
              {
                roleTitle: "Director of Business Intelligence",
                timeframe: "5+ years",
                transitionDifficulty: "High",
                marketDemand: "High",
                requiredSkillsToAcquire: ["Data Governance", "Executive Strategy", "Team Leadership", "Predictive Analytics"],
                description: "Lead the corporate business intelligence division. Align company KPIs with automated data pipelines, manage teams of analysts and engineers, and collaborate directly with C-suite on data-backed strategies."
              }
            ]
          },
          {
            pathwayName: "Product Management Track",
            description: "Leverage customer insights, marketing metrics, and growing analytical skills to define product strategy, roadmap, and core features.",
            predictedRoles: [
              {
                roleTitle: "Associate Product Manager (Growth)",
                timeframe: "1-2 years",
                transitionDifficulty: "Medium",
                marketDemand: "High",
                requiredSkillsToAcquire: ["Agile/Scrum", "Product Analytics (Amplitude/Mixpanel)", "UX/UI Design Fundamentals"],
                description: "Own growth features and onboarding funnels. Align acquisition marketing metrics with core in-app user retention programs."
              },
              {
                roleTitle: "Product Manager (Core Platform)",
                timeframe: "3-4 years",
                transitionDifficulty: "Medium",
                marketDemand: "High",
                requiredSkillsToAcquire: ["System Architecture Basics", "API Integrations", "Roadmapping & Stakeholder Management"],
                description: "Manage end-to-end product lifecycles. Collaborate with engineering, marketing, and sales to launch customer-centric SaaS integrations."
              },
              {
                roleTitle: "VP of Product",
                timeframe: "5+ years",
                transitionDifficulty: "High",
                marketDemand: "High",
                requiredSkillsToAcquire: ["Corporate Finance", "Portfolio Management", "Strategic Vision & Public Speaking"],
                description: "Own the entire corporate product portfolio. Define the 5-year product strategy, build high-performing PM teams, and report on business value directly to the C-suite."
              }
            ]
          }
        ]
      },
      competitivenessScores: {
        fiveYearsAgo: {
          score: 40,
          marketTrendContext: "In 2021, Sarah was a junior generalist marketer. Standard digital marketing profiles were highly oversaturated, and lack of technical metrics skills limited her growth potential."
        },
        today: {
          score: 72,
          marketTrendContext: "In 2026, the job market is highly metricized. Traditional generalist marketers are struggling, but Sarah's self-taught SQL and Tableau skills make her a highly attractive hybrid profile."
        },
        fiveYearsFuture: {
          score: 90,
          marketTrendContext: "By 2031, AI agents will write basic advertising copy and set up standard ads automatically. Human value lies entirely in advanced data mapping, interpreting deep behavioral insights, and data engineering."
        }
      },
      skillGapAnalysis: {
        gaps: [
          {
            skillName: "Data Transformation & Modeling (dbt)",
            type: "missing",
            priority: "Medium",
            impactDescription: "Modern analytics relies heavily on dbt. Knowing how to transform and document raw SQL data makes you a self-sufficient analyst rather than depending on data engineers.",
            actionableRecommendation: "Take the official free 'dbt Fundamentals' course. Build a local dbt project utilizing mock retail schemas on Google BigQuery sandbox."
          },
          {
            skillName: "Advanced SQL (Window Functions & CTEs)",
            type: "critical",
            priority: "High",
            impactDescription: "Crucial for cohort modeling, churn patterns, and time-series logic. Standard SELECT/JOIN operations are insufficient for complex growth analysis.",
            actionableRecommendation: "Practice on platforms like LeetCode (Database) or HackerRank. Focus specifically on LEAD, LAG, ROW_NUMBER, and nested query optimizations."
          },
          {
            skillName: "Python for Data Visualization & Wrangling",
            type: "emerging",
            priority: "High",
            impactDescription: "As data sizes exceed Excel/Tableau thresholds, Python (Pandas) becomes mandatory for quick scientific data transformations and predictive modeling.",
            actionableRecommendation: "Build a Jupyter notebook that pulls Google Analytics public data, cleans missing entries via Pandas, and creates custom heatmaps using Seaborn."
          }
        ],
        strategicAdvice: "Your superpowers are communication, marketing domain expertise, and executive presentation. A pure coder will struggle to explain 'why' campaign conversion dipped; you can explain it instantly. Capitalize on this 'domain knowledge + tech skill' combination to secure fast promotions."
      }
    }
  }
};
