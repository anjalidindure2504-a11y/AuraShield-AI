import { JobInputData, CertificateInputData, HrRosterRecord, ScamMillRecord } from '../types/detector';

export const JOB_PRESETS: Array<{ id: string; name: string; tag: string; riskExpected: string; data: JobInputData }> = [
  {
    id: 'pay-to-work-scam',
    name: '🔴 "Pay Registration Fee" Training Scam',
    tag: 'Critical Risk',
    riskExpected: '95% Fraud',
    data: {
      jobTitle: 'Full Stack Web Development Intern',
      companyName: 'Apex Infotech & Digital Solutions Pvt Ltd',
      companyDomain: 'apex-infotech-careers.free.site',
      stipend: '₹25,000/month upon completion (₹1,499 initial refundable kit & registration deposit required)',
      location: 'Remote / Work From Home',
      requirements: 'No prior coding experience needed! Open to 1st year to 4th year college students of any branch. Basic laptop and internet connection required.',
      contactInfo: 'hr.apexinfo.recruitment2025@gmail.com | WhatsApp: +91 98765 43210 (No calls, WhatsApp message only)',
      jobDescription: `Congratulations! Your resume has been shortlisted from thousands of applicants for our prestigious 2-Month Web Development Internship Program.
      
During this internship, you will work on live corporate client projects like E-commerce and AI Chatbots.
      
TERMS & CONDITIONS:
1. To confirm your slot and allocate your server credentials, ID badge, and learning kit, a one-time fully refundable security deposit of ₹1,499 must be paid via UPI within 24 hours.
2. Guaranteed completion certificate and Letter of Recommendation (LOR) signed by international directors.
3. No interview rounds required! Your slot will be reserved immediately upon payment confirmation.
4. Top performers will receive an offer of ₹6 LPA full time job.

Contact HR Priya immediately on WhatsApp at +91 98765 43210 with screenshot of payment receipt.`
    }
  },
  {
    id: 'telegram-task-scam',
    name: '🔴 Telegram / Crypto "Earn $200/Day" Task Scam',
    tag: 'Critical Risk',
    riskExpected: '98% Scam',
    data: {
      jobTitle: 'Digital Marketing & App Optimization Intern',
      companyName: 'Global Media Boost LLC',
      companyDomain: 'None provided / Unknown',
      stipend: '$150 - $400 / day via USDT Crypto or Google Pay',
      location: 'Remote (Anywhere in the world)',
      requirements: 'Smartphone or PC, 1-2 hours per day spare time, Telegram account. Age 18+.',
      contactInfo: 'Telegram: @Recruiter_Elena_VIP | Channel: t.me/global_tasks_official',
      jobDescription: `URGENT HIRING: Part-time Internship for College Students & Freshers!
Work only 60 to 90 minutes daily reviewing apps on Google Play Store and subscribing to YouTube channels.
Daily payout guaranteed directly to your crypto wallet or UPI!

Job Role:
- Like and subscribe to designated merchant accounts.
- Test app downloads and submit screenshot proofs.
- Earn $5 per task. Complete 20 tasks daily to earn up to $100+.

To start your trial day:
Contact Assistant Manager Elena on Telegram @Recruiter_Elena_VIP with code "TASK-INTERN". You will receive a $10 joining bonus immediately after completing the initial security verification task.`
    }
  },
  {
    id: 'bigtech-phishing-clone',
    name: '🟠 Phishing Big-Tech Impersonation',
    tag: 'High Risk',
    riskExpected: '90% Phishing',
    data: {
      jobTitle: 'Google Cloud Platform AI Engineering Intern',
      companyName: 'Google Cloud LLC (Impersonated)',
      companyDomain: 'google-careers-verification.cc',
      stipend: '$6,500/month + Free MacBook Pro M3 + Relocation Housing Allowance',
      location: 'Hybrid / Mountain View or Remote',
      requirements: 'Must be current undergraduate student. Enthusiastic about Machine Learning and Python.',
      contactInfo: 'recruiting-googlecloud@gmail.com / careers@google-careers-verification.cc',
      jobDescription: `Dear Candidate,
Google Cloud Talent Acquisition team has reviewed your GitHub profile and is pleased to offer you a direct fast-track Summer Internship without standard LeetCode rounds.

You will receive an official Google corporate email and our employee onboarding hardware package (MacBook Pro M3 Max + 34" Monitor).

To process your employee equipment shipment and legal background check:
Please fill out the identity verification form at: http://bit.ly/google-onboarding-kyc-ssn
You must submit your National ID / Aadhaar card copy, bank details, and an equipment delivery insurance charge of $75 (which Google will reimburse on your first monthly paycheck).

Welcome to the Google family!`
    }
  },
  {
    id: 'unpaid-exploitation',
    name: '🟡 Unpaid 60hr/week Exploitation Internship',
    tag: 'Moderate Concern',
    riskExpected: '65% Warning',
    data: {
      jobTitle: 'Lead Full Stack React & Python Developer Intern',
      companyName: 'Stealth AI Venture Technologies',
      companyDomain: 'stealthaiventure.io',
      stipend: 'Unpaid (Certificate + "Valuable Experience" + Equity upon Series A round in 2027)',
      location: 'Remote',
      requirements: 'Expert in React, Next.js, FastAPI, Docker, Kubernetes, AWS, and PostgreSQL. Must commit 50-60 hours per week including weekends.',
      contactInfo: 'founder@stealthaiventure.io',
      jobDescription: `We are looking for a rockstar, high-hustle student to join as our founding Lead Developer Intern.
You will be single-handedly architecting our core production SaaS platform from scratch.

What we offer:
- 100% Unpaid for the initial 6 months probationary period.
- All code, patents, and intellectual property written by you will belong 100% exclusively to the company forever.
- Non-compete clause: You cannot work for any tech company in software for 2 years after leaving.
- High intensity environment: 9 AM to 9 PM, 6 days a week.
- You will be rewarded with an unpaid completion certificate and LinkedIn endorsement if target metrics are hit.`
    }
  },
  {
    id: 'verified-legit-tech',
    name: '🟢 Legitimate Tech Internship Offer',
    tag: 'Safe / Low Risk',
    riskExpected: '5% Low Risk',
    data: {
      jobTitle: 'Software Development Engineering Intern (Summer 2026)',
      companyName: 'Razorpay Software Private Limited',
      companyDomain: 'razorpay.com',
      stipend: '₹45,000 / month fixed stipend + Health Insurance + Wellness Allowance',
      location: 'Bengaluru, India (Hybrid: 3 days in office, 2 days remote)',
      requirements: 'B.Tech/B.E. in CS/IT or related field graduating in 2027. Strong fundamentals in Data Structures, Algorithms, OS, and REST APIs.',
      contactInfo: 'campus-recruitment@razorpay.com | Applied via razorpay.com/jobs/careers',
      jobDescription: `About the Role:
As a Software Engineering Intern at Razorpay, you will work closely with our Core Payments engineering team to design, build, and optimize payment gateway microservices handling millions of transactions per second.

Recruitment Process:
1. Online Coding Assessment (HackerEarth) - 90 mins
2. Technical Interview Round 1 (Data Structures & System Design fundamentals)
3. Technical Interview Round 2 (Projects & Problem Solving)
4. HR & Culture Fit Discussion

Important Notes:
- Razorpay never asks candidates for any money, deposits, training fees, or equipment charges at any stage of the recruitment process.
- All official communications will originate strictly from the @razorpay.com domain.`
    }
  }
];

