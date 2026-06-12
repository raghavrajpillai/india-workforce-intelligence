import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MethodologyPage from './pages/MethodologyPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<><Nav /><HomePage /></>} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/methodology" element={<><Nav /><MethodologyPage /></>} />
        <Route path="/about" element={<><Nav /><AboutPage /></>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <div className="site-disclaimer">
        All data sourced from public domain Government of India publications (PLFS 2023-24 · NCO-2004 · CBDT Annual Reports). AI exposure scores are LLM-inferred estimates — not official statistics, forecasts, or predictions. All analysis and interpretations represent the author's personal views only and do not constitute professional, legal, financial, or policy advice. Workforce figures carry ±25–35% estimation error. Readers must independently verify all information before drawing any conclusions or making decisions. The author accepts no liability for any outcomes based on this content.
      </div>
    </HashRouter>
  );
}
