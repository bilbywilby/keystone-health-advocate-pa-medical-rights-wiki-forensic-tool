import { ScrubbedSubmission, ScrubbedEOB } from "@shared/types";
import { getOrCreateSalt } from "./db";
/**
 * Generates a SHA-256 hash for PII strings using a local salt.
 */
async function hashPII(data: string): Promise<string> {
  const salt = await getOrCreateSalt();
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
/**
 * Sanitizes sensitive medical billing data for community crowdsourcing.
 */
export function scrubPriceData(raw: {
  cptCode: string;
  billedAmount: number;
  zip: string;
  facilityType?: string;
}): ScrubbedSubmission {
  const cleanCpt = raw.cptCode.trim().substring(0, 5);
  const cleanZip = raw.zip.trim().substring(0, 3);
  const cleanAmount = Math.round(raw.billedAmount);
  return {
    cptCode: cleanCpt,
    billedAmount: cleanAmount,
    zip: cleanZip,
    facilityType: raw.facilityType || 'Unknown',
    isSanitized: true
  };
}
/**
 * Advanced EOB scrubbing that hashes names/SSNs and strips visit dates.
 */
export async function scrubEOB(raw: {
  patientName: string;
  patientSSN?: string;
  payerName: string;
  visitDate: string;
  cptCode: string;
  billedAmount: number;
  zip: string;
  npi?: string;
}): Promise<ScrubbedEOB> {
  const piiString = `${raw.patientName}-${raw.patientSSN || '0000'}`;
  const hashedPII = await hashPII(piiString);
  const base = scrubPriceData({
    cptCode: raw.cptCode,
    billedAmount: raw.billedAmount,
    zip: raw.zip
  });
  const visitYear = new Date(raw.visitDate).getFullYear();
  return {
    ...base,
    hashedPII,
    payerName: raw.payerName,
    serviceYear: isNaN(visitYear) ? new Date().getFullYear() : visitYear,
    npi: raw.npi
  };
}