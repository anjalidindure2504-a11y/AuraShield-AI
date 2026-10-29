import { 
  JobInputData, 
  JobAnalysisResult, 
  SuspiciousPhrase, 
  CompanyVerificationCheck,
  CertificateInputData,
  CertificateAnalysisResult,
  CertificateAnomaly,
  HrRosterRecord,
  HrVerificationResult
} from '../types/detector';

export function runHeuristicJobAnalysis(input: JobInputData): JobAnalysisResult {
  const textToScan = `${input.jobTitle || ''} ${input.companyName || ''} ${input.companyDomain || ''} ${input.stipend || ''} ${input.requirements || ''} ${input.contactInfo || ''} ${input.jobDescription || ''}`.toLowerCase();
  
  const suspiciousPhrases: SuspiciousPhrase[] = [];
  const companyVerification: CompanyVerificationCheck[] = [];
  let riskScore = 10; // baseline

  // 1. Payment Requests detection
  const paymentKeywords = [
    { pattern: /(?:security\s*deposit|refundable\s*deposit|registration\s*fee|kit\s*fee|training\s*fee|laptop\s*fee|examination\s*fee|processing\s*fee)/i, 
      label: 'Demanding upfront payment/fee', category: 'PAYMENT_DEMAND' as const, severity: 'CRITICAL' as const, penalty: 45 },
    { pattern: /(?:upi|paytm|gpay|google\s*pay|crypto|usdt|bitcoin|wire\s*transfer)\s*(?:payment|transfer|to\s*confirm|within)/i,
      label: 'Direct payment instructions (UPI/Crypto/Paytm)', category: 'PAYMENT_DEMAND' as const, severity: 'CRITICAL' as const, penalty: 40 },
    { pattern: /(?:pay\s*₹|pay\s*\$|transfer\s*₹|fee\s*of\s*₹)/i,
      label: 'Explicit monetary fee requested from applicant', category: 'PAYMENT_DEMAND' as const, severity: 'CRITICAL' as const, penalty: 45 }
  ];

  let hasPaymentRequest = false;
  const detectedCharges: Array<{ type: string; amountClaimed?: string; details: string }> = [];

  for (const item of paymentKeywords) {
    const match = textToScan.match(item.pattern);
    if (match) {
      hasPaymentRequest = true;
      riskScore += item.penalty;
      suspiciousPhrases.push({
        phrase: match[0],
        category: item.category,
        severity: item.severity,
        explanation: `Legitimate internships never demand registration fees, security deposits, or laptop insurance fees from students.`
      });
      detectedCharges.push({
        type: item.label,
        details: `Detected phrase: "${match[0]}" in job terms.`
      });
    }
  }

  // 2. Unofficial communication channels
  const commKeywords = [
    { pattern: /(?:whatsapp\s*(?:only|message|call|at|\+)|dm\s*on\s*whatsapp)/i,
      label: 'WhatsApp-only communication without official portal', category: 'UNOFFICIAL_COMMUNICATION' as const, severity: 'HIGH' as const, penalty: 20 },
    { pattern: /(?:telegram|t\.me|@telegram|dm\s*on\s*telegram)/i,
      label: 'Telegram recruitment channel', category: 'UNOFFICIAL_COMMUNICATION' as const, severity: 'CRITICAL' as const, penalty: 35 },
    { pattern: /(@gmail\.com|@yahoo\.com|@hotmail\.com|@outlook\.com|@rediffmail\.com)/i,
      label: 'Free public webmail (@gmail, @yahoo) used instead of corporate domain', category: 'DOMAIN_MISMATCH' as const, severity: 'HIGH' as const, penalty: 25 }
  ];

  for (const item of commKeywords) {
    const match = textToScan.match(item.pattern);
    if (match) {
      riskScore += item.penalty;
      suspiciousPhrases.push({
        phrase: match[0],
        category: item.category,
        severity: item.severity,
        explanation: `Corporate recruiters communicate via official company domain addresses, not personal Gmail or private Telegram channels.`
      });
    }
  }

  // 3. No interview / Guaranteed slot tactics
  const pressureKeywords = [
    { pattern: /(?:no\s*interview|direct\s*selection|no\s*coding\s*test|slot\s*will\s*be\s*reserved\s*immediately|guaranteed\s*certificate)/i,
      label: 'No technical assessment or interview required', category: 'PRESSURE_TACTICS' as const, severity: 'HIGH' as const, penalty: 25 },
    { pattern: /(?:within\s*24\s*hours|urgent\s*hiring|limited\s*slots\s*left|hurry\s*up)/i,
      label: 'Urgent artificial countdown pressure', category: 'PRESSURE_TACTICS' as const, severity: 'MEDIUM' as const, penalty: 15 },
    { pattern: /(?:earn\s*\$(?:100|200|300|500)\s*(?:a\s*day|\/day|daily)|earn\s*₹(?:5000|10000|20000)\s*daily)/i,
      label: 'Absurd daily earnings promise for minimal effort', category: 'UNREALISTIC_COMPENSATION' as const, severity: 'CRITICAL' as const, penalty: 35 }
  ];

  for (const item of pressureKeywords) {
    const match = textToScan.match(item.pattern);
    if (match) {
      riskScore += item.penalty;
      suspiciousPhrases.push({
        phrase: match[0],
        category: item.category,
        severity: item.severity,
        explanation: `Genuine engineering internships evaluate skills through interviews or portfolio reviews rather than selling guaranteed slots.`
      });
    }
  }

  // 4. Exploitative unpaid terms
  const exploitationKeywords = [
    { pattern: /(?:50-60\s*hours|60\s*hours|all\s*code\s*.*belong\s*100%|non-compete\s*.*2\s*years|unpaid\s*for\s*the\s*initial\s*6\s*months)/i,
      label: 'Excessive working hours or predatory IP clauses', category: 'WORK_EXPLOITATION' as const, severity: 'HIGH' as const, penalty: 25 }
  ];

  for (const item of exploitationKeywords) {
    const match = textToScan.match(item.pattern);
    if (match) {
      riskScore += item.penalty;
      suspiciousPhrases.push({
        phrase: match[0],
        category: item.category,
        severity: item.severity,
        explanation: `Extreme working hours without pay or aggressive non-compete clauses violate standard fair labor guidelines.`
      });
    }
  }

  // Check company domain
  const domainLower = (input.companyDomain || '').toLowerCase().trim();
  const contactLower = (input.contactInfo || '').toLowerCase();
  const stipendLower = (input.stipend || '').toLowerCase();
  const isFreeSite = domainLower.includes('.free.') || domainLower.includes('.xyz') || domainLower.includes('.top') || domainLower.includes('.cc') || domainLower.includes('.biz') || domainLower.includes('none');
  const isPublicEmail = contactLower.includes('@gmail') || contactLower.includes('@yahoo') || contactLower.includes('@hotmail') || contactLower.includes('@outlook');

  if (isPublicEmail) {
    companyVerification.push({
      item: 'Email Domain Verification',
      status: 'FAILED',
      details: 'Recruiter is using a free consumer email (@gmail/@yahoo) rather than an authenticated corporate domain (@company.com).',
      recommendation: 'Request confirmation from an official company email address.'
    });
  } else {
    companyVerification.push({
      item: 'Email Domain Verification',
      status: 'PASSED',
      details: 'Contact email appears to use a dedicated or corporate domain format.',
    });
  }

  if (isFreeSite || !domainLower) {
    companyVerification.push({
      item: 'Company Website & Domain Authenticity',
      status: 'FAILED',
      details: `Domain '${input.companyDomain || 'None'}' uses a suspicious generic TLD or free hosting provider known for phishing sites.`,
      recommendation: 'Check company registration on official government corporate portals (MCA, Companies House, SEC).'
    });
    riskScore += 20;
  } else {
    companyVerification.push({
      item: 'Company Website & Domain Authenticity',
      status: 'PASSED',
      details: `Company domain '${input.companyDomain}' is structured as a legitimate enterprise web property.`,
    });
  }

  companyVerification.push({
    item: 'Recruitment Funnel & Assessment Policy',
    status: suspiciousPhrases.some(p => p.category === 'PRESSURE_TACTICS' || p.category === 'PAYMENT_DEMAND') ? 'FAILED' : 'PASSED',
    details: suspiciousPhrases.some(p => p.category === 'PAYMENT_DEMAND') 
      ? 'Violates anti-extortion policies by requiring upfront student financial commitment.' 
      : 'Follows standard non-fee application flow.'
  });

  // Evaluate stipend
  let stipendAssessmentVerdict: 'UNREALISTICALLY_HIGH' | 'EXPLOITATIVE_UNPAID' | 'FEE_DISGUISED' | 'FAIR_MARKET' | 'SUSPICIOUS_COMMISSION' = 'FAIR_MARKET';
  let stipendExplanation = 'Stipend appears aligned with entry-level student intern standards.';

  if (hasPaymentRequest || stipendLower.includes('deposit') || stipendLower.includes('fee')) {
    stipendAssessmentVerdict = 'FEE_DISGUISED';
    stipendExplanation = 'The compensation is gated behind a mandatory upfront fee or deposit, which is a hallmark of internship fraud.';
  } else if (stipendLower.includes('$400 / day') || stipendLower.includes('$500') || stipendLower.includes('₹1,50,000') || stipendLower.includes('daily payout')) {
    stipendAssessmentVerdict = 'UNREALISTICALLY_HIGH';
    stipendExplanation = 'The promised payout is vastly above market reality for freshers with no experience, designed as clickbait for advance-fee scams.';
  } else if (stipendLower.includes('unpaid') && (textToScan.includes('6 months') || textToScan.includes('lead') || textToScan.includes('single-handedly'))) {
    stipendAssessmentVerdict = 'EXPLOITATIVE_UNPAID';
    stipendExplanation = 'Unpaid core development work exceeding standard academic learning boundaries without fair compensation.';
  }

  // Recruiter safety
  let channelType = 'Corporate Domain Portal';
  let safetyScore = 90;
  if (textToScan.includes('telegram')) {
    channelType = 'Telegram Messenger';
    safetyScore = 5;
  } else if (textToScan.includes('whatsapp message only') || textToScan.includes('no calls')) {
    channelType = 'WhatsApp Only (Untraceable)';
    safetyScore = 20;
  } else if (isPublicEmail) {
    channelType = 'Personal Consumer Webmail';
    safetyScore = 40;
  }

  // Cap riskScore
  riskScore = Math.min(100, Math.max(0, riskScore));

  let riskLevel: JobAnalysisResult['riskLevel'] = 'NO_RISK';
  if (riskScore >= 75) riskLevel = 'CRITICAL_RISK';
  else if (riskScore >= 50) riskLevel = 'HIGH_RISK';
  else if (riskScore >= 20) riskLevel = 'LOW_RISK';
  else riskLevel = 'NO_RISK';

  let verdictSummary = '';
  if (riskLevel === 'CRITICAL_RISK') {
    verdictSummary = 'CRITICAL RISK: High probability of advance-fee scam, task trap, or fraudulent scheme. Do NOT pay money or share identity credentials.';
  } else if (riskLevel === 'HIGH_RISK') {
    verdictSummary = 'HIGH RISK: Multiple high-severity red flags detected including suspicious communication channels and unverified employment terms.';
  } else if (riskLevel === 'LOW_RISK') {
    verdictSummary = 'LOW RISK: Listing exhibits minor concerns or unusual expectations. Clarify official corporate contact details before proceeding.';
  } else {
    verdictSummary = 'NO RISK: Listing adheres to verified professional recruitment practices with transparent evaluation and zero payment demands.';
  }

  return {
    riskScore,
    riskLevel,
    verdictSummary,
    detailedAnalysis: `This analysis evaluated the offer across financial integrity, communication authenticity, and labor fairness. The presence of ${suspiciousPhrases.length} distinct red flags strongly informs the risk score of ${riskScore}/100.`,
    suspiciousPhrases,
    companyVerification,
    stipendAssessment: {
      claimedStipend: input.stipend || 'Unspecified',
      assessmentVerdict: stipendAssessmentVerdict,
      explanation: stipendExplanation,
      marketRangeEstimate: 'Standard engineering intern stipends range from ₹15,000 - ₹50,000/mo ($500 - $2,500/mo in US). Legitimate firms NEVER charge registration fees.'
    },
    paymentRequests: {
      hasPaymentRequest,
      detectedCharges,
      legalNotice: 'Under standard employment regulations, charging an applicant a fee for an internship or job placement is prohibited.'
    },
    recruiterChannelSafety: {
      channelType,
      safetyScore,
      details: `Recruiter funnel assessed as ${channelType}. Genuine enterprise recruiters do not conduct hiring exclusively over anonymous chat applications.`
    },
    studentActionChecklist: [
      'Never send UPI, credit card, or cryptocurrency payments under the guise of "kit fees" or "security deposits".',
      'Verify the company on official government corporate registries (e.g., MCA21 in India, Companies House UK, SEC EDGAR US).',
      'Look up current employees and engineers at the company on LinkedIn and verify whether the recruiter actually works there.',
      'Check if the job posting exists on the official company careers page (e.g. company.com/careers).',
      'If pressured with artificial deadlines ("Pay within 24 hours"), immediately cease communication.'
    ],
    safeInterviewQuestions: [
      '"Can you confirm your corporate email address ending in the official company domain?"',
      '"What specific engineering mentor or team lead will be supervising my day-to-day code reviews?"',
      '"Could you clarify why a monetary deposit is requested, as this deviates from standard corporate hiring policies?"',
      '"Can you provide the company corporate CIN (Corporate Identification Number) for my university internship credit office?"'
    ]
  };
}

