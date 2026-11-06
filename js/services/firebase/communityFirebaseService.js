/**
 * @file communityFirebaseService.js
 * @description 커뮤니티(답변형 Q&A) 게시판 Firebase Cloud Firestore 서비스
 * - Firestore 'community_posts' 컬렉션 CRUD
 * - 질문유형 6종: '배송문의', '교환/환불', '계정문의', '시스템오류', '굿즈리뷰', '기타'
 * - 비공개(isSecret) 옵션: 작성자 본인 및 관리자만 열람 가능
 * - 답변 기능: 관리자만 작성/수정/삭제 가능 ('답변대기' -> '답변완료')
 * - 이모티콘 반응 3종: 웃음(smile), 슬픔(sad), 좋아요(like)
 * - 네트워크 지연 대비 타임아웃 레이스 및 안전한 로컬 캐시/샘플 데이터 폴백 탑재
 */

import { db } from './firebaseConfig.js';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  increment
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const COLLECTION_NAME = 'community_posts';
const LOCAL_BACKUP_KEY = 'vlast_community_backup_v2';

// 질문유형 6가지 정의
export const QUESTION_TYPES = [
  '배송문의',
  '교환/환불',
  '계정문의',
  '시스템오류',
  '굿즈리뷰',
  '기타'
];

// 5개 이상의 풍성한 초기 샘플 커뮤니티 게시글 (가상 데이터 6종)
export const INITIAL_POSTS = [
  {
    id: 'comm-init-1',
    title: 'STAR TRACE 공식 포토카드 재입고 일정이 궁금합니다.',
    category: '배송문의',
    content: '<p>품절된 포토카드 팩 추가 입고 예정이 있나요? 투어 일정 전에 구매하고 싶습니다!</p>',
    author: '플리1호',
    authorId: 'user_plave1',
    isSecret: false,
    status: '답변완료',
    answer: {
      content: '<p>안녕하세요, VLAST SHOP입니다.<br>문의주신 STAR TRACE 포토카드 팩은 다음 주 중 2차 예약 판매가 오픈될 예정입니다. 공지사항을 통해 상세 일정을 확인해 주시기 바랍니다. 감사합니다.</p>',
      author: '뚝스(관리자)',
      authorId: 'admin',
      createdAt: '2026-11-06T09:30:00.000Z'
    },
    reactions: { smile: 12, sad: 1, like: 34 },
    views: 142,
    createdAt: '2026-11-06T08:00:00.000Z',
    updatedAt: '2026-11-06T09:30:00.000Z'
  },
  {
    id: 'comm-init-2',
    title: '주문 상품 결제 취소 및 배송지 변경 요청의 건',
    category: '교환/환불',
    content: '<p>주문번호 20261105-00123 배송지 주소를 변경하고 싶습니다.</p>',
    author: '뚝스',
    authorId: 'admin',
    isSecret: true,
    status: '답변완료',
    answer: {
      content: '<p>안녕하세요. 배송지 수정이 정상 완료되었습니다. 상품 출고 후 송장번호를 안내해 드리겠습니다.</p>',
      author: '뚝스(관리자)',
      authorId: 'admin',
      createdAt: '2026-11-06T10:15:00.000Z'
    },
    reactions: { smile: 0, sad: 0, like: 5 },
    views: 19,
    createdAt: '2026-11-06T09:10:00.000Z',
    updatedAt: '2026-11-06T10:15:00.000Z'
  },
  {
    id: 'comm-init-3',
    title: '이번 PLBBUT 아크릴 스탠드 실물 후기 남깁니다!',
    category: '굿즈리뷰',
    content: '<p>실물 색감이 너무 예쁘고 마감도 훌륭해요! 거치대 홈도 딱 맞아서 흔들림 없이 세워집니다. 대만족이에요!! 💙💜💗❤️🖤</p>',
    author: '노아사랑',
    authorId: 'user_noah',
    isSecret: false,
    status: '답변대기',
    answer: null,
    reactions: { smile: 45, sad: 0, like: 88 },
    views: 215,
    createdAt: '2026-11-06T11:20:00.000Z',
    updatedAt: '2026-11-06T11:20:00.000Z'
  },
  {
    id: 'comm-init-4',
    title: '모바일 브라우저에서 결제창 팝업이 닫히는 현상',
    category: '시스템오류',
    content: '<p>사파리 모바일 브라우저에서 최종 주문하기를 누르면 새 창이 차단되어 넘어가지 않습니다. 확인 부탁드립니다.</p>',
    author: '테스터플리',
    authorId: 'user_tester',
    isSecret: false,
    status: '답변대기',
    answer: null,
    reactions: { smile: 2, sad: 8, like: 3 },
    views: 67,
    createdAt: '2026-11-06T13:00:00.000Z',
    updatedAt: '2026-11-06T13:00:00.000Z'
  },
  {
    id: 'comm-init-5',
    title: '회원 정보 등록 이메일 주소 변경 문의드립니다.',
    category: '계정문의',
    content: '<p>가입 시 등록했던 이메일 계정에 접근할 수 없게 되어 새 이메일로 변경하고 싶습니다. 본인확인 절차가 어떻게 되나요?</p>',
    author: '밤비단',
    authorId: 'user_bambi',
    isSecret: true,
    status: '답변완료',
    answer: {
      content: '<p>안녕하세요, VLAST 고객센터입니다.<br>회원 정보 수정은 고객센터 1:1 확인 후 변경을 도와드리고 있습니다. 등록된 휴대폰 번호로 안내 문자를 발송해 드렸으니 확인 부탁드립니다.</p>',
      author: '뚝스(관리자)',
      authorId: 'admin',
      createdAt: '2026-11-06T14:10:00.000Z'
    },
    reactions: { smile: 1, sad: 0, like: 9 },
    views: 45,
    createdAt: '2026-11-06T13:40:00.000Z',
    updatedAt: '2026-11-06T14:10:00.000Z'
  },
  {
    id: 'comm-init-6',
    title: '다음 콘서트 투어 공식 응원봉 현장 수령 부스 운영 여부',
    category: '기타',
    content: '<p>온라인 배송 외에 공연 당일 현장 수령 부스도 운영될 예정인지 궁금합니다. 티켓 소지자만 수령 가능한가요?</p>',
    author: '하민이팬',
    authorId: 'user_hamin',
    isSecret: false,
    status: '답변대기',
    answer: null,
    reactions: { smile: 18, sad: 0, like: 52 },
    views: 180,
    createdAt: '2026-11-06T15:00:00.000Z',
    updatedAt: '2026-11-06T15:00:00.000Z'
  }
];