export const CERTIFICATE_PRESETS: Array<{ id: string; name: string; tag: string; data: CertificateInputData }> = [
  {
    id: 'canva-forgery-sample',
    name: '🔴 Template Mill Forged Certificate (Apex Infotech)',
    tag: 'Forged / Fake',
    data: {
      candidateName: 'Rahul Sharma',
      companyName: 'Apex Web Infotech Global',
      certificateId: 'APX-2025-001',
      verificationUrl: 'https://tinyurl.com/verify-apex-cert-491',
      issueDate: 'Sunday, 14 September 2025',
      duration: '6 Months (Claimed: 01 Aug 2025 to 15 Aug 2025 - only 2 weeks!)',
      trackDomain: 'Senior Artificial Intelligence Specialist',
      signatoryName: 'Dr. John Miller (Director of AI Innovation)',
      certificateText: `CERTIFICATE OF EXCELLENCE & COMPLETION
This is proudly presented to Rahul Sharma for outstanding completion of 6 Months Internship as Senior Artificial Intelligence Specialist at Apex Web Infotech Global.
During his tenure from 01 Aug 2025 to 15 Aug 2025, he demonstrated outstanding technical expertise in Deep Learning and Quantum Computing.
Authorized Signatory: Dr. John Miller, Global HR Director
Certificate ID: APX-2025-001 | Verify at tinyurl.com/verify-apex`
    }
  },
  {
    id: 'cloned-bigtech-certificate',
    name: '🟠 Fabricated Microsoft Cloud Certificate',
    tag: 'Fabricated',
    data: {
      candidateName: 'Amit Verma',
      companyName: 'Microsoft Corporation India',
      certificateId: 'MS-INTERN-VERIFY-9921',
      verificationUrl: 'http://microsoft-interns-registry.xyz/verify?id=9921',
      issueDate: '31 February 2025',
      duration: '3 Months (June 2025 - August 2025)',
      trackDomain: 'Lead Cloud Solution Architect Intern',
      signatoryName: 'Satya Nadella, Chief Executive Officer',
      certificateText: `MICROSOFT CERTIFICATE OF INTERNSHIP ACHIEVEMENT
This certificate certifies that Amit Verma has successfully accomplished the full-time role of Lead Cloud Solution Architect Intern at Microsoft Hyderabad campus.
Issued on 31 February 2025.
Credential ID: MS-INTERN-VERIFY-9921
Verification URL: http://microsoft-interns-registry.xyz/verify
Signature: Satya Nadella (CEO, Microsoft)`
    }
  },
  {
    id: 'genuine-startup-certificate',
    name: '🟢 Legitimate Verifiable Certificate (HyperPost AI)',
    tag: 'Authentic',
    data: {
      candidateName: 'Priya Sundaram',
      companyName: 'HyperPost AI Technologies Inc.',
      certificateId: 'HYP-2025-CERT-8842A',
      verificationUrl: 'https://verify.hyperpost.ai/credentials/HYP-2025-CERT-8842A',
      issueDate: '31 July 2025',
      duration: '10 Weeks (May 20, 2025 - July 29, 2025)',
      trackDomain: 'Frontend Software Engineering Intern',
      signatoryName: 'Sneha Kulkarni, VP of Engineering',
      certificateText: `HyperPost AI - CERTIFICATE OF INTERNSHIP COMPLETION
Certificate Identifier: HYP-2025-CERT-8842A
This certifies that Priya Sundaram successfully completed a 10-week technical internship as Frontend Software Engineering Intern from May 20, 2025 to July 29, 2025.
Priya contributed to our Next.js web application and design system components.
Signed: Sneha Kulkarni (VP of Engineering) | Corporate CIN: U72900KA2021PTC145021
Verify publicly at: https://verify.hyperpost.ai/credentials/HYP-2025-CERT-8842A`
    }
  }
];

