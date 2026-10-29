import React from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  Building2, 
  AlertTriangle, 
  BookOpen, 
  Zap
} from 'lucide-react';

export type ActiveTab = 'job-detector' | 'certificate-detector' | 'hr-portal' | 'scam-directory' | 'safety-guide';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    {
      id: 'job-detector' as ActiveTab,
      label: 'Offer & Job Scanner',
      icon: ShieldCheck,
      badge: 'Real-Time'
    },
    {
      id: 'certificate-detector' as ActiveTab,
      label: 'Certificate Forensics',
      icon: FileCheck2,
      badge: 'Multimodal'
    },
    {
      id: 'hr-portal' as ActiveTab,
      label: 'Company HR Portal',
      icon: Building2,
      badge: 'LinkedIn Audit'
    },
    {
      id: 'scam-directory' as ActiveTab,
      label: 'Scam Blacklist',
      icon: AlertTriangle,
    },
    {
      id: 'safety-guide' as ActiveTab,
      label: 'Student Safety Guide',
      icon: BookOpen,
    }
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Wordmark */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer whitespace-nowrap shrink-0" 
            onClick={() => setActiveTab('job-detector')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-tight text-white">
                AuraShield<span className="text-cyan-400">AI</span>
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-indigo-700/80 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setActiveTab('job-detector')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 whitespace-nowrap shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-200" />
              <span>Real-Time Audit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
