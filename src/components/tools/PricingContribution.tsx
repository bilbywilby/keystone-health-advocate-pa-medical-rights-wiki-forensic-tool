import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Send, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { scrubPriceData } from '@/lib/scrubber';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export function PricingContribution() {
  const [formData, setFormData] = useState({ cptCode: '', amount: '', zip: '', facility: 'Hospital' });
  const [showScrubbed, setShowScrubbed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const scrubbed = scrubPriceData({
    cptCode: formData.cptCode,
    billedAmount: parseFloat(formData.amount) || 0,
    zip: formData.zip,
    facilityType: formData.facility
  });
  const handleSubmit = async () => {
    try {
      await api('/api/benchmarks/submit', {
        method: 'POST',
        body: JSON.stringify(scrubbed)
      });
      setSubmitted(true);
      toast.success('Community contribution successful!');
    } catch (e) {
      toast.error('Submission failed');
    }
  };
  if (submitted) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-400">Community Hero!</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-500/80">
              Your anonymized data point helps other Pennsylvanians fight unfair medical bills.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline" className="border-emerald-200">Submit Another</Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-500" />
          Crowdsource Fair Prices
        </CardTitle>
        <CardDescription>Anonymously share your bill totals to build the PA benchmark database.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>CPT Code</Label>
            <Input placeholder="70551" value={formData.cptCode} onChange={e => setFormData({...formData, cptCode: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Billed Amount</Label>
            <Input type="number" placeholder="800" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Patient Zip</Label>
            <Input placeholder="15213" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-dashed">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Privacy Scrubbing Engine
            </h4>
            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setShowScrubbed(!showScrubbed)}>
              {showScrubbed ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
              {showScrubbed ? 'Hide' : 'Preview Sanitized Data'}
            </Button>
          </div>
          <AnimatePresence>
            {showScrubbed && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-2">
                  <div className="bg-white dark:bg-black p-2 rounded border">
                    <span className="text-muted-foreground">CPT:</span> {scrubbed.cptCode || '---'}
                  </div>
                  <div className="bg-white dark:bg-black p-2 rounded border">
                    <span className="text-muted-foreground">ZIP:</span> {scrubbed.zip || '---'}
                  </div>
                  <div className="bg-white dark:bg-black p-2 rounded border">
                    <span className="text-muted-foreground">AMT:</span> ${scrubbed.billedAmount || '0'}
                  </div>
                  <div className="bg-white dark:bg-black p-2 rounded border text-emerald-500">
                    <span className="text-muted-foreground">PII:</span> STRIPPED
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-[10px] text-muted-foreground mt-2">
            We only send the first 3 digits of your zip and round your bill to the nearest dollar. No names, specific dates, or facility addresses are transmitted.
          </p>
        </div>
        <Button onClick={handleSubmit} className="w-full bg-slate-900 hover:bg-black text-white" disabled={!formData.cptCode || !formData.amount}>
          <Send className="w-4 h-4 mr-2" /> Contribute Anonymously
        </Button>
      </CardContent>
    </Card>
  );
}