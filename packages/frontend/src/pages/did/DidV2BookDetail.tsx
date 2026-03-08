import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDidBookDetail, getVideoStatus, requestVideo } from '../../api/did.api';
import { DidV2Layout } from './DidV2Layout';
import { VideoPopup } from '../../components/VideoPopup';
import { ShelfLocationModal } from '../../components/ShelfLocationModal';
import type { DidBookDetail } from '../../types';

export function DidV2BookDetail() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [bookDetail, setBookDetail] = useState<DidBookDetail | null>(null);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [videoMessage, setVideoMessage] = useState<string | null>(null);

  // Load book detail
  useEffect(() => {
    if (!bookId) return;
    (async () => {
      const detail = await getDidBookDetail(bookId);
      if (detail) {
        setBookDetail(detail);
      }
    })();
  }, [bookId]);

  // Clear video message after 3 seconds
  useEffect(() => {
    if (!videoMessage) return;
    const timer = setTimeout(() => setVideoMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [videoMessage]);

  const handleVideoClick = async () => {
    if (!bookId || !bookDetail) return;
    try {
      const res = await getVideoStatus(bookId);
      if (res.status === 'READY') {
        setShowVideoPopup(true);
      } else if (res.status === 'QUEUED' || res.status === 'GENERATING') {
        setVideoMessage('영상 준비 중입니다. 잠시 후 다시 시도해주세요');
      } else {
        // NONE or FAILED — request generation
        await requestVideo(bookId, {
          title: bookDetail.title,
          author: bookDetail.author,
          summary: bookDetail.summary,
        });
        setVideoMessage('영상 생성을 요청했습니다. 잠시 후 다시 시도해주세요');
      }
    } catch (e) {
      console.error('handleVideoClick error:', e);
      setVideoMessage('영상 요청 중 오류가 발생했습니다');
    }
  };

  return (
    <DidV2Layout title={bookDetail?.title || '도서 상세'}>
      <div className="flex flex-1 flex-col overflow-auto py-4 sm:py-6">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex w-fit items-center gap-1.5 rounded-xl px-4 py-2 text-base font-medium text-gray-600 transition active:scale-95 hover:bg-white/60"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          돌아가기
        </button>

        {/* Cover image */}
        <div className="flex justify-center">
          {bookDetail?.coverImageUrl ? (
            <div
              className="h-64 w-44 rounded-2xl sm:h-72 sm:w-48"
              style={{
                background: `url(${bookDetail.coverImageUrl}) center/cover no-repeat`,
                boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
              }}
            />
          ) : (
            <div
              className="flex h-64 w-44 items-center justify-center rounded-2xl sm:h-72 sm:w-48"
              style={{
                background: 'linear-gradient(135deg, #a8d8ea 0%, #aa96da 100%)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
              }}
            >
              <span className="text-5xl">📖</span>
            </div>
          )}
        </div>

        {/* Book info card */}
        <div
          className="mt-5 w-full rounded-2xl p-5 sm:mt-6 sm:p-6"
          style={{ background: 'rgba(255,255,255,0.85)' }}
        >
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            {bookDetail?.title || '제목'}
          </h2>

          {/* Info rows */}
          <div className="mt-4 space-y-2">
            <InfoRow label="저자" value={bookDetail?.author} />
            <InfoRow label="출판사" value={bookDetail?.publisher} />
            <InfoRow label="청구기호" value={bookDetail?.callNumber} />
            <InfoRow label="등록번호" value={bookDetail?.isbn} />
          </div>

          {/* Summary */}
          {bookDetail?.summary && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">줄거리/소개</p>
              <p className="mt-1.5 text-base leading-relaxed text-gray-700">
                {bookDetail.summary}
              </p>
            </div>
          )}

          {/* Availability */}
          {bookDetail?.isAvailable !== undefined && (
            <div className="mt-4">
              <span
                className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium ${
                  bookDetail.isAvailable
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {bookDetail.isAvailable ? '✓ 대출가능' : '✗ 대출중'}
              </span>
            </div>
          )}
        </div>

        {/* Video message toast */}
        {videoMessage && (
          <div className="mt-3 w-full rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-700">
            {videoMessage}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-auto shrink-0 space-y-3 pt-5">
          <button
            type="button"
            onClick={handleVideoClick}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl text-lg font-bold text-white transition active:scale-[0.98] sm:h-20 sm:text-xl"
            style={{
              background: 'linear-gradient(180deg, #6BB8D6 0%, #4DA3C4 100%)',
              boxShadow: '0 4px 16px rgba(77, 163, 196, 0.35)',
            }}
          >
            도서 소개 영상 보기
          </button>
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl text-lg font-bold text-white transition active:scale-[0.98] sm:h-20 sm:text-xl"
            style={{
              background: 'linear-gradient(180deg, #7ECC94 0%, #68B984 100%)',
              boxShadow: '0 4px 16px rgba(104, 185, 132, 0.35)',
            }}
          >
            서가 위치 보기
          </button>
        </div>
      </div>

      {/* Video popup modal */}
      {showVideoPopup && bookId && (
        <VideoPopup bookId={bookId} onClose={() => setShowVideoPopup(false)} />
      )}

      {/* Shelf location modal */}
      {showLocationModal && bookDetail && (
        <ShelfLocationModal
          shelfCode={bookDetail.shelfCode}
          callNumber={bookDetail.callNumber}
          onClose={() => setShowLocationModal(false)}
        />
      )}
    </DidV2Layout>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline gap-3 text-base">
      <span className="shrink-0 text-sm font-medium text-gray-500">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