function getLocalBackup() {
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...INITIAL_POSTS];
}

function saveLocalBackup(list) {
  try {
    localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(list));
  } catch (e) {}
}

export const communityFirebaseService = {
  /**
   * 커뮤니티 전체 목록 조회 (타임아웃 레이스 보호막 포함)
   */
  getAll: async (filter = {}) => {
    let items = [];

    if (!db) {
      items = getLocalBackup();
      saveLocalBackup(items);
      return communityFirebaseService.applyFilterAndSort(items, filter);
    }

    try {
      const fetchPromise = (async () => {
        try {
          const colRef = collection(db, COLLECTION_NAME);
          const snapshot = await getDocs(colRef);

          if (snapshot.empty) {
            console.log('[Community Firebase] 컬렉션이 비어 있어 초기 샘플 글 6종을 시딩합니다.');
            communityFirebaseService.seedInitialData().catch(console.warn);
            return [...INITIAL_POSTS];
          }

          return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        } catch (fetchErr) {
          console.warn('[Community Firebase] Firestore 조회 실패, 로컬 백업 로드:', fetchErr);
          return getLocalBackup();
        }
      })();

      // 3.5초 타임아웃 레이스 (네트워크 지연 시 화면이 멈추거나 에러가 뜨지 않도록 즉시 폴백)
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          console.warn('[Community Firebase] Firestore 응답 대기 초과(3.5s), 로컬 캐시/초기 데이터를 우선 렌더링합니다.');
          resolve(getLocalBackup());
        }, 3500);
      });

      items = await Promise.race([fetchPromise, timeoutPromise]);
    } catch (err) {
      console.warn('[Community Firebase] getAll 에러 발생, 로컬 백업 로드:', err);
      items = getLocalBackup();
    }

    saveLocalBackup(items);
    return communityFirebaseService.applyFilterAndSort(items, filter);
  },

  /**
   * 커뮤니티 페이지네이션 지원 목록 조회 (community.js 호환)
   */
  getPosts: async (options = {}) => {
    const {
      category = '전체',
      period = '전체',
      keyword = '',
      page = 1,
      pageSize = 10
    } = options;

    const allFiltered = await communityFirebaseService.getAll({
      category,
      period,
      keyword
    });

    const total = allFiltered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = allFiltered.slice(startIndex, startIndex + pageSize);

    return {
      posts: paginatedItems,
      total,
      page: currentPage,
      pageSize,
      totalPages
    };
  },

  /**
   * 정렬 및 필터 적용
   */
  applyFilterAndSort: (items, filter = {}) => {
    let result = Array.isArray(items) ? [...items] : [];

    // 1. 카테고리(질문유형) 필터
    if (filter.category && filter.category !== '전체') {
      result = result.filter((item) => item.category === filter.category);
    }

    // 2. 답변 상태 필터 (전체 | 답변대기 | 답변완료)
    if (filter.status && filter.status !== '전체') {
      result = result.filter((item) => item.status === filter.status);
    }

    // 3. 검색어 필터
    if (filter.keyword && filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase();
      result = result.filter((item) => {
        const titleMatch = (item.title || '').toLowerCase().includes(kw);
        const contentMatch = (item.content || '').toLowerCase().includes(kw);
        const authorMatch = (item.author || '').toLowerCase().includes(kw);
        return titleMatch || contentMatch || authorMatch;
      });
    }

    // 4. 최신순 정렬 (createdAt 내림차순)
    result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return result;
  },

  /**
   * 단일 게시글 상세 조회
   */
  getById: async (id) => {
    if (!id) return null;

    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() };
        }
      } catch (err) {
        console.warn('[Community Firebase] getById 실패, 로컬 백업 조회:', err);
      }
    }

    const locals = getLocalBackup();
    return locals.find((item) => item.id === id) || null;
  },

  /**
   * getPostById (community.js 호환)
   */
  getPostById: async (id, options = {}) => {
    if (options.incrementView) {
      communityFirebaseService.increaseViews(id).catch(() => {});
    }
    return await communityFirebaseService.getById(id);
  },

  /**
   * 이전글 / 다음글 조회 (community.js 호환)
   */
  getPrevNextPosts: async (currentId) => {
    const all = await communityFirebaseService.getAll();
    const index = all.findIndex((item) => item.id === currentId);

    if (index === -1) {
      return { prev: null, next: null };
    }

    return {
      prev: index > 0 ? all[index - 1] : null,
      next: index < all.length - 1 ? all[index + 1] : null
    };
  },

  /**
   * 게시글 작성 (로그인 회원 전용)
   */
  create: async (dto) => {
    const nowIso = new Date().toISOString();
    const newPost = {
      title: dto.title || '',
      category: dto.category || '기타',
      content: dto.content || '',
      author: dto.author || '플리',
      authorId: dto.authorId || '',
      isSecret: Boolean(dto.isSecret),
      status: '답변대기',
      answer: null,
      reactions: { smile: 0, sad: 0, like: 0 },
      views: 0,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    let savedId = `comm-${Date.now()}`;

    if (db) {
      try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), newPost);
        savedId = docRef.id;
        console.log('[Community Firebase] 새 글 등록 완료 ID:', savedId);
      } catch (err) {
        console.error('[Community Firebase] 새 글 Firestore 등록 실패 (로컬 우선 저장):', err);
      }
    }

    const created = { id: savedId, ...newPost };
    const locals = getLocalBackup();
    locals.unshift(created);
    saveLocalBackup(locals);

    return created;
  },

  /**
   * createPost (community.js 호환)
   */
  createPost: async (dto) => {
    return await communityFirebaseService.create(dto);
  },

  /**
   * 게시글 수정 (작성자 본인/관리자 전용)
   */
  update: async (id, dto) => {
    if (!id) throw new Error('ID가 필요합니다.');
    const nowIso = new Date().toISOString();

    const updatePayload = {
      title: dto.title,
      category: dto.category,
      content: dto.content,
      isSecret: Boolean(dto.isSecret),
      updatedAt: nowIso
    };

    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updatePayload);
      } catch (err) {
        console.error('[Community Firebase] 글 수정 실패 (로컬 우선 저장):', err);
      }
    }

    const locals = getLocalBackup();
    const idx = locals.findIndex((item) => item.id === id);
    if (idx >= 0) {
      locals[idx] = { ...locals[idx], ...updatePayload };
      saveLocalBackup(locals);
    }

    return { id, ...updatePayload };
  },

  /**
   * updatePost (community.js 호환)
   */
  updatePost: async (id, dto) => {
    return await communityFirebaseService.update(id, dto);
  },

  /**
   * 게시글 삭제 (작성자 본인/관리자 전용)
   */
  delete: async (id) => {
    if (!id) return false;

    if (db) {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
      } catch (err) {
        console.error('[Community Firebase] 글 삭제 실패 (로컬 우선 반영):', err);
      }
    }

    const locals = getLocalBackup().filter((item) => item.id !== id);
    saveLocalBackup(locals);
    return true;
  },

  /**
   * deletePost (community.js 호환)
   */
  deletePost: async (id) => {
    return await communityFirebaseService.delete(id);
  },

  /**
   * 관리자 답변 등록 및 수정 (관리자 전용)
   * - payload 형태: { content, author, authorId } 또는 { answerContent, adminName, adminId }
   */
  saveAnswer: async (id, payload = {}) => {
    if (!id) throw new Error('ID가 필요합니다.');
    const nowIso = new Date().toISOString();

    const content = payload.content || payload.answerContent || '';
    const author = payload.author || payload.adminName || '뚝스(관리자)';
    const authorId = payload.authorId || payload.adminId || 'admin';

    const answerData = {
      content,
      author,
      authorId,
      createdAt: nowIso
    };

    const updatePayload = {
      answer: answerData,
      status: '답변완료',
      updatedAt: nowIso
    };

    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updatePayload);
      } catch (err) {
        console.error('[Community Firebase] 답변 등록 실패 (로컬 우선 저장):', err);
      }
    }

    const locals = getLocalBackup();
    const idx = locals.findIndex((item) => item.id === id);
    if (idx >= 0) {
      locals[idx] = { ...locals[idx], ...updatePayload };
      saveLocalBackup(locals);
    }

    return answerData;
  },

  /**
   * 관리자 답변 삭제
   */
  deleteAnswer: async (id) => {
    if (!id) return false;
    const nowIso = new Date().toISOString();

    const updatePayload = {
      answer: null,
      status: '답변대기',
      updatedAt: nowIso
    };

    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updatePayload);
      } catch (err) {
        console.error('[Community Firebase] 답변 삭제 실패 (로컬 우선 반영):', err);
      }
    }

    const locals = getLocalBackup();
    const idx = locals.findIndex((item) => item.id === id);
    if (idx >= 0) {
      locals[idx] = { ...locals[idx], ...updatePayload };
      saveLocalBackup(locals);
    }

    return true;
  },

  /**
   * 이모티콘 반응 추가 (smile, sad, like)
   */
  addReaction: async (id, type) => {
    if (!id || !['smile', 'sad', 'like'].includes(type)) return 0;

    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
          [`reactions.${type}`]: increment(1)
        });
      } catch (err) {
        console.warn('[Community Firebase] 이모티콘 반영 지연 (로컬 우선 반영):', err);
      }
    }

    const locals = getLocalBackup();
    const post = locals.find((item) => item.id === id);
    if (post) {
      if (!post.reactions) post.reactions = { smile: 0, sad: 0, like: 0 };
      post.reactions[type] = (post.reactions[type] || 0) + 1;
      saveLocalBackup(locals);
      return post.reactions[type];
    }
    return 1;
  },

  /**
   * 조회수 1 증가
   */
  increaseViews: async (id) => {
    if (!id) return;
    if (db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, { views: increment(1) });
      } catch (e) {}
    }

    const locals = getLocalBackup();
    const post = locals.find((item) => item.id === id);
    if (post) {
      post.views = (post.views || 0) + 1;
      saveLocalBackup(locals);
    }
  },

  /**
   * 초기 샘플 글 6종 시딩
   */
  seedInitialData: async () => {
    if (!db) return;
    try {
      for (const item of INITIAL_POSTS) {
        const { id, ...rest } = item;
        await addDoc(collection(db, COLLECTION_NAME), rest);
      }
      console.log('[Community Firebase] 초기 샘플 글 6종 시딩 완료');
    } catch (e) {
      console.warn('[Community Firebase] 시딩 에러:', e);
    }
  }
};
