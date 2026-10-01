"use client";

import React, { useState } from "react";
import { Briefcase, Sparkles, FileText, CheckCircle } from "lucide-react";
import { API_BASE } from "../config";

interface JobInputProps {
  onJobCreated: (job: any) => void;
  activeJob: any;
}

const TEMPLATES = [
  {
    title: "Senior Full-Stack Engineer",
    description: "We are looking for a Senior Full-Stack Engineer to build scalable web applications. Required skills: Python, React, Next.js, FastAPI, Docker, and PostgreSQL. Candidates must have 5+ years of experience, design robust microservices, and lead technical architectures. Bachelor's or Master's degree in CS preferred.",
  },
  {
    title: "AI / Data Scientist",
    description: "Seeking a Data Scientist to build and deploy predictive ML models. Required skills: Python, SQL, Machine Learning, Deep Learning, PyTorch, Scikit-Learn, and NLP. Experience with Large Language Models (LLMs) and data visualization tools is a big plus. 3+ years of experience required.",
  },
  {
    title: "Technical Product Manager",
    description: "We are hiring a Technical Product Manager to oversee SaaS platform growth. Required skills: Agile, Scrum, Product Management, Jira, Roadmap planning, and system design concepts. You will collaborate with engineering teams to scope features and define product specifications. 4+ years of experience.",
  }
];

export default function JobInput({ onJobCreated, activeJob }: JobInputProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setTitle(template.title);
    setDescription(template.description);
    setMessage(`Applied "${template.title}" template.`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create job description.");
      }

      const job = await response.json();
      onJobCreated(job);
      setTitle("");
      setDescription("");
      setMessage("Job Description established successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      alert(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-2xl" />
      
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Briefcase className="h-4.5 w-4.5" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Job Specification</h2>
      </div>

      <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
        Define the requirements of the job. You can write your own or apply one of our templates below to load a preset profile instantly.
      </p>

      {/* Templates Row */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TEMPLATES.map((tmpl, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyTemplate(tmpl)}
            className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            {tmpl.title}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="job-title" className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Role Title
          </label>
          <input
            id="job-title"
            type="text"
            required
            placeholder="e.g., Lead AI Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus:border-indigo-500 dark:focus:bg-zinc-900"
          />
        </div>

        <div>
          <label htmlFor="job-desc" className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Description & Core Requirements
          </label>
          <textarea
            id="job-desc"
            required
            rows={5}
            placeholder="Outline the responsibilities, required skills, tools, technologies, and target years of experience..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus:border-indigo-500 dark:focus:bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98] disabled:bg-zinc-400 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Configure Screening Pipeline
            </>
          )}
        </button>
      </form>

      {message && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          {message}
        </div>
      )}

      {activeJob && (
        <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
            Active Job Profile
          </span>
          <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
            {activeJob.title}
          </h3>
          <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {activeJob.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {activeJob.requirements.map((req: string, idx: number) => (
              <span
                key={idx}
                className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