export const INITIAL_HR_ROSTER: HrRosterRecord[] = [
  {
    id: 'rost-001',
    certificateId: 'CORP-2025-INT-1092',
    candidateName: 'Ananya Deshmukh',
    department: 'Core Infrastructure Engineering',
    role: 'Cloud Systems Intern',
    startDate: '2025-05-15',
    endDate: '2025-07-25',
    mentorOrManager: 'Karthik Raman (Staff Eng)',
    status: 'COMPLETED',
    verifiedIssueDate: '2025-07-26'
  },
  {
    id: 'rost-002',
    certificateId: 'CORP-2025-INT-1093',
    candidateName: 'Rohan Mehra',
    department: 'Product Design',
    role: 'UI/UX Design Intern',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    mentorOrManager: 'Tanvi Joshi (Design Lead)',
    status: 'COMPLETED',
    verifiedIssueDate: '2025-09-01'
  },
  {
    id: 'rost-003',
    certificateId: 'CORP-2025-INT-1094',
    candidateName: 'Vikram Patel',
    department: 'Machine Learning Research',
    role: 'ML Engineering Intern',
    startDate: '2025-05-01',
    endDate: '2025-07-31',
    mentorOrManager: 'Dr. Aris Thorne (Research Director)',
    status: 'COMPLETED',
    verifiedIssueDate: '2025-08-01'
  },
  {
    id: 'rost-004',
    certificateId: 'CORP-2025-INT-1095',
    candidateName: 'Siddharth Rao',
    department: 'Frontend Engineering',
    role: 'Web Developer Intern',
    startDate: '2025-06-15',
    endDate: '2025-08-15',
    mentorOrManager: 'Pooja Iyer (Engineering Manager)',
    status: 'COMPLETED',
    verifiedIssueDate: '2025-08-16'
  }
];

