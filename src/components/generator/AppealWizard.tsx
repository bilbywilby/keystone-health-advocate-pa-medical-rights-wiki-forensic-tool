import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AppealIssue } from '@shared/types';
import { getWizardRecommendation } from '@/lib/calculations';
import { ChevronRight, ChevronLeft, Save, FileText, AlertCircle, ShieldAlert, Printer, ExternalLink, Phone, Volume2, HelpCircle } from 'lucide-react';
import { addToVault } from '@/lib/db';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
const STEPS = ['Assess Rights', 'Bill Details', 'Statutory Review', 'Legal Preview', 'Escalate to State'];
export function AppealWizard() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [wizardStep, setWizardStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    issue: AppealIssue.PRIOR_AUTH,
    patientName: '',
    providerName: '',
    billDate: '',
    accountNumber: '',
    details: '',
    denyingDoctorSpecialty: '',
    orderingDoctorSpecialty: '',
    statuteCite: 'PA Act 146'
  });
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && Object.keys(AppealIssue).includes(typeParam)) {
      setFormData(prev => ({ ...prev, issue: AppealIssue[typeParam as keyof typeof AppealIssue] }));
      setStep(1);
    }
  }, [searchParams]);
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const isMismatch = formData.denyingDoctorSpecialty &&
                     formData.orderingDoctorSpecialty &&
                     formData.denyingDoctorSpecialty.toLowerCase().trim() !== formData.orderingDoctorSpecialty.toLowerCase().trim();
  const handleWizardAnswer = (key: string, value: boolean) => {
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);
    // Logic Flow
    if (wizardStep === 0) { // Is Emergency?
      if (value) setWizardStep(1); // Go to OON check
      else setWizardStep(2); // Go to Clinical check
    } else if (wizardStep === 1) { // Is OON?
      finalizeWizard(nextAnswers);
    } else if (wizardStep === 2) { // Is Specialty Mismatch?
      if (value) finalizeWizard(nextAnswers);
      else setWizardStep(3); // Go to Financial check
    } else {
      finalizeWizard(nextAnswers);
    }
  };
  const finalizeWizard = (finalAnswers: Record<string, boolean>) => {
    const issueKey = getWizardRecommendation(finalAnswers);
    setFormData(prev => ({ ...prev, issue: AppealIssue[issueKey as keyof typeof AppealIssue] }));
    next();
  };
  const readAloud = () => {
    const text = generateLetter();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    toast.info("Reading Appeal Draft...");
  };
  const generateLetter = () => {
    const today = new Date().toLocaleDateString();
    let cite = "PA Act 146";
    let header = "FORMAL NOTICE OF DISPUTE";
    if (formData.issue === AppealIssue.BALANCE_BILLING) cite = "Federal No Surprises Act";
    if (formData.issue === AppealIssue.INTEREST_RATE) cite = "PA SB 371 (Louisa Carman Act)";
    if (formData.issue === AppealIssue.FINANCIAL_ASSISTANCE) cite = "PA HB 79 / SB 752";
    if (formData.issue === AppealIssue.PBM_OVERCHARGE) cite = "PA Act 77";
    const specialtyViolation = (isMismatch && formData.issue === AppealIssue.PRIOR_AUTH)
      ? `\n\nLEGAL NOTICE: Under PA Insurance Company Law Section 991.2116, this denial is procedurally deficient. A physician specializing in ${formData.denyingDoctorSpecialty} may not legally deny services ordered by a specialist in ${formData.orderingDoctorSpecialty}. I demand an immediate reversal or a formal review by a qualified specialty-match physician.`
      : '';
    return `
Date: ${today}
To: Consumer Grievance Department, ${formData.providerName || '[Provider Name]'}
Reference: Account #${formData.accountNumber || 'PENDING'}
FORMAL NOTICE OF DISPUTE PURSUANT TO ${cite.toUpperCase()}
Dear Grievance Coordinator,
I am writing to formally dispute the determination dated ${formData.billDate || '[DATE]'}. Under Pennsylvania law, I am invoking my specific consumer protection rights regarding ${formData.issue}.
DISPUTE BASIS:
${formData.details || 'The provider has failed to demonstrate compliance with state transparency and clinical review standards.'}${specialtyViolation}
Under the PA Fair Credit Extension Uniformity Act (FCEUA), this debt is now formally disputed. I request a written response within 30 days.
Sincerely,
${formData.patientName || '[Patient Name]'}
    `.trim();
  };
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10 flex justify-between items-center px-4 overflow-x-auto gap-4">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-shrink-0">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all", step >= i ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400')}>
              {i + 1}
            </div>
            <span className={cn("text-[9px] font-bold uppercase tracking-widest hidden lg:block", step >= i ? 'text-slate-900' : 'text-slate-400')}>{s}</span>
            {i < STEPS.length - 1 && <div className={cn("w-2 h-0.5 transition-colors", step > i ? 'bg-slate-900' : 'bg-slate-200')} />}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <Card className="shadow-xl border-slate-200 overflow-hidden min-h-[400px]">
            {step === 0 && (
              <CardContent className="pt-12 space-y-8 text-center">
                <div className="space-y-2">
                   <h2 className="text-2xl font-black uppercase tracking-tight">Let's find your protection</h2>
                   <p className="text-sm text-muted-foreground">Answer a few simple questions to determine the correct PA statute.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <AnimatePresence mode="wait">
                    {wizardStep === 0 && (
                      <motion.div key="q0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <p className="text-lg font-bold">Is this for an Emergency Service?</p>
                        <div className="flex justify-center gap-4">
                          <Button onClick={() => handleWizardAnswer('isEmergency', true)} className="w-32 bg-slate-900">Yes</Button>
                          <Button onClick={() => handleWizardAnswer('isEmergency', false)} variant="outline" className="w-32">No</Button>
                        </div>
                      </motion.div>
                    )}
                    {wizardStep === 1 && (
                      <motion.div key="q1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <p className="text-lg font-bold">Was the facility Out-of-Network?</p>
                        <div className="flex justify-center gap-4">
                          <Button onClick={() => handleWizardAnswer('isOutOfNetwork', true)} className="w-32 bg-slate-900">Yes</Button>
                          <Button onClick={() => handleWizardAnswer('isOutOfNetwork', false)} variant="outline" className="w-32">No</Button>
                        </div>
                      </motion.div>
                    )}
                    {wizardStep === 2 && (
                      <motion.div key="q2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <p className="text-lg font-bold">Did a GP deny a specialist's request?</p>
                        <div className="flex justify-center gap-4">
                          <Button onClick={() => handleWizardAnswer('isSpecialtyMismatch', true)} className="w-32 bg-slate-900">Yes</Button>
                          <Button onClick={() => handleWizardAnswer('isSpecialtyMismatch', false)} variant="outline" className="w-32">No</Button>
                        </div>
                      </motion.div>
                    )}
                    {wizardStep === 3 && (
                      <motion.div key="q3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <p className="text-lg font-bold">Is this related to a PBM or Pharmacy?</p>
                        <div className="flex justify-center gap-4">
                          <Button onClick={() => handleWizardAnswer('isPharmacyOvercharge', true)} className="w-32 bg-slate-900">Yes</Button>
                          <Button onClick={() => handleWizardAnswer('isPharmacyOvercharge', false)} variant="outline" className="w-32">No</Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            )}
            {step === 1 && (
              <CardContent className="pt-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1"><Label>Full Patient Name</Label></div>
                    <Input value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} />
                  </div>
                  <div className="space-y-2"><Label>Provider/Payer Name</Label><Input value={formData.providerName} onChange={e => setFormData({ ...formData, providerName: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>Date of Denial</Label><Input type="date" value={formData.billDate} onChange={e => setFormData({ ...formData, billDate: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Claim/Account Number</Label><Input value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} /></div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <Label>Factual Details of Dispute</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild><HelpCircle className="w-3 h-3 text-slate-400" /></TooltipTrigger>
                          <TooltipContent className="max-w-xs text-[10px] leading-tight">Be specific about why you believe the bill is incorrect or the denial unfair based on your doctor's orders.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                   </div>
                   <Textarea className="min-h-[100px]" value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} />
                </div>
              </CardContent>
            )}
            {step === 3 && (
              <CardContent className="pt-8 space-y-6">
                 <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Generated Legal Draft</span>
                    <div className="flex gap-2">
                       <Button variant="ghost" size="sm" onClick={readAloud} className="h-8 text-[10px] font-bold"><Volume2 className="w-3 h-3 mr-1" /> READ</Button>
                       <Button variant="ghost" size="sm" onClick={() => window.print()} className="h-8 text-[10px] font-bold"><Printer className="w-3 h-3 mr-1" /> PRINT</Button>
                    </div>
                 </div>
                 <div className="bg-white border-2 border-slate-200 shadow-inner rounded-lg p-10 font-serif text-sm whitespace-pre-wrap leading-relaxed min-h-[400px] overflow-y-auto" aria-live="polite">
                    {generateLetter()}
                 </div>
              </CardContent>
            )}
            <CardFooter className="flex justify-between border-t bg-slate-50/50 p-6">
              <Button variant="ghost" onClick={prev} disabled={step === 0} className="font-bold">
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              {step < 3 ? (
                <Button onClick={next} className="bg-slate-900 text-white font-black px-8" disabled={step === 0}>
                  Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={() => setStep(0)} className="bg-emerald-600 text-white font-black px-8">
                   Done & Archive
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}