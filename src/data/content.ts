/**
 * ALL site text lives here. Mirrors docs/CONTENT.md — edit that file first, then this one.
 * Any value set to "TODO" is missing on purpose and must be filled in by Harsh.
 */

// ---------- Types ----------

/** A value that is still missing in CONTENT.md. */
export type Todo = "TODO";

export interface Identity {
  name: string;
  label: string;
  tagline: string;
  shortBio: string;
  email: string;
  github: string;
  linkedin: string;
  /** Path under public/. The PDF itself still needs to be placed in public/. */
  resume: string;
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  major: string;
  minor: string;
  dates: string;
  cgpa: string;
  /** Whether to show the CGPA on the site. */
  showCgpa: boolean | Todo;
}

export interface ProjectLinks {
  liveDemo: string | Todo;
  apiDocs: string | Todo;
  github: string | Todo;
}

/** A headline metric shown on a project tile (e.g. with a Number Ticker). */
export interface HeadlineMetric {
  label: string;
  value: number;
  decimals: number;
  suffix?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  featured: boolean;
  oneLiner: string;
  details?: string;
  pipelineStages?: string[];
  metrics?: string[];
  headlineMetrics?: HeadlineMetric[];
  tags: string[];
  links: ProjectLinks;
  /** Extra role this project plays on the site. */
  alsoPowers?: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  dates: string;
  /** Research project title, if any. */
  title?: string;
  mentor?: string;
  points: string[];
  highlightMetric?: string;
}

export interface Skill {
  name: string;
  category: string;
  /** Key into src/lib/skill-icons.ts (added in Phase 5). */
  icon?: string;
  /** Show in the scrolling marquee rows (decided in Phase 5). */
  marquee?: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
}

export interface Seo {
  title: string;
  description: string;
  ogImage: {
    src: string;
    width: number;
    height: number;
    /** The image file has not been created yet. */
    file: string | Todo;
  };
}

/** One page section: its anchor id and its name (shown in the Phase 1 placeholders). */
export interface SectionMeta {
  id: string;
  label: string;
}

export interface Sections {
  hero: SectionMeta;
  askAi: SectionMeta;
  projects: SectionMeta;
  experience: SectionMeta;
  skills: SectionMeta;
  contact: SectionMeta;
}

/**
 * A navbar entry. "section" = scrolls to an anchor on the page.
 * "resume" = the gradient Resume button (opens the PDF).
 */
export interface NavItem {
  kind: "section" | "resume";
  label: string;
  href: string;
}

/** Small interface strings (screen-reader labels etc.). */
export interface UiStrings {
  navAriaLabel: string;
  openMenu: string;
  closeMenu: string;
}

export interface SiteContent {
  identity: Identity;
  sections: Sections;
  /** Navbar entries, in display order. Add one object to add a link. */
  nav: NavItem[];
  ui: UiStrings;
  education: Education;
  projects: Project[];
  experience: ExperienceEntry[];
  skills: Skill[];
  certifications: Certification[];
  seo: Seo;
  /** Endpoint for the "Ask my AI" section. The real value goes in .env.local (NEXT_PUBLIC_HARSHGPT_URL). */
  harshgptEndpoint: string | Todo;
}

// ---------- Content ----------

const identity: Identity = {
  name: "Harsh Nandan Shukla",
  label: "AI/ML Engineer · IIT Jodhpur",
  tagline: "Building production LLM systems — guardrails, RAG, and agent evaluation.",
  shortBio:
    "Final-year B.Tech student at IIT Jodhpur (Materials & Metallurgical Engineering, Minor in AI) who builds and deploys LLM systems end to end, from guardrail pipelines and RAG chatbots to agent-evaluation platforms, self-hosted on Oracle Cloud.",
  email: "shuklaharshnandan@gmail.com",
  github: "https://github.com/Harsh-nandanshukla",
  linkedin: "https://www.linkedin.com/in/harsh-shukla-a87b0a2b0/",
  // TODO: place resume.pdf in public/ (the Resume button 404s until then)
  resume: "/resume.pdf",
};

// Section names come from DESIGN.md "Sections"; ids are the page anchors.
const sections: Sections = {
  hero: { id: "home", label: "Hero" },
  askAi: { id: "ask-ai", label: "Ask my AI" },
  projects: { id: "projects", label: "Projects" },
  experience: { id: "experience", label: "Experience & Research" },
  skills: { id: "skills", label: "Skills" },
  contact: { id: "contact", label: "Contact" },
};

