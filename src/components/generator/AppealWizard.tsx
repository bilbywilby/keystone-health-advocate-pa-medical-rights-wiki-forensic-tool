import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AppealIssue } from '@shared/types';
import { ChevronRight, ChevronLeft, Save, FileText, Stethoscope, AlertCircle, ShieldAlert } from 'lucide-react';
import { addToVault } from '@/lib/db';
import { toast } from 'sonner';
const STEPS = ['Select Issue', 'Bill Details', 'Specialty Match', 'Review Letter'];
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
    denyingDoctorNPI: '',
    denyingDoctorSpecialty: '',
    orderingDoctorSpecialty: ''
  });
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && Object.keys(AppealIssue).includes(typeParam)) {
      setFormData(prev => ({ ...prev, issue: AppealIssue[typeParam as keyof typeof AppealIssue] }));
      setStep(1); // Auto-advance to details if type is pre-selected
    }
  }, [searchParams]);
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const isMismatch = formData.denyingDoctorSpecialty &&
                     formData.orderingDoctorSpecialty &&
                     formData.denyingDoctorSpecialty.toLowerCase().trim() !== formData.orderingDoctorSpecialty.toLowerCase().trim();
  const generateLetter = () => {
    const today = new Date().toLocaleDateString();
    let statute = "PA Act 146";
    if (formData.issue === AppealIssue.BALANCE_BILLING) statute = "Federal No Surprises Act";
    if (formData.issue === AppealIssue.INTEREST_RATE) statute = "PA SB 371 / Act 6";
    if (formData.issue === AppealIssue.FINANCIAL_ASSISTANCE) statute = "PA HB 79";
    const mismatchCite = isMismatch ? `\n\nCRITICAL VIOLATION: Under PA Act 146, Section 2116, medical denials must be reviewed by a physician in the same or similar specialty as the requesting provider. The denying physician (${formData.denyingDoctorSpecialty}) does not match the ordering specialist (${formData.orderingDoctorSpecialty}). This denial is procedurally invalid.` : '';
    return `
Date: ${today}
To: Grievance & Appeals Department, ${formData.providerName}
Subject: Formal Dispute - Account #${formData.accountNumber || 'N/A'}
Dear Appeals Coordinator,
I am writing to formally dispute the medical bill/denial received on ${formData.billDate || '[DATE]'} regarding services for ${formData.patientName || '[NAME]'}.
This dispute is based on non-compliance with ${statute}.${mismatchCite}
Further details:
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
      metadata: { ...formData, isSpecialtyMismatch: isMismatch }
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
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <Card className="shadow-lg border-slate-200">
            {step === 0 && (
              <CardContent className="pt-6 grid gap-3">
                {Object.values(AppealIssue).map((issue) => (
                  <button key={issue} onClick={() => { setFormData({ ...formData, issue }); next(); }} className={`text-left p-4 rounded-lg border-2 transition-all ${formData.issue === issue ? 'border-amber-500 bg-amber-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
                    <div className="font-semibold text-sm">{issue}</div>
                  </button>
                ))}
              </CardContent>
            )}
            {step === 1 && (
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Patient Name</Label><Input value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Hospital/Payer</Label><Input value={formData.providerName} onChange={e => setFormData({ ...formData, providerName: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Date of Denial</Label><Input type="date" value={formData.billDate} onChange={e => setFormData({ ...formData, billDate: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Account #</Label><Input value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Why is this unfair?</Label><Textarea value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} /></div>
              </CardContent>
            )}
            {step === 2 && (
              <CardContent className="pt-6 space-y-6">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3">
                  <Stethoscope className="w-5 h-5 text-indigo-500" />
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    <strong>Act 146 Enforcement:</strong> Denials must be reviewed by a peer in the same specialty. GP's cannot deny Orthopedic requests. Check your denial letter for the "Reviewing Physician" details.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Ordering Doctor Specialty</Label><Input placeholder="e.g. Orthopedic Surgery" value={formData.orderingDoctorSpecialty} onChange={e => setFormData({...formData, orderingDoctorSpecialty: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Denying Doctor Specialty (on letter)</Label><Input placeholder="e.g. General Practice" value={formData.denyingDoctorSpecialty} onChange={e => setFormData({...formData, denyingDoctorSpecialty: e.target.value})} /></div>
                </div>
                {isMismatch && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                    <ShieldAlert className="w-5 h-5" />
                    <span className="text-sm font-bold">Act 146 Mismatch Detected! Citing Section 2116.</span>
                  </div>
                )}
              </CardContent>
            )}
            {step === 3 && (
              <CardContent className="pt-6 space-y-4">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Legal Strength</span>
                    <Badge className={isMismatch ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}>
                      {isMismatch ? 'High: Procedural Violation' : 'Medium: Standards Audit'}
                    </Badge>
                 </div>
                 <div className="bg-slate-50 border rounded-lg p-6 font-mono text-[10px] whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto dark:bg-slate-900">
                    {generateLetter()}
                 </div>
              </CardContent>
            )}
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="ghost" onClick={prev} disabled={step === 0}>Back</Button>
              {step === STEPS.length - 1 ? (
                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">Save to Vault</Button>
              ) : (
                <Button onClick={next} className="bg-amber-500 hover:bg-amber-600 text-white">Next Step</Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}