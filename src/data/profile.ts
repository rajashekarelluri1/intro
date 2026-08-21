/**
 * CONTENT INTEGRITY: every string in this file is taken verbatim from
 * https://rajashekarelluri1.github.io/info/ — nothing is invented.
 */

export const PROFILE = {
  name: "Elluri Rajashekar",
  role: "Data Analyst & BI Expert",
  photoUrl: "https://raw.githubusercontent.com/rajashekarelluri1/info/main/profile.png",
  photoAlt: "Elluri Rajashekar — Data Analyst & BI Expert",
  roleShort: "Data Analyst",
  location: "Hyderabad, India",
  greeting: "Hi, I am",
  intro:
    "Passionate about converting complex data into actionable business intelligence. Specializing in SQL, Python, Power BI, and process automation to drive organizational growth and efficiency.",
  typeWords: ["SQL", "Python", "Power BI", "Excel"],
  resumeUrl:
    "https://drive.google.com/file/d/1bYnSof6XWBxY5JHQQfPslO_nMEW56jbQ/view?usp=drive_link",
  email: "rajashekarelluri@gmail.com",
  phoneDisplay: "+91 8XXXXXXXX1",
  phoneHref: "tel:+918XXXXXXXX1",
  linkedinUrl: "https://www.linkedin.com/in/elluri-rajashekar/",
  linkedinLabel: "in/elluri-rajashekar",
};

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Workflow", href: "#workflow" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Explore", href: "#tools" },
  { label: "Contact", href: "#contact" },
];

export const SCENES = [
  { id: "home", index: "01", label: "Intro" },
  { id: "about", index: "02", label: "Insight" },
  { id: "impact", index: "03", label: "Impact" },
  { id: "education", index: "04", label: "Education" },
  { id: "toolbox", index: "05", label: "Toolbox" },
  { id: "workflow", index: "06", label: "Workflow" },
  { id: "experience", index: "07", label: "Career" },
  { id: "projects", index: "08", label: "Projects" },
  { id: "tools", index: "09", label: "Lab" },
  { id: "intel", index: "10", label: "Intelligence" },
  { id: "contact", index: "11", label: "Contact" },
];

export const HERO_METRICS = [
  { value: 80, suffix: "%", label: "Efficiency Gain" },
  { value: 6, suffix: "+", label: "Awards" },
  { value: 4, suffix: "+", label: "Years Exp" },
];

export const ABOUT = {
  kicker: "Scene 02 — Turning Data Into Insight",
  headline: "Dedicated to excellence in data analysis and process optimization",
  sub: "With a proven track record of delivering impactful business solutions.",
  overview:
    "Results-driven Data Analyst with extensive experience at leading technology companies including Tech Mahindra and Frugal Testing. I excel in transforming complex data landscapes into clear, actionable insights that drive strategic business decisions.",
  pipeline: ["Complex Data", "Analysis", "Insight", "Decision"],
  achievements: [
    "4 Bravo Awards & 2 Pat on the Back Awards for outstanding performance",
    "80% reduction in manual processes through innovative automation",
    "Successfully led cross-functional teams in data-driven initiatives",
    "Developed comprehensive dashboards improving decision-making efficiency",
  ],
};

export const IMPACT = {
  stat: {
    value: 80,
    suffix: "%",
    title: "Reduction in manual processes",
    body: "80% reduction in manual processes through innovative automation.",
  },
  awards: {
    bravo: 4,
    pat: 2,
    line: "4 Bravo Awards & 2 Pat on the Back Awards for outstanding performance",
  },
  moments: [
    {
      title: "Cross-functional leadership",
      body: "Successfully led cross-functional teams in data-driven initiatives.",
    },
    {
      title: "Decision-grade dashboards",
      body: "Developed comprehensive dashboards improving decision-making efficiency.",
    },
  ],
};

export const EDUCATION = [
  {
    degree: "Bachelor of Technology",
    field: "Civil Engineering",
    school: "JNTU Hyderabad",
    years: "2018 – 2021",
    short: "B.TECH",
  },
  {
    degree: "Diploma",
    field: "Civil Engineering",
    school: "SBTET, Telangana",
    years: "2015 – 2018",
    short: "DIPLOMA",
  },
  {
    degree: "Class X",
    field: "Secondary Education",
    school: "Board of Secondary Education, Telangana",
    years: "2005 – 2015",
    short: "CLASS X",
  },
];

