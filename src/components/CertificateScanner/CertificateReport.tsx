import React, { useState } from 'react';
import { 
  CertificateAnalysisResult, 
  CertificateVerdict 
} from '../../types/detector';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileWarning, 
  ShieldCheck, 
  Calendar, 
  Key, 
  UserCheck, 
  Building, 
  Printer, 
  ExternalLink,
  Search,
  Eye
} from 'lucide-react';

interface CertificateReportProps {
  result: CertificateAnalysisResult;
  onReset: () => void;
  uploadedImageUrl?: string;
}

export const CertificateReport: React.FC<CertificateReportProps> = ({ 
  result, 
  onReset,
  uploadedImageUrl 
}) => {
  const [showDocInspector, setShowDocInspector] = useState<boolean>(true);

  const getVerdictStyle = (verdict: CertificateVerdict) => {
    switch (verdict) {
      case 'FABRICATED_FORGERY':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          text: 'text-rose-400',
          title: 'FABRICATED / COUNTERFEIT FORGERY'
        };
      case 'HIGH_SUSPICION_TEMPLATE':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
          text: 'text-orange-400',
          title: 'HIGH SUSPICION: TEMPLATE MILL DETECTED'
        };
      case 'UNVERIFIED_DISCREPANCIES':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          text: 'text-amber-400',
          title: 'UNVERIFIED DISCREPANCIES IDENTIFIED'
        };
      case 'LIKELY_GENUINE':
      default:
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          text: 'text-emerald-400',
          title: 'LIKELY GENUINE & VERIFIED'
        };
    }
  };

  const style = getVerdictStyle(result.verdict);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Authenticity Score */}
      <div className={`p-6 rounded-2xl border ${style.bg} ${style.border} relative overflow-hidden backdrop-blur-sm`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${style.badge}`}>
                {style.title}
              </span>
              <span className="text-xs text-slate-400">
                Digital Forensic Document Inspection
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {result.verdictSummary}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {result.recommendation}
            </p>
          </div>

          {/* Authenticity Score Meter */}
          <div className="flex items-center space-x-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shrink-0">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={`transition-all duration-1000 ease-out ${
                    result.authenticityScore >= 75
                      ? 'stroke-emerald-500'
                      : result.authenticityScore >= 45
                      ? 'stroke-amber-500'
                      : 'stroke-rose-500'
                  }`}
                  strokeWidth="8"
                  strokeDasharray={`${result.authenticityScore * 2.51} 251.2`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-white">
                  {result.authenticityScore}%
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Authenticity
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-200">Fraud Probability:</div>
              <div className={`font-extrabold ${result.fraudProbability > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {result.fraudProbability}% Risk
              </div>
              <div className="pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Print Audit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Breakdown Quadrant */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Typography & Fonts</div>
          <div className={`text-xl font-extrabold ${
            result.forensicBreakdown.typographyConsistency > 70 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {result.forensicBreakdown.typographyConsistency}%
          </div>
          <div className="text-[10px] text-slate-500">Font pairing integrity</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Logo & Stamp Seal</div>
          <div className={`text-xl font-extrabold ${
            result.forensicBreakdown.logoAndStampIntegrity > 70 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {result.forensicBreakdown.logoAndStampIntegrity}%
          </div>
          <div className="text-[10px] text-slate-500">Vector artifact check</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Corporate Entity</div>
          <div className={`text-xl font-extrabold ${
            result.forensicBreakdown.companyAuthenticity > 70 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {result.forensicBreakdown.companyAuthenticity}%
          </div>
          <div className="text-[10px] text-slate-500">CIN / Registration presence</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Metadata & Dates</div>
          <div className={`text-xl font-extrabold ${
            result.forensicBreakdown.metadataMatch > 70 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {result.forensicBreakdown.metadataMatch}%
          </div>
          <div className="text-[10px] text-slate-500">Timeline arithmetic</div>
        </div>
      </div>

      {/* Detected Forensic Anomalies */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileWarning className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white text-sm">
              Detected Forensic Red Flags ({result.anomaliesDetected.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Document Inconsistency Analysis
          </span>
        </div>

        {result.anomaliesDetected.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs rounded-xl bg-slate-950 border border-slate-800/80">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            No visual, chronological, or credential anomalies detected. Certificate conforms to authentic standards.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.anomaliesDetected.map((anom, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    anom.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300'
                      : anom.severity === 'HIGH'
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {anom.severity}
                  </span>
                  {anom.locationOnDoc && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      📍 {anom.locationOnDoc}
                    </span>
                  )}
                </div>

                <div className="font-bold text-xs text-slate-200">
                  {anom.title}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {anom.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Credential ID Audit, Date Paradox Audit, Signatory Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Credential ID & Verification URL */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold">
            <Key className="w-4 h-4" />
            <span>Credential ID & QR Endpoint</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Schema Validation:</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                result.credentialIdAudit.status === 'VALID_PATTERN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {result.credentialIdAudit.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-slate-300 pt-1">{result.credentialIdAudit.explanation}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 font-medium">Link Resolution:</span>
            <p className="text-slate-300">{result.credentialIdAudit.verificationUrlCheck}</p>
          </div>
        </div>

        {/* Date & Chronology Sanity */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold">
            <Calendar className="w-4 h-4" />
            <span>Temporal & Date Sanity</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Date Arithmetic:</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                result.dateAnalysis.status === 'LOGICAL' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {result.dateAnalysis.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-slate-300 pt-1">{result.dateAnalysis.explanation}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 font-medium">Claimed Duration:</span>
            <p className="text-slate-300">{result.dateAnalysis.durationClaimed}</p>
          </div>
        </div>

        {/* Signatory Assessment */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold">
            <UserCheck className="w-4 h-4" />
            <span>Signatory & Authority Audit</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400">Signatory Claimed:</div>
            <div className="font-bold text-white">{result.signatoryAssessment.signatoryName}</div>
            <div className="text-slate-400 text-[11px]">{result.signatoryAssessment.signatoryTitle}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
            <span className="text-slate-400 font-medium">Authenticity Check:</span>
            <p className="text-slate-300">{result.signatoryAssessment.verdict}</p>
          </div>
        </div>
      </div>

      {/* Visual Inspector Preview (if Image uploaded) */}
      {uploadedImageUrl && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white text-sm">Uploaded Certificate Document Preview</h3>
            </div>
            <button
              onClick={() => setShowDocInspector(!showDocInspector)}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              {showDocInspector ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
          {showDocInspector && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-center">
              <img
                src={uploadedImageUrl}
                alt="Audited certificate"
                className="max-h-96 rounded-lg object-contain shadow-lg border border-slate-700"
              />
            </div>
          )}
        </div>
      )}

      {/* Reset Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all shadow-md"
        >
          Audit Another Certificate
        </button>
      </div>
    </div>
  );
};
