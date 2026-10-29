export type RiskLevel = 'CRITICAL_RISK' | 'HIGH_RISK' | 'LOW_RISK' | 'NO_RISK';

export type RealTimeInputMode = 'custom-form' | 'live-url' | 'chat-forward' | 'document-upload';

export interface LiveUrlFetchResult {
  url: string;
  domain: string;
  title: string;
  extractedText: string;
  isSecure: boolean;
  error?: string;
}

export type PhraseCategory = 
  | 'PAYMENT_DEMAND'
  | 'UNREALISTIC_COMPENSATION'
  | 'VAGUE_REQUIREMENTS'
  | 'UNOFFICIAL_COMMUNICATION'
  | 'PRESSURE_TACTICS'
  | 'WORK_EXPLOITATION'
  | 'DOMAIN_MISMATCH'
  | 'IDENTITY_HARVESTING';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface SuspiciousPhrase {
  phrase: string;
  category: PhraseCategory;
  severity: Severity;
  explanation: string;
}

export interface CompanyVerificationCheck {
  item: string;
  status: 'PASSED' | 'FAILED' | 'WARNING' | 'UNKNOWN';
  details: string;
  recommendation?: string;
}

export interface StipendAssessment {
  claimedStipend: string;
  assessmentVerdict: 'UNREALISTICALLY_HIGH' | 'EXPLOITATIVE_UNPAID' | 'FEE_DISGUISED' | 'FAIR_MARKET' | 'SUSPICIOUS_COMMISSION';
  explanation: string;
  marketRangeEstimate: string;
}

export interface PaymentRequestDetection {
  hasPaymentRequest: boolean;
  detectedCharges: Array<{
    type: string; // e.g. "Security Deposit", "Registration Fee", "Laptop Kit Fee", "Training Certification"
    amountClaimed?: string;
    details: string;
  }>;
  legalNotice: string;
}

export interface JobAnalysisResult {
  riskScore: number; // 0 - 100 (100 = dangerous scam)
  riskLevel: RiskLevel;
  verdictSummary: string;
  detailedAnalysis: string;
  suspiciousPhrases: SuspiciousPhrase[];
  companyVerification: CompanyVerificationCheck[];
  stipendAssessment: StipendAssessment;
  paymentRequests: PaymentRequestDetection;
  recruiterChannelSafety: {
    channelType: string; // "Telegram", "WhatsApp", "Personal Webmail", "Corporate Domain", "ATS Portal"
    safetyScore: number; // 0-100
    details: string;
  };
  studentActionChecklist: string[];
  safeInterviewQuestions: string[];
}

export interface JobInputData {
  jobTitle: string;
  companyName: string;
  companyDomain: string;
  stipend: string;
  location: string;
  requirements: string;
  contactInfo: string;
  jobDescription: string;
}

// ========================
// CERTIFICATE DETECTOR TYPES
// ========================

export type CertificateVerdict = 
  | 'FABRICATED_FORGERY'
  | 'HIGH_SUSPICION_TEMPLATE'
  | 'UNVERIFIED_DISCREPANCIES'
  | 'LIKELY_GENUINE';

export interface CertificateAnomaly {
  anomalyType: 'VISUAL_LAYOUT' | 'SIGNATORY_FORGERY' | 'DATE_PARADOX' | 'CREDENTIAL_ID_INVALID' | 'PHANTOM_ORGANIZATION' | 'TEMPLATE_WATERMARK';
  severity: Severity;
  title: string;
  description: string;
  locationOnDoc?: string;
}

export interface CertificateAnalysisResult {
  authenticityScore: number; // 0-100 (100 = completely genuine)
  fraudProbability: number; // 0-100
  verdict: CertificateVerdict;
  verdictSummary: string;
  anomaliesDetected: CertificateAnomaly[];
  credentialIdAudit: {
    status: 'VALID_PATTERN' | 'SUSPICIOUS_SEQUENTIAL' | 'DUMMY_STRING' | 'MISSING_VERIFICATION';
    explanation: string;
    verificationUrlCheck: string;
  };
  dateAnalysis: {
    status: 'LOGICAL' | 'SUSPICIOUS' | 'CHRONOLOGY_PARADOX';
    explanation: string;
    durationClaimed: string;
  };
  signatoryAssessment: {
    signatoryName: string;
    signatoryTitle: string;
    verdict: string;
  };
  forensicBreakdown: {
    typographyConsistency: number; // 0-100
    logoAndStampIntegrity: number; // 0-100
    companyAuthenticity: number; // 0-100
    metadataMatch: number; // 0-100
  };
  recommendation: string;
}

export interface CertificateInputData {
  candidateName: string;
  companyName: string;
  certificateId: string;
  verificationUrl?: string;
  issueDate?: string;
  duration?: string;
  trackDomain?: string;
  signatoryName?: string;
  certificateText?: string;
  imageBase64?: string;
}

// ========================
// HR VERIFICATION TYPES
// ========================

export type HrMatchStatus = 
  | 'CONFIRMED_AUTHENTIC'
  | 'DEPARTMENT_MISMATCH'
  | 'DATE_ALTERATION'
  | 'UNAUTHORIZED_FORGERY'
  | 'NO_RECORD_FOUND';

export interface HrRosterRecord {
  id: string;
  certificateId: string;
  candidateName: string;
  department: string;
  role: string;
  startDate: string;
  endDate: string;
  mentorOrManager: string;
  status: 'ACTIVE_INTERN' | 'COMPLETED' | 'TERMINATED' | 'OFFER_REVOKED';
  verifiedIssueDate: string;
}

export interface HrVerificationResult {
  matchStatus: HrMatchStatus;
  confidenceScore: number;
  candidateName: string;
  claimedCompany: string;
  auditNotes: string[];
  rosterMatch?: HrRosterRecord;
  suggestedAction: 'APPROVE_RECORD' | 'REQUEST_ORIGINAL_CONTRACT' | 'ISSUE_DISCREPANCY_NOTICE' | 'REPORT_TO_LINKEDIN';
  generatedNoticeLetter?: string;
  generatedLinkedInReport?: string;
}

export interface ScamMillRecord {
  id: string;
  name: string;
  aliases: string[];
  scamPattern: string;
  typicalFeeCharged: string;
  reportedDomains: string[];
  telegramHandles: string[];
  dateReported: string;
  victimCountReported: number;
  warningNotice: string;
}
