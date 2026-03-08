import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DidV2Layout } from './DidV2Layout';
import { getNewArrivals, getLibrarianPicks, getPopularVideos } from '../../api/did.api';
import type { DidBook, AgeGroup } from '../../types';
import type { PopularVideo } from '../../api/did.api';

const AGE_OPTIONS: { group: AgeGroup; label: string; emoji: string }[] = [
  { group: 'preschool', label: '4-6세', emoji: '🐣' },
  { group: 'elementary', label: '7-9세', emoji: '🌟' },
  { group: 'teen', label: '10-13세', emoji: '🚀' },
];

function BookCard({ book, onClick }: { book: DidBook; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[140px] shrink-0 flex-col overflow-hidden rounded-2xl transition active:scale-[0.97]"
      style={{
        background: 'rgba(255,255,255,0.85)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}
    >
      {book.coverImageUrl ? (
        <img
          src={book.coverImageUrl}
          alt={book.title}
          className="h-[180px] w-full object-cover"
        />
      ) : (
        <div
          className="flex h-[180px] w-full items-center justify-center text-4xl"
          style={{ background: 'linear-gradient(180deg, #A8D8EA 0%, #8BC9E0 100%)' }}
        >
          📖
        </div>
      )}
      <div className="flex flex-col gap-0.5 p-2">
        <span className="line-clamp-2 text-sm font-bold text-gray-800">{book.title}</span>
        <span className="truncate text-xs text-gray-500">{book.author}</span>
      </div>
    </button>
  );
}

function VideoCard({ video, onClick }: { video: PopularVideo; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-[140px] shrink-0 flex-col overflow-hidden rounded-2xl transition active:scale-[0.97]"
      style={{
        background: 'rgba(255,255,255,0.85)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}
    >
      {/* Badge */}
      <div className="absolute left-2 top-2 z-10 rounded-lg bg-black/50 px-1.5 py-0.5 text-xs text-white">
        🎬
      </div>
      {video.coverImageUrl ? (
        <img
          src={video.coverImageUrl}
          alt={video.title}
          className="h-[180px] w-full object-cover"
        />
      ) : (
        <div
          className="flex h-[180px] w-full items-center justify-center text-4xl"
          style={{ background: 'linear-gradient(180deg, #F0C6FF 0%, #A8D8EA 100%)' }}
        >
          🎬
        </div>
      )}
      <div className="flex flex-col gap-0.5 p-2">
        <span className="line-clamp-2 text-sm font-bold text-gray-800">{video.title}</span>
        <span className="truncate text-xs text-gray-500">{video.author}</span>
      </div>
    </button>
  );
}

function SectionHeader({
  emoji,
  title,
  linkTo,
  onMore,
}: {
  emoji: string;
  title: string;
  linkTo?: string;
  onMore?: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-lg font-bold text-gray-800">
        {emoji} {title}
      </span>
      {linkTo && (
        <button
          type="button"
          onClick={() => navigate(linkTo)}
          className="text-sm text-gray-500 transition hover:text-gray-700"
        >
          더보기 &gt;
        </button>
      )}
      {onMore && (
        <button
          type="button"
          onClick={onMore}
          className="text-sm text-gray-500 transition hover:text-gray-700"
        >
          더보기 &gt;
        </button>
      )}
    </div>
  );
}

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {children}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div
      className="flex w-[140px] shrink-0 animate-pulse flex-col overflow-hidden rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.5)' }}
    >
      <div className="h-[180px] w-full bg-gray-200" />
      <div className="flex flex-col gap-1.5 p-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function DidV2Home() {
  const navigate = useNavigate();

  const [newArrivals, setNewArrivals] = useState<DidBook[]>([]);
  const [recommendations, setRecommendations] = useState<DidBook[]>([]);
  const [popularVideos, setPopularVideos] = useState<PopularVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const [arrivals, picks, videos] = await Promise.all([
          getNewArrivals(),
          getLibrarianPicks(),
          getPopularVideos(6),
        ]);
        if (!cancelled) {
          setNewArrivals(arrivals.slice(0, 6));
          setRecommendations(picks.slice(0, 6));
          setPopularVideos(videos.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const skeletons = Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />);

  return (
    <DidV2Layout>
      <div className="flex flex-col gap-6 py-2">
        {/* Section 1: 신착도서 */}
        <section>
          <SectionHeader emoji="🆕" title="신착도서" />
          <HorizontalScroll>
            {loading
              ? skeletons
              : newArrivals.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() => navigate(`/did/video/${book.id}`)}
                  />
                ))}
          </HorizontalScroll>
        </section>

        {/* Section 2: 추천도서 */}
        <section>
          <SectionHeader emoji="⭐" title="추천도서" linkTo="/did/recommendations" />
          <HorizontalScroll>
            {loading
              ? skeletons
              : recommendations.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={() => navigate(`/did/video/${book.id}`)}
                  />
                ))}
          </HorizontalScroll>
        </section>

        {/* Section 3: 인기 영상 */}
        <section>
          <SectionHeader emoji="🎬" title="인기 영상" />
          <HorizontalScroll>
            {loading
              ? skeletons
              : popularVideos.map((video) => (
                  <VideoCard
                    key={video.bookId}
                    video={video}
                    onClick={() => navigate(`/did/video/${video.bookId}`)}
                  />
                ))}
          </HorizontalScroll>
        </section>

        {/* Section 4: 연령별 추천 */}
        <section>
          <SectionHeader emoji="📚" title="연령별 추천" />
          <div className="flex gap-3">
            {AGE_OPTIONS.map(({ group, label, emoji }) => (
              <button
                key={group}
                type="button"
                onClick={() => navigate(`/did/age/${group}`)}
                className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-4 text-center transition active:scale-[0.97]"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-sm font-bold text-gray-800">{label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </DidV2Layout>
  );
}
