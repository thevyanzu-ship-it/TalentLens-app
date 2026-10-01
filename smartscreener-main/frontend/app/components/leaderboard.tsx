"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ShieldCheck,
  Mail,
  Phone,
  Layers,
  Scale,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Check
} from "lucide-react";

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

interface LeaderboardProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onCompareCandidates: (selectedIds: number[]) => void;
}

export default function Leaderboard({ candidates, onSelectCandidate, onCompareCandidates }: LeaderboardProps) {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "experience">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Toggle candidate selection for comparison
  const handleSelectCompare = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare a maximum of 3 candidates at a time.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleSortToggle = (field: "score" | "experience") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Get all unique skills for filter suggestion
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => c.skills.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [candidates]);

  // Filtered and Sorted Candidates
  const processedCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.email && c.email.toLowerCase().includes(search.toLowerCase()));
        const matchesSkill = !skillFilter || c.skills.some((s) => s.toLowerCase() === skillFilter.toLowerCase());
        return matchesSearch && matchesSkill;
      })
      .sort((a, b) => {
        let valA = sortBy === "score" ? a.score : a.experience.years;
        let valB = sortBy === "score" ? b.score : b.experience.years;
        return sortOrder === "desc" ? valB - valA : valA - valB;
      });
  }, [candidates, search, skillFilter, sortBy, sortOrder]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25";
    if (score >= 60) return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/25";
    if (score >= 40) return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25";
    return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25";
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-teal-400";
    if (score >= 60) return "bg-gradient-to-r from-indigo-500 to-violet-400";
    if (score >= 40) return "bg-gradient-to-r from-amber-500 to-yellow-400";
    return "bg-gradient-to-r from-rose-500 to-red-400";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/80">
      
      {/* Top Filter Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800/80">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
            </span>
            Candidate Ranking Leaderboard
            <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {processedCandidates.length}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Ranked by AI compatibility score against current job requirements
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {selectedIds.length >= 2 && (
            <button
              onClick={() => onCompareCandidates(selectedIds)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 active:scale-95 cursor-pointer"
            >
              <Scale className="h-3.5 w-3.5" />
              Compare ({selectedIds.length})
            </button>
          )}
          
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 rounded-xl border border-zinc-200/90 bg-zinc-50/70 py-1.8 pr-3.5 pl-9 text-xs outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 dark:border-zinc-800 dark:bg-zinc-800/60 dark:focus:border-indigo-500 dark:focus:bg-zinc-900"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-38 appearance-none rounded-xl border border-zinc-200/90 bg-zinc-50/70 py-1.8 pr-7 pl-9 text-xs outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 dark:border-zinc-800 dark:bg-zinc-800/60 dark:focus:border-indigo-500 cursor-pointer"
            >
              <option value="">All Skills</option>
              {allSkills.map((skill, idx) => (
                <option key={idx} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Grid */}
      {processedCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-zinc-200/80 rounded-2xl py-20 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400 mb-3 shadow-xs">
            <Layers className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No candidates analyzed yet</p>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm text-center">
            Upload resumes in PDF, DOCX, or TXT format to evaluate and rank profiles instantly.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800/80 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-2 w-8"></th>
                <th className="py-3 px-2 w-10 text-center">Rank</th>
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-4">
                  <button onClick={() => handleSortToggle("score")} className="flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer">
                    Compatibility Score
                    <ArrowUpDown className="h-3 w-3 text-zinc-400" />
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button onClick={() => handleSortToggle("experience")} className="flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer">
                    Experience
                    <ArrowUpDown className="h-3 w-3 text-zinc-400" />
                  </button>
                </th>
                <th className="py-3 px-3">Matched Skills</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/90 dark:divide-zinc-800/50">
              {processedCandidates.map((cand, idx) => {
                const rank = idx + 1;
                return (
                  <tr
                    key={cand.id}
                    className={`group transition-all ${
                      rank === 1
                        ? "bg-amber-500/3 hover:bg-amber-500/8 dark:bg-amber-400/5 dark:hover:bg-amber-400/10"
                        : "hover:bg-zinc-50/80 dark:hover:bg-zinc-850/40"
                    }`}
                  >
                    {/* Compare Checkbox */}
                    <td className="py-3.5 px-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(cand.id)}
                        onChange={() => handleSelectCompare(cand.id)}
                        className="h-4 w-4 rounded-md border-zinc-300 text-indigo-600 focus:ring-indigo-500/30 dark:border-zinc-700 cursor-pointer"
                        title="Select for comparison"
                      />
                    </td>

                    {/* Rank Badge */}
                    <td className="py-3.5 px-2 text-center">
                      {rank === 1 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 text-[11px] font-black text-white shadow-xs shadow-amber-500/30">
                          1
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-slate-400 to-zinc-300 text-[11px] font-bold text-slate-900 shadow-xs">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-700 to-amber-600 text-[11px] font-bold text-white shadow-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-zinc-400">
                          #{rank}
                        </span>
                      )}
                    </td>

                    {/* Candidate Name & Contact info */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-pink-500/15 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-500/15 shadow-2xs">
                          {getInitials(cand.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span
                            onClick={() => onSelectCandidate(cand)}
                            className="font-bold text-xs text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition cursor-pointer truncate"
                          >
                            {cand.name}
                          </span>
                          <div className="mt-0.5 flex items-center gap-3 text-[11px] text-zinc-400">
                            {cand.email && (
                              <span className="flex items-center gap-1 truncate max-w-[150px]">
                                <Mail className="h-3 w-3 text-zinc-400 shrink-0" />
                                {cand.email}
                              </span>
                            )}
                            {cand.phone && (
                              <span className="hidden sm:flex items-center gap-1">
                                <Phone className="h-3 w-3 text-zinc-400 shrink-0" />
                                {cand.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Compatibility Score with mini progress bar */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${getScoreColor(cand.score)}`}>
                            {cand.score}% Match
                          </span>
                        </div>
                        <div className="w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-1.5">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(cand.score)}`}
                            style={{ width: `${Math.min(100, Math.max(5, cand.score))}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col text-xs">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                          {cand.experience.years} {cand.experience.years === 1 ? "Year" : "Years"}
                        </span>
                        <span className="text-[10px] text-zinc-400 line-clamp-1 max-w-[130px]">
                          {cand.experience.roles.join(", ") || "Role unlisted"}
                        </span>
                      </div>
                    </td>

                    {/* Matched Skills list */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[280px]">
                        {cand.skills.slice(0, 4).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            onClick={() => setSkillFilter(skillFilter === skill ? "" : skill)}
                            className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold transition cursor-pointer ${
                              skillFilter === skill
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "bg-zinc-100/80 text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-zinc-800/70 dark:text-zinc-300 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                        {cand.skills.length > 4 && (
                          <span className="text-[10px] text-zinc-400 font-medium self-center pl-0.5">
                            +{cand.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* View Report Action */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => onSelectCandidate(cand)}
                        className="inline-flex items-center gap-1 rounded-xl bg-indigo-50/80 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white transition shadow-2xs dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white cursor-pointer active:scale-95"
                      >
                        Report
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
