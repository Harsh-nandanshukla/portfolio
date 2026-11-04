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
  /** Path under public/ (public/resume.pdf). */
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
  /** Research code repository (shown as the "Research code" button). */
  link?: EntryLink;
}

/** An external link on a timeline entry. Button text and accessible name come from content.experienceSection. */
export interface EntryLink {
  href: string;
}

export interface Skill {
  name: string;
  category: string;
  /** Key into src/lib/skill-icons.ts. Missing or unknown key → the skill renders as a text pill. */
  icon?: string;
  /** Show in the scrolling marquee rows. Every skill always appears in the grouped list. */
  marquee: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  /** Certificate verification page (shown as the "Verify" button). */
  link?: EntryLink;
}

/** Experience & Research section strings. The heading is sections.experience.label. */
export interface ExperienceSectionStrings {
  /** Shown before entry.mentor. */
  mentorLabel: string;
  /** Screen-reader label for an entry's highlight metric. */
  highlightAriaLabel: string;
  researchCode: {
    label: string;
    /** Accessible name; "{title}" is replaced with the research title (or the organization). */
    ariaLabel: string;
  };
  education: {
    /** Small mono label on the compact card. */
    label: string;
    /** Degree line; {degree}, {major} and {minor} come from content.education. */
    degreeLine: string;
    /** Shown only when education.showCgpa is true. */
    cgpaLine: string;
  };
  certification: {
    label: string;
    verify: {
      label: string;
      /** Accessible name; "{name}" is replaced with the certification name. */
      ariaLabel: string;
    };
  };
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

/** Hero section strings (DESIGN.md §2). Name, label and tagline come from `identity`. */
export interface HeroStrings {
  /** Gradient button, scrolls to the projects section. */
  primaryCta: string;
  /** Outline button, downloads identity.resume. */
  secondaryCta: string;
  /** Screen-reader label for the scroll-down indicator (links to the Ask my AI section). */
  scrollHint: string;
}

/** One link button on a project tile. Buttons render in this order; a "TODO" link hides its button. */
export interface ProjectLinkButton {
  key: keyof ProjectLinks;
  label: string;
  /** Accessible name; "{project}" is replaced with the project title. */
  ariaLabel: string;
}

/** Projects section strings (CONTENT.md "Projects section"). The heading is sections.projects.label. */
export interface ProjectsSectionStrings {
  intro: string;
  linkButtons: ProjectLinkButton[];
  /** Screen-reader labels for the featured tile's pipeline and metrics. */
  pipelineAriaLabel: string;
  metricsAriaLabel: string;
  /** Heading above the featured tile's full metrics list (project.metrics). */
  benchmarksHeading: string;
  tagsAriaLabel: string;
}

/** Contact section + footer strings (CONTENT.md "Contact section", DESIGN.md §7). Email, links and resume come from `identity`. */
export interface ContactSectionStrings {
  closingLine: string;
  /** The word(s) inside closingLine shown with the gradient. */
  closingHighlight: string;
  /** Accessible name of the big email button; "{email}" is replaced with the address. */
  copyEmailAriaLabel: string;
  /** Toast text after a successful copy (also announced to screen readers). */
  copied: string;
  sendEmail: string;
  githubAriaLabel: string;
  linkedinAriaLabel: string;
  resume: string;
  /** Screen-reader label for the row of links. */
  linksAriaLabel: string;
  footer: {
    /** DESIGN.md §7 */
    line: string;
    backToTop: string;
  };
}

/** Ask my AI section strings (DESIGN.md §3; chips per DECISIONS). The endpoint comes from .env.local. */
export interface AskAiSectionStrings {
  heading: string;
  placeholder: string;
  /** Accessible name of the question input. */
  inputAriaLabel: string;
  sendAriaLabel: string;
  /** Suggestion chips; clicking one asks it right away. Add one string to add a chip. */
  chips: string[];
  chipsAriaLabel: string;
  conversationAriaLabel: string;
  youLabel: string;
  aiLabel: string;
  /** Screen-reader text for the typing indicator. */
  thinking: string;
  sourcesLabel: string;
  /** One source line; "{source}" = API value as-is, "{page}" = API page + 1 (pages counted from 1). */
  sourceLine: string;
  /** Shown on HTTP 429 (the shared hourly limit). */
  rateLimitMessage: string;
  /** Shown on any other failure (missing endpoint, network/CORS, timeout, bad response). */
  errorMessage: string;
  /** Resume link shown under both failure messages (href = identity.resume). */
  resumeLink: string;
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
  hero: HeroStrings;
  askAiSection: AskAiSectionStrings;
  projectsSection: ProjectsSectionStrings;
  experienceSection: ExperienceSectionStrings;
  contactSection: ContactSectionStrings;
  /** Navbar entries, in display order. Add one object to add a link. */
  nav: NavItem[];
  ui: UiStrings;
  education: Education;
  projects: Project[];
  experience: ExperienceEntry[];
  skills: Skill[];
  certifications: Certification[];
  seo: Seo;
  /** Endpoint for the "Ask my AI" section (CONTENT.md, for reference). The app reads it from .env.local (NEXT_PUBLIC_HARSHGPT_URL). */
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

