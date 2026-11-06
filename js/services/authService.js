/**
 * @file authService.js
 * @description Firebase Cloud Firestore 기반 회원가입 및 로그인 인증 서비스
 * - Firestore 'users' 컬렉션에 사용자 정보(이름, 아이디, 비밀번호, 이메일, 역할, 생성일) 영구 보존
 * - LocalStorage 캐시 및 세션 동시 관리 (빠른 응답 및 오프라인/동기화 보장)
 * - 기본 관리자(admin) 계정 초기 등록:
 *   이름: 뚝스, 아이디: admin, 비밀번호: 1111, 이메일: admin.com@company.co.kr
 */

import { db } from './firebase/firebaseConfig.js';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const USERS_COLLECTION = 'users';
const MEMBERS_KEY = 'vlast_members';
const AUTH_USER_KEY = 'vlast_auth_user';

// 기본 관리자 계정 스펙
const DEFAULT_ADMIN = {
  id: 'admin',
  username: 'admin',
  name: '뚝스',
  password: '1111',
  email: 'admin.com@company.co.kr',
  role: 'admin',
  createdAt: '2026-11-06T00:00:00.000Z'
};

/**
 * 로컬 회원 목록 가져오기
 * @returns {Array}
 */
function getLocalMembers() {
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    let members = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(members)) members = [];

    const hasAdmin = members.some((m) => (m.id || '').toLowerCase() === 'admin');
    if (!hasAdmin) {
      members.unshift(DEFAULT_ADMIN);
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
    }
    return members;
  } catch (err) {
    return [DEFAULT_ADMIN];
  }
}

/**
 * 로컬 회원 저장/갱신
 * @param {Object} member
 */
function saveLocalMember(member) {
  try {
    const members = getLocalMembers();
    const idx = members.findIndex((m) => (m.id || '').toLowerCase() === (member.id || '').toLowerCase());
    if (idx >= 0) {
      members[idx] = member;
    } else {
      members.push(member);
    }
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  } catch (err) {
    console.error('로컬 회원 저장 실패:', err);
  }
}

