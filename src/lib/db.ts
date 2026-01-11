import Dexie, { type Table } from 'dexie';
import { DisputeTask, WorkLog, PBMRecord, PolicyAuditRecord } from '@shared/types';
export interface VaultItem {
  id: string;
  type: 'EOB' | 'Letter' | 'Calculation' | 'Record';
  date: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}
export interface BillingRecord {
  id: string;
  provider: string;
  amount: number;
  date: string;
  status: 'pending' | 'disputed' | 'resolved';
  cptCode?: string;
}
export interface AppSetting {
  key: string;
  value: any;
}
export class ValleyDB extends Dexie {
  vault!: Table<VaultItem>;
  billingRecords!: Table<BillingRecord>;
  tasks!: Table<DisputeTask>;
  appSettings!: Table<AppSetting>;
  workLogs!: Table<WorkLog>;
  pbmAudits!: Table<PBMRecord>;
  policyAudits!: Table<PolicyAuditRecord>;
  constructor() {
    super('ValleyDB');
    this.version(4).stores({
      vault: 'id, type, date, title',
      billingRecords: 'id, provider, date, status',
      tasks: 'id, status, dueDate, linkedVaultId',
      appSettings: 'key',
      workLogs: 'id, date, isExempt',
      pbmAudits: 'id, ndc, drugName',
      policyAudits: 'id, planName, timestamp'
    });
  }
}
export const db = new ValleyDB();
export async function getOrCreateSalt(): Promise<string> {
  const existing = await db.appSettings.get('pii_salt');
  if (existing) return existing.value;
  const newSalt = crypto.randomUUID();
  await db.appSettings.put({ key: 'pii_salt', value: newSalt });
  return newSalt;
}
export async function addToVault(item: Omit<VaultItem, 'id'>) {
  const id = crypto.randomUUID();
  await db.vault.add({ ...item, id });
  return id;
}
export async function getVaultItems() {
  return db.vault.orderBy('date').reverse().toArray();
}
export async function deleteVaultItem(id: string) {
  return db.vault.delete(id);
}
export async function getRecentCalculation() {
  const items = await db.vault.where('type').equals('Calculation').toArray();
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null;
}
export async function getTasks() {
  return db.tasks.orderBy('dueDate').toArray();
}
export async function upsertTask(task: DisputeTask) {
  return db.tasks.put(task);
}
export async function deleteTask(id: string) {
  return db.tasks.delete(id);
}
export async function getWorkLogs() {
  return db.workLogs.orderBy('date').toArray();
}
export async function addWorkLog(log: WorkLog) {
  return db.workLogs.put(log);
}
export async function savePolicyAudit(audit: PolicyAuditRecord) {
  return db.policyAudits.put(audit);
}
export async function getPolicyAudits() {
  return db.policyAudits.orderBy('timestamp').reverse().toArray();
}