  // Button labels from DESIGN.md §2 Hero.
  hero: {
    primaryCta: "View Projects",
    secondaryCta: "Download Resume",
    scrollHint: "Scroll down to Ask my AI",
  },

  // DESIGN.md §3. Chips name Harsh because retrieval misses "his" (DECISIONS #62).
  askAiSection: {
    heading: "Ask my AI about me",
    placeholder: "What has Harsh built with LLMs?",
    inputAriaLabel: "Ask a question about Harsh",
    sendAriaLabel: "Send question",
    chips: [
      "What's Harsh's strongest project?",
      "Tell me about Harsh's research",
      "What's Harsh's tech stack?",
    ],
    chipsAriaLabel: "Suggested questions",
    conversationAriaLabel: "Conversation with HarshGPT",
    youLabel: "You",
    aiLabel: "HarshGPT",
    thinking: "HarshGPT is thinking…",
    sourcesLabel: "Sources",
    sourceLine: "{source} · p. {page}",
    rateLimitMessage: "My AI has hit its hourly limit — try again later, or grab my resume instead.",
    errorMessage: "My AI can't answer right now — try again in a moment, or grab my resume instead.",
    resumeLink: "Open resume",
  },
  // Intro from CONTENT.md "Projects section"; button labels from DESIGN.md §4.
  projectsSection: {
    intro: "Production LLM systems I've designed, benchmarked, and deployed end to end.",
    linkButtons: [
      { key: "liveDemo", label: "Live Demo", ariaLabel: "Live demo of {project}" },
      { key: "apiDocs", label: "API Docs", ariaLabel: "API docs of {project}" },
      { key: "github", label: "GitHub", ariaLabel: "GitHub repository of {project}" },
    ],
    pipelineAriaLabel: "Safety pipeline stages",
    metricsAriaLabel: "Headline metrics",
    benchmarksHeading: "Benchmarks",
    tagsAriaLabel: "Tech stack",
  },

  contactSection: {
    closingLine: "Let's build something intelligent.",
    closingHighlight: "intelligent",
    copyEmailAriaLabel: "Copy email address {email}",
    copied: "Copied",
    sendEmail: "Send email",
    githubAriaLabel: "Harsh's GitHub",
    linkedinAriaLabel: "Harsh's LinkedIn",
    resume: "Resume",
    linksAriaLabel: "Profiles and resume",
    footer: {
      line: "© 2026 Harsh Nandan Shukla · Built with Next.js",
      backToTop: "Back to top",
    },
  },

