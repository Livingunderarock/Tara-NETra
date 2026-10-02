import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Overview from './pages/Overview';
import Analyze from './pages/Analyze';
import TrainingStudio from './pages/TrainingStudio';
import Knowledge from './pages/Knowledge';
import Compliance from './pages/Compliance';
import Findings from './pages/Findings';
import Remediation from './pages/Remediation';
import Evidence from './pages/Evidence';
import { analyzeConfiguration } from './core/interpreter';
import { evaluateCompliance, generateHeatmap } from './core/compliance';
import { saveAnalysis, getAnalysisHistory } from './services/storage';

const navItems = [
  { path: '/', label: 'Overview', icon: '◉' },
  { path: '/analyze', label: 'Analyze', icon: '⬡' },
  { path: '/training', label: 'Training Studio', icon: '⚡' },
  { path: '/knowledge', label: 'Knowledge', icon: '◈' },
  { path: '/compliance', label: 'Compliance', icon: '◆' },
  { path: '/findings', label: 'Findings', icon: '⚠' },
  { path: '/remediation', label: 'Remediation', icon: '⟳' },
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
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getAnalysisHistory());
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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

    showToast(`Analysis complete — ${analysis.vendor.vendor} detected with ${analysis.stats.recognizedPercent}% recognition`);
    navigate('/analyze');
  }, [navigate, showToast]);

  const handleReanalyze = useCallback(() => {
    if (configText) {
      handleAnalyze(configText, deviceName);
      showToast('Configuration reprocessed with updated knowledge');
    }
  }, [configText, deviceName, handleAnalyze, showToast]);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-brand">TĀRĀ-NETRA</NavLink>
          <div className="sidebar-brand-sub">The Guiding Eye</div>
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
        <div className="sidebar-footer">
          <div style={{ color: 'var(--color-gold-dim)', fontSize: '0.65rem', letterSpacing: '1px' }}>
            v1.0 — SIH 2026
          </div>
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
              navigate={navigate}
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
          {toast.message}
        </div>
      )}
    </div>
  );
}
