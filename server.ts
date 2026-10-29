import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { 
  JobInputData, 
  JobAnalysisResult, 
  CertificateInputData, 
  CertificateAnalysisResult,
  HrRosterRecord,
  HrVerificationResult 
} from './src/types/detector';
import { 
  runHeuristicJobAnalysis, 
  runHeuristicCertificateAnalysis, 
  runHeuristicHrVerification 
} from './src/utils/heuristics';
import { SCAM_MILLS_DATABASE } from './src/data/samples';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '30mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Resilient AI generation with automatic model fallback for 503 spikes
async function generateWithFallback(params: { contents: any; config?: any }) {
  const timeoutMs = 12000;
  const timeoutPromise = (ms: number) => new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Model timeout')), ms)
  );

  const baseConfig = {
    ...params.config,
    thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
  };

  try {
    return await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: params.contents,
        config: baseConfig,
      }),
      timeoutPromise(timeoutMs)
    ]);
  } catch (err: any) {
    // Graceful fallback to gemini-3.1-flash-lite
    return await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: params.contents,
        config: params.config,
      }),
      timeoutPromise(timeoutMs)
    ]);
  }
}

// ==========================================
// 1. JOB OFFER & ADVERTISEMENT SCANNER API
// ==========================================
app.post('/api/detect/job-offer', async (req: Request, res: Response) => {
  const input: JobInputData = req.body;
  if (!input || (!input.jobDescription && !input.jobTitle && !input.companyName)) {
    return res.status(400).json({ error: 'Job description, title, or company details required.' });
  }

  // Pre-calculate heuristic analysis as baseline
  const heuristic = runHeuristicJobAnalysis(input);

  if (!process.env.GEMINI_API_KEY) {
    return res.json(heuristic);
  }

  try {
    const prompt = `You are an elite Cyber-Fraud & Employment Law Investigator specializing in identifying fraudulent student internships, advance-fee recruitment scams, fake job postings, task scams, and deceptive hiring practices.

Analyze the following internship job advertisement:
- Job Title: ${input.jobTitle || 'Not specified'}
- Company Name: ${input.companyName || 'Not specified'}
- Company Domain: ${input.companyDomain || 'Not specified'}
- Stipend Claimed: ${input.stipend || 'Not specified'}
- Location / Format: ${input.location || 'Remote/Not specified'}
- Requirements: ${input.requirements || 'Not specified'}
- Recruiter Contact Info: ${input.contactInfo || 'Not specified'}
- Full Job Description & Terms:
"""
${input.jobDescription || 'No detailed description provided.'}
"""

Evaluate against known internship scam patterns:
1. Advance-Fee / Registration / Kit / Training / Examination / Security Deposit Fees demanded from students.
2. Unofficial communication (WhatsApp only, Telegram task channels, free @gmail/@yahoo addresses instead of corporate domains).
3. Missing company verification (typosquatted domain, non-existent entity, phantom registration).
4. Unrealistic or manipulative compensation (e.g. $400/day for reviewing apps, or predatory 60hr/week unpaid core development).
5. Fast-track "No interview needed, slot reserved immediately upon UPI payment".

Return a strictly formatted JSON response.`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { 
              type: Type.INTEGER, 
              description: 'Risk score from 0 to 100 where 100 is definite fraudulent scam, 0 is completely verified and safe' 
            },
            riskLevel: { 
              type: Type.STRING, 
              description: 'One of: CRITICAL_RISK, HIGH_RISK, LOW_RISK, NO_RISK' 
            },
            verdictSummary: { 
              type: Type.STRING, 
              description: 'Clear, authoritative one-paragraph final verdict' 
            },
            detailedAnalysis: { 
              type: Type.STRING, 
              description: 'In-depth forensic rationale analyzing the posting' 
            },
            suspiciousPhrases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phrase: { type: Type.STRING },
                  category: { 
                    type: Type.STRING, 
                    description: 'PAYMENT_DEMAND, UNREALISTIC_COMPENSATION, VAGUE_REQUIREMENTS, UNOFFICIAL_COMMUNICATION, PRESSURE_TACTICS, WORK_EXPLOITATION, DOMAIN_MISMATCH, IDENTITY_HARVESTING' 
                  },
                  severity: { type: Type.STRING, description: 'CRITICAL, HIGH, MEDIUM, LOW' },
                  explanation: { type: Type.STRING }
                },
                required: ['phrase', 'category', 'severity', 'explanation']
              }
            },
            companyVerification: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  status: { type: Type.STRING, description: 'PASSED, FAILED, WARNING, UNKNOWN' },
                  details: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                },
                required: ['item', 'status', 'details']
              }
            },
            stipendAssessment: {
              type: Type.OBJECT,
              properties: {
                claimedStipend: { type: Type.STRING },
                assessmentVerdict: { 
                  type: Type.STRING, 
                  description: 'UNREALISTICALLY_HIGH, EXPLOITATIVE_UNPAID, FEE_DISGUISED, FAIR_MARKET, SUSPICIOUS_COMMISSION' 
                },
                explanation: { type: Type.STRING },
                marketRangeEstimate: { type: Type.STRING }
              },
              required: ['claimedStipend', 'assessmentVerdict', 'explanation', 'marketRangeEstimate']
            },
            paymentRequests: {
              type: Type.OBJECT,
              properties: {
                hasPaymentRequest: { type: Type.BOOLEAN },
                detectedCharges: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      amountClaimed: { type: Type.STRING },
                      details: { type: Type.STRING }
                    },
                    required: ['type', 'details']
                  }
                },
                legalNotice: { type: Type.STRING }
              },
              required: ['hasPaymentRequest', 'detectedCharges', 'legalNotice']
            },
            recruiterChannelSafety: {
              type: Type.OBJECT,
              properties: {
                channelType: { type: Type.STRING },
                safetyScore: { type: Type.INTEGER, description: '0 to 100' },
                details: { type: Type.STRING }
              },
              required: ['channelType', 'safetyScore', 'details']
            },
            studentActionChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            safeInterviewQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'riskScore', 'riskLevel', 'verdictSummary', 'detailedAnalysis', 
            'suspiciousPhrases', 'companyVerification', 'stipendAssessment', 
            'paymentRequests', 'recruiterChannelSafety', 'studentActionChecklist', 'safeInterviewQuestions'
          ]
        }
      }
    });

    const parsed: JobAnalysisResult = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (_err) {
    return res.json(heuristic);
  }
});

