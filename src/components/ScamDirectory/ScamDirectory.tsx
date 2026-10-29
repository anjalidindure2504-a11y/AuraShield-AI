import React, { useState } from 'react';
import { SCAM_MILLS_DATABASE } from '../../data/samples';
import { ScamMillRecord } from '../../types/detector';
import { 
  AlertTriangle, 
  Search, 
  Plus, 
  ExternalLink, 
  Globe, 
  Send, 
  Users, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  Info 
} from 'lucide-react';

export const ScamDirectory: React.FC = () => {
  const [scams, setScams] = useState<ScamMillRecord[]>(SCAM_MILLS_DATABASE);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  const [newReport, setNewReport] = useState({
    name: '',
    aliases: '',
    scamPattern: '',
    fee: '',
    domains: '',
    telegram: ''
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.name || !newReport.scamPattern) return;

    const entry: ScamMillRecord = {
      id: `scam-${Date.now()}`,
      name: newReport.name,
      aliases: newReport.aliases ? newReport.aliases.split(',').map(s => s.trim()) : [],
      scamPattern: newReport.scamPattern,
      typicalFeeCharged: newReport.fee || '₹1,500 - ₹3,000',
      reportedDomains: newReport.domains ? newReport.domains.split(',').map(s => s.trim()) : [],
      telegramHandles: newReport.telegram ? newReport.telegram.split(',').map(s => s.trim()) : [],
      dateReported: new Date().toISOString().split('T')[0],
      victimCountReported: 1,
      warningNotice: 'Newly reported community incident currently pending peer confirmation.'
    };

    setScams(prev => [entry, ...prev]);
    setShowReportModal(false);
    setReportSuccess(true);
    setNewReport({
      name: '',
      aliases: '',
      scamPattern: '',
      fee: '',
      domains: '',
      telegram: ''
    });

    setTimeout(() => setReportSuccess(false), 5000);
  };

  const filtered = scams.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.aliases.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
    s.reportedDomains.some(d => d.toLowerCase().includes(searchTerm.toLowerCase())) ||
    s.scamPattern.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Community Scam Blacklist Directory
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Verified list of fake internship mills, task scams, and certificate fraud syndicates targeting students.
            </p>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-md shadow-rose-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Report a Scam Syndicate</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blacklisted company name, domain (e.g. .site, .xyz), or scam keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {reportSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Incident report submitted successfully. Thank you for protecting the student community!</span>
        </div>
      )}

      {/* Scam Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((scam) => (
          <div key={scam.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{scam.name}</h3>
                {scam.aliases.length > 0 && (
                  <div className="text-xs text-slate-400 pt-0.5">
                    AKA: {scam.aliases.join(', ')}
                  </div>
                )}
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {scam.victimCountReported.toLocaleString()} Reports
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              {scam.scamPattern}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Fee Extorted:</span>
                <span className="font-semibold text-rose-400">{scam.typicalFeeCharged}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">First Flagged:</span>
                <span className="font-semibold text-slate-200">{scam.dateReported}</span>
              </div>
            </div>

            {scam.reportedDomains.length > 0 && (
              <div className="text-xs space-y-1">
                <span className="text-slate-400 text-[11px] font-medium">Reported Malicious Domains:</span>
                <div className="flex flex-wrap gap-1.5">
                  {scam.reportedDomains.map((dom, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300">
                      {dom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/20 text-[11px] text-rose-200/90 flex items-start space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{scam.warningNotice}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Report a Fraudulent Internship Scheme</span>
            </h3>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Company / Entity Name *</label>
                <input
                  type="text"
                  required
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  placeholder="e.g. NextGen WebDev Hub"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Known Aliases / Other Names (comma-separated)</label>
                <input
                  type="text"
                  value={newReport.aliases}
                  onChange={(e) => setNewReport({ ...newReport, aliases: e.target.value })}
                  placeholder="e.g. NextGen Labs, WebDev Club"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">How did they attempt to scam you? (Scam Pattern) *</label>
                <textarea
                  rows={3}
                  required
                  value={newReport.scamPattern}
                  onChange={(e) => setNewReport({ ...newReport, scamPattern: e.target.value })}
                  placeholder="Describe what fee they demanded (e.g. ₹1,499 registration fee, or telegram task recharge) and what happened..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Fee Demanded</label>
                  <input
                    type="text"
                    value={newReport.fee}
                    onChange={(e) => setNewReport({ ...newReport, fee: e.target.value })}
                    placeholder="e.g. ₹1,999 or $50"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Reported Domain(s)</label>
                  <input
                    type="text"
                    value={newReport.domains}
                    onChange={(e) => setNewReport({ ...newReport, domains: e.target.value })}
                    placeholder="e.g. nextgen-interns.site"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-500"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
