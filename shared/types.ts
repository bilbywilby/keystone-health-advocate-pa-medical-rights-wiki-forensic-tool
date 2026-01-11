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