export const CERTIFICATIONS = [
  "Lean Six Sigma – Yellow Belt Certification",
  "Python for Data Analysis – Udemy",
  "SQL for Data Science – Udemy",
  "Power BI for Data Visualization – Udemy",
];

export const TOOLBOX = [
  {
    category: "Programming & Query Languages",
    short: "Languages",
    tone: "amber" as const,
    items: ["Python", "SQL", "App Script"],
  },
  {
    category: "Data Visualization",
    short: "Visualization",
    tone: "teal" as const,
    items: ["Power BI", "Looker Studio", "Excel", "Matplotlib", "Seaborn"],
  },
  {
    category: "Data Analysis & Tools",
    short: "Analysis",
    tone: "blue" as const,
    items: ["Pandas", "NumPy", "ETL", "Data Cleaning", "Colab"],
  },
  {
    category: "Automation & Platforms",
    short: "Automation",
    tone: "ink" as const,
    items: ["Google Sheets", "ChatGPT", "MS Office", "MySQL", "SQL Server"],
  },
];

export const WORKFLOW = {
  kicker: "Methodology",
  heading: "How I Work With Data",
  sub: "A cinematic look at my end-to-end analytics pipeline.",
  stages: [
    {
      stage: "01",
      title: "Raw Data",
      body: "Pulling data from source systems — tickets, spreadsheets, databases, and forms.",
      tags: ["SQL", "Sources"],
    },
    {
      stage: "02",
      title: "Data Cleaning",
      body: "Removing duplicates, fixing types, and handling nulls so every number can be trusted.",
      tags: ["Cleaning", "ETL"],
    },
    {
      stage: "03",
      title: "SQL / Python",
      body: "Querying, joining, and scripting transformations into analysis-ready datasets.",
      tags: ["SQL", "Python"],
    },
    {
      stage: "04",
      title: "Data Modeling",
      body: "Structuring clean data into relational models and star schemas for fast reporting.",
      tags: ["Star Schema", "Relations"],
    },
    {
      stage: "05",
      title: "Power BI",
      body: "Building interactive dashboards and DAX measures that make data explorable.",
      tags: ["Power BI", "Excel"],
    },
    {
      stage: "06",
      title: "Business Insights",
      body: "Translating charts and numbers into plain-language findings stakeholders can use.",
      tags: ["Storytelling", "KPIs"],
    },
    {
      stage: "07",
      title: "Decision Making",
      body: "Handing off clear, confident recommendations that move strategy and priorities forward.",
      tags: ["Strategy", "Impact"],
    },
  ],
};

export const CAREER = {
  kicker: "Career Path",
  heading: "Professional Experience",
  sub: "A journey of continuous growth and achievement in data analytics and process optimization.",
  jobs: [
    {
      role: "Data Analyst",
      company: "Frugal Testing",
      period: "June 2025 – Present",
      location: "Hyderabad, India",
      current: true,
      years: "2025 → NOW",
      summary:
        "Currently working as a Data Analyst, leveraging advanced analytics for performance optimization and strategic decision-making in quality assurance and testing environments.",
      bullets: [
        "Leading end-to-end data projects involving extraction, transformation, and visualization using SQL, Python, Power BI, and Google Looker Studio",
        "Collaborating with cross-functional teams to provide actionable insights for QA automation and testing platforms",
        "Implementing data-driven performance optimization strategies",
        "Developing comprehensive reporting solutions for testing workflow enhancement",
      ],
      chips: ["SQL", "Python", "Power BI", "Looker Studio"],
    },
    {
      role: "Senior Quality Analyst (Data)",
      company: "Tech Mahindra",
      period: "Nov 2021 – May 2025",
      location: "Hyderabad, India",
      current: false,
      years: "2021 → 2025",
      summary:
        "Specialized in data analysis, process automation, and quality assurance for enterprise-level solutions, focusing on operational excellence through innovative data strategies.",
      bullets: [
        "Automated feedback email processes using Google Sheets & App Script, achieving 80% reduction in manual efforts",
        "Designed interactive Power BI and Excel dashboards for real-time KPI tracking",
        "Utilized SQL Server and MySQL for comprehensive data analysis and customer data management",
        "Conducted ETL processes, data cleaning, and wrangling ensuring 99%+ accuracy",
        "Created impactful visualizations using Power BI, Excel, and Python libraries",
        "Led quality improvement initiatives including audits, Gemba walks, and calibrations",
        "Managed WBR and MBR meetings with stakeholders and clients",
        "Conducted training programs resulting in 25% improvement in team efficiency",
      ],
      chips: ["Google Sheets", "App Script", "Power BI", "Excel", "SQL Server", "MySQL", "Python"],
    },
  ],
};

