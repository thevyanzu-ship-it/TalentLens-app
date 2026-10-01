# TalentLens

**AI-Assisted Resume Screening and Candidate Ranking System**

Rank a batch of resumes against a job description in minutes, with a transparent score behind every candidate.

**B.Tech 3rd Year Project | Academic Year 2026-2027**

![Overview](assets/slide-1.jpg)

---

## What it does

TalentLens screens and ranks resumes against a job description. It extracts a structured profile from every resume, scores it against the role, and shows a ranked shortlist with clear score breakdowns. A human always makes the final decision.

---

## Features

| Feature | Description |
|---------|-------------|
| **Job Intake** | Paste a JD — skills are auto-detected |
| **Bulk Upload** | Upload PDF, DOCX, and TXT resumes together |
| **Smart Profiling** | Extracts name, skills, experience, and education |
| **Ranked Leaderboard** | Sort, search, and filter candidates by skill |
| **Score Breakdown** | See Technical, Experience, and Education scores |
| **Compare** | View up to 3 candidates side by side |

![Features](assets/slide-2.jpg)

---

## How it works

1. **Create job** — Title + JD; required skills extracted  
2. **Upload** — PDF / DOCX / TXT parsed to text  
3. **Extract** — LLM or rule-based profile  
4. **Score** — Weighted 0–100 match score  
5. **Review** — Leaderboard, detail view, and compare  

**Dual-mode extraction:** Uses local Ollama + Mistral when available. Falls back to regex + skills dictionary if the LLM is down or slow. Data stays on your machine.

![Pipeline](assets/slide-3.jpg)

---

## Scoring

| Component   | Weight | Method |
|-------------|--------|--------|
| Technical   | 40%    | 70% skill coverage + 30% text similarity |
| Experience  | 40%    | Candidate years ÷ target years (capped at 100) |
| Education   | 20%    | Associate 70 → Bachelor 80 → Master 90 → PhD 100 |

```
Overall = 0.4 × Technical + 0.4 × Experience + 0.2 × Education
```

Scores are advisory. Recruiters make the final call.

![Scoring](assets/slide-4.jpg)

---

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Recharts  
- **Backend:** Python, FastAPI, Uvicorn, Pydantic  
- **AI / NLP:** Ollama (Mistral), regex + skills dictionary, cosine similarity  
- **Data:** SQLite, pypdf, python-docx  

![Tech Stack](assets/slide-5.jpg)

---

## Roadmap

- Login and role-based access  
- Matched vs missing skills view  
- CSV / PDF export of rankings  
- Configurable weights and must-have skills  
- Upload error reporting and OCR  

---

## License

B.Tech 3rd Year Academic Project — 2026-2027
