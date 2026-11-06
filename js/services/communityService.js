/**
 * @file communityService.js
 * @description 커뮤니티(답변형 Q&A) 게시판 서비스 통합 진입점
 * UI 컴포넌트는 이 파일을 통해 커뮤니티 데이터 및 질문유형에 접근합니다.
 *
 * [저장소]
 * - Firebase Cloud Firestore 모드 (community_posts 컬렉션)
 */

export { communityFirebaseService as communityService, QUESTION_TYPES } from './firebase/communityFirebaseService.js';

