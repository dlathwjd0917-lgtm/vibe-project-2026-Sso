/**
 * @file noticeFirebaseService.js
 * @description Firebase Cloud Firestore 기반 공지사항 CRUD 구현체
 * (지침서 5절 1단계 준수: Firebase 전환 시 noticeService.js에서 이 서비스로 교체)
 */

// import {
//   collection,
//   getDocs,
//   getDoc,
//   doc,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   increment,
//   query,
//   orderBy
// } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from './firebaseConfig.js';

const COLLECTION_NAME = 'notices';

export const noticeFirebaseService = {
  /**
   * 전체 목록 조회
   */
  getAll: async (filter = {}) => {
    // const q = query(collection(db, COLLECTION_NAME), orderBy('isNotice', 'desc'), orderBy('createdAt', 'desc'));
    // const snapshot = await getDocs(q);
    // return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    throw new Error('Firebase 환경이 아직 구성되지 않았습니다. noticeService.js에서 Mock 모드를 사용하세요.');
  },

  /**
   * 단일 상세 조회
   */
  getById: async (id) => {
    // const d = await getDoc(doc(db, COLLECTION_NAME, id));
    // return d.exists() ? { id: d.id, ...d.data() } : null;
    throw new Error('Firebase 환경이 아직 구성되지 않았습니다.');
  },

  /**
   * 이전글 / 다음글 조회
   */
  getPrevNext: async (currentId) => {
    // Firestore 쿼리 또는 인덱스 기반 앞뒤 문서 조회
    return { prev: null, next: null };
  },

  /**
   * 조회수 1 증가
   */
  increaseViews: async (id) => {
    // const docRef = doc(db, COLLECTION_NAME, id);
    // await updateDoc(docRef, { views: increment(1) });
    return 0;
  },

  /**
   * 공지 생성 (Firebase Storage 파일 업로드 포함)
   */
  create: async (dto) => {
    // const nowIso = new Date().toISOString();
    // [Firebase Storage 파일 업로드 구현 지점]
    // const uploadedAttachments = await Promise.all(
    //   (dto.attachments || []).map(async (fileObj) => {
    //     if (fileObj.rawFile) {
    //       const storageRef = ref(storage, `notices/${Date.now()}_${fileObj.name}`);
    //       const snapshot = await uploadBytes(storageRef, fileObj.rawFile);
    //       const downloadUrl = await getDownloadURL(snapshot.ref);
    //       return { id: crypto.randomUUID(), name: fileObj.name, size: fileObj.size, type: fileObj.type, url: downloadUrl };
    //     }
    //     return fileObj;
    //   })
    // );
    // const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    //   ...dto,
    //   attachments: uploadedAttachments,
    //   views: 0,
    //   createdAt: nowIso,
    //   updatedAt: nowIso
    // });
    // return { id: docRef.id, ...dto, attachments: uploadedAttachments, createdAt: nowIso, updatedAt: nowIso };
    throw new Error('Firebase 환경이 아직 구성되지 않았습니다.');
  },

  /**
   * 공지 수정
   */
  update: async (id, dto) => {
    // const docRef = doc(db, COLLECTION_NAME, id);
    // const nowIso = new Date().toISOString();
    // await updateDoc(docRef, {
    //   ...dto,
    //   updatedAt: nowIso,
    //   ...(dto.updateDateToNow ? { createdAt: nowIso } : {})
    // });
    throw new Error('Firebase 환경이 아직 구성되지 않았습니다.');
  },

  /**
   * 공지 삭제
   */
  delete: async (id) => {
    // await deleteDoc(doc(db, COLLECTION_NAME, id));
    throw new Error('Firebase 환경이 아직 구성되지 않았습니다.');
  }
};

