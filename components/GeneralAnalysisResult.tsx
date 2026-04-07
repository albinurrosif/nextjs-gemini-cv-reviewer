'use client';

import { useState } from 'react';
import { EvaluationResult } from '@/lib/evaluation/scorer.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import ReactMarkdown, { type Components } from 'react-markdown';

export default function GeneralAnalysisResult({ data }: { data: EvaluationResult }) {
  // State untuk Tab Aktif
  const [activeTab, setActiveTab] = useState<'rapor' | 'cv' | 'interview'>('rapor');

  // Menentukan warna berdasarkan skor ATS
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-500 dark:text-amber-400';
    return 'text-destructive';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-destructive/10 border-destructive/20';
  };

  // mngunakan { node: _, ...props } di semuanya agar React Console tidak error
  const markdownComponents: Components = {
    h1: ({ node: _, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2 text-primary" {...props} />,
    h2: ({ node: _, ...props }) => <h2 className="text-xl font-bold mt-4 mb-2 text-primary/80" {...props} />,
    h3: ({ node: _, ...props }) => <h3 className="text-lg font-bold mt-3 mb-1" {...props} />,
    p: ({ node: _, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
    ul: ({ node: _, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
    ol: ({ node: _, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
    li: ({ node: _, ...props }) => <li className="pl-1" {...props} />,
    strong: ({ node: _, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
    em: ({ node: _, ...props }) => <em className="italic text-foreground/80" {...props} />,
    a: ({ node: _, ...props }) => <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
  };

  return (
    <div className="space-y-6 w-full">
      {/* --- MENU TABS NAVIGASI --- */}
      <div className="w-full mb-4">
        {/* HINT GESER: Hanya muncul di layar Mobile (md:hidden) */}
        <div className="flex items-center text-xs text-muted-foreground/60 mb-2 md:hidden animate-pulse">
          <span>👈 Geser menu untuk fitur lain 👉</span>
        </div>
        {/* Kontainer Tab */}
        <div className="flex overflow-x-auto w-full gap-2 border-b pb-3 snap-x snap-mandatory hide-scrollbar">
          <Button variant={activeTab === 'rapor' ? 'default' : 'ghost'} onClick={() => setActiveTab('rapor')} className="rounded-full shrink-0 snap-start">
            📊 Rapor ATS
          </Button>

          {/* Sembunyikan tab CV jika AI gagal membuat rewrittenCv */}
          {data.rewrittenCv && (
            <Button variant={activeTab === 'cv' ? 'default' : 'ghost'} onClick={() => setActiveTab('cv')} className="rounded-full shrink-0 snap-start">
              ✨ Draft CV Baru
            </Button>
          )}

          {/* Sembunyikan tab Interview jika datanya kosong */}
          {data.interviewQuestions && data.interviewQuestions.length > 0 && (
            <Button variant={activeTab === 'interview' ? 'default' : 'ghost'} onClick={() => setActiveTab('interview')} className="rounded-full shrink-0 snap-start">
              🎤 Persiapan Interview
            </Button>
          )}
        </div>
      </div>

      {/* --- KONTEN TAB 1: RAPOR ATS --- */}
      {activeTab === 'rapor' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className={`border-2 ${getScoreBg(data.matchScore)} overflow-hidden relative`}>
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <span className="text-9xl font-black">{data.matchScore}</span>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Skor Standar ATS</CardTitle>
              <CardDescription>Cek kelayakan CV berdasarkan struktur, metrik, dan kata kerja aktif.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`text-5xl font-extrabold ${getScoreColor(data.matchScore)}`}>
                  {data.matchScore}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <div className="flex flex-col gap-1">
                  {data.matchScore >= 80 && <Badge className="w-fit bg-emerald-500">Sangat Baik (ATS Friendly)</Badge>}
                  {data.matchScore >= 60 && data.matchScore < 80 && <Badge className="w-fit bg-amber-500">Cukup (Perlu Revisi)</Badge>}
                  {data.matchScore < 60 && <Badge className="w-fit bg-destructive">Kritis (Rombak Total)</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-emerald-500/20 shadow-sm">
              <CardHeader className="bg-emerald-500/5 pb-4">
                <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <span>✅</span> Kekuatan CV
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {data.strengths.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 shadow-sm">
              <CardHeader className="bg-destructive/5 pb-4">
                <CardTitle className="text-lg text-destructive flex items-center gap-2">
                  <span>⚠️</span> Area Perbaikan (Format & Isi)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {data.missingSkills.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-destructive mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>💡</span> Saran Perbaikan Strategis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{data.strategicAdvice}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- KONTEN TAB 2: CV MASTERPIECE --- */}
      {activeTab === 'cv' && data.rewrittenCv && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-primary/50 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <CardHeader className="bg-primary/5 pb-4 border-b flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <span>✨</span> Draft CV Baru (Versi AI)
                </CardTitle>
                <CardDescription className="mt-1">CV-mu telah ditulis ulang menggunakan standar ATS. Salin dan paste ke Word/Docs.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 flex items-center gap-2 mt-1"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(data.rewrittenCv || '');
                    toast.success('CV Berhasil Disalin!', {
                      description: 'Silakan paste di Microsoft Word atau Google Docs.',
                    });
                  } catch {
                    toast.error('Gagal menyalin teks CV.');
                  }
                }}
              >
                <span>📋</span> Copy Teks
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-muted/30 p-6 rounded-md border text-sm text-foreground/90 max-h-[600px] overflow-y-auto">
                {/* Memanggil Komponen Markdown yang sudah diperkuat */}
                <ReactMarkdown components={markdownComponents}>{data.rewrittenCv}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- KONTEN TAB 3: INTERVIEW PREP --- */}
      {activeTab === 'interview' && data.interviewQuestions && data.interviewQuestions.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>🎤</span> Prediksi Pertanyaan Interview
              </CardTitle>
              <CardDescription>Berdasarkan pengalaman yang tertulis di CV-mu.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {data.interviewQuestions.map((q, i) => (
                  <AccordionItem value={`item-${i}`} key={i} className="border-border">
                    <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors">
                      <span className="flex gap-3">
                        <span className="text-muted-foreground font-normal">Q{i + 1}.</span>
                        {q.question}
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="space-y-4 pt-2 pb-4">
                      {/* Alasan */}
                      <div className="bg-accent/50 border-l-4 border-primary p-3 text-sm text-foreground">
                        <strong>💡 Kenapa ditanyakan:</strong> {q.reason}
                      </div>

                      {/* Jawaban */}
                      <div className="bg-muted/30 p-4 rounded-md border border-border text-sm">
                        <strong className="text-emerald-600 dark:text-emerald-500 block mb-2">Contoh Jawaban (Metode STAR):</strong>

                        <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                          <ReactMarkdown
                            components={{
                              strong: markdownComponents.strong,
                              em: markdownComponents.em,
                              p: ({ node: _, ...props }) => <span {...props} />,
                            }}
                          >
                            {q.sampleAnswer}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
