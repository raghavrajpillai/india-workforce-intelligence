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
    </HashRouter>
  );
}
