/**
 * @file initialNotices.js
 * @description 초기 시드 공지 데이터 (최신 덤프 이미지 4개 공지 최상단 매칭 및 기존 공지 데이터 포함)
 */

export const INITIAL_NOTICES = [
  // [덤프 이미지 최상단 공지 4종]
  {
    id: "notice-hyperdrive-md",
    no: null,
    title: "[HYPERDRIVE MD] 판매 안내",
    category: "공지",
    isNotice: true,
    isNew: true,
    author: "VLAST SHOP (블래스트샵)",
    views: 1142,
    createdAt: "2026-02-10T10:00:00.000Z",
    updatedAt: "2026-02-10T10:00:00.000Z",
    content: `<p>안녕하세요, VLAST SHOP입니다.</p>
<p><br></p>
<p>PLAVE의 새로운 컬렉션 <strong>[HYPERDRIVE MD]</strong> 공식 판매가 시작됩니다.</p>
<p><br></p>
<h4 style="color: #e0245e; font-weight: 700; margin-bottom: 0.75rem;">| 판매 안내</h4>
<ul style="list-style-type: disc; padding-left: 1.25rem; line-height: 1.8;">
  <li><strong>판매 일시</strong> 2026년 2월 12일 (목) 14:00 (KST) ~ 재고 소진 시까지</li>
  <li><strong>판매처</strong> VLAST Shop 온라인 공식 스토어</li>
  <li><strong>배송 일정</strong> 2026년 2월 20일부터 순차 출고 예정</li>
</ul>
<p><br></p>
<p>팬 여러분의 많은 관심 부탁드립니다.<br>감사합니다.</p>`,
    attachments: []
  },
  {
    id: "notice-birthday-kit-hamin",
    no: null,
    title: "[2026 BIRTHDAY KIT_HAMIN] 판매안내",
    category: "공지",
    isNotice: true,
    isNew: true,
    author: "VLAST SHOP (블래스트샵)",
    views: 977,
    createdAt: "2026-02-05T11:00:00.000Z",
    updatedAt: "2026-02-05T11:00:00.000Z",
    content: `<p>안녕하세요, VLAST SHOP입니다.</p>
<p><br></p>
<p>하민의 생일을 기념하는 <strong>[2026 BIRTHDAY KIT_HAMIN]</strong> 공식 예약 판매 안내입니다.</p>
<p><br></p>
<h4 style="color: #e0245e; font-weight: 700; margin-bottom: 0.75rem;">| 예약 판매 안내</h4>
<ul style="list-style-type: disc; padding-left: 1.25rem; line-height: 1.8;">
  <li><strong>예약 기간</strong> 2026년 2월 6일 (금) ~ 2월 15일 (일) 23:59 (KST)</li>
  <li><strong>구성품</strong> 생일 기념 포토북, 아크릴 스탠드, 스페셜 포토카드 세트 등</li>
</ul>`,
    attachments: []
  },
  {
    id: "notice-hyperdrive-event-gifts",
    no: null,
    title: "PLAVE 5th Mini Album 'HYPERDRIVE' 발매 기념 로판st EVENT Special Gifts 당첨자 발표",
    category: "이벤트",
    isNotice: true,
    isNew: true,
    author: "VLAST SHOP (블래스트샵)",
    views: 5888,
    createdAt: "2026-02-01T15:00:00.000Z",
    updatedAt: "2026-02-01T15:00:00.000Z",
    content: `<p>안녕하세요, VLAST입니다.</p>
<p><br></p>
<p>PLAVE 5th Mini Album 'HYPERDRIVE' 발매 기념 로판st 이벤트에 참여해 주신 모든 분들께 감사드립니다.</p>
<p>Special Gifts 당첨자 명단을 공지해 드립니다.</p>
<p>당첨되신 분들께는 회원가입 시 등록된 이메일로 개별 안내 메일이 발송되었습니다.</p>`,
    attachments: []
  },
  {
    id: "notice-hyperdrive-talk-show",
    no: null,
    title: "PLAVE 5th Mini Album 'HYPERDRIVE' 발매 기념 로판st 토크회 당첨자 발표",
    category: "이벤트",
    isNotice: true,
    isNew: true,
    author: "VLAST SHOP (블래스트샵)",
    views: 4559,
    createdAt: "2026-01-28T16:00:00.000Z",
    updatedAt: "2026-01-28T16:00:00.000Z",
    content: `<p>안녕하세요, VLAST입니다.</p>
<p><br></p>
<p>PLAVE 5th Mini Album 'HYPERDRIVE' 발매 기념 로판st 토크회 당첨자 명단 및 행사 참석 안내사항입니다.</p>`,
    attachments: []
  },

  // [기존 공지 데이터 목록]
  {
    id: "notice-seed-01",
    no: 14,
    title: "VLAST 공식 공식 팬클럽 모집 안내",
    category: "공지",
    isNotice: false,
    isNew: true,
    author: "VLAST SHOP (블래스트샵)",
    views: 1248,
    createdAt: "2025-10-30T10:00:00.000Z",
    updatedAt: "2025-10-30T10:00:00.000Z",
    content: `<p>안녕하세요, VLAST입니다.</p>
<p><br></p>
<p>항상 VLAST를 아껴주시는 팬 여러분께 감사드리며,<br>더 가까이, 더 특별하게 소통할 수 있는 VLAST 공식 팬클럽을 모집합니다.</p>
<p><br></p>
<h4 style="color: #e0245e; font-weight: 700; margin-bottom: 0.75rem; font-size: 1.05rem;">| 모집 안내</h4>
<ul style="list-style-type: disc; padding-left: 1.25rem; line-height: 1.8;">
  <li><strong>모집 기간</strong> 2025년 11월 1일 (토) ~ 11월 30일 (일) 23:59 (KST)</li>
  <li><strong>가입 대상</strong> VLAST를 사랑하는 모든 팬</li>
  <li><strong>가입 방법</strong> VLAST 공식 홈페이지 내 팬클럽 가입 페이지에서 신청</li>
  <li><strong>주요 혜택</strong> 한정판 굿즈, 선예매 혜택, 특별 이벤트 등</li>
</ul>
<p><br></p>
<p>팬 여러분의 많은 관심과 참여 부탁드립니다.<br>감사합니다.</p>
<p>— VLAST 드림 —</p>`,
    attachments: [
      {
        id: "att-seed-01",
        name: "팬클럽_모집안내.pdf",
        size: 2621440,
        type: "application/pdf"
      }
    ]
  },
  {
    id: "notice-seed-02",
    no: 13,
    title: "2025 VLAST TOUR 'ASTERUM' 안내사항",
    category: "공지",
    isNotice: false,
    isNew: true,
    author: "VLAST SHOP (블래스트샵)",
    views: 986,
    createdAt: "2025-10-28T09:30:00.000Z",
    updatedAt: "2025-10-28T09:30:00.000Z",
    content: `<p>안녕하세요, VLAST입니다.</p>
<p><br></p>
<p>2025 VLAST TOUR 'ASTERUM' 투어 공연에 관련된 상세 입장 및 관람 안내사항을 공지합니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-03",
    no: 12,
    title: "온라인 스토어 배송 지연 안내",
    category: "공지",
    isNotice: false,
    isNew: true,
    author: "VLAST SHOP (블래스트샵)",
    views: 754,
    createdAt: "2025-10-25T14:10:00.000Z",
    updatedAt: "2025-10-25T14:10:00.000Z",
    content: `<p>안녕하세요, VLAST Shop입니다.</p>
<p>최근 주문량 폭주 및 택배사 물량 증가로 인해 일부 상품의 배송이 지연되고 있습니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-04",
    no: 11,
    title: "신규 굿즈 판매 안내 (10월 4주차)",
    category: "이벤트",
    isNotice: false,
    isNew: true,
    author: "VLAST SHOP (블래스트샵)",
    views: 1031,
    createdAt: "2025-10-23T11:00:00.000Z",
    updatedAt: "2025-10-23T11:00:00.000Z",
    content: `<p>10월 4주차 신규 공식 MD 굿즈 상품이 새롭게 업데이트되었습니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-05",
    no: 10,
    title: "멤버십 등급 변경 안내",
    category: "공지",
    isNotice: false,
    isNew: true,
    author: "VLAST SHOP (블래스트샵)",
    views: 722,
    createdAt: "2025-10-20T16:00:00.000Z",
    updatedAt: "2025-10-20T16:00:00.000Z",
    content: `<p>2025년도 4분기 회원 멤버십 등급 정책이 일부 변경되어 안내해 드립니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-06",
    no: 9,
    title: "사이트 점검 안내 (10/18 토 02:00~06:00)",
    category: "공지",
    isNotice: false,
    isNew: true,
    author: "VLAST SHOP (블래스트샵)",
    views: 693,
    createdAt: "2025-10-17T18:00:00.000Z",
    updatedAt: "2025-10-17T18:00:00.000Z",
    content: `<p>더욱 안정적인 서비스 제공을 위해 시스템 정기 서버 점검을 진행합니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-07",
    no: 8,
    title: "VLAST 콘서트 취소표 안내",
    category: "공지",
    isNotice: false,
    isNew: true,
    author: "VLAST SHOP (블래스트샵)",
    views: 1117,
    createdAt: "2025-10-15T15:00:00.000Z",
    updatedAt: "2025-10-15T15:00:00.000Z",
    content: `<p>VLAST 콘서트 취소표 예매 일정 및 잔여석 오픈 관련 안내사항입니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-08",
    no: 7,
    title: "개인정보 처리방침 개정 안내",
    category: "보도자료",
    isNotice: false,
    isNew: false,
    author: "VLAST SHOP (블래스트샵)",
    views: 628,
    createdAt: "2025-10-13T10:00:00.000Z",
    updatedAt: "2025-10-13T10:00:00.000Z",
    content: `<p>개인정보 보호법 개정에 따른 VLAST Shop 개인정보 처리방침 개정 공지입니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-09",
    no: 6,
    title: "2025 시즌 그리팅 예약 판매 안내",
    category: "이벤트",
    isNotice: false,
    isNew: false,
    author: "VLAST SHOP (블래스트샵)",
    views: 907,
    createdAt: "2025-10-10T11:00:00.000Z",
    updatedAt: "2025-10-10T11:00:00.000Z",
    content: `<p>2025 시즌 그리팅 공식 패키지 예약 판매가 시작되었습니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-10",
    no: 5,
    title: "고객센터 운영 시간 변경 안내",
    category: "공지",
    isNotice: false,
    isNew: false,
    author: "VLAST SHOP (블래스트샵)",
    views: 572,
    createdAt: "2025-10-08T09:00:00.000Z",
    updatedAt: "2025-10-08T09:00:00.000Z",
    content: `<p>고객센터 운영 시간이 평일 10:00 ~ 17:00로 변경됩니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-11",
    no: 4,
    title: "이벤트 당첨자 발표 안내",
    category: "이벤트",
    isNotice: false,
    isNew: false,
    author: "VLAST SHOP (블래스트샵)",
    views: 689,
    createdAt: "2025-10-05T17:00:00.000Z",
    updatedAt: "2025-10-05T17:00:00.000Z",
    content: `<p>지난 9월 구매 고객 대상 특별 사은품 이벤트 당첨자 명단을 발표합니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-12",
    no: 3,
    title: "VLAST 공식 SNS 채널 안내",
    category: "보도자료",
    isNotice: false,
    isNew: false,
    author: "VLAST SHOP (블래스트샵)",
    views: 741,
    createdAt: "2025-10-03T12:00:00.000Z",
    updatedAt: "2025-10-03T12:00:00.000Z",
    content: `<p>VLAST 공식 유튜브, X(트위터), 인스타그램 공식 채널 주소를 안내해 드립니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-13",
    no: 2,
    title: "팬레터 발송 관련 안내",
    category: "공지",
    isNotice: false,
    isNew: false,
    author: "VLAST SHOP (블래스트샵)",
    views: 620,
    createdAt: "2025-10-01T10:00:00.000Z",
    updatedAt: "2025-10-01T10:00:00.000Z",
    content: `<p>아티스트를 향한 따뜻한 마음이 담긴 팬레터 접수 주소 및 유의사항 안내입니다.</p>`,
    attachments: []
  },
  {
    id: "notice-seed-14",
    no: 1,
    title: "사이트 이용약관 개정 안내",
    category: "공지",
    isNotice: false,
    isNew: false,
    author: "VLAST SHOP (블래스트샵)",
    views: 1023,
    createdAt: "2025-09-29T09:00:00.000Z",
    updatedAt: "2025-09-29T09:00:00.000Z",
    content: `<p>전자상거래 표준약관 일부 변경에 따른 VLAST Shop 이용약관 개정 안내 공지입니다.</p>`,
    attachments: []
  }
];
