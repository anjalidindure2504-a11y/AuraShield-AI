import React, { useState } from 'react';
import { CertificateInputData, CertificateAnalysisResult } from '../../types/detector';
import { CERTIFICATE_PRESETS } from '../../data/samples';
import { CertificateReport } from './CertificateReport';
import { 
  FileCheck2, 
  UploadCloud, 
  Sparkles, 
  RotateCcw, 
  Search, 
  Loader2, 
  Image as ImageIcon, 
  X, 
  Zap,
  Info,
  Calendar,
  Key,
  Building
} from 'lucide-react';

export const CertificateScanner: React.FC = () => {
  const [formData, setFormData] = useState<CertificateInputData>({
    candidateName: '',
    companyName: '',
    certificateId: '',
    verificationUrl: '',
    issueDate: '',
    duration: '',
    trackDomain: '',
    signatoryName: '',
    certificateText: '',
    imageBase64: ''
  });

  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [result, setResult] = useState<CertificateAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPreset = (presetId: string) => {
    const found = CERTIFICATE_PRESETS.find(p => p.id === presetId);
    if (found) {
      setFormData({
        ...found.data,
        imageBase64: ''
      });
      setImagePreview(null);
      setActivePreset(presetId);
      setErrorMsg(null);
    }
  };

  const handleInputChange = (field: keyof CertificateInputData, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    setActivePreset(null);
    setErrorMsg(null);
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setImagePreview(b64);
      setFormData(prev => ({ ...prev, imageBase64: b64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageBase64: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.certificateText && !formData.certificateId && !formData.companyName && !formData.imageBase64) {
      setErrorMsg('Please provide certificate metadata, transcript text, or an image scan to audit.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep('Inspecting credential ID & issuing authority...');

    try {
      setTimeout(() => setLoadingStep('Auditing typography, seals & date arithmetic...'), 600);
      setTimeout(() => setLoadingStep('Comparing against template mill signatures...'), 1200);

      const res = await fetch('/api/detect/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: CertificateAnalysisResult = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Certificate scan error:', err);
      setErrorMsg('Unable to complete certificate audit. Check connection and retry.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleClear = () => {
    setFormData({
      candidateName: '',
      companyName: '',
      certificateId: '',
      verificationUrl: '',
      issueDate: '',
      duration: '',
      trackDomain: '',
      signatoryName: '',
      certificateText: '',
      imageBase64: ''
    });
    setImagePreview(null);
    setActivePreset(null);
    setResult(null);
    setErrorMsg(null);
  };

  if (result) {
    return (
      <CertificateReport
        result={result}
        onReset={() => setResult(null)}
        uploadedImageUrl={imagePreview || undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <FileCheck2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Fake Internship Certificate Detector
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Detect forged internship certificates, template-mill credentials, impossible dates, and fabricated CEO signatures.
            </p>
          </div>

          <button
            onClick={handleClear}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Fields</span>
          </button>
        </div>

        {/* Quick Presets Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load Sample Certificates for Quick Inspection:</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CERTIFICATE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => loadPreset(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center space-x-1.5 border ${
                  activePreset === p.id
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{p.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/80 text-slate-400">
                  {p.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
          <Info className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Scan Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
        {/* Certificate Scan Drag & Drop Area */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Upload Certificate Scan or Document Image (Optional)</span>
          </label>

          {imagePreview ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={imagePreview}
                  alt="Certificate thumbnail"
                  className="w-16 h-16 rounded object-cover border border-slate-700"
                />
                <div className="text-xs">
                  <div className="font-semibold text-white">Certificate Document Attached</div>
                  <div className="text-slate-400">Ready for visual anomaly & OCR inspection</div>
                </div>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/50"
              onClick={() => {
                const el = document.getElementById('cert-file-input');
                el?.click();
              }}
            >
              <input
                id="cert-file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />
              <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <div className="text-xs font-medium text-slate-300">
                Drag and drop your certificate image here, or <span className="text-indigo-400 underline">browse files</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports PNG, JPG, JPEG, WEBP scans
              </p>
            </div>
          )}
        </div>

        {/* Row 1: Candidate Name & Issuing Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Candidate Name (as written on certificate)
            </label>
            <input
              type="text"
              value={formData.candidateName}
              onChange={(e) => handleInputChange('candidateName', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              <span>Issuing Company / Organization</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="e.g. Microsoft Corporation India or Apex Web Infotech"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Certificate ID & Verification URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>Certificate Serial / Credential ID</span>
            </label>
            <input
              type="text"
              value={formData.certificateId}
              onChange={(e) => handleInputChange('certificateId', e.target.value)}
              placeholder="e.g. APX-2025-001 or MS-INTERN-VERIFY-9921"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Verification Link / QR Target URL
            </label>
            <input
              type="text"
              value={formData.verificationUrl}
              onChange={(e) => handleInputChange('verificationUrl', e.target.value)}
              placeholder="e.g. https://verify.company.com/id or tinyurl.com/xyz"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Row 3: Date, Duration, Signatory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Issue Date on Certificate</span>
            </label>
            <input
              type="text"
              value={formData.issueDate}
              onChange={(e) => handleInputChange('issueDate', e.target.value)}
              placeholder="e.g. Sunday, 14 Sept 2025 or 31 Feb 2025"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Claimed Tenure / Duration
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="e.g. 6 Months (01 Aug - 15 Aug)"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Signatory Name & Designation
            </label>
            <input
              type="text"
              value={formData.signatoryName}
              onChange={(e) => handleInputChange('signatoryName', e.target.value)}
              placeholder="e.g. Satya Nadella, CEO or John Miller, HR"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Certificate Transcript / Text */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Certificate Full Body Text / OCR Transcript
            </label>
            <span className="text-[11px] text-slate-400">
              Paste lines from the certificate for forensic analysis
            </span>
          </div>
          <textarea
            rows={5}
            value={formData.certificateText}
            onChange={(e) => handleInputChange('certificateText', e.target.value)}
            placeholder="Paste complete certificate text, terms, stamps, or CIN numbers here..."
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Checks template-mill markers, seal alterations, and executive forgery</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 transition-all shadow-lg ${
              isLoading
                ? 'bg-slate-800 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-500 hover:to-cyan-600 shadow-cyan-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>{loadingStep || 'Auditing Document...'}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Run Forensic Certificate Audit</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