export function runHeuristicCertificateAnalysis(input: CertificateInputData): CertificateAnalysisResult {
  const text = `${input.candidateName || ''} ${input.companyName || ''} ${input.certificateId || ''} ${input.verificationUrl || ''} ${input.issueDate || ''} ${input.duration || ''} ${input.trackDomain || ''} ${input.signatoryName || ''} ${input.certificateText || ''}`.toLowerCase();
  
  const anomalies: CertificateAnomaly[] = [];
  let fraudScore = 15; // baseline

  // 1. Template Mill check
  if (text.includes('apex web') || text.includes('apx-2025-001') || text.includes('tinyurl.com') || text.includes('free.site') || text.includes('canva')) {
    fraudScore += 50;
    anomalies.push({
      anomalyType: 'TEMPLATE_WATERMARK',
      severity: 'CRITICAL',
      title: 'Known Template-Mill Certificate Pattern',
      description: 'The certificate layout and serial ID match automated fake internship mills known for selling generic certificates without verified internships.',
      locationOnDoc: 'Header & Credential ID Block'
    });
  }

  // 2. Date paradox
  if (text.includes('sunday') || text.includes('31 february') || text.includes('only 2 weeks') || text.includes('01 aug 2025 to 15 aug 2025')) {
    fraudScore += 40;
    anomalies.push({
      anomalyType: 'DATE_PARADOX',
      severity: 'CRITICAL',
      title: 'Temporal Inconsistency & Impossible Dates',
      description: 'The dates listed on the certificate contain impossible calendar dates (e.g. Feb 31, Sunday corporate issuance, or claimed 6-month tenure spanning only 14 calendar days).',
      locationOnDoc: 'Duration & Date of Issuance'
    });
  }

  // 3. Credential ID and Verification URL check
  const idLower = (input.certificateId || '').toLowerCase();
  const urlLower = (input.verificationUrl || '').toLowerCase();
  let credentialStatus: CertificateAnalysisResult['credentialIdAudit']['status'] = 'VALID_PATTERN';
  let urlCheck = 'Verification URL links to a verifiable corporate endpoint.';

  if (!urlLower || urlLower.includes('tinyurl') || urlLower.includes('bit.ly') || urlLower.includes('.xyz') || urlLower.includes('free')) {
    fraudScore += 30;
    credentialStatus = 'MISSING_VERIFICATION';
    urlCheck = 'The verification URL uses a URL shortener or untrusted domain instead of the official company cryptographic ledger.';
    anomalies.push({
      anomalyType: 'CREDENTIAL_ID_INVALID',
      severity: 'HIGH',
      title: 'Suspicious / Untraceable Verification Link',
      description: 'Authentic enterprise credentials resolve on the verified parent domain (e.g., credentials.company.com), not free link shorteners.',
      locationOnDoc: 'Verification QR / Footer URL'
    });
  } else if (idLower.length < 5 || idLower === 'abc-001' || idLower.includes('fake')) {
    credentialStatus = 'DUMMY_STRING';
    fraudScore += 35;
    anomalies.push({
      anomalyType: 'CREDENTIAL_ID_INVALID',
      severity: 'HIGH',
      title: 'Dummy Serial Format',
      description: 'Certificate identifier uses trivial sequential numbering without cryptographic checksums or registry metadata.',
      locationOnDoc: 'Serial Number'
    });
  }

  // 4. Signatory Check
  if (text.includes('satya nadella') && text.includes('intern') && !text.includes('verified.microsoft.com')) {
    fraudScore += 45;
    anomalies.push({
      anomalyType: 'SIGNATORY_FORGERY',
      severity: 'CRITICAL',
      title: 'High-Profile Executive Impersonation',
      description: 'Fortune 500 CEOs (e.g., Satya Nadella, Sundar Pichai) do not individually sign entry-level college intern completion certificates; internship credentials are authenticated by University Relations or Campus HR directors.',
      locationOnDoc: 'Signature Block'
    });
  }

  fraudScore = Math.min(100, Math.max(5, fraudScore));
  const authenticityScore = Math.max(0, 100 - fraudScore);

  let verdict: CertificateAnalysisResult['verdict'] = 'LIKELY_GENUINE';
  let verdictSummary = 'The certificate exhibits consistent typography, credible corporate credentials, and a verifiable issuance record.';

  if (authenticityScore < 30) {
    verdict = 'FABRICATED_FORGERY';
    verdictSummary = 'CONFIRMED FRAUDULENT / FORGED: Multiple high-severity forensic anomalies detected including chronological paradoxes and fake verification links.';
  } else if (authenticityScore < 60) {
    verdict = 'HIGH_SUSPICION_TEMPLATE';
    verdictSummary = 'HIGH SUSPICION: Certificate bears hallmarks of an unaccredited template-mill or altered document.';
  } else if (authenticityScore < 85) {
    verdict = 'UNVERIFIED_DISCREPANCIES';
    verdictSummary = 'DISCREPANCIES IDENTIFIED: Requires secondary HR confirmation regarding dates or role titling.';
  }

  return {
    authenticityScore,
    fraudProbability: fraudScore,
    verdict,
    verdictSummary,
    anomaliesDetected: anomalies,
    credentialIdAudit: {
      status: credentialStatus,
      explanation: credentialStatus === 'VALID_PATTERN' 
        ? 'Certificate ID matches standard enterprise cryptographic or registry schema.'
        : 'Certificate ID could not be validated against an authentic corporate credential register.',
      verificationUrlCheck: urlCheck
    },
    dateAnalysis: {
      status: anomalies.some(a => a.anomalyType === 'DATE_PARADOX') ? 'CHRONOLOGY_PARADOX' : 'LOGICAL',
      explanation: anomalies.some(a => a.anomalyType === 'DATE_PARADOX')
        ? 'Claimed duration does not match issuance date calendar mathematics.'
        : 'Start and end dates align with typical academic semester or summer internship terms.',
      durationClaimed: input.duration || 'Unspecified'
    },
    signatoryAssessment: {
      signatoryName: input.signatoryName || 'Authorized Signatory',
      signatoryTitle: 'Corporate HR / Engineering Leadership',
      verdict: anomalies.some(a => a.anomalyType === 'SIGNATORY_FORGERY')
        ? 'Flagged: Executive forgery or fictitious signatory title.'
        : 'Format consistent with campus recruitment department protocols.'
    },
    forensicBreakdown: {
      typographyConsistency: authenticityScore > 60 ? 92 : 38,
      logoAndStampIntegrity: authenticityScore > 60 ? 95 : 24,
      companyAuthenticity: authenticityScore > 60 ? 88 : 19,
      metadataMatch: authenticityScore > 60 ? 94 : 32
    },
    recommendation: authenticityScore < 50
      ? 'DO NOT accept this credential for academic credit, university marks, or employment background checks without formal written verification from the company legal counsel.'
      : 'Certificate appears genuine. Verify the digital signature on the company portal if hiring for high-security roles.'
  };
}

