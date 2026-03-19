'use client';

import { useState } from 'react';
import { EvaluationResult } from '@/lib/evaluation/scorer.service';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalysisResult({ data }: { data: EvaluationResult }) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'improvements' | 'coverLetter' | 'interview'>('analysis');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const scoreColor = data.matchScore >= 75 ? 'text-green-500' : data.matchScore >= 50 ? 'text-yellow-500' : 'text-red-500';

  const formatText = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-foreground font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Konfigurasi animasi seragam untuk setiap Tab
  const tabAnimation = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: 0.3, ease: 'easeOut' as const },
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-8">
      {/* --- MENU TABS NAVIGASI --- */}
      <div className="flex flex-wrap border-b border-foreground/10 gap-2 md:gap-8 mb-4">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`pb-3 font-semibold transition-all flex items-center gap-2 ${activeTab === 'analysis' ? 'border-b-2 border-red-500 text-red-500' : 'text-foreground/60 hover:text-foreground'}`}
        >
          📊 Analysis & Gaps
        </button>
        <button
          onClick={() => setActiveTab('improvements')}
          className={`pb-3 font-semibold transition-all flex items-center gap-2 ${activeTab === 'improvements' ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-foreground/60 hover:text-foreground'}`}
        >
          ✨ CV Improvements
        </button>
        <button
          onClick={() => setActiveTab('coverLetter')}
          className={`pb-3 font-semibold transition-all flex items-center gap-2 ${activeTab === 'coverLetter' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-foreground/60 hover:text-foreground'}`}
        >
          ✉️ Cover Letter
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`pb-3 font-semibold transition-all flex items-center gap-2 ${activeTab === 'interview' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-foreground/60 hover:text-foreground'}`}
        >
          ❓ Interview Prep
        </button>
      </div>

      {/* --- KONTEN TABS (DIBUNGKUS ANIMATE PRESENCE) --- */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {/* TAB 1: ANALYSIS & GAPS */}
          {activeTab === 'analysis' && (
            <motion.div key="analysis" {...tabAnimation} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 p-8 bg-background rounded-2xl shadow-lg border border-foreground/10 flex flex-col justify-center items-center text-center">
                  <h2 className="text-xl font-bold text-foreground/80 mb-2 uppercase tracking-widest">Match Score</h2>
                  <div className={`text-7xl font-extrabold ${scoreColor}`}>{data.matchScore}%</div>
                </div>

                <div className="md:col-span-2 p-8 bg-background rounded-2xl shadow-lg border border-foreground/10">
                  <div className="flex flex-col gap-6">
                    <div>
                      <h4 className="text-md font-bold text-green-600 mb-2">✅ Kekuatan (Match)</h4>
                      <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                        {data.strengths.map((str, i) => (
                          <li key={i}>{formatText(str)}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-red-600 mb-2">❌ Kekurangan (Missing Skills)</h4>
                      {/* EMPTY STATE HANDLING UNTUK MISSING SKILLS */}
                      {data.missingSkills.length > 0 ? (
                        <ul className="list-disc pl-6 space-y-1 text-foreground/80 text-sm">
                          {data.missingSkills.map((skill, i) => (
                            <li key={i}>{formatText(skill)}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm italic">✨ Luar biasa! CV Anda sudah mencakup semua kriteria krusial yang dibutuhkan oleh loker ini.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {data.strategicAdvice && (
                <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">💡 Strategi Lamaran</h3>
                  <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">{formatText(data.strategicAdvice)}</p>
                </div>
              )}

              {data.atsKeywords && data.atsKeywords.length > 0 && (
                <div className="p-8 bg-background rounded-2xl shadow-lg border border-foreground/10">
                  <h3 className="text-lg font-bold text-foreground mb-4">🎯 Target ATS Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.atsKeywords.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-medium text-foreground/80">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: CV IMPROVEMENTS */}
          {activeTab === 'improvements' && (
            <motion.div key="improvements" {...tabAnimation} className="p-8 bg-background rounded-2xl shadow-lg border border-foreground/10">
              <div className="flex flex-col gap-10">
                {/* LACI BARU: MAGIC BULLETS (KRITIK & REWRITE) */}
                <div className="border-b border-foreground/10 pb-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">🪄 Magic Bullets (Perbaikan Kritis)</h3>
                  {/* EMPTY STATE HANDLING UNTUK MAGIC BULLETS */}
                  {data.magicBullets && data.magicBullets.length > 0 ? (
                    <div className="flex flex-col gap-6">
                      {data.magicBullets.map((bullet, i) => (
                        <div key={i} className="bg-foreground/5 p-5 rounded-xl border border-foreground/10">
                          <div className="mb-3 text-sm text-foreground/60 line-through">"{bullet.original}"</div>
                          <div className="mb-4 text-sm text-red-500 font-medium">Kritik: {bullet.critique}</div>
                          <div className="text-sm font-bold text-green-600 dark:text-green-500">✅ Rewrite: {bullet.rewrite}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm">
                      ✨ Kalimat-kalimat di CV Anda sudah terstruktur dengan sangat baik! Tidak ada perbaikan kritis yang disarankan AI untuk saat ini.
                    </div>
                  )}
                </div>

                {/* TAILORED SUMMARY */}
                {data.tailoredSummary && (
                  <div>
                    <h4 className="text-lg font-bold text-foreground/90 mb-3 flex justify-between items-center">
                      Professional Summary
                      <button onClick={() => handleCopy(data.tailoredSummary, 'summary')} className="text-xs font-normal text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
                        {copiedText === 'summary' ? 'Copied!' : 'Copy'}
                      </button>
                    </h4>
                    <p className="text-foreground/80 leading-relaxed bg-foreground/5 p-5 rounded-xl border border-foreground/10 italic">"{data.tailoredSummary}"</p>
                  </div>
                )}

                {/* TAILORED EXPERIENCES */}
                {data.tailoredExperiences && data.tailoredExperiences.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-foreground/90 mb-4">Pengalaman Kerja (Optimized)</h4>
                    <div className="flex flex-col gap-4">
                      {data.tailoredExperiences.map((exp, i) => (
                        <div key={i} className="border border-foreground/10 p-5 rounded-xl">
                          <div className="font-bold text-lg">{exp.role}</div>
                          <div className="text-sm text-foreground/60 mb-3">{exp.name}</div>
                          <ul className="list-disc pl-5 space-y-2 text-foreground/80 text-sm">
                            {exp.bullets.map((b, idx) => (
                              <li key={idx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: COVER LETTER */}
          {activeTab === 'coverLetter' && (
            <motion.div key="coverLetter" {...tabAnimation} className="p-8 bg-background rounded-2xl shadow-lg border border-foreground/10 relative group">
              <button onClick={() => handleCopy(data.coverLetter, 'coverLetter')} className="absolute top-4 right-4 px-3 py-1.5 bg-foreground/10 hover:bg-foreground/20 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                {copiedText === 'coverLetter' ? '✅ Copied' : '📋 Copy Text'}
              </button>
              <div className="bg-foreground/5 p-6 rounded-xl border border-foreground/10 text-foreground/90 whitespace-pre-wrap leading-relaxed font-sans mt-4">{data.coverLetter}</div>
            </motion.div>
          )}

          {/* TAB 4: INTERVIEW PREP */}
          {activeTab === 'interview' && (
            <motion.div key="interview" {...tabAnimation} className="p-8 bg-background rounded-2xl shadow-lg border border-foreground/10">
              <div className="flex flex-col gap-6">
                {data.interviewQuestions &&
                  data.interviewQuestions.map((qa, i) => (
                    <div key={i} className="border border-foreground/10 p-6 rounded-xl">
                      <h4 className="font-bold text-lg mb-3">
                        <span className="text-purple-500">Q:</span> {qa.question}
                      </h4>
                      <div className="text-sm text-amber-600 bg-amber-500/10 p-4 rounded-lg mb-4 italic">
                        💡 <strong>Kenapa ditanyakan:</strong> {qa.reason}
                      </div>
                      <div className="text-foreground/80 bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                        <span className="font-bold text-green-600 block mb-2">✅ Contoh Jawaban:</span>
                        <span className="whitespace-pre-wrap">{qa.sampleAnswer}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