export const PROJECTS = {
  kicker: "Featured Work",
  heading: "Featured Projects",
  sub: "Innovative solutions that showcase technical expertise and deliver measurable business impact.",
  galleryUrl: "https://rajashekarelluri1.github.io/info/projects.htm",
  items: [
    {
      index: "01",
      title: "Automated Email Feedback System",
      front:
        "Developed a comprehensive automated bulk email solution using Google Sheets, App Script, and ChatGPT integration.",
      impact:
        "This innovative system streamlined feedback collection and distribution, achieving an 80% reduction in manual workload while improving response accuracy.",
      tags: ["Google Sheets", "App Script", "ChatGPT", "Automation"],
      flow: ["Google Sheets", "App Script", "ChatGPT", "Automated Emails"],
    },
    {
      index: "02",
      title: "Business Intelligence Dashboard Suite",
      front:
        "Built a comprehensive dashboard ecosystem including HR Analytics, Coffee Shop Sales Analysis, and Sample Superstore Reporting using Power BI and Excel.",
      impact:
        "These dynamic dashboards provide real-time insights for strategic decision-making across multiple business units.",
      tags: ["Power BI", "Excel", "Data Modeling", "KPI Design"],
      flow: ["HR Analytics", "Coffee Shop Sales", "Sample Superstore"],
    },
    {
      index: "03",
      title: "Advanced Data Analysis Engine",
      front:
        "Created a sophisticated Exploratory Data Analysis (EDA) framework for customer feedback data using Pandas, Matplotlib, and Seaborn.",
      impact:
        "This analytical engine extracts meaningful patterns to drive customer satisfaction improvements and strategic business optimization.",
      tags: ["Python", "Pandas", "Matplotlib", "Seaborn"],
      flow: ["Customer Feedback", "EDA Framework", "Patterns", "Optimization"],
    },
  ],
};

export const LAB = {
  kicker: "Interactive Learning",
  heading: "Explore My Tools & Dashboards",
  sub: "Hands-on cheat sheets, live playgrounds, and dashboards built to teach and demonstrate real analyst workflows.",
  queryLine: "-- SELECT skill, impact FROM analyst WHERE curiosity = true;",
  queryStatus: "✓ Query executed — insights ready.",
  resources: [
    {
      tag: "SQLite",
      title: "SQL Master Cheatsheet",
      body: "Writing order vs. execution order — the key to debugging complex queries, with visual infographics.",
      href: "https://rajashekarelluri1.github.io/info/sql.htm",
    },
    {
      tag: "SQL",
      title: "SQL Zero to Hero",
      body: "24 chapters, 150+ queries and a live in-browser SQLite playground — from your first SELECT to window functions & CTEs.",
      href: "https://rajashekarelluri1.github.io/info/sql1.htm",
    },
    {
      tag: "Excel",
      title: "Excel Mastery",
      body: "An 80-formula cheat sheet with worked examples, error explanations, shortcuts, and a live practice grid.",
      href: "https://rajashekarelluri1.github.io/info/excel.html",
    },
    {
      tag: "Power BI",
      title: "Power BI Mastery",
      body: "A 61-function DAX cheat sheet, star-schema data model, and a live measure playground.",
      href: "https://rajashekarelluri1.github.io/info/powerbi.html",
    },
    {
      tag: "Dashboards",
      title: "Interactive Dashboards",
      body: "Cybersecurity, e-commerce & brand awareness dashboards — where data transforms into interactive stories.",
      href: "https://rajashekarelluri1.github.io/info/projects.htm",
    },
  ],
};

export const CONTACT = {
  kicker: "Scene 11 — Transmission",
  lead: "Ready to transform your data challenges into competitive advantages? Let's discuss how we can collaborate to drive your business forward.",
  headline: "Let's build something data-driven together",
  sub: "Have a project, a dashboard idea, or just want to talk analytics? I'd love to hear from you.",
  cta: "Say Hello",
};

export const SKILL_TICKER = [
  "Python",
  "SQL",
  "App Script",
  "Power BI",
  "Looker Studio",
  "Excel",
  "Matplotlib",
  "Seaborn",
  "Pandas",
  "NumPy",
  "ETL",
  "Google Sheets",
  "ChatGPT",
  "MySQL",
  "SQL Server",
];
