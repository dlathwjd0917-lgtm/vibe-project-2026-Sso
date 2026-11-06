/**
 * @file noticeService.js
 * @description 공지사항 서비스 통합 진입점 (단일 책임 인터페이스)
 * UI 컴포넌트는 오직 이 파일의 noticeService만 import하여 사용합니다.
 *
 * [저장소 전환 완료]
 * - Firebase Cloud Firestore 모드 활성화 완료 (sso-wed-project)
 */

// 1. [LocalStorage Mock 모드 - 비활성화]
// export { noticeMockService as noticeService } from './mock/noticeMockService.js';

// 2. [Firebase Firestore 모드 - 활성화]
export { noticeFirebaseService as noticeService } from './firebase/noticeFirebaseService.js';
