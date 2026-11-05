/**
 * @file noticeMockService.js
 * @description LocalStorage 기반 Mock 공지사항 CRUD 서비스
 * (지침서 3.3절 준수: 비동기 async 인터페이스, crypto.randomUUID() 사용, ISO 8601 타임스탬프)
 */

import { storageHelper } from './storageHelper.js';
import { INITIAL_NOTICES } from './initialNotices.js';

const STORAGE_KEY = 'vlast_notices_v4';

/**
 * 저장소 초기화 및 시드 데이터 보장
 * @returns {Promise<import('../types/notice.js').Notice[]>}
 */
async function ensureNotices() {
  let list = await storageHelper.get(STORAGE_KEY, null);
  if (!list || !Array.isArray(list) || list.length === 0) {
    list = [...INITIAL_NOTICES];
    await storageHelper.set(STORAGE_KEY, list);
    return list;
  }

  // 누락된 시드 데이터(덤프 공지 4종 포함) 자동 보강
  let updated = false;
  for (const seed of INITIAL_NOTICES) {
    const idx = list.findIndex((item) => item.id === seed.id);
    if (idx === -1) {
      list.push({ ...seed });
      updated = true;
    }
  }
  if (updated) {
    await storageHelper.set(STORAGE_KEY, list);
  }
  return list;
}

