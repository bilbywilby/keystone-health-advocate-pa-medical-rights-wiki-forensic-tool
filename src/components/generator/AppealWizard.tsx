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
import { ChevronRight, ChevronLeft, Save, FileText, AlertCircle, ShieldAlert, Printer, ExternalLink, Phone, Volume2, HelpCircle, Database, Zap } from 'lucide-react';
import { addToVault, getRecentCalculation } from '@/lib/db';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
const STEPS = ['Assess Rights', 'Bill Details', 'Statutory Review', 'Legal Preview', 'Escalate to State'];
const PRESETS = [
  { id: 'ACT146', label: 'Act 146 Specialty Mismatch', issue: AppealIssue.CLINICAL_FRAMEWORK },
  { id: 'NSA_ER', label: 'No Surprises Act (ER Visit)', issue: AppealIssue.BALANCE_BILLING },
  { id: 'TIER_EX', label: 'Pharmacy Tier Exception', issue: AppealIssue.PHARMACY_TIER_EXCEPTION }
];
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
  const autofillFromVault = async () => {
    const lastCalc = await getRecentCalculation();
    if (lastCalc && lastCalc.metadata) {
      setFormData(prev => ({
        ...prev,
        providerName: lastCalc.title.includes('Interest') ? 'Lender/Payer' : lastCalc.title,
        details: `Auto-populated from forensic audit: ${lastCalc.content.substring(0, 100)}...`
      }));
      toast.success('Fields pre-filled from your Privacy Vault');
    } else {
      toast.info('No recent forensic audits found in vault');
    }
  };
  const selectPreset = (p: typeof PRESETS[0]) => {
    setFormData(prev => ({ ...prev, issue: p.issue }));
    setStep(1);
  };
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const generateLetter = () => {
    const today = new Date().toLocaleDateString();
    let cite = "PA Act 146";
    if (formData.issue === AppealIssue.BALANCE_BILLING) cite = "Federal No Surprises Act";
    if (formData.issue === AppealIssue.INTEREST_RATE) cite = "PA SB 371 (Louisa Carman Act)";
    if (formData.issue === AppealIssue.PHARMACY_TIER_EXCEPTION) cite = "PA Act 77";
    if (formData.issue === AppealIssue.CLINICAL_FRAMEWORK) cite = "PA Act 146 Section 2116";
    return `
Date: ${today}
To: Consumer Grievance Department, [[PROVIDER_NAME]]
Reference: Account #[[ACCOUNT_NUMBER]]
FORMAL NOTICE OF DISPUTE PURSUANT TO ${cite.toUpperCase()}
Dear Grievance Coordinator,
I am writing to formally dispute the determination dated [[DENIAL_DATE]]. Under Pennsylvania law, I am invoking my specific consumer protection rights regarding ${formData.issue}.
DISPUTE BASIS:
[[DISPUTE_DETAILS]]
LEGAL NOTICE: Under the PA Fair Credit Extension Uniformity Act (FCEUA), this debt is now formally disputed. Pursuant to the ${cite}, I demand a written response within 30 days detailing your compliance with state transparency standards.
Sincerely,
[[PATIENT_NAME]]
    `.trim();
  };
  const saveToArchive = async () => {
    await addToVault({
      type: 'Letter',
      date: new Date().toISOString(),
      title: `Appeal Letter - ${formData.issue}`,
      content: generateLetter(),
      metadata: { formData }
    });
    toast.success('Appeal archived to Privacy Vault');
    setStep(0);
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
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <Card className="shadow-xl border-slate-200 overflow-hidden min-h-[400px]">
            {step === 0 && (
              <CardContent className="pt-12 space-y-8">
                <div className="text-center space-y-2">
                   <h2 className="text-2xl font-black uppercase tracking-tight">Select a Defense Preset</h2>
                   <p className="text-sm text-muted-foreground">Choose a common scenario or use the smart wizard.</p>
                </div>
                <div className="grid gap-3">
                  {PRESETS.map(p => (
                    <Button key={p.id} variant="outline" onClick={() => selectPreset(p)} className="h-16 justify-between text-left px-6 border-2 hover:border-indigo-500">
                      <div>
                        <div className="font-bold">{p.label}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{p.issue}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Button>
                  ))}
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or Smart Wizard</span></div>
                  </div>
                  <Button onClick={() => setStep(1)} className="h-12 bg-slate-900 text-white">Launch Custom Wizard</Button>
                </div>
              </CardContent>
            )}
            {step === 1 && (
              <CardContent className="pt-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg uppercase tracking-tight">Advocacy Data Entry</h3>
                  <Button variant="outline" size="sm" onClick={autofillFromVault} className="text-[10px] font-bold h-8">
                    <Database className="w-3 h-3 mr-2 text-indigo-500" /> Autofill from Vault
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>Full Patient Name</Label><Input value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Provider/Payer Name</Label><Input value={formData.providerName} onChange={e => setFormData({ ...formData, providerName: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>Date of Denial</Label><Input type="date" value={formData.billDate} onChange={e => setFormData({ ...formData, billDate: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Claim/Account Number</Label><Input value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} /></div>
                </div>
                <div className="space-y-2">
                   <Label>Factual Details of Dispute</Label>
                   <Textarea className="min-h-[100px]" value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} />
                </div>
              </CardContent>
            )}
            {step === 3 && (
              <CardContent className="pt-8 space-y-6">
                 <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-600 flex items-center gap-2">
                      <Zap className="w-3 h-3 text-amber-500" /> Gemini-Ready Draft
                    </span>
                    <div className="flex gap-2">
                       <Button variant="ghost" size="sm" onClick={() => window.print()} className="h-8 text-[10px] font-bold"><Printer className="w-3 h-3 mr-1" /> PRINT</Button>
                    </div>
                 </div>
                 <div className="bg-white border-2 border-slate-200 shadow-inner rounded-lg p-10 font-serif text-sm whitespace-pre-wrap leading-relaxed min-h-[400px] overflow-y-auto">
                    {generateLetter()}
                 </div>
              </CardContent>
            )}
            <CardFooter className="flex justify-between border-t bg-slate-50/50 p-6">
              <Button variant="ghost" onClick={prev} disabled={step === 0} className="font-bold">
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              {step < 3 ? (
                <Button onClick={next} className="bg-slate-900 text-white font-black px-8">
                  Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={saveToArchive} className="bg-emerald-600 text-white font-black px-8">
                   Save & Archive <Save className="ml-2 w-4 h-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}