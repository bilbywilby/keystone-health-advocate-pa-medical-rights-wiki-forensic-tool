import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { getVaultItems, deleteVaultItem, VaultItem } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, Download, ShieldCheck, Lock, Share2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
export function VaultPage() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    const data = await getVaultItems();
    setItems(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const handleDelete = async (id: string) => {
    await deleteVaultItem(id);
    toast.success('Record deleted');
    load();
  };
  return (
    <AppLayout>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" /> HIPAA-Safe Local-First
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">My Privacy Vault</h1>
            <p className="text-muted-foreground flex items-center gap-2 text-lg">
              <Lock className="w-4 h-4" /> Locally stored advocacy records. Zero cloud synchronization.
            </p>
          </div>
        </header>
        {items.length === 0 && !loading ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 border-2 border-dashed rounded-3xl bg-slate-50 dark:bg-slate-900/50">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold">Your Vault is Empty</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2 mb-8">
              Audit your first bill or generate an appeal letter to populate your secure local storage.
            </p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
              <Link to="/tools">Go to Forensic Toolkit <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="hover:shadow-md transition-all group border-slate-200 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between py-5 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest">{item.type}</Badge>
                          <span className="text-xs text-muted-foreground">{format(new Date(item.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.type === 'Calculation' && (
                          <Button variant="outline" size="sm" className="hidden sm:flex" asChild>
                            <Link to="/tools"><Share2 className="w-3 h-3 mr-1" /> Contribute</Link>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="relative group">
                        <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border font-mono whitespace-pre-wrap text-muted-foreground leading-relaxed max-h-48 overflow-y-auto">
                          {item.content}
                        </pre>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="secondary" size="sm" onClick={() => {
                            navigator.clipboard.writeText(item.content);
                            toast.success('Copied to clipboard');
                          }}>
                            Copy Content
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
}