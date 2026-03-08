interface ShelfLocationModalProps {
  shelfCode: string;
  callNumber: string;
  onClose: () => void;
}

export function ShelfLocationModal({ shelfCode, callNumber, onClose }: ShelfLocationModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-[90vw] max-w-[440px] animate-[fadeScaleIn_0.25s_ease-out] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-lg font-bold text-gray-800">서가 위치 안내</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 active:scale-90"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          {/* Floor map placeholder */}
          <div className="flex h-[200px] items-center justify-center rounded-xl bg-gray-100 text-gray-400">
            <span className="text-base">조감도 이미지 준비 중</span>
          </div>

          {/* Info rows */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm font-medium text-gray-500">서가 코드</span>
              <span className="text-base font-semibold text-gray-800">{shelfCode || '-'}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm font-medium text-gray-500">청구기호</span>
              <span className="text-base font-semibold text-gray-800">{callNumber || '-'}</span>
            </div>
          </div>

          {/* Friendly message */}
          <p className="mt-4 text-center text-sm leading-relaxed text-gray-500">
            위 정보를 참고하여 서가에서 도서를 찾아보세요!
          </p>
        </div>

        {/* Close button */}
        <div className="border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-gray-100 py-3 text-base font-semibold text-gray-600 transition active:scale-[0.98] hover:bg-gray-200"
          >
            닫기
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