export const authService = {
  /**
   * 기본 관리자 계정 정보 반환
   */
  getDefaultAdmin: () => DEFAULT_ADMIN,

  /**
   * 아이디 중복 체크 (Firestore + LocalStorage)
   * @param {string} id
   * @returns {Promise<boolean>} true: 중복(사용 불가), false: 사용 가능
   */
  checkIdDuplicate: async (id) => {
    if (!id || typeof id !== 'string') return true;
    const cleanId = id.trim().toLowerCase();

    // 1. 로컬 캐시 확인
    const localList = getLocalMembers();
    if (localList.some((m) => (m.id || '').toLowerCase() === cleanId)) {
      return true;
    }

    // 2. Firestore 확인
    if (db) {
      try {
        const userDocRef = doc(db, USERS_COLLECTION, cleanId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          return true;
        }
      } catch (err) {
        console.warn('[Firebase Auth] 중복 확인 Firestore 통신 지연/오류:', err);
      }
    }
    return false;
  },

  /**
   * 회원가입 (Firebase Firestore 'users' 컬렉션에 저장)
   * @param {Object} data { name, id, password, email }
   * @returns {Promise<{ success: boolean, message: string, user?: Object }>}
   */
  register: async ({ name, id, password, email }) => {
    const cleanName = (name || '').trim();
    const cleanId = (id || '').trim();
    const cleanPassword = (password || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. 유효성 검사
    if (!cleanName) return { success: false, message: '이름을 입력해 주세요.' };
    if (!cleanId) return { success: false, message: '아이디를 입력해 주세요.' };
    if (cleanId.length < 3) return { success: false, message: '아이디는 3자 이상이어야 합니다.' };
    if (!cleanPassword) return { success: false, message: '비밀번호를 입력해 주세요.' };
    if (cleanPassword.length < 4) return { success: false, message: '비밀번호는 4자 이상이어야 합니다.' };
    if (!cleanEmail) return { success: false, message: '이메일을 입력해 주세요.' };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, message: '올바른 이메일 형식을 입력해 주세요.' };
    }

    // 2. 중복 체크
    const isDup = await authService.checkIdDuplicate(cleanId);
    if (isDup) {
      return { success: false, message: '이미 사용 중인 아이디입니다. 다른 아이디를 입력해 주세요.' };
    }

    // 3. 신규 회원 데이터 생성 (일반회원 role: 'user', 관리자 role: 'admin')
    const newMember = {
      id: cleanId,
      username: cleanId,
      name: cleanName,
      password: cleanPassword,
      email: cleanEmail,
      role: cleanId.toLowerCase() === 'admin' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    // 4. Firebase Firestore에 저장 (문서 ID를 cleanId로 지정)
    if (db) {
      try {
        const userDocRef = doc(db, USERS_COLLECTION, cleanId);
        await setDoc(userDocRef, newMember);
        console.log(`[Firebase Auth] ✅ 사용자(${cleanId}) 정보가 Firestore '${USERS_COLLECTION}' 컬렉션에 등록되었습니다.`);
      } catch (err) {
        console.error('[Firebase Auth] Firestore 사용자 저장 실패:', err);
        if (err?.code === 'permission-denied') {
          console.warn('⚠️ [Firebase 보안 규칙] Firebase 콘솔 > Firestore > 규칙(Rules)에서 allow read, write: if true; 허용이 필요합니다.');
        }
      }
    }

    // 5. 로컬 캐시 동기화
    saveLocalMember(newMember);

    return {
      success: true,
      message: `${cleanName}님, 회원가입이 성공적으로 완료되었습니다!`,
      user: {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
        role: newMember.role
      }
    };
  },

  /**
   * 로그인 (Firestore 우선 조회 후 로컬 캐시 조회)
   * @param {string} id
   * @param {string} password
   * @returns {Promise<{ success: boolean, message: string, user?: Object }>}
   */
  login: async (id, password) => {
    const cleanId = (id || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanId || !cleanPassword) {
      return { success: false, message: '아이디와 비밀번호를 모두 입력해 주세요.' };
    }

    let found = null;

    // 1. Firestore에서 실시간 사용자 조회
    if (db) {
      try {
        const userDocRef = doc(db, USERS_COLLECTION, cleanId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          found = userSnap.data();
          // 로컬 캐시 갱신
          saveLocalMember(found);
        }
      } catch (err) {
        console.warn('[Firebase Auth] Firestore 로그인 조회 지연/오류:', err);
      }
    }

    // 2. Firestore에 없거나 네트워크 문제 시 로컬 캐시에서 조회
    if (!found) {
      const members = getLocalMembers();
      found = members.find(
        (m) => ((m.id || '').toLowerCase() === cleanId || (m.username || '').toLowerCase() === cleanId)
      );
    }

    if (!found) {
      return { success: false, message: '존재하지 않는 아이디입니다.' };
    }

    if (found.password !== cleanPassword) {
      return { success: false, message: '비밀번호가 일치하지 않습니다.' };
    }

    const sessionUser = {
      id: found.id,
      username: found.username || found.id,
      name: found.name,
      email: found.email,
      role: found.role || (found.id === 'admin' ? 'admin' : 'user'),
      loginAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
      window.dispatchEvent(new CustomEvent('vlast_auth_changed', { detail: sessionUser }));
    } catch (err) {
      console.error('로그인 세션 저장 실패:', err);
    }

    return {
      success: true,
      message: `${sessionUser.name}님 환영합니다!`,
      user: sessionUser
    };
  },

  /**
   * 로그아웃
   */
  logout: () => {
    try {
      localStorage.removeItem(AUTH_USER_KEY);
      window.dispatchEvent(new CustomEvent('vlast_auth_changed', { detail: null }));
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  },

  /**
   * 현재 세션 사용자 정보 조회 (동기)
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  },

  /**
   * 현재 사용자가 관리자(admin)인지 확인
   * @returns {boolean}
   */
  isAdmin: () => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    return user.role === 'admin' || user.id === 'admin' || user.username === 'admin';
  },

  /**
   * Firebase Firestore 초기 동기화 (관리자 계정 및 로컬 사용자 자동 업로드)
   */
  syncToFirebase: async () => {
    if (!db) return;
    try {
      // 1. 관리자 계정 존재 확인 및 업로드
      const adminDocRef = doc(db, USERS_COLLECTION, DEFAULT_ADMIN.id);
      const adminSnap = await getDoc(adminDocRef);
      if (!adminSnap.exists()) {
        await setDoc(adminDocRef, DEFAULT_ADMIN);
        console.log(`[Firebase Auth] 기본 관리자(admin: 뚝스) 계정이 Firestore '${USERS_COLLECTION}' 컬렉션에 자동 등록되었습니다.`);
      }

      // 2. 로컬에 저장되어 있던 기존 회원들도 Firestore로 동기화
      const localList = getLocalMembers();
      for (const m of localList) {
        if (!m || !m.id) continue;
        const ref = doc(db, USERS_COLLECTION, m.id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, m);
          console.log(`[Firebase Auth] 기존 회원(${m.id})이 Firestore '${USERS_COLLECTION}' 컬렉션에 동기화되었습니다.`);
        }
      }
    } catch (e) {
      console.warn('[Firebase Auth] 사용자 초기 동기화 비동기 대기 중:', e);
    }
  }
};

// 모듈 로드 시 Firestore와 백그라운드 자동 동기화 실행
if (typeof window !== 'undefined') {
  authService.syncToFirebase().catch((err) => {
    console.warn('[Firebase Auth] syncToFirebase 알림:', err);
  });
}