// Alias for generic employment and freelance offer audits
app.post('/api/detect/offer', (req: Request, res: Response) => {
  // Delegate directly to the main detector handler
  return app._router.handle(Object.assign(req, { url: '/api/detect/job-offer' }), res);
});

// ==========================================
// REAL-TIME URL FETCHER & AUDITOR API
// ==========================================
app.post('/api/fetch-live-url', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'Valid URL is required.' });
  }

  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  let parsedDomain = '';
  try {
    const urlObj = new URL(normalizedUrl);
    parsedDomain = urlObj.hostname;
  } catch {
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8'
      }
    });
    clearTimeout(timeoutId);

    const html = await response.text();
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : parsedDomain;

    // Extract meta description
    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const metaDesc = metaMatch ? metaMatch[1].trim() : '';

    // Strip scripts, styles, and html tags to get readable text
    const cleanBody = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 4000);

    return res.json({
      url: normalizedUrl,
      domain: parsedDomain,
      title,
      extractedText: `${title}\n${metaDesc ? metaDesc + '\n' : ''}${cleanBody}`,
      isSecure: normalizedUrl.startsWith('https://')
    });
  } catch (err: any) {
    // Return gracefully with domain info so user can still proceed
    return res.json({
      url: normalizedUrl,
      domain: parsedDomain,
      title: parsedDomain,
      extractedText: `Fetched domain: ${parsedDomain}. Note: Automated fetch was blocked or timed out by site security. Please paste the job description text manually below for comprehensive forensic analysis.`,
      isSecure: normalizedUrl.startsWith('https://'),
      warning: 'Live page content could not be fully scraped due to site restrictions. Domain metadata extracted.'
    });
  }
});

