import React, { useState } from 'react';
import { JobInputData, JobAnalysisResult, RealTimeInputMode, LiveUrlFetchResult } from '../../types/detector';
import { JOB_PRESETS } from '../../data/samples';
import { JobRiskReport } from './JobRiskReport';
import { 
  ShieldCheck, 
  Globe, 
  MessageSquare, 
  FileText, 
  UploadCloud, 
  RotateCcw, 
  Search, 
  Loader2, 
  Zap, 
  Building2, 
  DollarSign, 
  Mail, 
  ExternalLink,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';

export const JobScanner: React.FC = () => {
  const [activeInputMode, setActiveInputMode] = useState<RealTimeInputMode>('custom-form');
  
  // Real-time custom form data
  const [formData, setFormData] = useState<JobInputData>({
    jobTitle: '',
    companyName: '',
    companyDomain: '',
    stipend: '',
    location: '',
    requirements: '',
    contactInfo: '',
    jobDescription: ''
  });

  // Real-time URL Fetcher state
  const [liveUrl, setLiveUrl] = useState<string>('');
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false);
  const [fetchedUrlData, setFetchedUrlData] = useState<LiveUrlFetchResult | null>(null);

  // Chat forward parser state
  const [rawForwardText, setRawForwardText] = useState<string>('');
  const [parsedForwardNotice, setParsedForwardNotice] = useState<string | null>(null);

  // Document upload state
  const [uploadedDocName, setUploadedDocName] = useState<string | null>(null);

  // Processing & Results state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<JobAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handleInputChange = (field: keyof JobInputData, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    setActivePreset(null);
    setErrorMsg(null);
  };

  // 1. REAL-TIME URL FETCHER HANDLER
  const handleFetchLiveUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveUrl.trim()) {
      setErrorMsg('Please enter a job posting or company URL to fetch.');
      return;
    }

    setIsFetchingUrl(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/fetch-live-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: liveUrl.trim() })
      });

      if (!res.ok) throw new Error('Failed to fetch URL content');
      const data: LiveUrlFetchResult = await res.json();
      setFetchedUrlData(data);

      // Populate form data with real-time extracted content
      setFormData(prev => ({
        ...prev,
        jobTitle: prev.jobTitle || data.title.split('-')[0].trim() || 'Online Position',
        companyDomain: data.domain,
        companyName: prev.companyName || data.domain.replace(/\.[a-zA-Z]+$/, ''),
        jobDescription: data.extractedText
      }));
    } catch (err: any) {
      setErrorMsg('Could not directly fetch page. You can still paste the job description text manually below.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  // 2. REAL-TIME CHAT FORWARD PARSER
  const handleParseChatForward = (text: string) => {
    setRawForwardText(text);
    if (!text.trim()) {
      setParsedForwardNotice(null);
      return;
    }

    // Heuristically extract phone numbers, handles, and monetary claims
    let phoneMatch = text.match(/(?:\+91|91)?\s?[6-9]\d{9}|\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b/);
    let tgMatch = text.match(/@([a-zA-Z0-9_]{4,})/);
    let emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
    let moneyMatch = text.match(/(?:₹|\$|rs\.?|inr|usd)\s?\d+(?:,\d+)*(?:\/day|\/month|\/task|\s?daily)?/i);

    const detectedContact = [
      phoneMatch ? `Phone/WhatsApp: ${phoneMatch[0]}` : null,
      tgMatch ? `Telegram: ${tgMatch[0]}` : null,
      emailMatch ? `Email: ${emailMatch[0]}` : null
    ].filter(Boolean).join(' | ');

    setFormData(prev => ({
      ...prev,
      jobDescription: text,
      contactInfo: detectedContact || prev.contactInfo,
      stipend: moneyMatch ? moneyMatch[0] : prev.stipend,
      jobTitle: prev.jobTitle || 'Remote Freelance / Task Opportunity'
    }));

    setParsedForwardNotice(`Real-time parsed: ${detectedContact ? 'Contacts detected. ' : ''}${moneyMatch ? 'Compensation detected. ' : ''}Ready for forensic fraud scan.`);
  };

  // 3. DOCUMENT UPLOAD HANDLER
  const handleDocumentUpload = (file: File) => {
    setUploadedDocName(file.name);
    setErrorMsg(null);

    // If text file
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setFormData(prev => ({
          ...prev,
          jobDescription: text,
          jobTitle: prev.jobTitle || file.name.replace(/\.[^/.]+$/, '')
        }));
      };
      reader.readAsText(file);
    } else {
      // For images or PDFs, read as data URI or extract name
      setFormData(prev => ({
        ...prev,
        jobDescription: prev.jobDescription || `Document file attached: ${file.name} (${Math.round(file.size / 1024)} KB). Evaluating employment contract terms and corporate typography.`,
        jobTitle: prev.jobTitle || file.name.replace(/\.[^/.]+$/, '')
      }));
    }
  };

  // 4. LOAD SAMPLE PRESETS (FOR DEMONSTRATION)
  const loadPreset = (presetId: string) => {
    const found = JOB_PRESETS.find(p => p.id === presetId);
    if (found) {
      setFormData(found.data);
      setActivePreset(presetId);
      setActiveInputMode('custom-form');
      setErrorMsg(null);
    }
  };

  // 5. RUN FORENSIC SCAN
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobDescription.trim() && !formData.jobTitle.trim() && !formData.companyName.trim()) {
      setErrorMsg('Please input real-time job details, paste a forwarded message, or provide a URL to audit.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep('Ingesting real-time employment data...');

    try {
      setTimeout(() => setLoadingStep('Analyzing compensation & advance payment traps...'), 500);
      setTimeout(() => setLoadingStep('Auditing corporate domain & recruiter channels...'), 1100);

      const res = await fetch('/api/detect/job-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error(`Server returned status ${res.status}`);

      const data: JobAnalysisResult = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Scan error:', err);
      setErrorMsg('Unable to complete deep forensic scan. Please check connection and try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setActivePreset(null);
  };

  const handleClearAll = () => {
    setFormData({
      jobTitle: '',
      companyName: '',
      companyDomain: '',
      stipend: '',
      location: '',
      requirements: '',
      contactInfo: '',
      jobDescription: ''
    });
    setLiveUrl('');
    setFetchedUrlData(null);
    setRawForwardText('');
    setParsedForwardNotice(null);
    setUploadedDocName(null);
    setActivePreset(null);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  if (analysisResult) {
    return (
      <JobRiskReport 
        result={analysisResult} 
        onReset={handleReset}
        scannedSource={formData.companyDomain || formData.companyName || liveUrl || 'Real-Time Submission'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Real-Time Offer & Job Fraud Scanner
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Audit live job listings, internship offers, freelance gigs, and contract terms with instant risk scoring.
            </p>
          </div>

          <button
            onClick={handleClearAll}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>

        {/* 4 Real-Time Input Mode Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-3">
            Select Real-Time Data Ingestion Pipeline:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setActiveInputMode('custom-form')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                activeInputMode === 'custom-form'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1.5">
                <FileText className={`w-4 h-4 ${activeInputMode === 'custom-form' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">1. Live Custom Input</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Fill details or paste raw offer text directly
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveInputMode('live-url')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                activeInputMode === 'live-url'
                  ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1.5">
                <Globe className={`w-4 h-4 ${activeInputMode === 'live-url' ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">2. Direct Live URL</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Scrape & audit LinkedIn or career pages
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveInputMode('chat-forward')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                activeInputMode === 'chat-forward'
                  ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1.5">
                <MessageSquare className={`w-4 h-4 ${activeInputMode === 'chat-forward' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">3. Chat Forward Parser</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Paste WhatsApp/Telegram forwards
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveInputMode('document-upload')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                activeInputMode === 'document-upload'
                  ? 'bg-amber-600/20 border-amber-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1.5">
                <UploadCloud className={`w-4 h-4 ${activeInputMode === 'document-upload' ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">4. Contract / File Upload</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Upload appointment letter or PDF/Image
              </p>
            </button>
          </div>
        </div>

        {/* Quick Test Presets Carousel */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Or test with real-world case studies:</span>
          </span>
          {JOB_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPreset(p.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all border ${
                activePreset === p.id
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </section>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2 SPECIFIC: DIRECT LIVE URL FETCHER INTERFACE       */}
      {/* ======================================================== */}
      {activeInputMode === 'live-url' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Direct Job Post & Career Portal URL Ingestion</span>
            </h3>
            <p className="text-xs text-slate-400">
              Provide any live public URL (e.g. LinkedIn job post, Indeed link, Google Form, or company careers page). Our real-time engine will extract and audit the posting.
            </p>
          </div>

          <form onSubmit={handleFetchLiveUrl} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="e.g. https://www.linkedin.com/jobs/view/... or https://apex-tech.free.site/careers"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isFetchingUrl}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shrink-0"
            >
              {isFetchingUrl ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching URL...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Fetch & Extract Content</span>
                </>
              )}
            </button>
          </form>

          {fetchedUrlData && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/20 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{fetchedUrlData.title}</span>
                <span className="font-mono text-cyan-400">{fetchedUrlData.domain}</span>
              </div>
              <p className="text-slate-400 text-[11px] line-clamp-2">
                {fetchedUrlData.extractedText.slice(0, 200)}...
              </p>
              <div className="text-emerald-400 font-semibold text-[11px] pt-1">
                ✓ Extracted content populated into analysis pipeline. Click "Run Forensic Fraud Scan" below.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3 SPECIFIC: MULTI-CHANNEL CHAT FORWARD PARSER       */}
      {/* ======================================================== */}
      {activeInputMode === 'chat-forward' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Multi-Channel Chat Forward Parser (WhatsApp / Telegram / SMS)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Students frequently receive suspicious job offers forwarded in group chats. Paste the raw message exactly as received.
            </p>
          </div>

          <textarea
            rows={5}
            value={rawForwardText}
            onChange={(e) => handleParseChatForward(e.target.value)}
            placeholder={`Paste raw forwarded chat text here, e.g.:\n"🔥 URGENT HIRING: Part-time Work From Home! Earn ₹3,000 daily by reviewing YouTube videos. No experience required. WhatsApp HR at +91 98765 43210 to claim ₹500 joining bonus!"`}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors"
          />

          {parsedForwardNotice && (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{parsedForwardNotice}</span>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 4 SPECIFIC: FILE / CONTRACT UPLOAD                  */}
      {/* ======================================================== */}
      {activeInputMode === 'document-upload' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <UploadCloud className="w-4 h-4 text-amber-400" />
            <span>Employment Contract, Offer Letter or Poster Upload</span>
          </h3>

          <div
            onClick={() => document.getElementById('contract-upload-input')?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-amber-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/60"
          >
            <input
              id="contract-upload-input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleDocumentUpload(e.target.files[0]);
                }
              }}
            />
            <UploadCloud className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
            <div className="text-xs font-semibold text-slate-200">
              {uploadedDocName ? `Uploaded: ${uploadedDocName}` : 'Drop employment contract, appointment letter, or job poster here'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports PDF, PNG, JPG, or TXT
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CORE FORM INPUTS (COMMON TO ALL PIPELINES)               */}
      {/* ======================================================== */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Role / Job Title
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="e.g. AI / Web Development Intern or Remote Reviewer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Company / Organization Name</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="e.g. Apex Infotech Solutions or Google LLC"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Company Website or Domain
            </label>
            <input
              type="text"
              value={formData.companyDomain}
              onChange={(e) => handleInputChange('companyDomain', e.target.value)}
              placeholder="e.g. apex-careers.free.site or razorpay.com"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Claimed Stipend / Salary / Fees</span>
            </label>
            <input
              type="text"
              value={formData.stipend}
              onChange={(e) => handleInputChange('stipend', e.target.value)}
              placeholder="e.g. ₹25,000/mo (₹1,500 kit fee required)"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Location / Mode
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g. Remote / Work From Home / Bengaluru"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Recruiter Contact Channels (Email, WhatsApp, Telegram)</span>
            </label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) => handleInputChange('contactInfo', e.target.value)}
              placeholder="e.g. hr@gmail.com | WhatsApp: +91 98... | Telegram @task_hr"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Candidate Eligibility / Skill Requirements
            </label>
            <input
              type="text"
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="e.g. Anyone can apply, no prior experience needed"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Full Job Description, Offer Letter, or Advertisement Text *
            </label>
            <span className="text-[11px] text-slate-400">
              Include all payment conditions, terms, or contact links
            </span>
          </div>
          <textarea
            rows={7}
            value={formData.jobDescription}
            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
            placeholder="Paste complete real-time job advertisement, appointment letter terms, Telegram instructions, or WhatsApp forward here..."
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            Directly computes risk percentage and displays tier (Critical, High, Low, or No Risk).
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 transition-all shadow-lg ${
              isLoading
                ? 'bg-slate-800 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-700 hover:from-cyan-500 hover:to-indigo-600 shadow-indigo-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>{loadingStep || 'Running Forensic Fraud Scan...'}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Run Forensic Fraud Scan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
