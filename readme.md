# 🔍 Job Finder Application with RAG (Retrieval-Augmented Generation)

The **Job Finder Application** is a cutting-edge platform that leverages **RAG (Retrieval-Augmented Generation)** and AI to match job seekers with relevant job listings and insights. It combines the power of semantic search, AI-driven resume analysis, and modern web technologies to deliver a personalized and intelligent job discovery experience.

---

## 🚀 Features

- 🧠 **AI-Powered Resume Analysis**
  - Parses and understands resumes using NLP
  - Extracts key skills, education, and experience
  - Matches resumes against job descriptions

- 🔎 **RAG-Based Job Matching**
  - Uses a combination of vector search and LLMs (like GPT) to find relevant job roles
  - Retrieves job data using semantic search (ChromaDB)
  - Generates explanations for job matches

- 📄 **Smart Job Listings**
  - Upload or create job descriptions
  - Get AI suggestions for matching candidates

- 🛡️ **User Authentication**
  - Secure login/signup system
  - Role-based access for admins and users

- 📂 **Resume Upload & Parsing**
  - Upload resumes in PDF format
  - Extract and visualize content in a structured format

- 🌐 **Modern Frontend**
  - Built with **Next.js (App Router)**, **Tailwind CSS**, and **React Query**
  - Responsive, fast, and accessible UI

---

## 🧰 Tech Stack

### 🔧 Backend (NestJS + PostgreSQL)
- **NestJS** for scalable server-side application architecture
- **PostgreSQL** for structured relational data
- **ChromaDB** for storing and retrieving embeddings (semantic search)
- **OpenAI API** for LLM integration
- **JWT** for authentication
- **Multer** for resume file uploads

### 🎯 Frontend (Next.js + Tailwind CSS)
- **Next.js App Router**
- **Tailwind CSS** for styling
- **React Query** for API state management
- **Protected routes** for authenticated users

---

## 📂 Project Structure

```bash
job-finder-app/
├── backend/             # NestJS server
│   ├── auth/            # Login/Signup, JWT
│   ├── users/           # User management
│   ├── resumes/         # Upload, parse, vectorize
│   ├── jobs/            # Create/search job postings
│   └── ...              
├── frontend/            # Next.js frontend
│   ├── app/             # App Router pages
│   ├── components/      # UI components
│   ├── hooks/           # Custom hooks
│   └── ...
└── README.md