// ==========================================
// 2. CERTIFICATE FRAUD DETECTOR API
// ==========================================
app.post('/api/detect/certificate', async (req: Request, res: Response) => {
  const input: CertificateInputData = req.body;
  if (!input || (!input.certificateText && !input.certificateId && !input.companyName && !input.imageBase64)) {
    return res.status(400).json({ error: 'Certificate details or image required.' });
  }

  const heuristic = runHeuristicCertificateAnalysis(input);

  if (!process.env.GEMINI_API_KEY) {
    return res.json(heuristic);
  }

  try {
    const parts: any[] = [];

    // Multimodal support if an image base64 is uploaded
    if (input.imageBase64) {
      const match = input.imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }

    const textPrompt = `You are a Senior Digital Document Forensics Specialist and HR Credential Auditor.
Examine the following internship certificate metadata and text for forgery, template mill reproduction, date inconsistencies, fake credentials, and unauthorized corporate branding:

Candidate Name: ${input.candidateName || 'Not specified'}
Issuing Company: ${input.companyName || 'Not specified'}
Certificate ID: ${input.certificateId || 'Not specified'}
Verification URL: ${input.verificationUrl || 'Not specified'}
Issue Date: ${input.issueDate || 'Not specified'}
Claimed Duration: ${input.duration || 'Not specified'}
Role / Track: ${input.trackDomain || 'Not specified'}
Signatory Name & Title: ${input.signatoryName || 'Not specified'}

Certificate Extracted Text / Transcript:
"""
${input.certificateText || 'N/A'}
"""

Evaluate for:
1. Template Mill Signatures (Canva free certificate borders, generic watermark artifacts, stock seal graphics).
2. Date Inconsistencies (Sundays, leap year / impossible dates, duration mismatch vs issue date).
3. Credential ID verification (non-standard schema, dummy string, dead or shortened link like tinyurl/bit.ly).
4. Signatory Authenticity (High-profile CEO impersonation on entry intern certificates, fictitious manager titles).
5. Visual and typographical harmony.

Return a strictly formatted JSON response.`;

    parts.push({ text: textPrompt });

    const response = await generateWithFallback({
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            authenticityScore: { type: Type.INTEGER, description: '0 to 100 (100 = completely genuine)' },
            fraudProbability: { type: Type.INTEGER, description: '0 to 100 (100 = completely fake/forged)' },
            verdict: { 
              type: Type.STRING, 
              description: 'FABRICATED_FORGERY, HIGH_SUSPICION_TEMPLATE, UNVERIFIED_DISCREPANCIES, LIKELY_GENUINE' 
            },
            verdictSummary: { type: Type.STRING },
            anomaliesDetected: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  anomalyType: { 
                    type: Type.STRING, 
                    description: 'VISUAL_LAYOUT, SIGNATORY_FORGERY, DATE_PARADOX, CREDENTIAL_ID_INVALID, PHANTOM_ORGANIZATION, TEMPLATE_WATERMARK' 
                  },
                  severity: { type: Type.STRING, description: 'CRITICAL, HIGH, MEDIUM, LOW' },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  locationOnDoc: { type: Type.STRING }
                },
                required: ['anomalyType', 'severity', 'title', 'description']
              }
            },
            credentialIdAudit: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING, description: 'VALID_PATTERN, SUSPICIOUS_SEQUENTIAL, DUMMY_STRING, MISSING_VERIFICATION' },
                explanation: { type: Type.STRING },
                verificationUrlCheck: { type: Type.STRING }
              },
              required: ['status', 'explanation', 'verificationUrlCheck']
            },
            dateAnalysis: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING, description: 'LOGICAL, SUSPICIOUS, CHRONOLOGY_PARADOX' },
                explanation: { type: Type.STRING },
                durationClaimed: { type: Type.STRING }
              },
              required: ['status', 'explanation', 'durationClaimed']
            },
            signatoryAssessment: {
              type: Type.OBJECT,
              properties: {
                signatoryName: { type: Type.STRING },
                signatoryTitle: { type: Type.STRING },
                verdict: { type: Type.STRING }
              },
              required: ['signatoryName', 'signatoryTitle', 'verdict']
            },
            forensicBreakdown: {
              type: Type.OBJECT,
              properties: {
                typographyConsistency: { type: Type.INTEGER },
                logoAndStampIntegrity: { type: Type.INTEGER },
                companyAuthenticity: { type: Type.INTEGER },
                metadataMatch: { type: Type.INTEGER }
              },
              required: ['typographyConsistency', 'logoAndStampIntegrity', 'companyAuthenticity', 'metadataMatch']
            },
            recommendation: { type: Type.STRING }
          },
          required: [
            'authenticityScore', 'fraudProbability', 'verdict', 'verdictSummary', 
            'anomaliesDetected', 'credentialIdAudit', 'dateAnalysis', 
            'signatoryAssessment', 'forensicBreakdown', 'recommendation'
          ]
        }
      }
    });

    const parsed: CertificateAnalysisResult = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (_err) {
    return res.json(heuristic);
  }
});

