import React, { useState } from 'react';
import { 
  JobAnalysisResult, 
  RiskLevel 
} from '../../types/detector';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  Building, 
  DollarSign, 
  MessageSquareWarning, 
  Copy, 
  Check, 
  Printer, 
  ExternalLink,
  Flag,
  RotateCcw,
  Info
} from 'lucide-react';

interface JobRiskReportProps {
  result: JobAnalysisResult;
  onReset: () => void;
  scannedSource?: string;
}

export const JobRiskReport: React.FC<JobRiskReportProps> = ({ 
  result, 
  onReset,
  scannedSource 
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);

  // Four strict user-defined risk tiers
  const getTierVisuals = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL_RISK':
        return {
          title: 'CRITICAL RISK',
          subtitle: 'Confirmed Scam / High Danger of Financial Extortion or Phishing',
          bg: 'bg-rose-950/40',
          border: 'border-rose-500/50',
          gaugeStroke: 'stroke-rose-500',
          badgeBg: 'bg-rose-500 text-white',
          glow: 'shadow-rose-900/30',
          text: 'text-rose-400'
        };
      case 'HIGH_RISK':
        return {
          title: 'HIGH RISK',
          subtitle: 'Severe Red Flags Detected / Multiple Deceptive Patterns Present',
          bg: 'bg-orange-950/40',
          border: 'border-orange-500/50',
          gaugeStroke: 'stroke-orange-500',
          badgeBg: 'bg-orange-500 text-white',
          glow: 'shadow-orange-900/30',
          text: 'text-orange-400'
        };
      case 'LOW_RISK':
        return {
          title: 'LOW RISK',
          subtitle: 'Minor Ambiguities or Non-Standard Terms / Verify Identity Details',
          bg: 'bg-amber-950/40',
          border: 'border-amber-500/50',
          gaugeStroke: 'stroke-amber-400',
          badgeBg: 'bg-amber-500 text-slate-950',
          glow: 'shadow-amber-900/30',
          text: 'text-amber-400'
        };
      case 'NO_RISK':
      default:
        return {
          title: 'NO RISK',
          subtitle: 'Verified Safe / Professional Recruitment & Compensation Standards',
          bg: 'bg-emerald-950/40',
          border: 'border-emerald-500/50',
          gaugeStroke: 'stroke-emerald-400',
          badgeBg: 'bg-emerald-500 text-slate-950',
          glow: 'shadow-emerald-900/30',
          text: 'text-emerald-400'
        };
    }
  };

  const tier = getTierVisuals(result.riskLevel);

  const filteredPhrases = selectedSeverity === 'ALL'
    ? result.suspiciousPhrases
    : result.suspiciousPhrases.filter(p => p.severity === selectedSeverity);

  const copyQuestion = (q: string, idx: number) => {
    navigator.clipboard.writeText(q);
    setCopiedQuestionIndex(idx);
    setTimeout(() => setCopiedQuestionIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ======================================================== */}
      {/* 1. PROMINENT HERO GAUGE & DIRECT TIER BADGE DISPLAY      */}
      {/* ======================================================== */}
      <section className={`p-6 sm:p-8 rounded-2xl border ${tier.border} ${tier.bg} shadow-2xl ${tier.glow} relative overflow-hidden backdrop-blur-sm`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Column: Direct Tier Badge, Score & Verdict */}
          <div className="space-y-4 flex-1 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className={`px-4 py-1.5 rounded-lg text-sm font-black tracking-wider uppercase shadow-md ${tier.badgeBg}`}>
                {tier.title}
              </span>
              <span className="text-xs text-slate-300">
                {tier.subtitle}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {result.verdictSummary}
            </h2>

            <p className="text-sm text-slate-200 leading-relaxed max-w-3xl">
              {result.detailedAnalysis}
            </p>

            {scannedSource && (
              <div className="text-xs text-slate-400 font-mono truncate max-w-xl">
                Audited Source: {scannedSource}
              </div>
            )}
          </div>

          {/* Right Column: High-Impact Radial Risk Gauge */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0 min-w-[220px]">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Radial SVG meter */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`transition-all duration-1000 ease-out ${tier.gaugeStroke}`}
                  strokeWidth="8"
                  strokeDasharray={`${result.riskScore * 2.64} 264`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-white tabular-nums tracking-tight">
                  {result.riskScore}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Risk Index
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 w-full flex items-center justify-between text-xs text-slate-400">
              <span>Classification:</span>
              <span className={`font-bold ${tier.text}`}>{tier.title}</span>
            </div>

            <button
              onClick={() => window.print()}
              className="mt-3 w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit</span>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PAYMENT / FINANCIAL DEMANDS ALERT (IF DETECTED)       */}
      {/* ======================================================== */}
      {result.paymentRequests.hasPaymentRequest && (
        <div className="p-5 rounded-xl border border-rose-500/60 bg-gradient-to-r from-rose-950/60 via-rose-900/30 to-slate-900">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-rose-200">
                  CRITICAL FRAUD TRAP: Upfront Payment Demanded
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-rose-600 text-white uppercase">
                  UNLAWFUL CHARGE
                </span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                {result.paymentRequests.legalNotice}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {result.paymentRequests.detectedCharges.map((chg, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/30 text-xs">
                    <span className="font-bold text-rose-300 block">{chg.type}</span>
                    <span className="text-slate-300">{chg.details}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. COMPANY DOMAIN INTEGRITY & STIPEND/SALARY BENCHMARK   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company & Domain Verification Matrix */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">Company & Domain Integrity Matrix</h3>
            </div>
            <span className="text-xs text-slate-400">DNS & Identity Audit</span>
          </div>

          <div className="space-y-2.5">
            {result.companyVerification.map((check, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                  check.status === 'PASSED' 
                    ? 'bg-slate-950/60 border-emerald-500/20' 
                    : check.status === 'FAILED'
                    ? 'bg-rose-950/30 border-rose-500/30'
                    : 'bg-amber-950/30 border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{check.item}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    check.status === 'PASSED'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : check.status === 'FAILED'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {check.status}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{check.details}</p>
                {check.recommendation && (
                  <p className="text-slate-400 italic text-[11px] pt-0.5">
                    Tip: {check.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Recruiter Channel Safety Rating */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="text-slate-400 text-[11px]">Recruiter Channel Format:</div>
              <div className="font-bold text-white">{result.recruiterChannelSafety.channelType}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-[11px]">Channel Safety:</div>
              <div className={`font-extrabold ${
                result.recruiterChannelSafety.safetyScore > 70 
                  ? 'text-emerald-400' 
                  : result.recruiterChannelSafety.safetyScore > 40
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}>
                {result.recruiterChannelSafety.safetyScore}/100
              </div>
            </div>
          </div>
        </div>

        {/* Stipend / Salary Compensation Analysis */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Compensation & Stipend Audit</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                result.stipendAssessment.assessmentVerdict === 'FAIR_MARKET'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : result.stipendAssessment.assessmentVerdict === 'FEE_DISGUISED'
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {result.stipendAssessment.assessmentVerdict.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-3.5 pt-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Claimed Compensation:</div>
                <div className="text-base font-bold text-white pt-1">
                  {result.stipendAssessment.claimedStipend}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400 font-medium">Evaluation Verdict:</div>
                <p className="text-slate-200 leading-relaxed">
                  {result.stipendAssessment.explanation}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400 font-medium">Market Benchmark Comparison:</div>
                <p className="text-slate-300">
                  {result.stipendAssessment.marketRangeEstimate}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center space-x-2 mt-4">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              Real employers evaluate skill fit via interviews; they never offer high compensation without assessments or ask employees to pay.
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. SUSPICIOUS PHRASES INSPECTOR (EXACT EVIDENCE)         */}
      {/* ======================================================== */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <MessageSquareWarning className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">
              Suspicious Phrases & Red Flags Detected ({result.suspiciousPhrases.length})
            </h3>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex items-center space-x-1 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {filteredPhrases.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs rounded-xl bg-slate-950 border border-slate-800/80">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            No suspicious phrases matching this severity filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPhrases.map((phrase, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    phrase.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300'
                      : phrase.severity === 'HIGH'
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {phrase.severity}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {phrase.category.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-amber-200 break-words">
                  "{phrase.phrase}"
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {phrase.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. ACTION CHECKLIST & SAFE QUESTIONS TO ASK RECRUITER    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Action Checklist */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Action Steps to Protect Yourself</h3>
          </div>
          <ul className="space-y-2.5">
            {result.studentActionChecklist.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Safe Questions for Recruiter */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Flag className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">Safe Questions to Ask the Recruiter</h3>
            </div>
            <span className="text-[11px] text-slate-400">Click to Copy</span>
          </div>
          <div className="space-y-2.5">
            {result.safeInterviewQuestions.map((q, idx) => (
              <div 
                key={idx}
                onClick={() => copyQuestion(q, idx)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 flex items-center justify-between cursor-pointer transition-colors group"
              >
                <span className="pr-2">{q}</span>
                <button className="text-slate-400 group-hover:text-indigo-400 p-1">
                  {copiedQuestionIndex === idx ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reset & Scan Another Offer */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Audit Another Real-Time Listing or Offer</span>
        </button>
      </div>
    </div>
  );
};
