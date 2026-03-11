/**
 * DB에 저장된 비디오 경로를 공개 URL로 변환.
 * GCS 사용 시 직접 GCS URL을 반환하여 프록시 없이 빠르게 서빙.
 */
const GCS_BASE = process.env.GCS_PUBLIC_BASE_URL || '';
const STORAGE_TYPE = (process.env.STORAGE_TYPE || 'local').toLowerCase();

export function toPublicVideoUrl(videoUrl: string | null | undefined): string | null {
  if (!videoUrl) return null;

  // 이미 GCS 절대 URL이면 그대로
  if (videoUrl.startsWith('https://storage.googleapis.com/')) {
    return videoUrl;
  }

  // 파일명 추출
  const filename = videoUrl
    .replace(/^\/api\/videos\//, '')
    .replace(/^\/videos\//, '')
    .replace(/^\.\//, '')
    .split('/').pop();

  if (!filename) return null;

  // GCS 사용 시 직접 GCS URL 반환 (프록시 없이 빠름)
  if (STORAGE_TYPE === 'gcs' && GCS_BASE) {
    return `${GCS_BASE}/${filename}`;
  }

  // 로컬 스토리지는 프록시 경로
  return `/videos/${filename}`;
}

/**
 * 자막 URL도 동일하게 변환
 */
export function toPublicSubtitleUrl(subtitleUrl: string | null | undefined): string | null {
  return toPublicVideoUrl(subtitleUrl);
}
