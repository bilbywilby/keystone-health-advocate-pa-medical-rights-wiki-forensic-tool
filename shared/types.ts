export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
export enum WikiCategory {
  REGULATORY = "Regulatory",
  CLINICAL = "Clinical",
  FINANCIAL = "Financial",
  PROCEDURAL = "Procedural"
}
export interface WikiArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: WikiCategory;
  lastUpdated: string;
  excerpt: string;
}
export interface Provider {
  id: string;
  name: string;
  city: string;
  zip: string;
  transparencyRating: number; // 1-5
  isCompliant: boolean;
  type: 'Hospital' | 'Clinic' | 'Payer';
}
export enum AppealIssue {
  PRIOR_AUTH = "Prior Authorization Denial (Act 146)",
  BALANCE_BILLING = "Surprise Balance Billing (No Surprises Act)",
  INTEREST_RATE = "Illegal Interest Rate (Act 6/SB 371)",
  UNFAIR_PRICING = "Fair Market Value Dispute",
  FINANCIAL_ASSISTANCE = "HB 79 Financial Assistance Denial",
  MEDICAL_DEBT_SHIELD = "SB 371 Medical Debt Violation"
}
export interface AppealTemplate {
  id: string;
  title: string;
  issueType: AppealIssue;
  description: string;
  content: string;
}
export type ConfidenceLevel = 'Low' | 'High';
export interface BenchmarkStats {
  avg: number;
  median: number;
  fmv: number;
  count: number;
  confidence: ConfidenceLevel;
}
export interface PricePoint {
  id: string;
  cptCode: string;
  amount: number;
  zipPrefix: string;
  facilityType: string;
  timestamp: number;
}
export interface ScrubbedSubmission {
  cptCode: string;
  billedAmount: number;
  zip: string;
  facilityType: string;
  isSanitized: boolean;
}
export interface CommunityStats {
  totalAudited: number;
  totalSavingsIdentified: number;
  contributorCount: number;
  legislativePulse: {
    label: string;
    status: 'Active' | 'Pending' | 'Enforced';
    impact: string;
  }[];
}
export interface FPLThresholds {
  householdSize: number;
  incomeLimit: number; // 400% FPL
}
export interface PremiumShockData {
  year2025: number;
  year2026: number;
  income: number;
}
export interface NPIRecord {
  npi: string;
  name: string;
  specialty: string;
  status: string;
}