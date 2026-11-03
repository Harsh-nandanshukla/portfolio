# CONTENT.md — Site Content

Everything the site says comes from here. `src/data/content.ts` mirrors this file.
Items marked `TODO` must be filled in by Harsh. Do not invent them.

## Identity
- **Name:** Harsh Nandan Shukla
- **Label:** AI/ML Engineer · IIT Jodhpur
- **Tagline:** Building production LLM systems — guardrails, RAG, and agent evaluation.
- **Short bio:** Final-year B.Tech student at IIT Jodhpur (Materials & Metallurgical Engineering,
  Minor in AI) who builds and deploys LLM systems end to end, from guardrail pipelines and RAG
  chatbots to agent-evaluation platforms, self-hosted on Oracle Cloud.
- **Email:** shuklaharshnandan@gmail.com
- **GitHub:** https://github.com/Harsh-nandanshukla
- **LinkedIn:** https://www.linkedin.com/in/harsh-shukla-a87b0a2b0/
- **Resume:** `/resume.pdf` (place the file in `public/`)
- Do not show the phone number on the site.

## Education
- **Indian Institute of Technology Jodhpur** — Jodhpur, Rajasthan
- B.Tech, Major in Materials & Metallurgical Engineering, Minor in Artificial Intelligence
- Aug 2023 – Present · CGPA 7.53 (show CGPA on site: no)

## Projects section
- **Intro:** Production LLM systems I've designed, benchmarked, and deployed end to end.

## Projects

### 1. LLM Guardrails Gateway (featured) — June 2026
- **One-liner:** A production gateway that wraps GPT-4o mini in a 6-stage fail-fast safety pipeline.
- **Pipeline stages:** Prompt injection detection → Input toxicity check → PII redaction →
  LLM call → Output toxicity check → Output PII redaction
- **Metrics:**
  - Prompt injection detector (heuristic + GPT-4o mini judge): F1 0.97, FPR 0.0 on 107 adversarial samples
  - Presidio PII detection: Precision 0.96 / Recall 0.84 (vs regex baseline 0.62 / 0.58)
  - Redis caching: 92% hit rate, latency 60ms → 47ms under Locust load testing
  - Toxic-BERT classifier: Precision 1.0, Recall 0.74, F1 0.85 at 128ms
- **Headline metrics for the tile:** F1 0.97 · 92% cache hit rate · Precision 0.96
- **Tags:** FastAPI · Streamlit · PostgreSQL · Redis · Docker Compose · OCI · Nginx
- **Links:** Live Demo https://137-23-46-16.sslip.io/guardrails-ui/ · API Docs https://137-23-46-16.sslip.io/docs · GitHub TODO

### 2. AgentScope — LLM/Agent Evaluation Platform — Aug 2026
- **One-liner:** Scores LLM agent runs by combining loop, budget, schema, and LLM-as-a-Judge signals.
- **Details:** LangGraph + LangSmith trace ingestion, unified run-level scoring, PostgreSQL persistence;
  FastAPI + Streamlit multi-container stack on Oracle Cloud with IP rate limiting behind Nginx/HTTPS.
- **Tags:** LangGraph · LangSmith · FastAPI · PostgreSQL · Docker · OCI
- **Links:** Live Demo https://137-23-46-16.sslip.io/agentscope-ui/ · API Docs https://137-23-46-16.sslip.io/agentscope/docs · GitHub TODO

### 3. HarshGPT — Production RAG Chatbot — Mar 2026
- **One-liner:** A production RAG chatbot with MMR retrieval, smart query routing, and table-aware PDF parsing.
- **Details:** LangChain + Qdrant + GPT-4o mini; metadata filtering and system-prompt guardrails;
  PDFPlumber table-aware parsing with MD5 deterministic chunk IDs; FastAPI + Redis caching +
  IP rate limiting; self-hosted Qdrant and Redis on an OCI ARM VM behind Nginx/HTTPS.
- **Tags:** LangChain · Qdrant · FastAPI · Redis · Docker · OCI
- **Links:** Live Demo https://137-23-46-16.sslip.io/harshgpt-ui/ · API Docs https://137-23-46-16.sslip.io/harshgpt/docs · GitHub TODO
- **Also powers:** the "Ask my AI" section (endpoint: POST https://137-23-46-16.sslip.io/harshgpt/chat — set as `NEXT_PUBLIC_HARSHGPT_URL` in `.env.local`)

## Experience & Research (timeline order: newest first)

### Data Science Intern — Pull Logic · Sept 2025 – Oct 2025
- Built extraction, transformation, and validation workflows for large geospatial and market
  datasets in Python and SQL (Microsoft SQL Server).
- Ran statistical analysis and hypothesis testing on inventory and sales trends, and automated
  client-specific analytical reports.

### Summer Research Intern — IIIT Allahabad · June – July 2025
- *GAN-based Defense Strategy for Adversarial Images using Vision Transformer*
- Mentor: Prof. Shivram Dubey, Computer Vision and Biometrics Lab
- Trained a ViT on CIFAR-100 (74.17% clean accuracy); PGD attacks collapsed accuracy to 6.66%.
- Designed a U-Net-based GAN reconstruction pipeline with a multi-objective loss
  (adversarial + MSE + cross-entropy) across 9 experimental phases.
- **Highlight metric:** 6.66% → ~27% accuracy under attack (4× recovery)
- **Link:** Research code https://github.com/Harsh-nandanshukla/Exploring_GAN_based_Defense_Strategy_for_Adversarial_Images_using_Vision_Transformer

### Research Intern — Ganpat University · April – May 2025
- Sentiment & sarcasm detection on a 1.3M-comment Reddit dataset.
- Benchmarked 5 ML models and 3 deep learning models (GRU, BiLSTM, Stacked LSTM).
- **Highlight metric:** Logistic Regression best at 67.3% accuracy (F1 67.25%)

## Skills
- **Programming:** Python, C/C++, SQL
- **AI/ML:** PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy, Computer Vision, Vision Transformers, GANs, NLP
- **LLM & GenAI:** LangChain, LangGraph, RAG, Prompt Engineering, OpenAI API, Hugging Face Transformers, Qdrant
- **Backend:** FastAPI, REST APIs, PostgreSQL, Redis
- **Cloud & DevOps:** Docker, Docker Compose, Oracle Cloud (OCI), AWS EC2, Nginx, Git, Linux
- **AI dev tools:** Claude Code

## Certifications
- Advanced Learning Algorithms — Stanford Online & DeepLearning.AI (Coursera)
- **Link:** Verify https://www.coursera.org/account/accomplishments/verify/DA2QLL1E433U

## Contact section
- **Closing line:** Let's build something intelligent.

## SEO
- **Title:** Harsh Nandan Shukla — AI/ML Engineer
- **Description:** AI/ML engineer building production LLM systems: guardrails, RAG, and agent evaluation.
- **OG image:** `public/og-image.png` (TODO, 1200×630)
