"use client";

import React, { useState, useEffect } from "react";
import { X, Award, Briefcase, GraduationCap, Mail, Phone, Code, Scale } from "lucide-react";
import { API_BASE } from "../config";

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

interface ComparisonMatrixProps {
  jobId: number;
  candidateIds: number[];
  onClose: () => void;
}

export default function ComparisonMatrix({ jobId, candidateIds, onClose }: ComparisonMatrixProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComparisonData() {
      try {
        const idsParam = candidateIds.join(",");
        const response = await fetch(
          `${API_BASE}/api/jobs/${jobId}/compare?ids=${idsParam}`
        );
        if (!response.ok) throw new Error("Failed to fetch comparison details");
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        console.error(err);
        alert("Could not load candidate comparison details.");
      } finally {
        setLoading(false);
      }
    }

    if (candidateIds.length > 0) {
      fetchComparisonData();
    }
  }, [jobId, candidateIds]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 50) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6">
      
      {/* Clickable Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Dialog */}
      <div className="relative flex flex-col w-full max-w-4xl h-full max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 p-5 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                Side-by-Side Comparison Matrix
              </h2>
              <p className="text-[11px] text-zinc-400">
                Evaluating candidate parameters and structural alignment details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Matrix Body */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent dark:border-indigo-500" />
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">Assembling matrix data...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-[160px_repeat(auto-fit,minmax(200px,1fr))] border border-zinc-150 rounded-2xl overflow-hidden divide-x divide-zinc-150 dark:border-zinc-800 dark:divide-zinc-850">
              
              {/* Row Header Labels Column */}
              <div className="bg-zinc-50/50 text-[10px] font-bold uppercase tracking-wider text-zinc-400 divide-y divide-zinc-150 dark:bg-zinc-900/30 dark:divide-zinc-850">
                <div className="p-4 h-16 flex items-center">Candidate</div>
                <div className="p-4 h-20 flex items-center">Overall Evaluation</div>
                <div className="p-4 h-16 flex items-center">Technical score</div>
                <div className="p-4 h-20 flex items-center">Experience profile</div>
                <div className="p-4 h-20 flex items-center">Education Tier</div>
                <div className="p-4 h-36 flex items-center">AI Summary & Gap Verdict</div>
                <div className="p-4 h-36 flex items-center">Primary Skills</div>
                <div className="p-4 h-20 flex items-center">Contact details</div>
              </div>

              {/* Candidate Profiles Columns */}
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  className="bg-white divide-y divide-zinc-150 text-xs text-zinc-700 dark:bg-zinc-950 dark:divide-zinc-850 dark:text-zinc-300"
                >
                  {/* Candidate Name */}
                  <div className="p-4 h-16 flex flex-col justify-center">
                    <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50">{cand.name}</span>
                  </div>

                  {/* Match score */}
                  <div className="p-4 h-20 flex items-center">
                    <div className="flex flex-col">
                      <span className={`text-xl font-black ${getScoreColor(cand.score)}`}>
                        {cand.score}% Match
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">Calculated score weight</span>
                    </div>
                  </div>

                  {/* Technical Score */}
                  <div className="p-4 h-16 flex items-center">
                    <div className="flex items-center gap-1.5">
                      <Code className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {cand.technical_score}% Score
                      </span>
                    </div>
                  </div>

                  {/* Experience profile */}
                  <div className="p-4 h-20 flex items-center">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{cand.experience.years} Years</span>
                        <span className="text-[10px] text-zinc-400 line-clamp-1">
                          {cand.experience.roles[0] || "No role listed"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Education tier */}
                  <div className="p-4 h-20 flex items-center">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      <span className="font-semibold text-zinc-850 dark:text-zinc-250 truncate">
                        {cand.education || "Bachelor's Degree"}
                      </span>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="p-4 h-36 flex items-center overflow-hidden">
                    <p className="leading-relaxed text-[11px] font-medium text-zinc-600 dark:text-zinc-400 line-clamp-5">
                      {cand.summary || "No summary provided."}
                    </p>
                  </div>

                  {/* Primary Skills */}
                  <div className="p-4 h-36 flex items-center overflow-hidden">
                    <div className="flex flex-wrap gap-1 max-h-full overflow-y-auto pr-1">
                      {cand.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md bg-zinc-50 border border-zinc-100 px-1.8 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-900 dark:border-zinc-850 dark:text-zinc-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="p-4 h-20 flex flex-col justify-center gap-1 text-[11px]">
                    {cand.email && (
                      <span className="flex items-center gap-1.5 truncate text-zinc-500">
                        <Mail className="h-3.2 w-3.2 text-zinc-400 shrink-0" />
                        {cand.email}
                      </span>
                    )}
                    {cand.phone && (
                      <span className="flex items-center gap-1.5 truncate text-zinc-500">
                        <Phone className="h-3.2 w-3.2 text-zinc-400 shrink-0" />
                        {cand.phone}
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
