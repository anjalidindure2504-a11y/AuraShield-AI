import React, { useState } from 'react';
import { HrRosterRecord, HrVerificationResult, HrMatchStatus } from '../../types/detector';
import { INITIAL_HR_ROSTER, SAMPLE_HR_CLAIMS } from '../../data/samples';
import { 
  Building2, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileWarning, 
  Copy, 
  Check, 
  Plus, 
  Search, 
  Share2, 
  Download, 
  Trash2, 
  ShieldAlert, 
  Loader2,
  Sparkles,
  Linkedin,
  FileText,
  BadgeAlert
} from 'lucide-react';

export const HrPortal: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'claim-auditor' | 'roster-registry' | 'fraud-ledger'>('claim-auditor');
  const [companyName, setCompanyName] = useState<string>('Acme Global Technologies Inc.');
  
  // Roster state
  const [roster, setRoster] = useState<HrRosterRecord[]>(INITIAL_HR_ROSTER);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Claim audit inputs
  const [candidateName, setCandidateName] = useState<string>('');
  const [claimedCertId, setClaimedCertId] = useState<string>('');
  const [claimedRole, setClaimedRole] = useState<string>('');
  const [claimedPeriod, setClaimedPeriod] = useState<string>('');
  const [claimedMentor, setClaimedMentor] = useState<string>('');
  const [postText, setPostText] = useState<string>('');

  // Results state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<HrVerificationResult | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Fraud Ledger state
  const [flaggedCases, setFlaggedCases] = useState<Array<{
    id: string;
    candidateName: string;
    claimedRole: string;
    violation: string;
    dateFlagged: string;
    status: string;
  }>>([
    {
      id: 'CASE-2025-081',
      candidateName: 'Harsh Vardhan',
      claimedRole: 'Senior Principal AI Architect Intern',
      violation: 'Total fabrication; never employed by company. Forged credential presented on LinkedIn.',
      dateFlagged: '2025-10-14',
      status: 'Notice Issued'
    }
  ]);

  // Add Intern Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newIntern, setNewIntern] = useState({
    candidateName: '',
    department: 'Software Engineering',
    role: 'Software Development Intern',
    startDate: '',
    endDate: '',
    mentorOrManager: '',
    status: 'COMPLETED' as const
  });

  const loadClaimSample = (sampleId: string) => {
    const s = SAMPLE_HR_CLAIMS.find(x => x.id === sampleId);
    if (s) {
      setCandidateName(s.candidateName);
      setClaimedCertId(s.claimedCertificateId);
      setClaimedRole(s.claimedRole);
      setClaimedPeriod(s.claimedPeriod);
      setClaimedMentor(s.claimedMentor);
      setPostText(s.postText);
      setVerificationResult(null);
    }
  };

  const handleAuditClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() && !claimedCertId.trim() && !postText.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/hr/verify-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          claimedCompany: companyName,
          claimedCertId,
          claimedRole,
          claimedPeriod,
          claimedMentor,
          postText,
          rosterRecords: roster
        })
      });

      if (!res.ok) throw new Error('HR verification failed');
      const data: HrVerificationResult = await res.json();
      setVerificationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogToFraudLedger = () => {
    if (!verificationResult) return;
    const newCase = {
      id: `CASE-2025-${Math.floor(100 + Math.random() * 900)}`,
      candidateName: verificationResult.candidateName,
      claimedRole: claimedRole || 'Unspecified Intern Role',
      violation: verificationResult.auditNotes.join('; '),
      dateFlagged: new Date().toISOString().split('T')[0],
      status: 'Escalated to Legal'
    };
    setFlaggedCases(prev => [newCase, ...prev]);
    setActiveSubTab('fraud-ledger');
  };

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleAddNewIntern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIntern.candidateName) return;

    const certId = `CORP-2025-INT-${1100 + roster.length}`;
    const record: HrRosterRecord = {
      id: `rost-${Date.now()}`,
      certificateId: certId,
      candidateName: newIntern.candidateName,
      department: newIntern.department,
      role: newIntern.role,
      startDate: newIntern.startDate || '2025-06-01',
      endDate: newIntern.endDate || '2025-08-31',
      mentorOrManager: newIntern.mentorOrManager || 'Engineering Lead',
      status: newIntern.status,
      verifiedIssueDate: new Date().toISOString().split('T')[0]
    };

    setRoster(prev => [record, ...prev]);
    setShowAddModal(false);
    setNewIntern({
      candidateName: '',
      department: 'Software Engineering',
      role: 'Software Development Intern',
      startDate: '',
      endDate: '',
      mentorOrManager: '',
      status: 'COMPLETED'
    });
  };

  const filteredRoster = roster.filter(r => 
    r.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top HR Portal Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Building2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Company HR Verification & LinkedIn Claim Auditor
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Protect your corporate reputation. Audit candidates posting fake certificates or inflated titles claiming to be from your company.
            </p>
          </div>

          {/* Company Workspace Picker */}
          <div className="flex items-center space-x-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400">Company Workspace:</span>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-slate-900 px-2.5 py-1 rounded text-white font-medium border border-slate-700 text-xs focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex space-x-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('claim-auditor')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'claim-auditor'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            <Linkedin className="w-4 h-4 text-cyan-400" />
            <span>Audit LinkedIn Claim / Certificate</span>
          </button>

          <button
            onClick={() => setActiveSubTab('roster-registry')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'roster-registry'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Intern Database ({roster.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('fraud-ledger')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'fraud-ledger'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            <BadgeAlert className="w-4 h-4 text-rose-400" />
            <span>Flagged Fraud Ledger ({flaggedCases.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CLAIM AUDITOR & LINKEDIN AUDIT */}
      {activeSubTab === 'claim-auditor' && (
        <div className="space-y-6">
          {/* Quick Preset Claims */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load Sample Candidate Claims:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_HR_CLAIMS.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => loadClaimSample(sc.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors"
                >
                  {sc.title}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAuditClaim} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Candidate Name to Verify</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Harsh Vardhan or Ananya Deshmukh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Claimed Certificate ID</label>
                <input
                  type="text"
                  value={claimedCertId}
                  onChange={(e) => setClaimedCertId(e.target.value)}
                  placeholder="e.g. CORP-2025-INT-1092"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Claimed Role / Title</label>
                <input
                  type="text"
                  value={claimedRole}
                  onChange={(e) => setClaimedRole(e.target.value)}
                  placeholder="e.g. Lead AI Architect Intern"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Claimed Duration / Period</label>
                <input
                  type="text"
                  value={claimedPeriod}
                  onChange={(e) => setClaimedPeriod(e.target.value)}
                  placeholder="e.g. May 2025 - August 2025"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Claimed Supervisor / Mentor</label>
                <input
                  type="text"
                  value={claimedMentor}
                  onChange={(e) => setClaimedMentor(e.target.value)}
                  placeholder="e.g. Karthik Raman or Sundar Pichai"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                <span>LinkedIn Post Announcement / Resume Experience Text</span>
              </label>
              <textarea
                rows={4}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Paste the candidate's LinkedIn celebration post text or resume paragraph here..."
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cross-Auditing Against Company Roster...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Audit Candidate Claim</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Audit Result Display */}
          {verificationResult && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-fadeIn">
              {/* Status Header */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                verificationResult.matchStatus === 'CONFIRMED_AUTHENTIC'
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : verificationResult.matchStatus === 'DEPARTMENT_MISMATCH'
                  ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm uppercase tracking-wider px-2 py-0.5 rounded bg-black/40">
                      {verificationResult.matchStatus.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-300">
                      {verificationResult.confidenceScore}% Verification Confidence
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Audit for Candidate: {verificationResult.candidateName}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  {verificationResult.matchStatus !== 'CONFIRMED_AUTHENTIC' && (
                    <button
                      onClick={handleLogToFraudLedger}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      Log to Fraud Ledger
                    </button>
                  )}
                </div>
              </div>

              {/* Audit Notes */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400">Compliance Audit Notes:</span>
                <ul className="space-y-1.5">
                  {verificationResult.auditNotes.map((note, idx) => (
                    <li key={idx} className="text-xs text-slate-200 flex items-start space-x-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Matched Record in Database (if found) */}
              {verificationResult.rosterMatch && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Official Match Found in Company Internship Records:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 block">Candidate:</span>
                      <span className="font-semibold text-white">{verificationResult.rosterMatch.candidateName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Official Role:</span>
                      <span className="font-semibold text-white">{verificationResult.rosterMatch.role}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Department:</span>
                      <span className="font-semibold text-white">{verificationResult.rosterMatch.department}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Verified Dates:</span>
                      <span className="font-semibold text-white">
                        {verificationResult.rosterMatch.startDate} to {verificationResult.rosterMatch.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Toolkit: Legal Notice & LinkedIn Report Letter Generator */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Formal Discrepancy Notice */}
                {verificationResult.generatedNoticeLetter && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span>Formal HR Notice to Candidate</span>
                      </span>
                      <button
                        onClick={() => handleCopyText(verificationResult.generatedNoticeLetter!, 'notice')}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                      >
                        {copiedType === 'notice' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Notice</span>
                      </button>
                    </div>
                    <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto p-2 bg-slate-900 rounded">
                      {verificationResult.generatedNoticeLetter}
                    </pre>
                  </div>
                )}

                {/* LinkedIn Infringement Report Draft */}
                {verificationResult.generatedLinkedInReport && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <Linkedin className="w-4 h-4 text-cyan-400" />
                        <span>LinkedIn Takedown / Fraud Report Draft</span>
                      </span>
                      <button
                        onClick={() => handleCopyText(verificationResult.generatedLinkedInReport!, 'linkedin')}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                      >
                        {copiedType === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Report</span>
                      </button>
                    </div>
                    <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto p-2 bg-slate-900 rounded">
                      {verificationResult.generatedLinkedInReport}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ROSTER REGISTRY */}
      {activeSubTab === 'roster-registry' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, cert ID, role..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Register Verified Intern</span>
              </button>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Certificate ID</th>
                  <th className="px-4 py-3">Candidate Name</th>
                  <th className="px-4 py-3">Department & Role</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Mentor</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredRoster.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-cyan-300 font-bold">{r.certificateId}</td>
                    <td className="px-4 py-3 font-semibold text-white">{r.candidateName}</td>
                    <td className="px-4 py-3">
                      <div>{r.role}</div>
                      <div className="text-[10px] text-slate-500">{r.department}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {r.startDate} to {r.endDate}
                    </td>
                    <td className="px-4 py-3">{r.mentorOrManager}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: FRAUD LEDGER */}
      {activeSubTab === 'fraud-ledger' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-white text-sm">Internal Fraud & Discrepancy Ledger</h3>
            </div>
            <span className="text-xs text-slate-400">
              Preserved evidence for university dean and LinkedIn reports
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {flaggedCases.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {c.id}
                    </span>
                    <span className="font-bold text-sm text-white">{c.candidateName}</span>
                  </div>
                  <span className="text-xs text-slate-400">Flagged on: {c.dateFlagged}</span>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400">Claimed: </span>
                  <span className="font-semibold text-rose-200">{c.claimedRole}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                  {c.violation}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    Status: {c.status}
                  </span>
                  <button
                    onClick={() => setFlaggedCases(prev => prev.filter(x => x.id !== c.id))}
                    className="text-slate-500 hover:text-rose-400 text-xs p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Intern Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Register Verified Intern Record</h3>
            <form onSubmit={handleAddNewIntern} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={newIntern.candidateName}
                  onChange={(e) => setNewIntern({ ...newIntern, candidateName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  placeholder="e.g. Maya Patel"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Department</label>
                <input
                  type="text"
                  value={newIntern.department}
                  onChange={(e) => setNewIntern({ ...newIntern, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Assigned Role</label>
                <input
                  type="text"
                  value={newIntern.role}
                  onChange={(e) => setNewIntern({ ...newIntern, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newIntern.startDate}
                    onChange={(e) => setNewIntern({ ...newIntern, startDate: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={newIntern.endDate}
                    onChange={(e) => setNewIntern({ ...newIntern, endDate: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Supervisor / Mentor</label>
                <input
                  type="text"
                  value={newIntern.mentorOrManager}
                  onChange={(e) => setNewIntern({ ...newIntern, mentorOrManager: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  placeholder="e.g. Vikas Gupta (VP Eng)"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