  experienceSection: {
    mentorLabel: "Mentor:",
    highlightAriaLabel: "Highlight",
    researchCode: { label: "Research code", ariaLabel: "Research code for {title}" },
    education: {
      label: "Education",
      degreeLine: "{degree}, {major}, Minor in {minor}",
      cgpaLine: "CGPA {cgpa}",
    },
    certification: {
      label: "Certification",
      verify: { label: "Verify", ariaLabel: "Verify {name} certificate" },
    },
  },

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
      link: {
        href: "https://github.com/Harsh-nandanshukla/Exploring_GAN_based_Defense_Strategy_for_Adversarial_Images_using_Vision_Transformer",
      },
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
  // No icon: concepts (list only) or brands whose logo isn't in react-icons' Simple Icons set (text pill in the marquee).
  skills: [
    { name: "Python", category: "Programming", icon: "python", marquee: true },
    { name: "C/C++", category: "Programming", icon: "cplusplus", marquee: true },
    { name: "SQL", category: "Programming", marquee: false },

    { name: "PyTorch", category: "AI/ML", icon: "pytorch", marquee: true },
    { name: "TensorFlow", category: "AI/ML", icon: "tensorflow", marquee: true },
    { name: "Scikit-learn", category: "AI/ML", icon: "scikitlearn", marquee: true },
    { name: "Pandas", category: "AI/ML", icon: "pandas", marquee: true },
    { name: "NumPy", category: "AI/ML", icon: "numpy", marquee: true },
    { name: "Computer Vision", category: "AI/ML", marquee: false },
    { name: "Vision Transformers", category: "AI/ML", marquee: false },
    { name: "GANs", category: "AI/ML", marquee: false },
    { name: "NLP", category: "AI/ML", marquee: false },

    { name: "LangChain", category: "LLM & GenAI", icon: "langchain", marquee: true },
    { name: "LangGraph", category: "LLM & GenAI", icon: "langgraph", marquee: true },
    { name: "RAG", category: "LLM & GenAI", marquee: false },
    { name: "Prompt Engineering", category: "LLM & GenAI", marquee: false },
    { name: "OpenAI API", category: "LLM & GenAI", marquee: true },
    { name: "Hugging Face Transformers", category: "LLM & GenAI", icon: "huggingface", marquee: true },
    { name: "Qdrant", category: "LLM & GenAI", icon: "qdrant", marquee: true },

    { name: "FastAPI", category: "Backend", icon: "fastapi", marquee: true },
    { name: "REST APIs", category: "Backend", marquee: false },
    { name: "PostgreSQL", category: "Backend", icon: "postgresql", marquee: true },
    { name: "Redis", category: "Backend", icon: "redis", marquee: true },

    { name: "Docker", category: "Cloud & DevOps", icon: "docker", marquee: true },
    { name: "Docker Compose", category: "Cloud & DevOps", icon: "docker", marquee: false },
    { name: "Oracle Cloud (OCI)", category: "Cloud & DevOps", marquee: true },
    { name: "AWS EC2", category: "Cloud & DevOps", marquee: true },
    { name: "Nginx", category: "Cloud & DevOps", icon: "nginx", marquee: true },
    { name: "Git", category: "Cloud & DevOps", icon: "git", marquee: true },
    { name: "Linux", category: "Cloud & DevOps", icon: "linux", marquee: true },

    { name: "Claude Code", category: "AI dev tools", icon: "claudecode", marquee: true },
  ],

  certifications: [
    {
      name: "Advanced Learning Algorithms",
      issuer: "Stanford Online & DeepLearning.AI (Coursera)",
      link: { href: "https://www.coursera.org/account/accomplishments/verify/DA2QLL1E433U" },
    },
  ],

  seo: {
    title: "Harsh Nandan Shukla — AI/ML Engineer",
    description:
      "AI/ML engineer building production LLM systems: guardrails, RAG, and agent evaluation.",
    ogImage: { src: "/og-image.png", width: 1200, height: 630, file: "TODO" },
  },

  harshgptEndpoint: "https://137-23-46-16.sslip.io/harshgpt/chat",
};