// ==========================================
// 3. COMPANY HR VERIFICATION & CLAIM AUDIT
// ==========================================
app.post('/api/hr/verify-claim', async (req: Request, res: Response) => {
  const {
    candidateName,
    claimedCompany,
    claimedCertId,
    claimedRole,
    claimedPeriod,
    claimedMentor,
    postText,
    rosterRecords
  } = req.body;

  const roster: HrRosterRecord[] = rosterRecords || [];
  const heuristic = runHeuristicHrVerification(
    candidateName || '',
    claimedCompany || '',
    claimedCertId || '',
    claimedRole || '',
    claimedPeriod || '',
    claimedMentor || '',
    postText || '',
    roster
  );

  if (!process.env.GEMINI_API_KEY) {
    return res.json(heuristic);
  }

  try {
    const prompt = `You are an HR Legal Compliance Director and Talent Integrity Officer at ${claimedCompany || 'the hiring company'}.
You are verifying an internship claim made by a candidate (e.g. on LinkedIn or a job application resume) against your company's official registered intern database.

Candidate Claim Data:
- Candidate Name: ${candidateName}
- Claimed Role/Title: ${claimedRole}
- Claimed Certificate/Credential ID: ${claimedCertId}
- Claimed Period: ${claimedPeriod}
- Claimed Mentor/Manager: ${claimedMentor}
- LinkedIn Post / Announcement Text:
"""
${postText || 'N/A'}
"""

Company Official Verified Roster Records Provided:
${JSON.stringify(roster, null, 2)}

Audit tasks:
1. Check whether candidate exists in roster or if there is certificate ID impersonation/substitution.
2. Check if the claimed title is exaggerated (e.g., intern claiming "Principal Architect" or "Head of Engineering").
3. Determine match status: CONFIRMED_AUTHENTIC, DEPARTMENT_MISMATCH, DATE_ALTERATION, UNAUTHORIZED_FORGERY, NO_RECORD_FOUND.
4. Draft a formal, professional HR Discrepancy Notice to candidate.
5. Draft a formal LinkedIn Trademark Infringement / False Profile Report if fraudulent.

Return a strictly formatted JSON response.`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchStatus: { 
              type: Type.STRING, 
              description: 'CONFIRMED_AUTHENTIC, DEPARTMENT_MISMATCH, DATE_ALTERATION, UNAUTHORIZED_FORGERY, NO_RECORD_FOUND' 
            },
            confidenceScore: { type: Type.INTEGER, description: '0 to 100' },
            candidateName: { type: Type.STRING },
            claimedCompany: { type: Type.STRING },
            auditNotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedAction: { 
              type: Type.STRING, 
              description: 'APPROVE_RECORD, REQUEST_ORIGINAL_CONTRACT, ISSUE_DISCREPANCY_NOTICE, REPORT_TO_LINKEDIN' 
            },
            generatedNoticeLetter: { type: Type.STRING },
            generatedLinkedInReport: { type: Type.STRING }
          },
          required: [
            'matchStatus', 'confidenceScore', 'candidateName', 'claimedCompany', 
            'auditNotes', 'suggestedAction', 'generatedNoticeLetter', 'generatedLinkedInReport'
          ]
        }
      }
    });

    const parsed: HrVerificationResult = JSON.parse(response.text?.trim() || '{}');
    // Attach matched roster record if found
    if (heuristic.rosterMatch) {
      parsed.rosterMatch = heuristic.rosterMatch;
    }
    return res.json(parsed);
  } catch (_err) {
    return res.json(heuristic);
  }
});

// ==========================================
// 4. SCAM MILLS DIRECTORY
// ==========================================
app.get('/api/scams', (_req: Request, res: Response) => {
  res.json(SCAM_MILLS_DATABASE);
});

// ==========================================
// VITE DEV SERVER OR STATIC PROD SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VeriIntern AI Server active on port ${PORT}`);
  });
}

startServer();
