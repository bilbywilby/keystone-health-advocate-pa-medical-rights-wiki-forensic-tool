import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Calendar, Clock, FileText } from 'lucide-react';
import { addWorkLog, getWorkLogs } from '@/lib/db';
import { WorkLog } from '@shared/types';
import { checkMedicaidCompliance } from '@/lib/calculations';
import { toast } from 'sonner';
import { format } from 'date-fns';
export function MedicaidGuard() {
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({ hours: '', activity: '', date: format(new Date(), 'yyyy-MM-dd'), isExempt: false });
  const loadLogs = async () => {
    const data = await getWorkLogs();
    setLogs(data);
    setLoading(false);
  };
  useEffect(() => { loadLogs(); }, []);
  const handleAdd = async () => {
    if (!newEntry.hours && !newEntry.isExempt) return;
    const log: WorkLog = {
      id: crypto.randomUUID(),
      date: newEntry.date,
      hours: Number(newEntry.hours) || 0,
      activity: newEntry.activity || (newEntry.isExempt ? 'Exemption Claim' : 'Work/Training'),
      isExempt: newEntry.isExempt,
      exemptionReason: newEntry.isExempt ? 'Dependent Care (<13)' : undefined
    };
    await addWorkLog(log);
    setNewEntry({ ...newEntry, hours: '', activity: '' });
    loadLogs();
    toast.success('Activity logged to ValleyDB');
  };
  const compliance = checkMedicaidCompliance(logs);
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">2026 MA Compliance</span>
            </div>
            <CardTitle>Work & Engagement Log</CardTitle>
            <CardDescription>Track your 80-hour monthly requirement to prevent Medicaid coverage loss.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-dashed">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-slate-500">Date</Label>
                <Input type="date" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-slate-500">Hours</Label>
                <Input type="number" value={newEntry.hours} onChange={e => setNewEntry({...newEntry, hours: e.target.value})} disabled={newEntry.isExempt} />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-slate-500">Activity</Label>
                  <Input placeholder="e.g. Retail Work" value={newEntry.activity} onChange={e => setNewEntry({...newEntry, activity: e.target.value})} disabled={newEntry.isExempt} />
                </div>
                <Button onClick={handleAdd} className="bg-slate-900 text-white mt-auto">Log</Button>
              </div>
            </div>
            <div className="space-y-3">
              {logs.slice(-5).reverse().map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded text-slate-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{log.activity}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{log.date}</div>
                    </div>
                  </div>
                  <Badge variant={log.isExempt ? 'secondary' : 'default'} className="font-bold">
                    {log.isExempt ? 'EXEMPT' : `${log.hours}h`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none shadow-2xl">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Monthly Pulse</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-6 space-y-4">
              <div className="relative inline-block">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * Math.min(1, compliance.totalHours / 80))}
                    className="text-emerald-500 transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black">{compliance.totalHours}</span>
                  <span className="text-[10px] uppercase text-slate-400 font-bold">of 80h</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-lg font-bold ${compliance.isCompliant ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {compliance.isCompliant ? 'Compliant' : 'Needs Engagement'}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {compliance.isCompliant ? 'Your 2026 MA coverage is protected.' : `Log ${compliance.remaining} more hours to ensure zero gap.`}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs">
                <FileText className="w-3 h-3 mr-2" /> Generate Attestation
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">Exemption Shield</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                Are you caring for a child under 13 or an incapacitated adult? You may be exempt from the 80-hour requirement.
              </p>
              <Button
                variant="outline"
                className={`w-full text-xs font-bold ${newEntry.isExempt ? 'bg-amber-50 border-amber-500 text-amber-700' : ''}`}
                onClick={() => setNewEntry({...newEntry, isExempt: !newEntry.isExempt})}
              >
                {newEntry.isExempt ? 'Exemption Shield Active' : 'Toggle Exemption Shield'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}