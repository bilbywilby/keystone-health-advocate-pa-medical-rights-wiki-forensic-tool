import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AppealIssue } from '@shared/types';
import { ChevronRight, ChevronLeft, Save, FileText, AlertCircle, ShieldAlert, Printer } from 'lucide-react';
import { addToVault } from '@/lib/db';
import { toast } from 'sonner';
const STEPS = ['Select Issue', 'Bill Details', 'Statutory Review', 'Legal Preview'];
export function AppealWizard() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
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
  const generateLetter = () => {
    const today = new Date().toLocaleDateString();
    let cite = "PA Act 146";
    let header = "FORMAL NOTICE OF DISPUTE";
    if (formData.issue === AppealIssue.BALANCE_BILLING) cite = "Federal No Surprises Act";
    if (formData.issue === AppealIssue.INTEREST_RATE) cite = "PA SB 371 (Louisa Carman Act)";
    if (formData.issue === AppealIssue.FINANCIAL_ASSISTANCE) cite = "PA HB 79 / SB 752";
    if (formData.issue === AppealIssue.LYME_COVERAGE) cite = "PA Act 6 of 2020";
    const specialtyViolation = (isMismatch && formData.issue === AppealIssue.PRIOR_AUTH)
      ? `\n\nLEGAL NOTICE: Under PA Insurance Company Law Section 991.2116, this denial is procedurally deficient. A physician specializing in ${formData.denyingDoctorSpecialty} may not legally deny services ordered by a specialist in ${formData.orderingDoctorSpecialty}. I demand an immediate reversal or a formal review by a qualified specialty-match physician.` 
      : '';
    const violationHeader = isMismatch ? "URGENT STATUTORY VIOLATION NOTICE\n" : "";
    return `
Date: ${today}
To: Consumer Grievance Department, ${formData.providerName || '[Provider Name]'}
Reference: Account #${formData.accountNumber || 'PENDING'}
${violationHeader}${header} PURSUANT TO ${cite.toUpperCase()}
Dear Grievance Coordinator,
I am writing to formally dispute the determination dated ${formData.billDate || '[DATE]'}. Under Pennsylvania law, I am invoking my specific consumer protection rights regarding ${formData.issue}.
DISPUTE BASIS:
${formData.details || 'The provider has failed to demonstrate compliance with state transparency and clinical review standards.'}${specialtyViolation}
Under the PA Fair Credit Extension Uniformity Act (FCEUA), this debt is now formally disputed. Pursuant to state law, any reporting to credit bureaus during this 30-day resolution window, or failing to mark the item as disputed, constitutes a violation.
I request a written response within 30 days confirming the receipt of this dispute and the initiation of a formal clinical/financial review.
Sincerely,
[Signature]
${formData.patientName || '[Patient Name]'}
    `.trim();
  };
  const handleSave = async () => {
    await addToVault({
      type: 'Letter',
      date: new Date().toISOString(),
      title: `Legal Appeal: ${formData.issue}`,
      content: generateLetter(),
      metadata: { ...formData, isSpecialtyMismatch: isMismatch }
    });
    toast.success('Dispute letter archived in local Vault');
    setStep(0);
  };
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10 flex justify-between items-center px-4">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${step >= i ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
              {i + 1}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest hidden md:block ${step >= i ? 'text-slate-900' : 'text-slate-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-4 md:w-12 h-0.5 transition-colors ${step > i ? 'bg-slate-900' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <Card className="shadow-xl border-slate-200 overflow-hidden">
            {step === 0 && (
              <CardContent className="pt-8 grid gap-4">
                {Object.values(AppealIssue).map((issue) => (
                  <button key={issue} onClick={() => { setFormData({ ...formData, issue }); next(); }} className={`text-left p-5 rounded-xl border-2 transition-all group ${formData.issue === issue ? 'border-amber-500 bg-amber-50/50' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-800">{issue}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
                    </div>
                  </button>
                ))}
              </CardContent>
            )}
            {step === 1 && (
              <CardContent className="pt-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>Full Patient Name</Label><Input value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} placeholder="As on Insurance Card" /></div>
                  <div className="space-y-2"><Label>Provider/Payer Name</Label><Input value={formData.providerName} onChange={e => setFormData({ ...formData, providerName: e.target.value })} placeholder="e.g. UPMC Health Plan" /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2"><Label>Date of Denial</Label><Input type="date" value={formData.billDate} onChange={e => setFormData({ ...formData, billDate: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Claim/Account Number</Label><Input value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} placeholder="Required for identification" /></div>
                </div>
                <div className="space-y-2"><Label>Factual Details of Dispute</Label><Textarea className="min-h-[100px]" value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} placeholder="Explain why the charge or denial is incorrect based on your records..." /></div>
              </CardContent>
            )}
            {step === 2 && (
              <CardContent className="pt-8 space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-900">Act 146 (§991.2116) Enforcement</h4>
                    <p className="text-xs text-amber-700 leading-relaxed mt-1">
                      Denials are often invalid if the reviewing physician's specialty does not match the ordering doctor. Ensure you enter the exact specialties listed on your denial paperwork.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Ordering Doctor Specialty</Label>
                    <Input placeholder="e.g. Cardiology" value={formData.orderingDoctorSpecialty} onChange={e => setFormData({...formData, orderingDoctorSpecialty: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Reviewing Physician Specialty</Label>
                    <Input placeholder="e.g. Internal Medicine" value={formData.denyingDoctorSpecialty} onChange={e => setFormData({...formData, denyingDoctorSpecialty: e.target.value})} />
                  </div>
                </div>
                {isMismatch && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 text-red-700">
                    <ShieldAlert className="w-6 h-6" />
                    <span className="text-sm font-black">STATUTORY VIOLATION DETECTED (§991.2116)</span>
                  </motion.div>
                )}
              </CardContent>
            )}
            {step === 3 && (
              <CardContent className="pt-8 space-y-6">
                 <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border">
                    <div className="flex items-center gap-2">
                       <FileText className="w-5 h-5 text-slate-500" />
                       <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Generated Legal Draft</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => window.print()} className="h-8 text-[10px] font-bold">
                       <Printer className="w-3 h-3 mr-1" /> PRINT TO PDF
                    </Button>
                 </div>
                 <div className="bg-white border-2 border-slate-200 shadow-inner rounded-lg p-10 font-serif text-sm whitespace-pre-wrap leading-relaxed min-h-[400px] max-h-[500px] overflow-y-auto text-slate-900 selection:bg-amber-100">
                    {generateLetter()}
                 </div>
              </CardContent>
            )}
            <CardFooter className="flex justify-between border-t bg-slate-50/50 p-6">
              <Button variant="ghost" onClick={prev} disabled={step === 0} className="font-bold">
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              {step === STEPS.length - 1 ? (
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8">
                  <Save className="w-4 h-4 mr-2" /> Archive to Vault
                </Button>
              ) : (
                <Button onClick={next} className="bg-slate-900 hover:bg-black text-white font-black px-8">
                  Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}