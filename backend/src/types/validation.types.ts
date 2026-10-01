export type ValidationStatus = 'VERIFIED' | 'REVIEW_REQUIRED';
export type CheckStatus = 'MATCH' | 'MISMATCH' | 'MISSING' | 'NOT_APPLICABLE';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ValidationCheck {
  field: string;
  status: CheckStatus;
  expectedValue?: any;
  actualValue?: any;
  difference?: any;
  severity?: Severity;
  message: string;
}

export interface Discrepancy {
  field: string;
  status: CheckStatus;
  expectedValue: any;
  actualValue: any;
  difference?: any;
  severity: Severity;
  message: string;
}

export interface ValidationResult {
  overallStatus: ValidationStatus;
  overallSeverity: Severity | 'NONE';
  checks: ValidationCheck[];
  discrepancies: Discrepancy[];
  summary: string;
}
