import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowLeft, Phone, AlertCircle, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
export function EmergencyPage() {
  const copyLegalSnippet = () => {
    const text = "I am invoking my rights under the Federal No Surprises Act and PA Act 146. I request that all emergency services be billed at my in-network cost-sharing rates. I am not signing any out-of-network balance billing waivers.";
    navigator.clipboard.writeText(text);
    toast.success('Legal snippet copied to clipboard');
  };
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-10">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Safety</Link>
          </Button>
        </div>
        <section className="bg-red-600 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertCircle className="w-48 h-48" />
          </div>
          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Emergency Rights</h1>
            <p className="text-red-100 text-lg font-medium">Read this if you are currently at a hospital in Pennsylvania.</p>
          </div>
        </section>
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-500" /> Your Immediate Protections
          </h2>
          <div className="grid gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
              <h3 className="font-bold">The No Surprises Act</h3>
              <p className="text-sm text-muted-foreground">You cannot be balance-billed for emergency care, even at an out-of-network hospital. You only pay your in-network deductible/copay.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
              <h3 className="font-bold">EMTALA Rights</h3>
              <p className="text-sm text-muted-foreground">Hospitals MUST stabilize you regardless of your ability to pay or insurance status. They cannot turn you away in a crisis.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-red-500">
              <h3 className="font-bold text-red-600">WARNING: Do Not Sign!</h3>
              <p className="text-sm text-muted-foreground">If a hospital asks you to sign a "Surprise Billing Protection Waiver" or "Consent to Out-of-Network Billing" in the ER, you have the right to REFUSE.</p>
            </div>
          </div>
        </section>
        <section className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Copy className="w-4 h-4 text-amber-500" /> Show the Administrator
          </h3>
          <p className="text-sm text-slate-400">
            If you are being pressured regarding billing, copy and show this text to the hospital billing advocate or ombudsman:
          </p>
          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 italic text-sm">
            "I am invoking my rights under the Federal No Surprises Act and PA Act 146. I request that all emergency services be billed at my in-network cost-sharing rates. I am not signing any out-of-network balance billing waivers."
          </div>
          <Button onClick={copyLegalSnippet} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
            Copy Legal Snippet
          </Button>
        </section>
        <section className="space-y-4 pt-10 border-t">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Immediate Help</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline" className="flex-1">
              <a href="tel:1-877-881-6388">
                <Phone className="w-4 h-4 mr-2" /> PA Insurance Dept
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a href="https://www.cms.gov/nosurprises/consumers/complaints" target="_blank" rel="noreferrer">
                File Federal Complaint
              </a>
            </Button>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}