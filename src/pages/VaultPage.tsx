import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { getVaultItems, deleteVaultItem, VaultItem, getTasks, upsertTask, deleteTask } from '@/lib/db';
import { DisputeTask } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, FileText, ShieldCheck, Lock, Share2, ArrowRight, CheckCircle2, Clock, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
export function VaultPage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [tasks, setTasks] = useState<DisputeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', dueDate: format(new Date(), 'yyyy-MM-dd') });
  const loadData = async () => {
    const [vItems, vTasks] = await Promise.all([getVaultItems(), getTasks()]);
    setItems(vItems);
    setTasks(vTasks);
    setLoading(false);
  };
  useEffect(() => { loadData(); }, []);
  const handleAddTask = async () => {
    if (!newTask.title) return;
    const task: DisputeTask = {
      id: crypto.randomUUID(),
      title: newTask.title,
      status: 'Pending',
      dueDate: newTask.dueDate
    };
    await upsertTask(task);
    setNewTask({ title: '', dueDate: format(new Date(), 'yyyy-MM-dd') });
    setShowTaskForm(false);
    loadData();
    toast.success('Dispute task added');
  };
  const toggleTaskStatus = async (task: DisputeTask) => {
    const nextStatusMap: Record<string, 'Pending' | 'Sent' | 'Resolved'> = {
      'Pending': 'Sent',
      'Sent': 'Resolved',
      'Resolved': 'Pending'
    };
    await upsertTask({ ...task, status: nextStatusMap[task.status] });
    loadData();
  };
  return (
    <AppLayout>
      <div className="space-y-12">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" /> HIPAA-Safe Local-First Storage
          </div>
          <h1 className="text-5xl font-black tracking-tight">My Advocacy Vault</h1>
          <p className="text-muted-foreground flex items-center gap-2 text-lg">
            <Lock className="w-4 h-4" /> ValleyDB Encryption Active. Zero cloud synchronization.
          </p>
        </header>
        {/* Task Tracker Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" /> Advocacy Roadmap
            </h2>
            <Button size="sm" onClick={() => setShowTaskForm(!showTaskForm)} variant="outline" className="h-8">
              {showTaskForm ? 'Cancel' : <><Plus className="w-3 h-3 mr-1" /> Add Milestone</>}
            </Button>
          </div>
          <AnimatePresence>
            {showTaskForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
                  <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Dispute Task</label>
                      <Input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Mail Certified Letter to UPMC" />
                    </div>
                    <div className="w-full md:w-48 space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Follow-up Date</label>
                      <Input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                    </div>
                    <Button onClick={handleAddTask} className="bg-slate-900 text-white w-full md:w-auto">Add Task</Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="grid gap-3">
            {tasks.length === 0 && !showTaskForm && (
              <p className="text-sm text-muted-foreground italic">No active disputes being tracked.</p>
            )}
            {tasks.map(task => (
              <div key={task.id} className="group flex items-center justify-between p-4 bg-white dark:bg-slate-950 border rounded-xl hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleTaskStatus(task)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'Resolved' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 group-hover:border-indigo-500'}`}>
                    {task.status === 'Resolved' && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <div className={`font-bold text-sm ${task.status === 'Resolved' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Due: {task.dueDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`text-[10px] ${task.status === 'Sent' ? 'bg-blue-50 text-blue-700' : task.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : ''}`}>{task.status}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id).then(loadData)} className="h-8 w-8 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Vault Items Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" /> Forensic Evidence
            </h2>
            <div className="flex items-center gap-2">
               <Badge variant="secondary" className="font-bold">{items.length} Records</Badge>
               <Button variant="ghost" size="icon" className="h-8 w-8"><Filter className="w-4 h-4" /></Button>
            </div>
          </div>
          {items.length === 0 && !loading ? (
            <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-2xl font-bold">Vault Empty</h3>
              <p className="text-muted-foreground mt-2 mb-8">Generate a dispute or calculation to see it here.</p>
              <Button asChild className="bg-amber-500 text-slate-950 font-bold"><Link to="/tools">Open Toolkit</Link></Button>
            </div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <Card className="hover:shadow-lg transition-all border-slate-200 overflow-hidden">
                      <CardHeader className="flex flex-row items-center justify-between py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] font-black uppercase">{item.type}</Badge>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{format(new Date(item.date), 'MMM d, yyyy')}</span>
                          </div>
                          <CardTitle className="text-base font-bold">{item.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={() => deleteVaultItem(item.id).then(loadData)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <pre className="text-[11px] bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border font-mono whitespace-pre-wrap text-slate-600 dark:text-slate-400 leading-relaxed max-h-40 overflow-y-auto selection:bg-indigo-100">
                          {item.content}
                        </pre>
                        <div className="flex justify-end mt-4 gap-2">
                           <Button variant="secondary" size="sm" className="text-[10px] font-bold" onClick={() => { navigator.clipboard.writeText(item.content); toast.success('Copied'); }}>
                             Copy Text
                           </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}