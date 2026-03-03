import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const NAV_TABS = [
  { label: '대시보드', path: '/admin/dashboard' },
  { label: '영상 관리', path: '/admin/videos' },
  { label: '도서 등록', path: '/admin/recommend' },
] as const;

/**
 * Admin 공통 레이아웃 - 상단 네비게이션 + 넓은 가로 레이아웃
 */
export function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        fontFamily: 'Pretendard, sans-serif',
        background: 'linear-gradient(180deg, #F0F4F8 0%, #E8ECF0 100%)',
      }}
    >
      {/* Header */}
      <header
        className="flex w-full shrink-0 items-center justify-between px-6 py-0"
        style={{ background: 'rgba(45, 55, 72, 0.95)' }}
      >
        {/* 좌측: 타이틀 */}
        <span
          className="shrink-0 cursor-pointer text-lg font-bold text-white"
          onClick={() => navigate('/admin/dashboard')}
        >
          BookMate 관리자
        </span>

        {/* 중앙: 탭 네비게이션 */}
        <nav className="flex">
          {NAV_TABS.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => navigate(tab.path)}
                className="relative px-5 py-4 text-sm font-medium transition"
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.6)' }}
              >
                {tab.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t"
                    style={{ background: '#63B3ED' }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* 우측: DID 보기 + 로그아웃 */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/did')}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            DID 화면 보기
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/20 hover:text-white"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex min-h-0 flex-1 flex-col overflow-auto">
        {children}
      </main>
    </div>
  );
}
