/**
 * Mock 데이터 35권을 recommendations 테이블에 시딩
 * 네이버 API로 실제 표지 검색
 */
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// .env 로드
const envPaths = [
  path.resolve(__dirname, '../../../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../.env'),
];
const envPath = envPaths.find((p) => fs.existsSync(p));
if (envPath) dotenv.config({ path: envPath });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || '';
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || '';

interface MockBook {
  title: string;
  author: string;
  publisher: string;
  summary: string;
  category: string;
  ageGroup: 'preschool' | 'elementary' | 'teen';
}

// Mock 데이터 → 연령 그룹 매핑
const BOOKS: MockBook[] = [
  // 유아 (preschool)
  { title: '달팽이 학교', author: '박서연', publisher: '문학동네', summary: '느림의 가치를 배우는 달팽이들의 학교 생활.', category: '그림책', ageGroup: 'preschool' },
  { title: '숲속 음악회', author: '최유진', publisher: '웅진주니어', summary: '숲속 동물들이 모여 음악회를 준비하는 과정을 통해 협력과 우정의 가치를 배웁니다.', category: '그림책', ageGroup: 'preschool' },
  { title: '친구가 되어줄래?', author: '송하나', publisher: '문학동네', summary: '새로운 환경에서 친구 사귀기가 어려운 아이를 위한 따뜻한 이야기.', category: '그림책', ageGroup: 'preschool' },
  { title: '까만 콩의 여행', author: '이현', publisher: '문학동네', summary: '콩 한 알이 싹 트고 자라는 과정을 통해 생명의 소중함을 배우는 그림책.', category: '그림책', ageGroup: 'preschool' },
  { title: '용감한 소방관 아저씨', author: '최용기', publisher: '웅진주니어', summary: '소방관의 하루를 통해 직업의 의미를 배우는 그림책.', category: '직업', ageGroup: 'preschool' },

  // 초등 저학년 (elementary)
  { title: '별을 헤아리며', author: '김미영', publisher: '창비', summary: '어린 소녀가 별을 관찰하며 우주와 꿈에 대해 배워가는 감동적인 이야기입니다.', category: '아동문학', ageGroup: 'elementary' },
  { title: '용감한 토끼의 모험', author: '이지수', publisher: '사계절', summary: '겁쟁이 토끼가 친구들을 구하기 위해 용기를 내는 이야기.', category: '아동문학', ageGroup: 'elementary' },
  { title: '마법의 도서관', author: '정민아', publisher: '비룡소', summary: '책 속으로 들어갈 수 있는 마법의 도서관에서 벌어지는 신비로운 모험 이야기.', category: '판타지', ageGroup: 'elementary' },
  { title: '흔들리지 않는 용기', author: '강민수', publisher: '창비', summary: '실패를 두려워하지 않고 도전하는 아이들의 이야기.', category: '아동문학', ageGroup: 'elementary' },
  { title: '우주 탐험대', author: '김태양', publisher: '사계절', summary: '우주를 탐험하는 어린이 탐험대의 과학 모험 이야기.', category: '과학', ageGroup: 'elementary' },
  { title: '공룡 백과사전', author: '박진우', publisher: '아이세움', summary: '아이들이 좋아하는 공룡에 대한 모든 것을 담은 백과사전.', category: '과학', ageGroup: 'elementary' },
  { title: '마당을 나온 암탉', author: '황선미', publisher: '사계절', summary: '자유를 꿈꾸는 암탉 잎싹의 감동적인 이야기.', category: '아동문학', ageGroup: 'elementary' },
  { title: '로봇 친구 로비', author: '한미래', publisher: '비룡소', summary: '로봇과 인간의 우정을 그린 따뜻한 SF 동화.', category: '과학소설', ageGroup: 'elementary' },
  { title: '지구를 지키는 어린이', author: '김환경', publisher: '풀빛', summary: '환경보호의 중요성을 알려주는 교육적인 동화.', category: '환경', ageGroup: 'elementary' },
  { title: '꿈꾸는 피아니스트', author: '조음악', publisher: '웅진주니어', summary: '피아노를 사랑하는 소녀의 꿈과 도전을 그린 감동적인 이야기.', category: '예술', ageGroup: 'elementary' },
  { title: '마법의 색연필', author: '홍그림', publisher: '비룡소', summary: '그림이 현실이 되는 마법의 색연필 이야기.', category: '판타지', ageGroup: 'elementary' },

  // 청소년 (teen)
  { title: '어린 왕자', author: '생텍쥐페리', publisher: '문학동네', summary: '사막에 불시착한 비행사가 만난 어린 왕자와의 대화를 통해 삶의 본질을 탐구하는 세계적 명작.', category: '세계문학', ageGroup: 'teen' },
  { title: '이상한 나라의 앨리스', author: '루이스 캐럴', publisher: '시공주니어', summary: '토끼굴에 빠진 앨리스가 겪는 기상천외한 모험.', category: '세계문학', ageGroup: 'teen' },
  { title: '해리포터와 마법사의 돌', author: 'J.K. 롤링', publisher: '문학수첩', summary: '평범한 소년 해리포터가 마법학교에 입학하면서 시작되는 환상적인 모험 이야기.', category: '판타지', ageGroup: 'teen' },
  { title: '나의 라임오렌지나무', author: '바스콘셀로스', publisher: '동녘', summary: '가난한 소년의 성장과 상처를 라임오렌지나무와의 교감을 통해 그린 감동적인 이야기.', category: '세계문학', ageGroup: 'teen' },
  { title: '모모', author: '미하엘 엔데', publisher: '비룡소', summary: '시간을 훔쳐가는 회색 신사들에 맞서 싸우는 소녀 모모의 이야기.', category: '세계문학', ageGroup: 'teen' },
  { title: '몽실언니', author: '권정생', publisher: '창비', summary: '전쟁의 아픔을 겪은 소녀 몽실의 이야기.', category: '아동문학', ageGroup: 'teen' },
  { title: '불량한 자전거 여행', author: '김남중', publisher: '창비', summary: '자전거를 타고 떠나는 소년의 성장 여행기.', category: '청소년문학', ageGroup: 'teen' },
  { title: '나무를 심은 사람', author: '장 지오노', publisher: '두레아이들', summary: '황무지에 나무를 심어 숲을 만든 한 사람의 이야기.', category: '세계문학', ageGroup: 'teen' },
  { title: '생각을 키우는 철학 이야기', author: '정철학', publisher: '풀빛', summary: '어린이의 눈높이에 맞춘 철학 입문서.', category: '철학', ageGroup: 'teen' },
];

