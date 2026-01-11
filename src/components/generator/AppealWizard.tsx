import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AppealIssue } from '@shared/types';
import { ChevronRight, ChevronLeft, Save, FileText, CheckCircle2 } from 'lucide-react';
import { addToVault } from '@/lib/db';
import { toast } from 'sonner';
const STEPS = ['Select Issue', 'Bill Details', 'Review Letter'];
export function AppealWizard() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    issue: AppealIssue.PRIOR_AUTH,
    patientName: '',
    providerName: '',
    billDate: '',
    accountNumber: '',
    details: ''
  });
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const generateLetter = () => {
    const today = new Date().toLocaleDateString();
    let statute = "PA Act 146";
    if (formData.issue === AppealIssue.BALANCE_BILLING) statute = "Federal No Surprises Act";
    if (formData.issue === AppealIssue.INTEREST_RATE) statute = "PA Act 6";
    return `
Date: ${today}
To: Grievance & Appeals Department, ${formData.providerName}
Subject: Formal Dispute - Account #${formData.accountNumber || 'N/A'}
Dear Appeals Coordinator,
I am writing to formally dispute the medical bill/denial received on ${formData.billDate || '[DATE]'} regarding services for ${formData.patientName || '[NAME]'}.
This dispute is based on non-compliance with ${statute}. Specifically:
${formData.details || 'The charges/denial provided do not align with established state transparency and consumer protection standards.'}
Under Pennsylvania law, I request a full review of this file and a written response within 30 days.
Sincerely,
${formData.patientName || '[YOUR NAME]'}
    `.trim();
  };
  const handleSave = async () => {
    await addToVault({
      type: 'Letter',
      date: new Date().toISOString(),
      title: `Appeal: ${formData.issue}`,
      content: generateLetter(),
      metadata: { ...formData }
    });
    toast.success('Appeal letter saved to Privacy Vault');
    setStep(0);
  };
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex justify-between items-center px-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= i ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step >= i ? 'text-slate-900' : 'text-slate-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 sm:w-16 h-px bg-slate-200 mx-2" />}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="shadow-lg border-slate-200">
            {step === 0 && (
              <>
                <CardHeader>
                  <CardTitle>What are you disputing?</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {Object.values(AppealIssue).map((issue) => (
                    <button
                      key={issue}
                      onClick={() => setFormData({ ...formData, issue })}
                      className={`text-left p-4 rounded-lg border-2 transition-all ${formData.issue === issue ? 'border-amber-500 bg-amber-50/30' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                      <div className="font-semibold text-sm">{issue}</div>
                    </button>
                  ))}
                </CardContent>
              </>
            )}
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Bill Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Patient Name</Label>
                      <Input value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Provider/Hospital</Label>
                      <Input value={formData.providerName} onChange={e => setFormData({ ...formData, providerName: e.target.value })} placeholder="UPMC..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Service</Label>
                      <Input type="date" value={formData.billDate} onChange={e => setFormData({ ...formData, billDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Account # (Optional)</Label>
                      <Input value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} placeholder="12345" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Briefly describe the error (denial reason, high rate, etc.)</Label>
                    <Textarea 
                      value={formData.details} 
                      onChange={e => setFormData({ ...formData, details: e.target.value })} 
                      placeholder="e.g. Denied MRI despite doctor referral; Interest rate exceeds 6% cap..."
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </>
            )}
            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" /> Review Generated Letter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 border rounded-lg p-6 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                    {generateLetter()}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground italic">
                    Note: This is an advocacy tool, not legal advice. Review the letter carefully before sending.
                  </p>
                </CardContent>
              </>
            )}
            <CardFooter className="flex justify-between border-t p-6 mt-4">
              <Button variant="ghost" onClick={prev} disabled={step === 0}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              {step === STEPS.length - 1 ? (
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                  <Save className="w-4 h-4 mr-2" /> Save to Vault
                </Button>
              ) : (
                <Button onClick={next} className="bg-amber-500 hover:bg-amber-600 text-white font-bold">
                  Next Step <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}