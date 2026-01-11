import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShieldAlert, BookOpen, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { decodeJargon } from '@/lib/calculations';
import { toast } from 'sonner';
export function AIDecoder() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<{ term: string; explanation: string; violation?: string }[] | null>(null);
  const handleDecode = () => {
    if (!input.trim()) {
      toast.error('Paste text to decode');
      return;
    }
    const results = decodeJargon(input);
    setAnalysis(results);
    if (results.some(r => r.violation)) {
      toast.warning('Potential PA Statutory Violation Flagged');
    } else {
      toast.success('Text Decoded Successfully');
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="border-slate-200 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500" />
        <CardHeader>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Privacy AI Shield</span>
          </div>
          <CardTitle>AI Jargon Decoder</CardTitle>
          <CardDescription>Paste your denial letter or EOB description. We decode it locally without sending it to the cloud.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="e.g. 'Requested MRI lumbar spine denied as not medically necessary. Review by medical director (General Practice) found standard conservative therapy was not exhausted...'"
            className="min-h-[150px] font-sans text-sm leading-relaxed"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={handleDecode} className="w-full bg-slate-900 text-white font-black group">
            Decode Denial Letter <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Plain English Breakdown
              </h3>
              <Badge variant="outline" className="text-[10px] uppercase font-bold">{analysis.length} Insights</Badge>
            </div>
            <div className="grid gap-4">
              {analysis.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground italic bg-slate-50 rounded-xl border">
                  No complex medical jargon detected. Your letter appears to use standard plain language.
                </div>
              ) : analysis.map((item, i) => (
                <Card key={i} className={cn("transition-all", item.violation ? "border-red-200 bg-red-50/30" : "border-slate-100")}>
                  <CardContent className="p-5 flex gap-4">
                    <div className={cn("p-2 rounded-lg h-fit", item.violation ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600")}>
                      {item.violation ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm uppercase tracking-tight">{item.term}</span>
                        {item.violation && <Badge variant="destructive" className="text-[8px] px-1 py-0">VIOLATION</Badge>}
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item.explanation}
                      </p>
                      {item.violation && (
                        <div className="mt-2 text-[10px] font-bold text-red-700 uppercase tracking-widest flex items-center gap-1">
                           <ShieldAlert className="w-3 h-3" /> Cite PA {item.violation} in your appeal.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}