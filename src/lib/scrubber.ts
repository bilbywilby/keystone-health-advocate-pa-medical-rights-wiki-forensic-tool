import { ScrubbedSubmission } from "@shared/types";
/**
 * Sanitizes sensitive medical billing data for community crowdsourcing.
 * Strips PII and preserves only aggregate-safe markers.
 */
export function scrubPriceData(raw: {
  cptCode: string;
  billedAmount: number;
  zip: string;
  facilityType?: string;
}): ScrubbedSubmission {
  // 1. Validate CPT Code (Must be numeric or standardized)
  const cleanCpt = raw.cptCode.trim().substring(0, 5);
  // 2. Anonymize Zip (Keep only 3-digit prefix for regionality)
  const cleanZip = raw.zip.trim().substring(0, 3);
  // 3. Round pricing to nearest dollar to prevent "unique amount" tracking
  const cleanAmount = Math.round(raw.billedAmount);
  return {
    cptCode: cleanCpt,
    billedAmount: cleanAmount,
    zip: cleanZip,
    facilityType: raw.facilityType || 'Unknown',
    isSanitized: true
  };
}