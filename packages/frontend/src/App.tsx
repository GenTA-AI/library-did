import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminRecommendBook } from './pages/admin/AdminRecommendBook';
import { VideoManagement } from './pages/admin/VideoManagement';
import { DidV2Home } from './pages/did/DidV2Home';
import { DidV2BookGrid } from './pages/did/DidV2BookGrid';
import { DidV2BookDetail } from './pages/did/DidV2BookDetail';
import { NewArrivalsPage } from './pages/did/NewArrivalsPage';
import { RecommendationsPage } from './pages/did/RecommendationsPage';

function App() {
  const { initialize } = useAuthStore();
  useAutoRefresh();

  useEffect(() => {
    initialize();
  }, []);

  const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/';

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* DID 베타: 홈 → 연령별 추천 → 책 상세/영상 */}
        <Route path="/" element={<Navigate to="/did" replace />} />
        <Route path="/did" element={<DidV2Home />} />
        <Route path="/did/age/:group" element={<DidV2BookGrid />} />
        <Route path="/did/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/did/recommendations" element={<RecommendationsPage />} />
        <Route path="/did/video/:bookId" element={<DidV2BookDetail />} />

        {/* Admin 관리자 페이지 */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/recommend" element={<AdminRecommendBook />} />
        <Route path="/admin/videos" element={<VideoManagement />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/did" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
