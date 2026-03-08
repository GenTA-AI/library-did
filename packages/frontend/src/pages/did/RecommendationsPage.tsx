import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLibrarianPicks } from '../../api/did.api';
import type { DidBook } from '../../types';
import { DidV2Layout } from './DidV2Layout';
import { VideoPopup } from '../../components/VideoPopup';

export function RecommendationsPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<DidBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await getLibrarianPicks();
        if (!cancelled) setBooks(list);
      } catch {
        if (!cancelled) setBooks([]);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DidV2Layout title="추천도서">
      <div className="flex flex-col gap-4 py-2">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate('/did')}
          className="flex w-fit items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition active:scale-95"
          style={{ background: 'rgba(255,255,255,0.6)' }}
        >
          &larr; 돌아가기
        </button>

        {/* Book grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(loading ? [] : books).map((book) => (
            <div
              key={book.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md"
            >
              {/* Card body: cover + info */}
              <button
                type="button"
                onClick={() => navigate(`/did/video/${book.id}`)}
                className="flex flex-col p-3 text-left transition active:bg-gray-50"
              >
                {/* Cover image */}
                <div
                  className="mb-2 h-36 w-full rounded-xl sm:h-44"
                  style={{
                    background: book.coverImageUrl
                      ? `url(${book.coverImageUrl}) center/cover no-repeat`
                      : 'linear-gradient(180deg, #E0F0F8 0%, #C8E8D0 100%)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  }}
                />
                {/* Info */}
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 sm:text-base">
                  {book.title || '제목'}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                  {book.author || '저자'}
                </p>
                {book.category && (
                  <span
                    className="mt-1.5 w-fit rounded-full px-2 py-0.5 text-xs font-medium text-gray-600"
                    style={{ background: 'rgba(107, 184, 214, 0.2)' }}
                  >
                    #{book.category}
                  </span>
                )}
              </button>
              {/* Watch video button */}
              <button
                type="button"
                onClick={() => setSelectedBookId(book.id)}
                className="flex h-10 w-full items-center justify-center gap-1 border-t border-gray-100 text-sm font-semibold transition active:bg-gray-50 sm:h-12 sm:text-base"
                style={{ color: '#4DA3C4' }}
              >
                🎬 영상 보기
              </button>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex flex-1 items-center justify-center py-16">
            <p className="text-base text-gray-500 sm:text-lg">불러오는 중...</p>
          </div>
        )}
        {!loading && books.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-16">
            <p className="text-base text-gray-500 sm:text-lg">등록된 추천도서가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Video popup modal */}
      {selectedBookId && (
        <VideoPopup
          bookId={selectedBookId}
          onClose={() => setSelectedBookId(null)}
        />
      )}
    </DidV2Layout>
  );
}