export const content: SiteContent = {
  identity,
  sections,

  // Labels from DESIGN.md §1 Navbar: Projects · Experience · Skills · Contact + "Resume".
  nav: [
    { kind: "section", label: "Projects", href: `#${sections.projects.id}` },
    { kind: "section", label: "Experience", href: `#${sections.experience.id}` },
    { kind: "section", label: "Skills", href: `#${sections.skills.id}` },
    { kind: "section", label: "Contact", href: `#${sections.contact.id}` },
    { kind: "resume", label: "Resume", href: identity.resume },
  ],

  ui: {
    navAriaLabel: "Main",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  education: {
    institution: "Indian Institute of Technology Jodhpur",
    location: "Jodhpur, Rajasthan",
    degree: "B.Tech",
    major: "Materials & Metallurgical Engineering",
    minor: "Artificial Intelligence",
    dates: "Aug 2023 – Present",
    cgpa: "7.53",
    showCgpa: false,
  },

  projects: [
    {
      id: "llm-guardrails-gateway",
      title: "LLM Guardrails Gateway",
      date: "June 2026",
      featured: true,
      oneLiner: "A production gateway that wraps GPT-4o mini in a 6-stage fail-fast safety pipeline.",
      pipelineStages: [
        "Prompt injection detection",
        "Input toxicity check",
        "PII redaction",
        "LLM call",
        "Output toxicity check",
        "Output PII redaction",
      ],
      metrics: [
        "Prompt injection detector (heuristic + GPT-4o mini judge): F1 0.97, FPR 0.0 on 107 adversarial samples",
        "Presidio PII detection: Precision 0.96 / Recall 0.84 (vs regex baseline 0.62 / 0.58)",
        "Redis caching: 92% hit rate, latency 60ms → 47ms under Locust load testing",
        "Toxic-BERT classifier: Precision 1.0, Recall 0.74, F1 0.85 at 128ms",
      ],
      headlineMetrics: [
        { label: "F1", value: 0.97, decimals: 2 },
        { label: "cache hit rate", value: 92, decimals: 0, suffix: "%" },
        { label: "Precision", value: 0.96, decimals: 2 },
      ],
      tags: ["FastAPI", "Streamlit", "PostgreSQL", "Redis", "Docker Compose", "OCI", "Nginx"],
      links: {
        liveDemo: "https://137-23-46-16.sslip.io/guardrails-ui/",
        apiDocs: "https://137-23-46-16.sslip.io/docs",
        github: "TODO",
      },
    },
    {
      id: "agentscope",
      title: "AgentScope",
      subtitle: "LLM/Agent Evaluation Platform",
      date: "Aug 2026",
      featured: false,
      oneLiner: "Scores LLM agent runs by combining loop, budget, schema, and LLM-as-a-Judge signals.",
      details:
        "LangGraph + LangSmith trace ingestion, unified run-level scoring, PostgreSQL persistence; FastAPI + Streamlit multi-container stack on Oracle Cloud with IP rate limiting behind Nginx/HTTPS.",
      tags: ["LangGraph", "LangSmith", "FastAPI", "PostgreSQL", "Docker", "OCI"],
      links: {
        liveDemo: "https://137-23-46-16.sslip.io/agentscope-ui/",
        apiDocs: "https://137-23-46-16.sslip.io/agentscope/docs",
        github: "TODO",
      },
    },
    {
      id: "harshgpt",
      title: "HarshGPT",
      subtitle: "Production RAG Chatbot",
      date: "Mar 2026",
      featured: false,
      oneLiner:
        "A production RAG chatbot with MMR retrieval, smart query routing, and table-aware PDF parsing.",
      details:
        "LangChain + Qdrant + GPT-4o mini; metadata filtering and system-prompt guardrails; PDFPlumber table-aware parsing with MD5 deterministic chunk IDs; FastAPI + Redis caching + IP rate limiting; self-hosted Qdrant and Redis on an OCI ARM VM behind Nginx/HTTPS.",
      tags: ["LangChain", "Qdrant", "FastAPI", "Redis", "Docker", "OCI"],
      links: {
        liveDemo: "https://137-23-46-16.sslip.io/harshgpt-ui/",
        apiDocs: "https://137-23-46-16.sslip.io/harshgpt/docs",
        github: "TODO",
      },
      alsoPowers: 'the "Ask my AI" section',
    },
  ],

  // Timeline order: newest first
  experience: [
    {
      id: "pull-logic",
      role: "Data Science Intern",
      organization: "Pull Logic",
      dates: "Sept 2025 – Oct 2025",
      points: [
        "Built extraction, transformation, and validation workflows for large geospatial and market datasets in Python and SQL (Microsoft SQL Server).",
        "Ran statistical analysis and hypothesis testing on inventory and sales trends, and automated client-specific analytical reports.",
      ],
    },
    {
      id: "iiit-allahabad",
      role: "Summer Research Intern",
      organization: "IIIT Allahabad",
      dates: "June – July 2025",
      title: "GAN-based Defense Strategy for Adversarial Images using Vision Transformer",
      mentor: "Prof. Shivram Dubey, Computer Vision and Biometrics Lab",
      points: [
        "Trained a ViT on CIFAR-100 (74.17% clean accuracy); PGD attacks collapsed accuracy to 6.66%.",
        "Designed a U-Net-based GAN reconstruction pipeline with a multi-objective loss (adversarial + MSE + cross-entropy) across 9 experimental phases.",
      ],
      highlightMetric: "6.66% → ~27% accuracy under attack (4× recovery)",
    },
    {
      id: "ganpat-university",
      role: "Research Intern",
      organization: "Ganpat University",
      dates: "April – May 2025",
      points: [
        "Sentiment & sarcasm detection on a 1.3M-comment Reddit dataset.",
        "Benchmarked 5 ML models and 3 deep learning models (GRU, BiLSTM, Stacked LSTM).",
      ],
      highlightMetric: "Logistic Regression best at 67.3% accuracy (F1 67.25%)",
    },
  ],

  // Category order on the site = order of first appearance here.
  skills: [
    { name: "Python", category: "Programming" },
    { name: "C/C++", category: "Programming" },
    { name: "SQL", category: "Programming" },

    { name: "PyTorch", category: "AI/ML" },
    { name: "TensorFlow", category: "AI/ML" },
    { name: "Scikit-learn", category: "AI/ML" },
    { name: "Pandas", category: "AI/ML" },
    { name: "NumPy", category: "AI/ML" },
    { name: "Computer Vision", category: "AI/ML" },
    { name: "Vision Transformers", category: "AI/ML" },
    { name: "GANs", category: "AI/ML" },
    { name: "NLP", category: "AI/ML" },

    { name: "LangChain", category: "LLM & GenAI" },
    { name: "LangGraph", category: "LLM & GenAI" },
    { name: "RAG", category: "LLM & GenAI" },
    { name: "Prompt Engineering", category: "LLM & GenAI" },
    { name: "OpenAI API", category: "LLM & GenAI" },
    { name: "Hugging Face Transformers", category: "LLM & GenAI" },
    { name: "Qdrant", category: "LLM & GenAI" },

    { name: "FastAPI", category: "Backend" },
    { name: "REST APIs", category: "Backend" },
    { name: "PostgreSQL", category: "Backend" },
    { name: "Redis", category: "Backend" },

    { name: "Docker", category: "Cloud & DevOps" },
    { name: "Docker Compose", category: "Cloud & DevOps" },
    { name: "Oracle Cloud (OCI)", category: "Cloud & DevOps" },
    { name: "AWS EC2", category: "Cloud & DevOps" },
    { name: "Nginx", category: "Cloud & DevOps" },
    { name: "Git", category: "Cloud & DevOps" },
    { name: "Linux", category: "Cloud & DevOps" },

    { name: "Claude Code", category: "AI dev tools" },
  ],

  certifications: [
    {
      name: "Advanced Learning Algorithms",
      issuer: "Stanford Online & DeepLearning.AI (Coursera)",
    },
  ],

  seo: {
    title: "Harsh Nandan Shukla — AI/ML Engineer",
    description:
      "AI/ML engineer building production LLM systems: guardrails, RAG, and agent evaluation.",
    ogImage: { src: "/og-image.png", width: 1200, height: 630, file: "TODO" },
  },

  harshgptEndpoint: "TODO",
};
