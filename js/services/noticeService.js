/**
 * @file noticeService.js
 * @description 공지사항 서비스 통합 진입점 (단일 책임 인터페이스)
 * UI 컴포넌트는 오직 이 파일의 noticeService만 import하여 사용합니다.
 *
 * [저장소 전환 방법]
 * - 현재 (개발/테스트): LocalStorage Mock 서비스 활성화
 * - 추후 (운영/Firebase): 아래 1번 주석 처리 후 2번 주석 해제 (UI 컴포넌트 수정 불필요)
 */

// 1. [LocalStorage Mock 모드]
export { noticeMockService as noticeService } from './mock/noticeMockService.js';

// 2. [Firebase Firestore 모드 - 전환 시 위 라인을 주석 처리하고 아래 라인을 활성화]
// export { noticeFirebaseService as noticeService } from './firebase/noticeFirebaseService.js';

