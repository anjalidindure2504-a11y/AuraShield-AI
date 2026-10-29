import React from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  AlertOctagon, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle,
  PhoneCall,
  Scale
} from 'lucide-react';

export const SafetyGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Student Internship Rights & Fraud Defense Guide
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          A definitive handbook for engineering and college students to navigate hiring offers, corporate verifications, and legal protections.
        </p>
      </div>

      {/* The Golden Rule */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30">
        <div className="flex items-start space-x-3.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-white">
              The Golden Rule: An Internship Pays You; You NEVER Pay for an Internship
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              No genuine tech company, startup, or corporate enterprise will ever ask an applicant or intern for an upfront "registration fee", "security deposit", "laptop kit insurance charge", or "training certificate issuance fee". Any entity requesting money before or during employment is running a commercial training course or an outright advance-fee scam.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Classic Red Flags */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <AlertOctagon className="w-5 h-5 text-rose-400" />
          <span>The 5 Classic Warning Signs of a Fake Internship</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-rose-300 block text-sm">1. Payment Requested via UPI / Crypto</span>
            <p className="text-slate-300 leading-relaxed">
              They claim the fee is "refundable upon completion of the internship" or for "allocating server credentials". Once paid, the recruiter vanishes or blocks your phone number.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-rose-300 block text-sm">2. Free Webmail or WhatsApp-Only Recruiter</span>
            <p className="text-slate-300 leading-relaxed">
              The email arrives from <code>recruiting-company@gmail.com</code> instead of <code>@company.com</code>. Legitimate companies never recruit from personal free webmail addresses.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-rose-300 block text-sm">3. No Technical Evaluation or Interview</span>
            <p className="text-slate-300 leading-relaxed">
              You applied 5 minutes ago and received a "Congratulations! You are selected" email with zero technical assessment, coding round, or interview. Real companies interview candidates to evaluate skills.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-rose-300 block text-sm">4. Telegram "App Review / Video Like" Tasks</span>
            <p className="text-slate-300 leading-relaxed">
              Posing as digital marketing internships, these ask you to subscribe to YouTube channels for small rewards ($2/task) to gain trust, before coercing you into high-deposit "VIP prepaid task recharges".
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 md:col-span-2">
            <span className="font-bold text-rose-300 block text-sm">5. Fabricated Executive Signatures & Canva Templates</span>
            <p className="text-slate-300 leading-relaxed">
              Fake certificates often display high-profile signatures (e.g. Satya Nadella, Sundar Pichai) on an intern completion certificate, lack Corporate Identification Numbers (CIN), or point to short URLs like <code>tinyurl.com</code> instead of a corporate domain.
            </p>
          </div>
        </div>
      </div>

      {/* How to verify corporate registration */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Scale className="w-5 h-5 text-indigo-400" />
          <span>How to Independently Verify a Company's Legitimacy</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-white block">🇮🇳 India: MCA21 Company Registry</span>
            <p className="text-slate-300 leading-relaxed">
              Visit <strong>mca.gov.in</strong> and search for the company's Corporate Identification Number (CIN). If the company is not registered with the Ministry of Corporate Affairs, they cannot legally hire.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-white block">🇺🇸 US: SEC EDGAR & Secretary of State</span>
            <p className="text-slate-300 leading-relaxed">
              Check the State's Division of Corporations (e.g., California, Delaware) or SEC EDGAR for public filings to ensure the entity is actively chartered in good standing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-white block">🇬🇧 UK: Companies House</span>
            <p className="text-slate-300 leading-relaxed">
              Search <strong>find-and-update.company-information.service.gov.uk</strong> to verify the company number, registered office address, and active status.
            </p>
          </div>
        </div>
      </div>

      {/* Cybercrime Reporting Hotlines */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2">
          <PhoneCall className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-base">Victim Support & Emergency Reporting Hotlines</h3>
        </div>
        <p className="text-xs text-slate-300">
          If you have lost money or submitted confidential identity documents (Aadhaar, SSN, Passport) to a fraudulent entity, immediately lodge a complaint:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-medium">India National Cyber Crime:</div>
            <div className="font-bold text-cyan-300 text-sm">Helpline: 1930</div>
            <div className="text-slate-400 text-[11px]">cybercrime.gov.in</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-medium">United States (FBI IC3 / FTC):</div>
            <div className="font-bold text-cyan-300 text-sm">ic3.gov | reportfraud.ftc.gov</div>
            <div className="text-slate-400 text-[11px]">Internet Crime Complaint Center</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400 font-medium">United Kingdom (Action Fraud):</div>
            <div className="font-bold text-cyan-300 text-sm">0300 123 2040</div>
            <div className="text-slate-400 text-[11px]">actionfraud.police.uk</div>
          </div>
        </div>
      </div>
    </div>
  );
};
