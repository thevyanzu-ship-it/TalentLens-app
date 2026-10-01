"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Activity,
  Layers,
  Trash2,
  Cpu,
  Plus,
  UploadCloud,
  Award,
  FileText,
  LayoutGrid,
  Columns2,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Users,
  Target
} from "lucide-react";
import { API_BASE } from "../config";
import JobInput from "./job-input";
import UploadZone from "./upload-zone";
import Leaderboard from "./leaderboard";
import CandidateDetail from "./candidate-detail";
import ComparisonMatrix from "./comparison-matrix";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  created_at: string;
}

interface Candidate {
  id: number;
  job_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience: {
    years: number;
    roles: string[];
    companies: string[];
  };
  education: string | null;
  summary: string | null;
  score: number;
  technical_score: number;
  experience_score: number;
  education_score: number;
  resume_text: string | null;
  created_at: string;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [comparingIds, setComparingIds] = useState<number[] | null>(null);
  const [activeTab, setActiveTab] = useState<"leaderboard" | "upload" | "job" | "pipelines">("leaderboard");
  const [viewMode, setViewMode] = useState<"tabbed" | "split">("tabbed");
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    ollama_status: string;
    message: string;
  } | null>(null);

  // 1. Fetch jobs list and health status on startup
  useEffect(() => {
    fetchJobs();
    checkHealth();
  }, []);

  // 2. Fetch candidates whenever active job changes
  useEffect(() => {
    if (activeJob) {
      fetchCandidates(activeJob.id);
    } else {
      setCandidates([]);
    }
  }, [activeJob]);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      if (response.ok) {
        const data = await response.json();
        setHealthStatus(data);
      }
    } catch (e) {
      console.warn("Backend server not reachable yet.");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        if (data.length > 0 && !activeJob) {
          setActiveJob(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load jobs list", err);
    }
  };

  const fetchCandidates = async (jobId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}/candidates`);
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
      }
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    }
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    setActiveJob(newJob);
    setActiveTab("upload"); // Automatically navigate to upload resumes after creating role
  };

  const handleCandidatesProcessed = (newCandidates: Candidate[]) => {
    if (activeJob) {
      fetchCandidates(activeJob.id);
      setActiveTab("leaderboard"); // Automatically navigate to rankings to view screened candidates
    }
  };

  const handleDeleteJob = async (jobId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this screening pipeline? All candidates will be deleted.")) return;

    try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
        if (activeJob?.id === jobId) {
          const remaining = jobs.filter((j) => j.id !== jobId);
          setActiveJob(remaining.length > 0 ? remaining[0] : null);
        }
      }
    } catch (err) {
      alert("Failed to delete pipeline.");
    }
  };

  // Pipeline summary statistics
  const stats = useMemo(() => {
    if (!candidates.length) {
      return { total: 0, topScore: 0, avgScore: 0, topCandidate: null };
    }
    const sorted = [...candidates].sort((a, b) => b.score - a.score);
    const sum = candidates.reduce((acc, c) => acc + c.score, 0);
    return {
      total: candidates.length,
      topScore: sorted[0]?.score || 0,
      avgScore: Math.round(sum / candidates.length),
      topCandidate: sorted[0] || null,
    };
  }, [candidates]);

  return (
    <div className="min-h-screen bg-zinc-50/60 pb-20 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 shadow-2xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight uppercase">
                  TalentLens
                </span>
                <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  AI PRO
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Talent Screening & Ranking
              </span>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-3">
            
            {/* Health / Ollama Status Pill */}
            {healthStatus && (
              <div className={`hidden sm:flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                healthStatus.ollama_status === "connected"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                    healthStatus.ollama_status === "connected" ? "bg-emerald-400" : "bg-amber-400"
                  }`} />
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${
                    healthStatus.ollama_status === "connected" ? "bg-emerald-500" : "bg-amber-500"
                  }`} />
                </span>
                <span>{healthStatus.ollama_status === "connected" ? "Ollama LLM" : "NLP Fallback"}</span>
              </div>
            )}

            {/* Pipeline Selector */}
            {jobs.length > 0 && (
              <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
                <span className="hidden md:inline pl-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Role:
                </span>
                <select
                  value={activeJob?.id || ""}
                  onChange={(e) => {
                    const job = jobs.find((j) => j.id === Number(e.target.value));
                    if (job) setActiveJob(job);
                  }}
                  className="rounded-lg border-0 bg-transparent py-1 px-2.5 text-xs font-semibold text-zinc-800 outline-none dark:text-zinc-200 cursor-pointer"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id} className="dark:bg-zinc-900">
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Layout View Switcher (Tabs vs Split) */}
            <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
              <button
                onClick={() => setViewMode("tabbed")}
                title="Full Tabbed Workflow"
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  viewMode === "tabbed"
                    ? "bg-white text-indigo-600 shadow-xs dark:bg-zinc-800 dark:text-indigo-400"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tabs</span>
              </button>
              <button
                onClick={() => setViewMode("split")}
                title="Side-by-side Split View"
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  viewMode === "split"
                    ? "bg-white text-indigo-600 shadow-xs dark:bg-zinc-800 dark:text-indigo-400"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                <Columns2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Split</span>
              </button>
            </div>

            {/* New Pipeline Button */}
            <button
              onClick={() => {
                setActiveTab("job");
                if (viewMode === "split") setViewMode("tabbed");
              }}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition active:scale-98 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Pipeline</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">

        {/* Active Pipeline Hero Banner & KPI Stats */}
        {activeJob ? (
          <div className="mb-6 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <Briefcase className="h-3 w-3" />
                    Active Pipeline
                  </span>
                  <span className="text-xs text-zinc-400">
                    Created {new Date(activeJob.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {activeJob.title}
                </h1>
                
                {/* Requirements skill chips */}
                {activeJob.requirements && activeJob.requirements.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-zinc-400 mr-1">
                      Required Skills:
                    </span>
                    {activeJob.requirements.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 self-start md:self-center">
                <button
                  onClick={() => setActiveTab("upload")}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 shadow-2xs transition"
                >
                  <UploadCloud className="h-3.5 w-3.5 text-indigo-500" />
                  Upload Resumes
                </button>
                <button
                  onClick={() => setActiveTab("job")}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 shadow-2xs transition"
                >
                  <FileText className="h-3.5 w-3.5 text-zinc-500" />
                  View JD Spec
                </button>
              </div>
            </div>

            {/* KPI Metrics Strip */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-zinc-50/70 p-3 dark:bg-zinc-800/40 border border-zinc-150/60 dark:border-zinc-800/40">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-indigo-500" />
                  Candidates
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                  {stats.total}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50/70 p-3 dark:bg-zinc-800/40 border border-zinc-150/60 dark:border-zinc-800/40">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  Top Match
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
                  {stats.topScore ? `${stats.topScore}%` : "—"}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50/70 p-3 dark:bg-zinc-800/40 border border-zinc-150/60 dark:border-zinc-800/40">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  Average Match
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                  {stats.avgScore ? `${stats.avgScore}%` : "—"}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50/70 p-3 dark:bg-zinc-800/40 border border-zinc-150/60 dark:border-zinc-800/40">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Target className="h-3.5 w-3.5 text-violet-500" />
                  Leader
                </p>
                <p className="mt-1 text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">
                  {stats.topCandidate?.name || "None yet"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/40 p-8 text-center dark:border-indigo-900 dark:bg-indigo-950/20">
            <Sparkles className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h2 className="mt-2 text-base font-bold text-zinc-900 dark:text-white">
              No Screening Pipeline Selected
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
              Create a job role or choose a template to begin screening and ranking candidate resumes automatically.
            </p>
            <button
              onClick={() => setActiveTab("job")}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Create First Job Pipeline
            </button>
          </div>
        )}

        {/* TABBED WORKFLOW VIEW */}
        {viewMode === "tabbed" ? (
          <div>
            {/* Tab navigation pills */}
            <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  activeTab === "leaderboard"
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <Award className="h-4 w-4" />
                <span>Leaderboard & Rankings</span>
                <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  activeTab === "leaderboard"
                    ? "bg-white/20 text-white"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}>
                  {candidates.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  activeTab === "upload"
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload Resumes</span>
              </button>

              <button
                onClick={() => setActiveTab("job")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  activeTab === "job"
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Job Specification</span>
              </button>

              <button
                onClick={() => setActiveTab("pipelines")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  activeTab === "pipelines"
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>All Pipelines ({jobs.length})</span>
              </button>
            </div>

            {/* TAB CONTENT: LEADERBOARD */}
            {activeTab === "leaderboard" && (
              <div className="space-y-6">
                <Leaderboard
                  candidates={candidates}
                  onSelectCandidate={setActiveCandidate}
                  onCompareCandidates={setComparingIds}
                />
              </div>
            )}

            {/* TAB CONTENT: UPLOAD */}
            {activeTab === "upload" && (
              <div className="mx-auto max-w-3xl space-y-6">
                <UploadZone
                  activeJobId={activeJob ? activeJob.id : null}
                  onCandidatesProcessed={handleCandidatesProcessed}
                />
              </div>
            )}

            {/* TAB CONTENT: JOB SPEC */}
            {activeTab === "job" && (
              <div className="mx-auto max-w-3xl space-y-6">
                <JobInput onJobCreated={handleJobCreated} activeJob={activeJob} />
              </div>
            )}

            {/* TAB CONTENT: ALL PIPELINES */}
            {activeTab === "pipelines" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                    Screening Pipelines Directory
                  </h2>
                  <button
                    onClick={() => setActiveTab("job")}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Job Pipeline
                  </button>
                </div>

                {jobs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
                    <p className="text-xs text-zinc-400">No pipelines created yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => {
                          setActiveJob(job);
                          setActiveTab("leaderboard");
                        }}
                        className={`group relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer transition shadow-2xs hover:shadow-md ${
                          activeJob?.id === job.id
                            ? "border-indigo-500 bg-indigo-50/15 dark:border-indigo-500 dark:bg-indigo-950/20"
                            : "border-zinc-200/80 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                              Pipeline #{job.id}
                            </span>
                            <button
                              onClick={(e) => handleDeleteJob(job.id, e)}
                              className="rounded-lg p-1 text-zinc-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/50 transition"
                              title="Delete pipeline"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <h3 className="mt-1 text-sm font-bold text-zinc-900 dark:text-white">
                            {job.title}
                          </h3>
                          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3">
                            {job.description}
                          </p>

                          {job.requirements && job.requirements.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {job.requirements.slice(0, 3).map((req, i) => (
                                <span
                                  key={i}
                                  className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                                >
                                  {req}
                                </span>
                              ))}
                              {job.requirements.length > 3 && (
                                <span className="text-[10px] text-zinc-400 self-center">
                                  +{job.requirements.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                          <span className="text-zinc-400 text-[11px]">
                            {new Date(job.created_at).toLocaleDateString()}
                          </span>
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                            Open Pipeline <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* SPLIT VIEW (BALANCED 2-COLUMN) */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-5">
              <JobInput onJobCreated={handleJobCreated} activeJob={activeJob} />
              <UploadZone
                activeJobId={activeJob ? activeJob.id : null}
                onCandidatesProcessed={handleCandidatesProcessed}
              />
            </div>
            <div className="lg:col-span-7">
              <Leaderboard
                candidates={candidates}
                onSelectCandidate={setActiveCandidate}
                onCompareCandidates={setComparingIds}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Candidate details report drawer */}
      <CandidateDetail
        candidate={activeCandidate}
        onClose={() => setActiveCandidate(null)}
      />

      {/* Floating Side-by-side comparison matrix modal */}
      {comparingIds && activeJob && (
        <ComparisonMatrix
          jobId={activeJob.id}
          candidateIds={comparingIds}
          onClose={() => setComparingIds(null)}
        />
      )}
    </div>
  );
}
