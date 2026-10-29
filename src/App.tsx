/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { JobScanner } from './components/JobScanner/JobScanner';
import { CertificateScanner } from './components/CertificateScanner/CertificateScanner';
import { HrPortal } from './components/HrPortal/HrPortal';
import { ScamDirectory } from './components/ScamDirectory/ScamDirectory';
import { SafetyGuide } from './components/SafetyGuide/SafetyGuide';
import { ShieldCheck, Heart, ExternalLink, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('job-detector');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'job-detector' && <JobScanner />}
        {activeTab === 'certificate-detector' && <CertificateScanner />}
        {activeTab === 'hr-portal' && <HrPortal />}
        {activeTab === 'scam-directory' && <ScamDirectory />}
        {activeTab === 'safety-guide' && <SafetyGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              AS
            </div>
            <span className="font-semibold text-slate-300">AuraShield AI Suite</span>
            <span className="text-slate-500">• Real-Time Employment & Credential Defense</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <button
              onClick={() => setActiveTab('safety-guide')}
              className="hover:text-cyan-400 transition-colors"
            >
              Labor Rights & Law
            </button>
            <button
              onClick={() => setActiveTab('scam-directory')}
              className="hover:text-rose-400 transition-colors"
            >
              Blacklist Directory
            </button>
            <button
              onClick={() => setActiveTab('hr-portal')}
              className="hover:text-indigo-400 transition-colors"
            >
              For HR Recruiters
            </button>
          </div>

          <p className="text-slate-400 text-center sm:text-right">
            Protecting students & companies from fraudulent internship advertisements and forged credentials.
          </p>
        </div>
      </footer>
    </div>
  );
}