export const SAMPLE_HR_CLAIMS = [
  {
    id: 'fake-linkedin-claim',
    title: '🚨 Fabricated Claim: Candidate never hired',
    candidateName: 'Harsh Vardhan',
    claimedCertificateId: 'CORP-2025-FAKE-9999',
    claimedRole: 'Senior Principal AI Architect Intern',
    claimedPeriod: 'May 2025 - August 2025',
    claimedMentor: 'Sundar Pichai (Claimed)',
    postText: `Thrilled and humbled to share that I have successfully completed my 4-month stint at Acme Corporation as 'Senior Principal AI Architect Intern'! 🚀 
During my time, I architected the company's entire enterprise LLM cluster and reduced cloud costs by 80%.
Huge thanks to my mentor and the executive board for this honor! Attached is my official certificate of completion! #AI #Internship #Hustle #Career`
  },
  {
    id: 'genuine-claim',
    title: '✅ Legitimate Claim: Matches Roster Record',
    candidateName: 'Ananya Deshmukh',
    claimedCertificateId: 'CORP-2025-INT-1092',
    claimedRole: 'Cloud Systems Intern',
    claimedPeriod: 'May 15, 2025 - July 25, 2025',
    claimedMentor: 'Karthik Raman',
    postText: `Wrapped up an incredible 10 weeks at Acme Corp as a Cloud Systems Intern! Grateful to my manager Karthik Raman and the Core Infrastructure team for guiding me through Kubernetes cluster scaling. Here is my completion credential CORP-2025-INT-1092.`
  },
  {
    id: 'role-inflation-claim',
    title: '⚠️ Exaggerated Title / Department Discrepancy',
    candidateName: 'Siddharth Rao',
    claimedCertificateId: 'CORP-2025-INT-1095',
    claimedRole: 'Head of Artificial Intelligence & Global Engineering',
    claimedPeriod: 'June 2025 - August 2025',
    claimedMentor: 'Pooja Iyer',
    postText: `Proud to conclude my tenure as Head of Artificial Intelligence & Global Engineering at Acme Corp where I managed a team of 40 developers! Credential CORP-2025-INT-1095.`
  }
];

export const SCAM_MILLS_DATABASE: ScamMillRecord[] = [
  {
    id: 'scam-001',
    name: 'Let’sCodeTech / CodeCraft Virtual Hub',
    aliases: ['CodeCraft Labs', 'NextGen Intern Hub', 'SkillElevate Online'],
    scamPattern: 'Mass LinkedIn inmails offering guaranteed internships with no interview, then charging ₹999 - ₹2,499 under "LMS hosting & certificate issuance fees". Students receive auto-generated certificates and zero mentorship.',
    typicalFeeCharged: '₹999 to ₹2,499 ($15 - $35)',
    reportedDomains: ['letscodetech.xyz', 'codecraft-interns.site', 'skill-elevate.online'],
    telegramHandles: ['@letscodetech_support', '@codecraft_hr'],
    dateReported: '2025-08-12',
    victimCountReported: 1420,
    warningNotice: 'Not registered with MCA/ROC. Issues counterfeit certificates created using Canva templates with invalid QR codes.'
  },
  {
    id: 'scam-002',
    name: 'Global Task Boost Media / Alpha Video Review LLC',
    aliases: ['YouTube Task Pay', 'Telegram Daily Review Group', 'MediaBoost 24'],
    scamPattern: 'Task scam posing as a remote digital marketing internship. Prompts students to complete small tasks (liking YouTube videos) and pays ₹150 initially to build trust, then lures them into high-deposit "VIP prepaid task recharge" traps where thousands are stolen.',
    typicalFeeCharged: '₹5,000 to ₹1,50,000 ($60 - $2,000)',
    reportedDomains: ['mediaboost-global.cc', 'youtube-task-work.top'],
    telegramHandles: ['@GlobalMedia_TaskAdmin', '@Elena_Payment_Manager'],
    dateReported: '2025-09-04',
    victimCountReported: 3890,
    warningNotice: 'Active financial cyber-fraud syndicate. Involves unauthorized cryptocurrency wallets and mule bank accounts.'
  },
  {
    id: 'scam-003',
    name: 'Apex Future Infotech Career Solutions',
    aliases: ['Apex Global Tech', 'FutureTech Softwares Pvt Ltd'],
    scamPattern: 'Sends fake appointment letters using forged company registration numbers. Demands a ₹3,500 "refundable security deposit for company laptop & security kit". After payment, the HR WhatsApp account blocks the candidate.',
    typicalFeeCharged: '₹3,500 refundable deposit',
    reportedDomains: ['apex-future-infotech.co.in', 'futuretech-careers.biz'],
    telegramHandles: ['@Apex_HR_Manager'],
    dateReported: '2025-10-18',
    victimCountReported: 870,
    warningNotice: 'Uses forged corporate logos of Indian banks and multinational IT companies in their forged offer letters.'
  },
  {
    id: 'scam-004',
    name: 'Stealth Byte Certificate Forge Network',
    aliases: ['InstantCertify Global', 'InternshipVault Pro'],
    scamPattern: 'Offers students fake backdated internship certificates for $20-$50 claiming to provide "HR background verification support" for college credits and resumes. Sells stolen corporate logos.',
    typicalFeeCharged: '$25 - $75 per certificate',
    reportedDomains: ['instantcertify.club', 'internshipvault-online.org'],
    telegramHandles: ['@buy_intern_cert', '@CertVendor_Bot'],
    dateReported: '2025-07-29',
    victimCountReported: 2150,
    warningNotice: 'Any candidate submitting these certificates to real employers risks immediate blacklisting and academic suspension.'
  }
];
