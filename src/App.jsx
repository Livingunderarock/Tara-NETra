import React, { useState, useCallback } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Overview from './pages/Overview';
import Analyze from './pages/Analyze';
import TrainingStudio from './pages/TrainingStudio';
import Knowledge from './pages/Knowledge';
import Compliance from './pages/Compliance';
import Findings from './pages/Findings';
import Remediation from './pages/Remediation';
import Evidence from './pages/Evidence';
import TutorialGuide from './components/TutorialGuide';
import TaraDemoModal from './components/TaraDemoModal';
import { analyzeConfiguration } from './core/interpreter';
import { evaluateCompliance, generateHeatmap } from './core/compliance';
import { saveAnalysis, getAnalysisHistory } from './services/storage';

// Refined, understated astronomical/instrument icons
const navItems = [
  { path: '/', label: 'Overview', icon: '☉' },
  { path: '/analyze', label: 'Analyze', icon: '◬' },
  { path: '/training', label: 'Training', icon: '⚚' },
  { path: '/knowledge', label: 'Knowledge', icon: '☵' },
  { path: '/compliance', label: 'Compliance', icon: '◫' },
  { path: '/findings', label: 'Findings', icon: '△' },
  { path: '/remediation', label: 'Remediation', icon: '↻' },
  { path: '/evidence', label: 'Evidence', icon: '◎' },
];

export default function App() {
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [complianceResult, setComplianceResult] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [configText, setConfigText] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState(() => getAnalysisHistory());
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const handleAnalyze = useCallback((text, name) => {
    setConfigText(text);
    setDeviceName(name);

    const analysis = analyzeConfiguration(text);
    analysis.deviceName = name;
    setAnalysisResult(analysis);

    const compliance = evaluateCompliance(analysis.sbm);
    analysis.compliancePercent = compliance.summary.compliancePercent;
    analysis.complianceSummary = compliance.summary;
    setComplianceResult(compliance);

    const heatmap = generateHeatmap(compliance);
    setHeatmapData(heatmap);

    // Save to history
    saveAnalysis(analysis);
    setHistory(getAnalysisHistory());

    showToast(`Analysis completed — ${analysis.vendor.vendor} (${analysis.stats.recognizedPercent}% recognized)`);
    navigate('/analyze');
  }, [navigate, showToast]);

  const handleReanalyze = useCallback(() => {
    if (configText) {
      handleAnalyze(configText, deviceName);
      showToast('Configuration re-analyzed with updated knowledge');
    }
  }, [configText, deviceName, handleAnalyze, showToast]);

  return (
    <div className="app-layout">
      {/* Sidebar Rail */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-brand-wrapper">
            {/* Engraved Yantra Emblem */}
            <svg className="sidebar-emblem" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16.5" stroke="#B08A3C" strokeWidth="0.8" strokeDasharray="1.5 2.5"/>
              <circle cx="18" cy="18" r="14" stroke="#20263A" strokeWidth="1"/>
              <circle cx="18" cy="18" r="10.5" stroke="#B08A3C" strokeWidth="0.7"/>
              <path d="M 8 18 C 11.5 12, 24.5 12, 28 18 C 24.5 24, 11.5 24, 8 18 Z" stroke="#20263A" strokeWidth="1.1"/>
              <circle cx="18" cy="18" r="3.5" stroke="#B08A3C" strokeWidth="0.9"/>
              <circle cx="18" cy="18" r="1.4" fill="#A66A2C"/>
              <line x1="18" y1="1" x2="18" y2="4" stroke="#A66A2C" strokeWidth="1"/>
              <line x1="18" y1="32" x2="18" y2="35" stroke="#A66A2C" strokeWidth="1"/>
              <line x1="1" y1="18" x2="4" y2="18" stroke="#A66A2C" strokeWidth="1"/>
              <line x1="32" y1="18" x2="35" y2="18" stroke="#A66A2C" strokeWidth="1"/>
            </svg>
            <div>
              <span className="sidebar-brand">Tārā-NETra</span>
              <div className="sidebar-devanagari">तारानेत्र</div>
            </div>
          </NavLink>
          <div className="sidebar-brand-sub">The Guiding Eye for Security</div>
        </div>

        <div className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={item.path === '/'}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Guided 2-Minute Competition Demonstration Trigger */}
        <button
          className="sidebar-demo-btn"
          onClick={() => setIsDemoOpen(true)}
          title="Run 2-Minute Guided Competition Demonstration"
        >
          <span>✦</span>
          <span>Run Tārā Demo</span>
        </button>

        {/* Global Instrument Guide & Tutorial Trigger */}
        <button
          className="sidebar-tutorial-btn"
          onClick={() => setIsTutorialOpen(true)}
          title="Interactive walkthrough of all Tārā-NETra features"
        >
          <span>✧</span>
          <span>Guide &amp; Tutorial</span>
        </button>

        <div className="sidebar-footer">
          <div className="sidebar-footer-title">Trustworthy Adaptive Risk Analytics — Network Reasoning & Assurance</div>
          <div>SIH 2026 • Astronomical Engine</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <Overview
              analysisResult={analysisResult}
              complianceResult={complianceResult}
              history={history}
              onAnalyze={handleAnalyze}
              onOpenTutorial={() => setIsTutorialOpen(true)}
              navigate={navigate}
              showToast={showToast}
            />
          } />
          <Route path="/analyze" element={
            <Analyze
              analysisResult={analysisResult}
              complianceResult={complianceResult}
              onAnalyze={handleAnalyze}
              configText={configText}
              navigate={navigate}
            />
          } />
          <Route path="/training" element={
            <TrainingStudio
              analysisResult={analysisResult}
              onReanalyze={handleReanalyze}
              showToast={showToast}
            />
          } />
          <Route path="/knowledge" element={
            <Knowledge showToast={showToast} />
          } />
          <Route path="/compliance" element={
            <Compliance
              complianceResult={complianceResult}
              heatmapData={heatmapData}
              analysisResult={analysisResult}
              configText={configText}
            />
          } />
          <Route path="/findings" element={
            <Findings
              complianceResult={complianceResult}
              analysisResult={analysisResult}
              configText={configText}
            />
          } />
          <Route path="/remediation" element={
            <Remediation
              complianceResult={complianceResult}
              analysisResult={analysisResult}
            />
          } />
          <Route path="/evidence" element={
            <Evidence
              analysisResult={analysisResult}
              complianceResult={complianceResult}
              configText={configText}
              showToast={showToast}
            />
          } />
        </Routes>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span>{toast.type === 'error' ? '⚠' : '◈'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Global Interactive Instrument Guide & Tutorial Modal */}
      <TutorialGuide
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        navigate={navigate}
      />

      {/* Global Guided 2-Minute Competition Demo Modal */}
      <TaraDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onAnalyze={handleAnalyze}
        navigate={navigate}
        showToast={showToast}
      />
    </div>
  );
}