async function searchNaverCover(title: string, author: string, publisher: string): Promise<string | null> {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.log('  [SKIP] Naver API keys not configured');
    return null;
  }

  try {
    const query = `${title} ${author}`;
    const url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&display=5`;

    const response = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      console.log(`  [ERR] Naver API ${response.status}`);
      return null;
    }

    const data = await response.json() as any;
    if (!data.items || data.items.length === 0) {
      console.log('  [MISS] No Naver results');
      return null;
    }

    // 제목이 가장 일치하는 항목 찾기
    const cleanTitle = title.replace(/\s/g, '').toLowerCase();
    const best = data.items.find((item: any) => {
      const itemTitle = item.title.replace(/<[^>]*>/g, '').replace(/\s/g, '').toLowerCase();
      return itemTitle.includes(cleanTitle) || cleanTitle.includes(itemTitle);
    });

    const chosen = best || data.items[0];
    return chosen.image || null;
  } catch (err) {
    console.log(`  [ERR] ${err}`);
    return null;
  }
}

async function main() {
  console.log('=== Mock → Recommendations 시딩 시작 ===\n');
  console.log(`Naver API: ${NAVER_CLIENT_ID ? 'OK' : 'NOT SET'}`);
  console.log(`총 ${BOOKS.length}권 처리 예정\n`);

  // 기존 데이터 삭제
  const existing = await prisma.recommendation.count();
  if (existing > 0) {
    console.log(`기존 ${existing}건 삭제...`);
    await prisma.recommendation.deleteMany();
  }

  let success = 0;
  let coverFound = 0;

  for (let i = 0; i < BOOKS.length; i++) {
    const book = BOOKS[i];
    console.log(`[${i + 1}/${BOOKS.length}] "${book.title}" (${book.author}) — ${book.ageGroup}`);

    // 네이버 표지 검색
    const coverUrl = await searchNaverCover(book.title, book.author, book.publisher);
    if (coverUrl) {
      coverFound++;
      console.log(`  ✓ 표지 발견: ${coverUrl.substring(0, 60)}...`);
    }

    // DB에 저장
    await prisma.recommendation.create({
      data: {
        bookId: `REC-${crypto.randomUUID()}`,
        ageGroup: book.ageGroup,
        sortOrder: i + 1,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        summary: book.summary,
        coverImageUrl: coverUrl,
        category: book.category,
      },
    });

    success++;

    // Rate limiting (네이버 API 초당 10회 제한)
    if (i < BOOKS.length - 1) {
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  console.log(`\n=== 완료 ===`);
  console.log(`등록: ${success}/${BOOKS.length}권`);
  console.log(`표지 발견: ${coverFound}/${BOOKS.length}권`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
