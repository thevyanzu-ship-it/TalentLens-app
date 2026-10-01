"use client";

import React, { useState, useEffect } from "react";
import { X, Briefcase, GraduationCap, Award, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

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

interface CandidateDetailProps {
  candidate: Candidate | null;
  onClose: () => void;
}

export default function CandidateDetail({ candidate, onClose }: CandidateDetailProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "resume">("summary");
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration mismatch for Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!candidate) return null;

  // Chart data matching candidate scores
  const chartData = [
    { name: "Technical", Score: candidate.technical_score, fill: "#6366f1" },
    { name: "Experience", Score: candidate.experience_score, fill: "#3b82f6" },
    { name: "Education", Score: candidate.education_score, fill: "#10b981" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      
      {/* Clickable Backdrop to Close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Slide-over Drawer Panel */}
      <div className="relative flex h-full w-full max-w-xl flex-col border-l border-zinc-200 bg-white shadow-2xl transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-950 sm:w-[500px]">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 p-5 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
              Candidate Profile Report
            </span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{candidate.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab("summary")}
            className={`flex-1 py-3 text-center text-xs font-semibold border-b-2 transition ${
              activeTab === "summary"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Match Summary
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`flex-1 py-3 text-center text-xs font-semibold border-b-2 transition ${
              activeTab === "resume"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Raw Parsed Resume
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "summary" ? (
            <>
              {/* Overall Score Meter Card */}
              <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Overall Evaluation
                    </span>
                    <h3 className="mt-0.5 text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      {candidate.score}% Match
                    </h3>
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-full border border-indigo-200 bg-indigo-50 flex items-center justify-center dark:border-indigo-900 dark:bg-indigo-950/30">
                    <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                
                {/* 2-Sentence AI Summary */}
                <div className="mt-4 border-t border-zinc-200/60 pt-3 dark:border-zinc-800/60">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                    AI Verdict Summary
                  </span>
                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                    {candidate.summary}
                  </p>
                </div>
              </div>

              {/* Match Category Chart */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Dimension Breakdown
                </h4>
                <div className="h-44 w-full rounded-2xl border border-zinc-150 p-3 dark:border-zinc-800">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                      >
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={80} style={{ fontSize: "10px", fontWeight: "600" }} />
                        <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                        <Bar dataKey="Score" radius={6} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-zinc-400">
                      Loading chart dimensions...
                    </div>
                  )}
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-zinc-100 p-3.5 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                    Experience Profile
                  </div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {candidate.experience.years} Years
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                    Roles: {candidate.experience.roles.slice(0, 2).join(", ") || "None listed"}
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-100 p-3.5 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />
                    Education Tier
                  </div>
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                    {candidate.education || "Bachelor's (Estimated)"}
                  </p>
                </div>
              </div>

              {/* Skills Inventory */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Skills Inventory ({candidate.skills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 border border-zinc-200/45 dark:border-zinc-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Timeline Details */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Heuristic Timeline Highlights
                </h4>
                <div className="space-y-3 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                  {candidate.experience.roles.map((role, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[13px] top-1 h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-zinc-950" />
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{role}</p>
                      {candidate.experience.companies[idx] && (
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">at {candidate.experience.companies[idx]}</p>
                      )}
                    </div>
                  ))}
                  {candidate.experience.roles.length === 0 && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">No specific chronological roles extracted.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Full resume text tab */
            <div className="relative h-full flex flex-col min-h-[350px]">
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <FileText className="h-4 w-4" />
                Raw Extraction Terminal Output
              </div>
              <pre className="flex-1 overflow-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-[10.5px] leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                {candidate.resume_text || "No resume text content available."}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
