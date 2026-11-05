/**
 * @file notice.js
 * @description 공지사항 데이터 모델 및 DTO 정의 (NoSQL/Firestore 친화적 스키마)
 */

/**
 * 첨부파일 메타데이터 모델
 * @typedef {Object} NoticeAttachment
 * @property {string} id - 고유 식별자 (UUID)
 * @property {string} name - 파일명
 * @property {number} size - 파일 크기 (bytes)
 * @property {string} type - MIME 타입
 * @property {string} [url] - 다운로드 URL (LocalStorage는 dataURL/blob 또는 가상 URL, Firebase는 Storage URL)
 */

/**
 * 공지사항 게시글 엔티티 모델
 * @typedef {Object} Notice
 * @property {string} id - 고유 식별자 (crypto.randomUUID() 또는 Firestore doc.id)
 * @property {number} no - 표시 번호 (정렬/참고용)
 * @property {string} title - 공지 제목
 * @property {'전체'|'공지'|'이벤트'|'보도자료'} category - 분류 유형
 * @property {boolean} isNotice - 중요 공지 여부 (상단 고정 및 핑크 배경)
 * @property {boolean} isNew - NEW 뱃지 표시 여부
 * @property {string} content - 본문 내용 (HTML/리치 텍스트)
 * @property {string} author - 작성자 (기본 "VLAST")
 * @property {number} views - 조회수
 * @property {NoticeAttachment[]} attachments - 첨부파일 배열
 * @property {string} createdAt - 생성일시 (ISO 8601 문자열: "2025-10-30T10:00:00.000Z")
 * @property {string} updatedAt - 수정일시 (ISO 8601 문자열)
 */

/**
 * 공지 생성 DTO
 * @typedef {Object} CreateNoticeDto
 * @property {string} title
 * @property {'전체'|'공지'|'이벤트'|'보도자료'} category
 * @property {boolean} [isNotice]
 * @property {boolean} [isNew]
 * @property {string} content
 * @property {string} [author]
 * @property {NoticeAttachment[]} [attachments]
 */

/**
 * 공지 수정 DTO
 * @typedef {Partial<CreateNoticeDto> & { updateDateToNow?: boolean }} UpdateNoticeDto
 */

export {};

