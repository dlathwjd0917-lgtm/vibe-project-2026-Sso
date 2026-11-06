/**
 * @file noticeFirebaseService.js
 * @description Firebase Cloud Firestore 기반 공지사항 CRUD 구현체
 * - 첨부파일: 기존 방식(DataURL)을 그대로 유지하여 Firestore 문서에 직접 저장
 * - 보안/인증: 별도 admin 로그인 없이 즉시 읽기/쓰기 가능
 * - 장애 방지(Fail-Safe): Firestore 응답 지연/오류 시에도 즉시 초기 공지 데이터를 화면에 출력하여 화면이 멈추지 않음
 * - 복합 색인 오류 방지: 클라이언트 안전 정렬(상단 공지 고정 + 최신순) 적용
 * - 자동 시딩: Firestore DB가 비어있는 경우 기존 공지 데이터를 1회 자동 업로드
 */

import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  increment
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { db } from './firebaseConfig.js';
import { INITIAL_NOTICES } from '../mock/initialNotices.js';

const COLLECTION_NAME = 'notices';

export const noticeFirebaseService = {
  /**
   * 전체 공지 목록 조회
   * - 3초 타임아웃 보호막: Firestore 응답이 늦거나 차단되어도 화면이 멈추지 않고 즉시 로드
   */
  getAll: async (filter = {}) => {
    if (!db) {
      console.warn('Firebase DB가 초기화되지 않아 초기 공지 데이터를 표시합니다.');
      return noticeFirebaseService.applySortAndFilter([...INITIAL_NOTICES], filter);
    }

    try {
      // 3.5초 타임아웃 레이스: 네트워크 지연 시 폴백 데이터 반환
      const fetchPromise = (async () => {
        const colRef = collection(db, COLLECTION_NAME);
        const snapshot = await getDocs(colRef);

        // Firestore가 완전히 비어있을 경우 초기 공지사항 자동 시딩 (1회)
        if (snapshot.empty) {
          console.log('[Firebase Migration] Firestore notices 컬렉션이 비어 있어 기존 공지 데이터를 자동 시딩합니다.');
          noticeFirebaseService.seedInitialData().catch((e) => console.warn('시딩 비동기 진행:', e));
          return noticeFirebaseService.applySortAndFilter([...INITIAL_NOTICES], filter);
        }

        let items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        return noticeFirebaseService.applySortAndFilter(items, filter);
      })();

      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          console.warn('[Firebase] Firestore 응답 대기 초과(3.5s), 로컬 캐시/초기 공지 데이터를 우선 렌더링합니다.');
          resolve(noticeFirebaseService.applySortAndFilter([...INITIAL_NOTICES], filter));
        }, 3500);
      });

      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (err) {
      console.error('Firestore getAll 에러 발생, 안전 폴백 데이터 표시:', err);
      return noticeFirebaseService.applySortAndFilter([...INITIAL_NOTICES], filter);
    }
  },

  /**
   * 목록 정렬 및 필터 적용 (복합 색인 오류 없는 안전한 클라이언트 정렬)
   */
  applySortAndFilter: (items, filter = {}) => {
    if (!Array.isArray(items)) return [];

    // 1. 정렬: 상단 고정 공지(isNotice: true) 최상단 우선, 그 다음 등록일(createdAt) 내림차순 최신순
    items.sort((a, b) => {
      const aNotice = Boolean(a.isNotice);
      const bNotice = Boolean(b.isNotice);
      if (aNotice !== bNotice) {
        return bNotice ? 1 : -1;
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    // 2. 검색어 필터링
    if (filter.keyword && filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase();
      items = items.filter((item) => {
        if (filter.searchField === 'author') {
          return (item.author || '').toLowerCase().includes(kw);
        }
        if (filter.searchField === 'content') {
          return (item.content || '').toLowerCase().includes(kw);
        }
        return (item.title || '').toLowerCase().includes(kw);
      });
    }

    // 3. 공지 유형 필터링
    if (filter.category && filter.category !== 'all') {
      items = items.filter((item) => item.category === filter.category);
    }

    return items;
  },

  /**
   * 단일 상세 조회
   */
  getById: async (id) => {
    if (!id) return null;

    if (!db) {
      return INITIAL_NOTICES.find((n) => n.id === id) || null;
    }

    try {
      const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      // Firestore에 없으면 초기 데이터에서 조회
      return INITIAL_NOTICES.find((n) => n.id === id) || null;
    } catch (err) {
      console.error('Firestore getById 에러:', err);
      return INITIAL_NOTICES.find((n) => n.id === id) || null;
    }
  },

  /**
   * 이전글 / 다음글 조회
   */
  getPrevNext: async (currentId) => {
    const all = await noticeFirebaseService.getAll();
    const normalList = all.filter((n) => !n.isNotice);
    const index = normalList.findIndex((n) => n.id === currentId);

    if (index === -1) {
      return { prev: null, next: null };
    }

    return {
      prev: index > 0 ? normalList[index - 1] : null,
      next: index < normalList.length - 1 ? normalList[index + 1] : null
    };
  },

  /**
   * 조회수 1 증가
   */
  increaseViews: async (id) => {
    if (!db || !id) return 0;
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { views: increment(1) });
      return 1;
    } catch (err) {
      console.warn('조회수 증가 실패:', err);
      return 0;
    }
  },

  /**
   * 새 공지 등록
   * - 첨부파일은 요청대로 기존 방식(DataURL)을 유지하여 Firestore 문서에 직접 저장
   */
  create: async (dto) => {
    if (!db) throw new Error('Firebase DB가 연결되지 않았습니다.');
    const nowIso = new Date().toISOString();

    const newRecord = {
      title: dto.title || '',
      category: dto.category || '일반공지',
      isNotice: Boolean(dto.isNotice),
      author: dto.author || 'VLAST SHOP (블래스트샵)',
      content: dto.content || '',
      views: 0,
      attachments: dto.attachments || [], // 기존 DataURL 방식 그대로 보존
      createdAt: nowIso,
      updatedAt: nowIso
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newRecord);
    return { id: docRef.id, ...newRecord };
  },

  /**
   * 공지 수정
   */
  update: async (id, dto) => {
    if (!db) throw new Error('Firebase DB가 연결되지 않았습니다.');
    const nowIso = new Date().toISOString();
    const docRef = doc(db, COLLECTION_NAME, id);

    const updatePayload = {
      title: dto.title,
      category: dto.category,
      isNotice: Boolean(dto.isNotice),
      author: dto.author,
      content: dto.content,
      attachments: dto.attachments || [],
      updatedAt: nowIso
    };

    if (dto.updateDateToNow) {
      updatePayload.createdAt = nowIso;
    }

    await updateDoc(docRef, updatePayload);
    return { id, ...updatePayload };
  },

  /**
   * 공지 삭제
   */
  delete: async (id) => {
    if (!db) throw new Error('Firebase DB가 연결되지 않았습니다.');
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  },

  /**
   * 초기 데이터 마이그레이션 (기존 LocalStorage 공지사항을 Firestore로 업로드)
   */
  seedInitialData: async () => {
    if (!db) return;
    try {
      let localData = [];
      try {
        const raw = localStorage.getItem('vlast_notices_mock');
        if (raw) localData = JSON.parse(raw);
      } catch (e) {}

      const sourceItems = localData && localData.length > 0 ? localData : INITIAL_NOTICES;

      for (const item of sourceItems) {
        const { id, ...rest } = item;
        await addDoc(collection(db, COLLECTION_NAME), rest);
      }
      console.log(`[Firebase Migration] Firestore에 ${sourceItems.length}개의 공지 데이터 마이그레이션 완료`);
    } catch (err) {
      console.error('[Firebase Migration] 초기 데이터 시딩 실패:', err);
    }
  }
};
