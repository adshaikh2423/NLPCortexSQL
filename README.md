<div align="center">

<img src="https://img.shields.io/badge/NLPCortexSQL-Autonomous%20Data%20Intelligence-6C63FF?style=for-the-badge&logo=databricks&logoColor=white" alt="NLPCortexSQL" />

<br/>
<br/>

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.109.0-059669?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Gemini](https://img.shields.io/badge/Google_GenAI-Gemini_2.0_Flash-orange?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Fine--tuned%20T5-yellow)](https://huggingface.co/Karan6124/t5-nl2sql-gen)
[![License](https://img.shields.io/badge/License-MIT-green?logo=opensourceinitiative&logoColor=white)](./LICENSE)

<br/>

> **NLPCortexSQL** — A professional-grade autonomous data intelligence platform that transforms natural language into precise PostgreSQL queries using a sophisticated multi-agent orchestration model.

</div>

---

## Table of Contents

- [Overview](#overview)
- [The Multi-Agent Intelligence Layer](#the-multi-agent-intelligence-layer)
- [Advanced Features](#advanced-features)
- [Technical Architecture](#technical-architecture)
- [Rapid Deployment](#rapid-deployment)
  - [Environment Configuration](#1-environment-configuration)
  - [Backend Initialization](#2-backend-initialization)
  - [Frontend Initialization](#3-frontend-initialization)
- [Project Structure](#project-structure)
- [License & Credits](#license--credits)

---

## Overview

**NLPCortexSQL** is engineered for scale and precision. Unlike simple NL2SQL scripts, it utilizes **LangGraph** to coordinate a team of specialized AI agents that navigate complex schemas, identify analytical trends, and self-heal from execution errors — delivering enterprise-grade intelligence directly from natural language.

---

## The Multi-Agent Intelligence Layer

NLPCortexSQL orchestrates a **pipeline of five specialized agents**, each with a distinct role in transforming language into insight:

### 1. Supervisor — Semantic Filter

Acts as the project manager. Performs a **Semantic Schema Search** to identify the most relevant tables from the knowledge base, stripping away noise to keep the reasoning engine precisely focused.

### 2. Reasoning Architect — Two-Step Strategy

Engineered for logic. Follows a deliberate two-phase approach:

- **Logic Path** — Plans joins, filters, and aggregations in plain English first.
- **SQL Generation** — Only after the logic is sound does it generate the final PostgreSQL.

### 3. Reflection Agent — Schema-Obsessed Auditor

The code reviewer of the pipeline. Performs a strict **Hallucination Check**, verifying every column and table name against the actual database schema before any query is allowed to execute.

### 4. Executor — Self-Healing Loop

Runs the generated query. If the database reports an error, the Executor captures the full traceback and feeds it back into the Reasoning loop for an **Error-Aware Retry** — no manual intervention required.

### 5. Pro Formatter — Analytical Storytelling

The data analyst of the pipeline. Doesn't just list rows — performs **Analytical Storytelling** by identifying patterns, trends, and anomalies to answer the *why* behind the data.

---

## Advanced Features

| Feature | Description |
|---|---|
| **Hybrid Intelligence** | Seamlessly blends a local fine-tuned ML model with Gemini 2.0 Flash for maximum speed and accuracy |
| **Semantic Knowledge Mapping** | Upload a CSV or Excel file and the AI instantly maps the entire schema into its neural memory |
| **Security Layer** | Enterprise-grade JWT authentication and bcrypt password encryption ensure data remains isolated and secure |
| **Premium Workspace** | A glassmorphic UI featuring real-time AI thought visualization, technical detail expansion, and automated system clock synchronization |
| **Self-Healing Queries** | Autonomous error recovery loop — failed queries are diagnosed and retried without user intervention |
| **Multi-Agent Orchestration** | LangGraph-powered agent coordination for robust, multi-step reasoning over complex schemas |

---

## Technical Architecture

| Component | Technology |
|---|---|
| **Core Engine** | FastAPI (Python 3.11) |
| **Agentic Framework** | LangGraph / LangChain |
| **Primary LLM** | Google Gemini 2.0 Flash |
| **Local Model** | [Fine-tuned T5-Small](https://huggingface.co/Karan6124/t5-nl2sql-gen) |
| **Frontend** | React 19 + Framer Motion |
| **Styling** | Vanilla CSS + Tailwind v4 (Beta) |
| **Database** | PostgreSQL |
| **Authentication** | JWT + bcrypt |
| **Schema Ingestion** | CSV / Excel → Semantic Vector Store |

---

## Rapid Deployment

### 1. Environment Configuration

Create a `.env` file in the **root directory** of the project:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
GEMINI_API_KEY="your-gemini-api-key"
SECRET_KEY="your-jwt-secret-key"
```

> **Note:** Never commit your `.env` file to version control. Add it to `.gitignore`.

---

### 2. Backend Initialization

```powershell
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install all dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the development server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

---

### 3. Frontend Initialization

```powershell
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or as specified by Vite).

---

## Project Structure

```
NLPCortexSQL/
├── backend/
│   ├── agents/             # LangGraph agent definitions (Supervisor, Reasoner, Reflector, Executor, Formatter)
│   ├── api/                # FastAPI route handlers
│   ├── core/               # JWT auth, security, config
│   ├── db/                 # Database models & Alembic migrations
│   ├── schemas/            # Pydantic request/response models
│   ├── services/           # Business logic & schema ingestion
│   ├── main.py             # FastAPI application entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── styles/         # CSS & Tailwind config
│   ├── index.html
│   └── package.json
├── .env                    # Environment variables (not committed)
├── .gitignore
└── README.md
```

---

## License & Credits

This project is developed as a next-generation AI data intelligence demonstration platform.

**Lead Engineers:** Ahad & Karan

---

<div align="center">

Built with **LangGraph**, **Gemini 2.0 Flash**, and **FastAPI**

<br/>

If you find this project useful, please consider starring the repository.

</div>