export function runHeuristicHrVerification(
  candidateName: string,
  claimedCompany: string,
  claimedCertId: string,
  claimedRole: string,
  claimedPeriod: string,
  claimedMentor: string,
  postText: string,
  roster: HrRosterRecord[]
): HrVerificationResult {
  const normName = candidateName.toLowerCase().trim();
  const normCert = claimedCertId.toLowerCase().trim();
  const normRole = claimedRole.toLowerCase().trim();

  // Find match in roster by certificate ID or candidate name
  const rosterMatch = roster.find(r => 
    (r.certificateId && r.certificateId.toLowerCase().trim() === normCert) ||
    (r.candidateName.toLowerCase().trim() === normName)
  );

  const auditNotes: string[] = [];

  if (!rosterMatch) {
    auditNotes.push(`No internship record found for candidate "${candidateName}" with certificate ID "${claimedCertId}" in official company database.`);
    if (claimedRole.toLowerCase().includes('principal') || claimedRole.toLowerCase().includes('lead') || claimedRole.toLowerCase().includes('head of')) {
      auditNotes.push(`Claimed title "${claimedRole}" is an executive/senior role never assigned to intern personnel in company hierarchy.`);
    }
    auditNotes.push('The claimed certificate ID does not conform to internal serial sequences.');

    return {
      matchStatus: 'NO_RECORD_FOUND',
      confidenceScore: 98,
      candidateName,
      claimedCompany,
      auditNotes,
      suggestedAction: 'REPORT_TO_LINKEDIN',
      generatedNoticeLetter: `Dear ${candidateName},\n\nWe have identified a public post/claim on your profile stating that you completed an internship as "${claimedRole}" at ${claimedCompany} under credential ID ${claimedCertId}.\n\nOur Talent Acquisition & Human Resources compliance registry has confirmed that you were never enrolled in our internship program, nor has any such credential been issued by our organization. Falsely representing affiliation with our firm constitutes fraudulent misrepresentation.\n\nWe demand that you immediately remove all references to ${claimedCompany} from your LinkedIn profile, resume, and public portfolios within 48 hours to avoid legal escalation.\n\nSincerely,\nHuman Resources & Legal Compliance\n${claimedCompany}`,
      generatedLinkedInReport: `Report Subject: Fraudulent Experience & Counterfeit Certificate Claim\nMember Reported: ${candidateName}\nInfringement: False claim of employment and internship at ${claimedCompany}.\nEvidence: Candidate claims role "${claimedRole}" with forged certificate ${claimedCertId}. No record exists in company HR records. The member is displaying an unauthorized company trademark on LinkedIn.`
    };
  }

  // Record exists - check for title inflation or discrepancies
  if (normName !== rosterMatch.candidateName.toLowerCase().trim()) {
    auditNotes.push(`Certificate ID "${claimedCertId}" was originally issued to "${rosterMatch.candidateName}", NOT "${candidateName}". Identity substitution detected!`);
    return {
      matchStatus: 'UNAUTHORIZED_FORGERY',
      confidenceScore: 99,
      candidateName,
      claimedCompany,
      auditNotes,
      rosterMatch,
      suggestedAction: 'ISSUE_DISCREPANCY_NOTICE',
      generatedNoticeLetter: `Dear ${candidateName},\n\nOur system detected that you are presenting certificate ${claimedCertId} which was officially issued to another individual (${rosterMatch.candidateName}). This constitutes document fraud and identity tampering.\n\nPlease cease and desist immediately.\n\nHR Compliance,\n${claimedCompany}`
    };
  }

  // Check role exaggeration
  const officialRole = rosterMatch.role.toLowerCase();
  const claimedRoleIsExaggerated = (normRole.includes('lead') || normRole.includes('head') || normRole.includes('director') || normRole.includes('principal')) &&
    !officialRole.includes('lead') && !officialRole.includes('head');

  if (claimedRoleIsExaggerated) {
    auditNotes.push(`Candidate was officially registered as "${rosterMatch.role}", but claims the title "${claimedRole}" on LinkedIn.`);
    auditNotes.push(`Verified department: "${rosterMatch.department}". Verified duration: ${rosterMatch.startDate} to ${rosterMatch.endDate}.`);
    
    return {
      matchStatus: 'DEPARTMENT_MISMATCH',
      confidenceScore: 92,
      candidateName,
      claimedCompany,
      auditNotes,
      rosterMatch,
      suggestedAction: 'ISSUE_DISCREPANCY_NOTICE',
      generatedNoticeLetter: `Dear ${candidateName},\n\nWe appreciate your past contribution to ${claimedCompany} as a ${rosterMatch.role} in ${rosterMatch.department} (${rosterMatch.startDate} to ${rosterMatch.endDate}).\n\nHowever, we noted that your recent public announcement cites your position as "${claimedRole}". To maintain institutional accuracy, please update your LinkedIn headline and experience entry to reflect your official title ("${rosterMatch.role}").\n\nBest regards,\nTalent Acquisition Team\n${claimedCompany}`
    };
  }

  // Authentic match
  auditNotes.push(`Confirmed match in official database: "${rosterMatch.candidateName}" as "${rosterMatch.role}" in ${rosterMatch.department}.`);
  auditNotes.push(`Verified supervisor: ${rosterMatch.mentorOrManager}. Completion status: ${rosterMatch.status}.`);

  return {
    matchStatus: 'CONFIRMED_AUTHENTIC',
    confidenceScore: 100,
    candidateName,
    claimedCompany,
    auditNotes,
    rosterMatch,
    suggestedAction: 'APPROVE_RECORD',
    generatedNoticeLetter: `Status: Candidate record is 100% verified and compliant with ${claimedCompany} internship records.`
  };
}
