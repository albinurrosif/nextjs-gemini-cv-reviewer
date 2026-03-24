'use client';

import { useState } from 'react';
import { EvaluationResult } from '@/lib/evaluation/scorer.service';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORT SHADCN ---
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

export default function AnalysisResult({ data }: { data: EvaluationResult }) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'improvements' | 'coverLetter' | 'interview'>('analysis');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Logika warna skor (dipertahankan karena memiliki semantic meaning yang kuat)
  const scoreColorClass = data.matchScore >= 75 ? 'text-emerald-600 dark:text-emerald-500' : data.matchScore >= 50 ? 'text-amber-500 dark:text-amber-400' : 'text-destructive';
  const progressIndicatorColor = data.matchScore >= 75 ? 'bg-emerald-500' : data.matchScore >= 50 ? 'bg-amber-500' : 'bg-destructive';

  // Parser text bold
  const formatText = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const tabAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-12">
      {/* --- MENU TABS NAVIGASI --- */}
      {/* Menggunakan overflow-x-auto agar bisa digeser ke samping di HP, dan shrink-0 pada tombol */}
      <div className="w-full mb-4">
        {/* HINT GESER: Hanya muncul di layar Mobile (md:hidden) */}
        <div className="flex items-center text-xs text-muted-foreground/60 mb-2 md:hidden animate-pulse">
          <span>👈 Geser menu untuk fitur lain 👉</span>
        </div>
        {/* Kontainer Tab */}
        <div className="flex overflow-x-auto w-full gap-2 border-b pb-3 snap-x snap-mandatory hide-scrollbar">
          <Button variant={activeTab === 'analysis' ? 'default' : 'ghost'} onClick={() => setActiveTab('analysis')} className="rounded-full shrink-0 snap-start">
            📊 Analysis & Gaps
          </Button>
          <Button variant={activeTab === 'improvements' ? 'default' : 'ghost'} onClick={() => setActiveTab('improvements')} className="rounded-full shrink-0 snap-start">
            ✨ CV Improvements
          </Button>
          <Button variant={activeTab === 'coverLetter' ? 'default' : 'ghost'} onClick={() => setActiveTab('coverLetter')} className="rounded-full shrink-0 snap-start">
            ✉️ Cover Letter
          </Button>
          <Button variant={activeTab === 'interview' ? 'default' : 'ghost'} onClick={() => setActiveTab('interview')} className="rounded-full shrink-0 snap-start">
            ❓ Interview Prep
          </Button>
        </div>
      </div>

      {/* --- KONTEN TABS --- */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {/* TAB 1: ANALYSIS & GAPS */}
          {activeTab === 'analysis' && (
            <motion.div key="analysis" {...tabAnimation} className="space-y-6">
              <Card className="border-border w-full shadow-sm bg-card">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Match Score</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                  <span className={`text-6xl md:text-7xl font-black tracking-tighter ${scoreColorClass}`}>{data.matchScore}%</span>
                  <Progress value={data.matchScore} className="w-1/2 md:w-1/3 h-2" indicatorColor={progressIndicatorColor} />
                </CardContent>
              </Card>

              <Card className="border-border w-full shadow-sm bg-card">
                <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Kekuatan */}
                  <div>
                    <h4 className="font-semibold text-emerald-600 dark:text-emerald-500 flex items-center gap-2 mb-4 pb-2 border-b">
                      <span>✅</span> Kekuatan CV
                    </h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {data.strengths.map((str, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed">{formatText(str)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Kelemahan */}
                  <div>
                    <h4 className="font-semibold text-destructive flex items-center gap-2 mb-4 pb-2 border-b">
                      <span>❌</span> Kekurangan (Gap)
                    </h4>
                    {data.missingSkills.length > 0 ? (
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        {data.missingSkills.map((skill, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <span className="text-destructive shrink-0 mt-0.5">•</span>
                            <span className="leading-relaxed">{formatText(skill)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-4 rounded-lg border border-emerald-200 dark:border-emerald-900">
                        Luar biasa! CV Anda mencakup semua kriteria krusial.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Strategi */}
              {data.strategicAdvice && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary flex items-center gap-2">💡 Strategi Lamaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{formatText(data.strategicAdvice)}</p>
                  </CardContent>
                </Card>
              )}

              {/* Keywords */}
              {data.atsKeywords && data.atsKeywords.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">🎯 Target ATS Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.atsKeywords.map((keyword, i) => (
                      <Badge key={i} variant="secondary" className="font-normal text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: CV IMPROVEMENTS */}
          {activeTab === 'improvements' && (
            <motion.div key="improvements" {...tabAnimation} className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  🪄 Magic Bullets <span className="text-sm font-normal text-muted-foreground">(Perbaikan Kritis)</span>
                </h3>
                {data.magicBullets && data.magicBullets.length > 0 ? (
                  <div className="grid gap-4">
                    {data.magicBullets.map((bullet, i) => (
                      <Card key={i} className="bg-muted/40 border-border">
                        <CardContent className="pt-6 space-y-3">
                          <p className="text-sm text-muted-foreground line-through italic">&quot;{bullet.original}&quot;</p>
                          <p className="text-sm text-destructive font-medium text-balance">Kritik: {bullet.critique}</p>
                          <Separator className="bg-border" />
                          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-500">✨ Rewrite: {bullet.rewrite}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 p-4 rounded-md border border-emerald-200 dark:border-emerald-900">Kalimat di CV Anda sudah terstruktur sangat baik!</p>
                )}
              </section>

              {data.tailoredSummary && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-foreground">Professional Summary</h3>
                    <Button variant="outline" size="sm" onClick={() => handleCopy(data.tailoredSummary, 'summary')}>
                      {copiedText === 'summary' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="bg-muted/50 p-5 rounded-lg border border-border text-sm italic leading-relaxed text-foreground/80">&quot;{data.tailoredSummary}&quot;</div>
                </section>
              )}

              {/* TAILORED EXPERIENCES */}
              {data.tailoredExperiences && data.tailoredExperiences.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Pengalaman Kerja (Optimized)</h3>
                  <div className="flex flex-col gap-4">
                    {data.tailoredExperiences.map((exp, i) => (
                      <Card key={i} className="border-border shadow-sm">
                        <CardContent className="pt-6">
                          <div className="font-bold text-lg text-foreground">{exp.role}</div>
                          <div className="text-sm text-muted-foreground mb-4 pb-3 border-b border-border">{exp.name}</div>
                          <ul className="space-y-3 text-sm text-foreground/80">
                            {exp.bullets.map((b, idx) => (
                              <li key={idx} className="flex gap-2 items-start">
                                <span className="text-primary shrink-0 mt-0.5">•</span>
                                <span className="leading-relaxed">{formatText(b)}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {/* TAB 3: COVER LETTER */}
          {activeTab === 'coverLetter' && (
            <motion.div key="coverLetter" {...tabAnimation}>
              <Card className="relative overflow-hidden border-border">
                <div className="absolute top-4 right-4 z-10">
                  <Button variant="secondary" size="sm" onClick={() => handleCopy(data.coverLetter, 'coverLetter')}>
                    {copiedText === 'coverLetter' ? '✅ Copied' : '📋 Copy Text'}
                  </Button>
                </div>
                <CardContent className="pt-16 bg-muted/20 font-serif text-sm leading-loose whitespace-pre-wrap text-foreground">{data.coverLetter}</CardContent>
              </Card>
            </motion.div>
          )}

          {/* TAB 4: INTERVIEW PREP */}
          {activeTab === 'interview' && (
            <motion.div key="interview" {...tabAnimation}>
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Prediksi Pertanyaan Wawancara</CardTitle>
                  <CardDescription>Berdasarkan gap antara CV Anda dan Job Description.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {data.interviewQuestions?.map((qa, i) => (
                      <AccordionItem value={`item-${i}`} key={i} className="border-border">
                        <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors">
                          <span className="flex gap-3">
                            <span className="text-muted-foreground font-normal">Q{i + 1}.</span> {qa.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 pb-4">
                          {/* Alert untuk Alasan */}
                          <div className="bg-accent/50 border-l-4 border-primary p-3 text-sm text-foreground">
                            <strong>💡 Kenapa ditanyakan:</strong> {qa.reason}
                          </div>
                          {/* Contoh Jawaban */}
                          <div className="bg-muted/30 p-4 rounded-md border border-border text-sm">
                            <strong className="text-emerald-600 dark:text-emerald-500 block mb-2">✅ Contoh Jawaban STAR:</strong>
                            <span className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{qa.sampleAnswer}</span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
