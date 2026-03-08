import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { adminApi } from '../../api/admin.api';
import { Notification } from '../../types';

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

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminApi.getNotifications({ take: 5 });
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch {}
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showNotifPanel &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifPanel]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleMarkAllRead = async () => {
    try {
      await adminApi.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleMarkRead = async (id: string) => {
    try {
      await adminApi.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '방금 전';
    if (mins < 60) return `${mins}분 전`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
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

        {/* 우측: DID 보기 + 알림 + 로그아웃 */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/did')}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            DID 화면 보기
          </button>

          {/* 알림 벨 */}
          <div className="relative">
            <button
              ref={bellRef}
              type="button"
              onClick={() => setShowNotifPanel((v) => !v)}
              className="relative rounded-md px-2 py-1.5 text-base transition hover:bg-white/10"
            >
              <span role="img" aria-label="알림">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifPanel && (
              <div
                ref={panelRef}
                className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg"
              >
                {/* Panel header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <span className="text-sm font-bold text-gray-800">알림</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      모두 읽음
                    </button>
                  )}
                </div>

                {/* Notification list */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-gray-400">
                      새로운 알림이 없습니다
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        type="button"
                        onClick={() => handleMarkRead(notif.id)}
                        className="flex w-full items-start gap-2 px-4 py-3 text-left transition hover:bg-gray-50"
                      >
                        {!notif.isRead && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                        )}
                        <div className={`min-w-0 flex-1 ${notif.isRead ? 'pl-4' : ''}`}>
                          <p className="text-sm text-gray-700">{notif.message}</p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {timeAgo(notif.createdAt)}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