export const noticeMockService = {
  /**
   * 전체 공지 목록 조회
   * (중요 공지 isNotice: true가 최상단, 그 후 createdAt 내림차순 정렬)
   * @param {Object} [filter]
   * @param {string} [filter.category] - '전체' | '공지' | '이벤트' | '보도자료'
   * @param {string} [filter.period] - '전체' | '일주일' | '한달' | '세달'
   * @param {string} [filter.keyword] - 검색 키워드 (제목, 내용)
   * @returns {Promise<import('../types/notice.js').Notice[]>}
   */
  getAll: async (filter = {}) => {
    const list = await ensureNotices();
    let filtered = [...list];

    // 1. 카테고리 필터
    if (filter.category && filter.category !== '전체') {
      filtered = filtered.filter((item) => item.category === filter.category);
    }

    // 2. 기간 필터 (일주일, 한달, 세달)
    if (filter.period && filter.period !== '전체') {
      const now = new Date();
      let daysAgo = 0;
      if (filter.period === '일주일') daysAgo = 7;
      else if (filter.period === '한달') daysAgo = 30;
      else if (filter.period === '세달') daysAgo = 90;

      if (daysAgo > 0) {
        const threshold = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((item) => new Date(item.createdAt) >= threshold);
      }
    }

    // 3. 키워드 검색 (제목 또는 내용)
    if (filter.keyword && filter.keyword.trim() !== '') {
      const kw = filter.keyword.trim().toLowerCase();
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(kw) ||
        (item.content && item.content.toLowerCase().includes(kw))
      );
    }

    // 4. 정렬: 중요 공지(isNotice) 상단 우선 -> 그 안에서는 최신순, 일반 공지도 최신순
    filtered.sort((a, b) => {
      if (a.isNotice && !b.isNotice) return -1;
      if (!a.isNotice && b.isNotice) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  },

  /**
   * 단일 공지 상세 조회
   * @param {string} id
   * @returns {Promise<import('../types/notice.js').Notice | null>}
   */
  getById: async (id) => {
    const list = await ensureNotices();
    let found = list.find((item) => item.id === id);
    if (!found) {
      found = INITIAL_NOTICES.find((item) => item.id === id);
      if (found) {
        list.unshift({ ...found });
        await storageHelper.set(STORAGE_KEY, list);
      }
    }
    return found || null;
  },

  /**
   * 이전글 / 다음글 정보 조회
   * @param {string} currentId
   * @returns {Promise<{ prev: import('../types/notice.js').Notice | null, next: import('../types/notice.js').Notice | null }>}
   */
  getPrevNext: async (currentId) => {
    const list = await ensureNotices();
    // 전체 목록과 동일한 정렬 적용
    const sorted = [...list].sort((a, b) => {
      if (a.isNotice && !b.isNotice) return -1;
      if (!a.isNotice && b.isNotice) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const currentIndex = sorted.findIndex((item) => item.id === currentId);
    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    // 이전글: 인덱스 앞쪽(더 최신 글) 또는 뒤쪽
    // 게시판 관례: 이전글은 No가 더 작은 글(인덱스 + 1 또는 - 1), 여기서는 목록 순서 기준
    const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
    const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

    return { prev, next };
  },

  /**
   * 조회수 1 증가 (상세 화면 진입 시)
   * @param {string} id
   * @returns {Promise<number>} - 갱신된 조회수
   */
  increaseViews: async (id) => {
    const list = await ensureNotices();
    const target = list.find((item) => item.id === id);
    if (!target) return 0;

    target.views = (target.views || 0) + 1;
    await storageHelper.set(STORAGE_KEY, list);
    return target.views;
  },

  /**
   * 공지 생성
   * @param {import('../types/notice.js').CreateNoticeDto} dto
   * @returns {Promise<import('../types/notice.js').Notice>}
   */
  create: async (dto) => {
    const list = await ensureNotices();
    const nowIso = new Date().toISOString();

    const isNotice = Boolean(dto.isNotice);
    const normalItems = list.filter((item) => !item.isNotice);
    const maxNo = normalItems.reduce((max, item) => (item.no > max ? item.no : max), 0);

    const newNotice = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `notice-${Date.now()}`,
      no: isNotice ? null : (maxNo + 1), // 공지리스트는 넘버링 없음(null), 일반 공지는 최신 등록 시 가장 큰 번호 부여
      title: dto.title.trim(),
      category: dto.category || '공지',
      isNotice,
      isNew: dto.isNew !== undefined ? Boolean(dto.isNew) : true,
      content: dto.content || '',
      author: dto.author || 'VLAST SHOP (블래스트샵)',
      views: 0,
      attachments: Array.isArray(dto.attachments) ? dto.attachments : [],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    list.unshift(newNotice);
    await storageHelper.set(STORAGE_KEY, list);
    return newNotice;
  },

  /**
   * 공지 수정
   * @param {string} id
   * @param {import('../types/notice.js').UpdateNoticeDto} dto
   * @returns {Promise<import('../types/notice.js').Notice>}
   */
  update: async (id, dto) => {
    const list = await ensureNotices();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`공지글(${id})을 찾을 수 없습니다.`);
    }

    const current = list[index];
    const nowIso = new Date().toISOString();

    const updated = {
      ...current,
      ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
      ...(dto.category !== undefined ? { category: dto.category } : {}),
      ...(dto.isNotice !== undefined ? { isNotice: Boolean(dto.isNotice) } : {}),
      ...(dto.isNew !== undefined ? { isNew: Boolean(dto.isNew) } : {}),
      ...(dto.content !== undefined ? { content: dto.content } : {}),
      ...(dto.attachments !== undefined ? { attachments: dto.attachments } : {}),
      // "수정일을 현재 날짜로 갱신" 체크 시 createdAt 또는 updatedAt을 갱신
      updatedAt: nowIso,
      ...(dto.updateDateToNow ? { createdAt: nowIso } : {})
    };

    list[index] = updated;
    await storageHelper.set(STORAGE_KEY, list);
    return updated;
  },

  /**
   * 공지 삭제
   * @param {string} id
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    const list = await ensureNotices();
    const filtered = list.filter((item) => item.id !== id);
    await storageHelper.set(STORAGE_KEY, filtered);
  },

  /**
   * 시드 데이터로 강제 리셋 (테스트용)
   * @returns {Promise<void>}
   */
  resetToSeed: async () => {
    await storageHelper.set(STORAGE_KEY, INITIAL_NOTICES);
  }
};

