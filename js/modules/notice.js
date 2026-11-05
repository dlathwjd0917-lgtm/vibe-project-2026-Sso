/**
 * @file notice.js
 * @description 공지사항 게시판 UI 컴포넌트 & 라우팅 컨트롤러
 * (지침서 원칙 준수: localStorage 직접 접근 금지, 오직 noticeService만 호출)
 */

import { noticeService } from '../services/noticeService.js';

// 게시판 상태 관리
const state = {
  mode: 'list', // 'list' | 'view' | 'write' | 'edit'
  currentId: null,
  category: '전체',
  period: '전체',
  keyword: '',
  page: 1,
  pageSize: 10,
  loading: false,
  notices: [],
  selectedNotice: null,
  prevNotice: null,
  nextNotice: null,
  // 글쓰기/수정용 폼 첨부파일
  tempAttachments: []
};

// DOM 요소 컨테이너
let containerEl = null;

/**
 * URL 파라미터 기반 상태 동기화 및 라우팅
 */
function syncStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  state.mode = params.get('mode') || 'list';
  state.currentId = params.get('id') || null;
  state.category = params.get('category') || '전체';
  state.period = params.get('period') || '전체';
  state.keyword = params.get('keyword') || '';
  state.page = parseInt(params.get('page') || '1', 10);
  state.pageSize = parseInt(params.get('pageSize') || '10', 10);
}

/**
 * URL 업데이트 (브라우저 뒤로가기 지원)
 * @param {boolean} [replace=false]
 */
function updateUrl(replace = false) {
  const params = new URLSearchParams();
  if (state.mode !== 'list') params.set('mode', state.mode);
  if (state.currentId) params.set('id', state.currentId);
  if (state.category !== '전체') params.set('category', state.category);
  if (state.period !== '전체') params.set('period', state.period);
  if (state.keyword) params.set('keyword', state.keyword);
  if (state.page > 1) params.set('page', String(state.page));
  if (state.pageSize !== 10) params.set('pageSize', String(state.pageSize));

  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  if (replace) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.pushState({}, '', newUrl);
  }
}

/**
 * 날짜 포맷팅 도우미 (YYYY.MM.DD)
 * @param {string} isoString
 * @returns {string}
 */
function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

/**
 * 파일 크기 포맷팅 도우미
 * @param {number} bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ==========================================================================
// 1. 목록 화면 (List View)
// ==========================================================================
async function renderListView() {
  containerEl.innerHTML = `
    <header class="board-header">
      <div class="board-header__top">
        <nav class="board-header__breadcrumb" aria-label="브레드크럼">
          <a href="index.html">홈</a>
          <span>/</span>
          <a href="notice.html">게시판</a>
          <span>/</span>
          <strong aria-current="page">NOTICE</strong>
        </nav>
      </div>
      <h1 class="board-header__title">NOTICE</h1>
    </header>

    <div class="board-loading" id="board-loading">공지사항 목록을 불러오는 중입니다...</div>
    <div id="board-content" style="display: none;"></div>
  `;

  const contentEl = containerEl.querySelector('#board-content');
  const loadingEl = containerEl.querySelector('#board-loading');

  try {
    const list = await noticeService.getAll({
      category: state.category,
      period: state.period,
      keyword: state.keyword
    });
    state.notices = list;
  } catch (error) {
    console.error('목록 로드 실패:', error);
    loadingEl.textContent = '공지사항을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
    return;
  }

  loadingEl.style.display = 'none';
  contentEl.style.display = 'block';

  // 상단 고정 공지와 일반 글 분리
  // (요구사항: 다음 페이지로 넘어가도 상단 공지 리스트는 사라지지 않음)
  const noticeItems = state.notices.filter((item) => Boolean(item.isNotice));
  const normalItems = state.notices.filter((item) => !item.isNotice);

  // 일반 공지 기준 페이지네이션 계산
  const totalNormal = normalItems.length;
  const totalPages = Math.max(1, Math.ceil(totalNormal / state.pageSize));
  if (state.page > totalPages) state.page = totalPages;
  if (state.page < 1) state.page = 1;

  const startIndex = (state.page - 1) * state.pageSize;
  const pagedNormalItems = normalItems.slice(startIndex, startIndex + state.pageSize);

  // 1. 상단 공지 행 생성 (항상 테이블 최상단에 고정 표시)
  const noticeRowsHtml = noticeItems.map((item) => {
    return `
      <tr class="is-notice-row">
        <td class="col-no"><span class="notice-badge-label">공지</span></td>
        <td class="col-title">
          <a class="notice-table__title-link is-notice-title" href="?mode=view&id=${encodeURIComponent(item.id)}" data-view-id="${item.id}">
            ${escapeHtml(item.title)}
          </a>
          ${item.isNew ? '<span class="badge-new" aria-label="새 글">N</span>' : ''}
        </td>
        <td class="col-author">${escapeHtml(item.author || 'VLAST SHOP (블래스트샵)')}</td>
        <td class="col-views">${(item.views || 0).toLocaleString()}</td>
      </tr>
    `;
  }).join('');

  // 2. 일반 공지 행 생성 (페이지네이션 슬라이스 적용)
  const normalRowsHtml = pagedNormalItems.map((item, idx) => {
    // 최신순으로 나중에 등록된 리스트가 번호가 클 수 있도록 내림차순으로 계산
    const displayNo = totalNormal - (startIndex + idx);
    return `
      <tr>
        <td class="col-no">${displayNo}</td>
        <td class="col-title">
          <a class="notice-table__title-link" href="?mode=view&id=${encodeURIComponent(item.id)}" data-view-id="${item.id}">
            ${escapeHtml(item.title)}
          </a>
          ${item.isNew ? '<span class="badge-new" aria-label="새 글">N</span>' : ''}
        </td>
        <td class="col-author">${escapeHtml(item.author || 'VLAST SHOP (블래스트샵)')}</td>
        <td class="col-views">${(item.views || 0).toLocaleString()}</td>
      </tr>
    `;
  }).join('');

  let rowsHtml = noticeRowsHtml + normalRowsHtml;
  if (!rowsHtml.trim()) {
    rowsHtml = `
      <tr>
        <td colspan="4" style="padding: 3rem 1rem; color: #888; text-align: center;">등록된 공지사항이 없습니다.</td>
      </tr>
    `;
  }

  // 페이지 버튼 HTML
  let pagesHtml = '';
  const maxButtons = 5;
  const startPage = Math.floor((state.page - 1) / maxButtons) * maxButtons + 1;
  const endPage = Math.min(startPage + maxButtons - 1, totalPages);

  for (let p = startPage; p <= endPage; p++) {
    pagesHtml += `
      <button class="board-pagination__btn ${p === state.page ? 'is-active' : ''}" type="button" data-page="${p}">
        ${p}
      </button>
    `;
  }

  contentEl.innerHTML = `
    <div class="notice-table-wrap">
      <table class="notice-table" aria-label="공지사항 목록">
        <thead>
          <tr>
            <th class="col-no" scope="col">번호</th>
            <th class="col-title" scope="col">제목</th>
            <th class="col-author" scope="col">작성자</th>
            <th class="col-views" scope="col">조회</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <div class="board-toolbar">
      <div class="board-toolbar__left">
        <select class="board-toolbar__select" id="page-size-select" aria-label="한 페이지에 표시할 개수">
          <option value="10" ${state.pageSize === 10 ? 'selected' : ''}>10개씩 보기</option>
          <option value="15" ${state.pageSize === 15 ? 'selected' : ''}>15개씩 보기</option>
          <option value="20" ${state.pageSize === 20 ? 'selected' : ''}>20개씩 보기</option>
        </select>

        <div class="board-toolbar__filters" role="group" aria-label="기간 필터">
          <button class="board-toolbar__filter-btn ${state.period === '전체' ? 'is-active' : ''}" type="button" data-period="전체">전체</button>
          <button class="board-toolbar__filter-btn ${state.period === '일주일' ? 'is-active' : ''}" type="button" data-period="일주일">일주일</button>
          <button class="board-toolbar__filter-btn ${state.period === '한달' ? 'is-active' : ''}" type="button" data-period="한달">한달</button>
          <button class="board-toolbar__filter-btn ${state.period === '세달' ? 'is-active' : ''}" type="button" data-period="세달">세달</button>
        </div>

        <span class="board-toolbar__divider" aria-hidden="true"></span>

        <form class="board-toolbar__search" id="notice-search-form">
          <input class="board-toolbar__search-input" type="text" id="notice-keyword-input" placeholder="검색어를 입력하세요." value="${escapeHtml(state.keyword)}" />
          <button class="board-toolbar__search-btn" type="submit" aria-label="검색">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </div>

      <div class="board-toolbar__right">
        <button class="board-toolbar__write-btn" type="button" id="go-write-btn">
          글쓰기 &gt;
        </button>
      </div>
    </div>

    <nav class="board-pagination" aria-label="공지사항 페이지 탐색">
      <button class="board-pagination__btn" type="button" id="prev-page-btn" ${state.page <= 1 ? 'disabled' : ''} aria-label="이전 페이지">&lt;</button>
      ${pagesHtml}
      <button class="board-pagination__btn" type="button" id="next-page-btn" ${state.page >= totalPages ? 'disabled' : ''} aria-label="다음 페이지">&gt;</button>
    </nav>
  `;

  // 이벤트 바인딩
  // 1. 상세 보기 클릭
  contentEl.querySelectorAll('[data-view-id]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      state.currentId = link.dataset.viewId;
      state.mode = 'view';
      updateUrl();
      window.scrollTo({ top: 0, behavior: 'instant' });
      renderDetailView(state.currentId);
    });
  });

  // 2. 글쓰기 버튼 클릭
  contentEl.querySelector('#go-write-btn')?.addEventListener('click', () => {
    state.mode = 'write';
    state.currentId = null;
    updateUrl();
    renderWriteView();
  });

  // 3. 페이지 사이즈 변경
  contentEl.querySelector('#page-size-select')?.addEventListener('change', (e) => {
    state.pageSize = parseInt(e.target.value, 10);
    state.page = 1;
    updateUrl();
    renderListView();
  });

  // 4. 기간 필터 클릭
  contentEl.querySelectorAll('.board-toolbar__filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.period = btn.dataset.period;
      state.page = 1;
      updateUrl();
      renderListView();
    });
  });

  // 5. 검색 폼 제출
  contentEl.querySelector('#notice-search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = contentEl.querySelector('#notice-keyword-input');
    state.keyword = input ? input.value : '';
    state.page = 1;
    updateUrl();
    renderListView();
  });

  // 6. 페이지 번호 클릭
  contentEl.querySelectorAll('.board-pagination__btn[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.dataset.page, 10);
      if (p !== state.page) {
        state.page = p;
        updateUrl();
        renderListView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // 7. 이전/다음 페이지
  contentEl.querySelector('#prev-page-btn')?.addEventListener('click', () => {
    if (state.page > 1) {
      state.page--;
      updateUrl();
      renderListView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  contentEl.querySelector('#next-page-btn')?.addEventListener('click', () => {
    if (state.page < totalPages) {
      state.page++;
      updateUrl();
      renderListView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// 2. 상세 화면 (Detail View)
// ==========================================================================
async function renderDetailView(id) {
  window.scrollTo({ top: 0, behavior: 'instant' });
  containerEl.innerHTML = `
    <header class="board-header board-header--detail">
      <div class="board-header__top">
        <h1 class="board-header__title">NOTICE</h1>
        <nav class="board-header__breadcrumb" aria-label="브레드크럼">
          <a href="index.html">HOME</a>
          <span>&gt;</span>
          <strong aria-current="page">NOTICE</strong>
        </nav>
      </div>
    </header>

    <div class="board-loading" id="detail-loading">공지사항을 불러오는 중입니다...</div>
    <div id="detail-content" style="display: none;"></div>
  `;

  const loadingEl = containerEl.querySelector('#detail-loading');
  const contentEl = containerEl.querySelector('#detail-content');

  try {
    // 1. 조회수 1 증가 (요구사항: 진입 시 조회수 +1)
    await noticeService.increaseViews(id);
    // 2. 데이터 및 이전글/다음글 비동기 병렬 조회
    const [notice, prevNext] = await Promise.all([
      noticeService.getById(id),
      noticeService.getPrevNext(id)
    ]);

    let foundNotice = notice;
    if (!foundNotice) {
      foundNotice = state.notices.find(item => item.id === id);
    }

    if (!foundNotice) {
      loadingEl.textContent = '해당 공지사항을 찾을 수 없습니다.';
      return;
    }

    state.selectedNotice = foundNotice;
    state.prevNotice = prevNext ? prevNext.prev : null;
    state.nextNotice = prevNext ? prevNext.next : null;
  } catch (error) {
    console.error('상세 로드 실패:', error);
    loadingEl.textContent = '공지사항을 불러오지 못했습니다.';
    return;
  }

  loadingEl.style.display = 'none';
  contentEl.style.display = 'block';

  const notice = state.selectedNotice;
  const isNotice = Boolean(notice.isNotice);
  const badgeHtml = isNotice ? '<span class="badge-notice">공지</span>' : '';
  const newBadgeHtml = notice.isNew ? '<span class="badge-new" aria-label="새 글">N</span>' : '';

  // 첨부파일 영역 HTML
  let attachmentsHtml = '';
  if (notice.attachments && notice.attachments.length > 0) {
    const listHtml = notice.attachments.map((att) => `
      <a class="notice-detail__attachment-item" href="${att.url || '#'}" download="${escapeHtml(att.name)}" target="_blank" rel="noopener noreferrer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
        </svg>
        <span>${escapeHtml(att.name)} (${formatFileSize(att.size)})</span>
      </a>
    `).join('');

    attachmentsHtml = `
      <div class="notice-detail__attachments">
        <div class="notice-detail__attachments-title">첨부파일 (${notice.attachments.length})</div>
        <div class="notice-detail__attachment-list">${listHtml}</div>
      </div>
    `;
  }

  // 이전글 / 다음글 HTML
  const prevHtml = state.prevNotice ? `
    <a class="notice-nav__btn" href="?mode=view&id=${state.prevNotice.id}" data-nav-id="${state.prevNotice.id}">
      <span class="notice-nav__label">&lt; 이전글</span>
      <span>${escapeHtml(state.prevNotice.title)}</span>
    </a>
  ` : `
    <span class="notice-nav__btn" style="opacity: 0.4;">
      <span class="notice-nav__label">&lt; 이전글</span>
      <span>이전 글이 없습니다.</span>
    </span>
  `;

  const nextHtml = state.nextNotice ? `
    <a class="notice-nav__btn" style="justify-content: flex-end;" href="?mode=view&id=${state.nextNotice.id}" data-nav-id="${state.nextNotice.id}">
      <span>${escapeHtml(state.nextNotice.title)}</span>
      <span class="notice-nav__label">다음글 &gt;</span>
    </a>
  ` : `
    <span class="notice-nav__btn" style="opacity: 0.4; justify-content: flex-end;">
      <span>다음 글이 없습니다.</span>
      <span class="notice-nav__label">다음글 &gt;</span>
    </span>
  `;

  contentEl.innerHTML = `
    <article class="notice-detail">
      <div class="notice-detail__head">
        <div class="notice-detail__title-row">
          <div class="notice-detail__title-wrap">
            ${badgeHtml}
            <h2 class="notice-detail__title">${escapeHtml(notice.title)}${newBadgeHtml}</h2>
          </div>
          <div class="notice-detail__quick-info">
            <span>${formatDate(notice.createdAt)}</span>
            <span aria-hidden="true">|</span>
            <span>👁 ${(notice.views || 0).toLocaleString()}</span>
          </div>
        </div>

        <div class="notice-detail__meta">
          <span>작성자 <strong>${escapeHtml(notice.author || 'VLAST')}</strong></span>
          <span aria-hidden="true">|</span>
          <span>조회수 <strong>${(notice.views || 0).toLocaleString()}</strong></span>
          <span aria-hidden="true">|</span>
          <span>등록일 <strong>${formatDate(notice.createdAt)}</strong></span>
        </div>
      </div>

      <div class="notice-detail__body">
        ${notice.content || ''}
      </div>

      ${attachmentsHtml}

      <nav class="notice-nav" aria-label="이전글 다음글 탐색">
        ${prevHtml}
        ${nextHtml}
      </nav>
    </article>

    <div class="notice-detail__actions">
      <button class="btn-secondary" type="button" id="detail-list-btn">
        ≡ 목록으로
      </button>
      <button class="btn-secondary" type="button" id="detail-edit-btn">
        수정
      </button>
      <button class="btn-danger" type="button" id="detail-delete-btn">
        삭제
      </button>
    </div>
  `;

  // 이벤트 바인딩
  // 브레드크럼 목록 이동
  containerEl.querySelector('#breadcrumb-list')?.addEventListener('click', (e) => {
    e.preventDefault();
    goToList();
  });

  // 목록으로 버튼
  contentEl.querySelector('#detail-list-btn')?.addEventListener('click', goToList);

  // 수정 버튼
  contentEl.querySelector('#detail-edit-btn')?.addEventListener('click', () => {
    state.mode = 'edit';
    updateUrl();
    renderEditView(state.currentId);
  });

  // 삭제 버튼 (확인 다이얼로그)
  contentEl.querySelector('#detail-delete-btn')?.addEventListener('click', async () => {
    if (confirm('이 공지사항을 정말 삭제하시겠습니까?')) {
      try {
        await noticeService.delete(state.currentId);
        alert('공지사항이 삭제되었습니다.');
        goToList();
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  });

  // 이전글 / 다음글 이동
  contentEl.querySelectorAll('[data-nav-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.dataset.navId;
      state.currentId = targetId;
      updateUrl();
      renderDetailView(targetId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// ==========================================================================
// 3. 글쓰기 화면 (Write View)
// ==========================================================================
function renderWriteView() {
  state.tempAttachments = [];

  containerEl.innerHTML = `
    <header class="board-header">
      <div class="board-header__top">
        <h1 class="board-header__title">NOTICE</h1>
        <nav class="board-header__breadcrumb" aria-label="브레드크럼">
          <a href="index.html">HOME</a>
          <span>&gt;</span>
          <a href="notice.html" id="breadcrumb-list">NOTICE</a>
        </nav>
      </div>
    </header>

    <div class="notice-form-card">
      <form id="notice-write-form">
        <div class="form-group">
          <label class="form-label" for="write-title">제목 <span class="required">*</span></label>
          <div>
            <input class="form-input-text" type="text" id="write-title" placeholder="제목을 입력해주세요." required maxlength="200" />
          </div>
        </div>

        <div class="form-group">
          <span class="form-label">분류</span>
          <div class="form-radio-group">
            <label class="form-radio-label">
              <input type="radio" name="write-category" value="전체" checked /> 전체
            </label>
            <label class="form-radio-label">
              <input type="radio" name="write-category" value="공지" /> 공지
            </label>
            <label class="form-radio-label">
              <input type="radio" name="write-category" value="이벤트" /> 이벤트
            </label>
            <label class="form-radio-label">
              <input type="radio" name="write-category" value="보도자료" /> 보도자료
            </label>
            <label class="form-radio-label" style="margin-left: 1rem; color: #e0245e; font-weight: 600;">
              <input type="checkbox" id="write-is-notice" /> 중요 공지 (상단 고정)
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">내용 <span class="required">*</span></label>
          <div>
            <div class="editor-container" id="write-editor-container">
              <div class="editor-toolbar" role="toolbar" aria-label="리치 텍스트 서식">
                <button class="editor-btn" type="button" data-cmd="bold" title="굵게 (Ctrl+B)"><strong>B</strong></button>
                <button class="editor-btn" type="button" data-cmd="italic" title="기울임 (Ctrl+I)"><em>I</em></button>
                <button class="editor-btn" type="button" data-cmd="underline" title="밑줄 (Ctrl+U)"><u>U</u></button>
                <button class="editor-btn" type="button" data-cmd="strikeThrough" title="취소선"><s>S</s></button>

                <span class="editor-divider" aria-hidden="true"></span>

                <button class="editor-btn" type="button" data-cmd="insertUnorderedList" title="글머리 기호 목록">• ≡</button>
                <button class="editor-btn" type="button" data-cmd="insertOrderedList" title="번호 매기기 목록">1. ≡</button>
                <button class="editor-btn" type="button" data-cmd="justifyLeft" title="왼쪽 정렬">⇤</button>
                <button class="editor-btn" type="button" data-cmd="justifyCenter" title="가운데 정렬">≡</button>
                <button class="editor-btn" type="button" data-cmd="justifyRight" title="오른쪽 정렬">⇥</button>

                <span class="editor-divider" aria-hidden="true"></span>

                <button class="editor-btn" type="button" data-custom="link" title="링크 삽입">🔗</button>
                <button class="editor-btn" type="button" data-custom="image" title="이미지 삽입">🖼</button>
                <button class="editor-btn" type="button" data-custom="video" title="동영상 링크">▶</button>

                <span class="editor-divider" aria-hidden="true"></span>

                <select class="editor-select" id="write-format-select" aria-label="서식 스타일">
                  <option value="p">본문</option>
                  <option value="h3">제목 (대)</option>
                  <option value="h4">제목 (중)</option>
                  <option value="blockquote">인용구</option>
                </select>
                <button class="editor-btn" type="button" data-cmd="removeFormat" title="서식 제거">Tx</button>
              </div>

              <div class="editor-content" id="write-editor" contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="내용을 입력해주세요."></div>

              <div class="editor-footer">
                <span id="write-char-counter">0 / 5,000</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <span class="form-label">첨부파일</span>
          <div>
            <div class="file-dropzone" id="write-dropzone">
              <div class="file-dropzone__icon">📎</div>
              <p class="file-dropzone__text">파일을 드래그하거나 클릭하여 첨부하세요.</p>
              <p class="file-dropzone__sub">(최대 10MB, JPG/PNG/PDF/ZIP, 최대 5개까지 가능)</p>
              <input type="file" id="write-file-input" style="display: none;" multiple accept=".jpg,.jpeg,.png,.pdf,.zip" />
            </div>
            <div class="file-list" id="write-file-list"></div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-secondary" type="button" id="write-cancel-btn">취소</button>
          <button class="btn-primary" type="submit" id="write-submit-btn">등록하기</button>
        </div>
      </form>
    </div>
  `;

  setupFormEditorAndFiles('write');
}

// ==========================================================================
// 4. 글수정 화면 (Edit View)
// ==========================================================================
async function renderEditView(id) {
  containerEl.innerHTML = `
    <header class="board-header">
      <div class="board-header__top">
        <h1 class="board-header__title">NOTICE</h1>
        <nav class="board-header__breadcrumb" aria-label="브레드크럼">
          <a href="index.html">HOME</a>
          <span>&gt;</span>
          <a href="notice.html" id="breadcrumb-list">NOTICE</a>
          <span>&gt;</span>
          <strong aria-current="page">글수정</strong>
        </nav>
      </div>
    </header>

    <div class="board-loading" id="edit-loading">공지사항 데이터를 불러오는 중입니다...</div>
    <div id="edit-content" style="display: none;"></div>
  `;

  const loadingEl = containerEl.querySelector('#edit-loading');
  const contentEl = containerEl.querySelector('#edit-content');

  let notice = null;
  try {
    notice = await noticeService.getById(id);
    if (!notice) {
      loadingEl.textContent = '수정할 공지사항을 찾을 수 없습니다.';
      return;
    }
    state.selectedNotice = notice;
    state.tempAttachments = [...(notice.attachments || [])];
  } catch (error) {
    console.error('공지 로드 실패:', error);
    loadingEl.textContent = '공지사항을 불러오지 못했습니다.';
    return;
  }

  loadingEl.style.display = 'none';
  contentEl.style.display = 'block';

  contentEl.innerHTML = `
    <div class="notice-form-card">
      <h2 class="notice-form__heading">글수정</h2>

      <form id="notice-edit-form">
        <div class="form-group">
          <label class="form-label" for="edit-title">제목 <span class="required">*</span></label>
          <div>
            <input class="form-input-text" type="text" id="edit-title" value="${escapeHtml(notice.title)}" required maxlength="200" />
          </div>
        </div>

        <div class="form-group">
          <span class="form-label">분류</span>
          <div class="form-radio-group">
            <label class="form-radio-label">
              <input type="radio" name="edit-category" value="전체" ${notice.category === '전체' ? 'checked' : ''} /> 전체
            </label>
            <label class="form-radio-label">
              <input type="radio" name="edit-category" value="공지" ${notice.category === '공지' ? 'checked' : ''} /> 공지
            </label>
            <label class="form-radio-label">
              <input type="radio" name="edit-category" value="이벤트" ${notice.category === '이벤트' ? 'checked' : ''} /> 이벤트
            </label>
            <label class="form-radio-label">
              <input type="radio" name="edit-category" value="보도자료" ${notice.category === '보도자료' ? 'checked' : ''} /> 보도자료
            </label>
            <label class="form-radio-label" style="margin-left: 1rem; color: #e0245e; font-weight: 600;">
              <input type="checkbox" id="edit-is-notice" ${notice.isNotice ? 'checked' : ''} /> 중요 공지 (상단 고정)
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">내용 <span class="required">*</span></label>
          <div>
            <div class="editor-container" id="edit-editor-container">
              <div class="editor-toolbar" role="toolbar" aria-label="리치 텍스트 서식">
                <button class="editor-btn" type="button" data-cmd="bold" title="굵게"><strong>B</strong></button>
                <button class="editor-btn" type="button" data-cmd="italic" title="기울임"><em>I</em></button>
                <button class="editor-btn" type="button" data-cmd="underline" title="밑줄"><u>U</u></button>
                <button class="editor-btn" type="button" data-cmd="strikeThrough" title="취소선"><s>S</s></button>

                <span class="editor-divider" aria-hidden="true"></span>

                <button class="editor-btn" type="button" data-cmd="insertUnorderedList" title="글머리 기호 목록">• ≡</button>
                <button class="editor-btn" type="button" data-cmd="insertOrderedList" title="번호 매기기 목록">1. ≡</button>
                <button class="editor-btn" type="button" data-cmd="justifyLeft" title="왼쪽 정렬">⇤</button>
                <button class="editor-btn" type="button" data-cmd="justifyCenter" title="가운데 정렬">≡</button>
                <button class="editor-btn" type="button" data-cmd="justifyRight" title="오른쪽 정렬">⇥</button>

                <span class="editor-divider" aria-hidden="true"></span>

                <button class="editor-btn" type="button" data-custom="link" title="링크 삽입">🔗</button>
                <button class="editor-btn" type="button" data-custom="image" title="이미지 삽입">🖼</button>
                <button class="editor-btn" type="button" data-custom="video" title="동영상 링크">▶</button>

                <span class="editor-divider" aria-hidden="true"></span>

                <select class="editor-select" id="edit-format-select" aria-label="서식 스타일">
                  <option value="p">본문</option>
                  <option value="h3">제목 (대)</option>
                  <option value="h4">제목 (중)</option>
                  <option value="blockquote">인용구</option>
                </select>
                <button class="editor-btn" type="button" data-cmd="removeFormat" title="서식 제거">Tx</button>
              </div>

              <div class="editor-content" id="edit-editor" contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="내용을 입력해주세요.">
                ${notice.content || ''}
              </div>

              <div class="editor-footer">
                <span id="edit-char-counter">0 / 5,000</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <span class="form-label">첨부파일</span>
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
              <button class="file-add-btn" type="button" id="edit-file-add-trigger">파일 추가 +</button>
              <span style="font-size: 0.75rem; color: #888;">(최대 10MB, 최대 5개)</span>
              <input type="file" id="edit-file-input" style="display: none;" multiple accept=".jpg,.jpeg,.png,.pdf,.zip" />
            </div>
            <div class="file-list" id="edit-file-list"></div>
          </div>
        </div>

        <div class="form-group">
          <span class="form-label">옵션</span>
          <div>
            <label class="form-radio-label">
              <input type="checkbox" id="edit-update-date" /> 수정일을 현재 날짜로 갱신
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-secondary" type="button" id="edit-cancel-btn">취소</button>
          <button class="btn-primary" type="submit" id="edit-submit-btn">수정 완료</button>
          <button class="btn-secondary" type="button" id="edit-list-btn">목록으로</button>
        </div>
      </form>
    </div>
  `;

  setupFormEditorAndFiles('edit');
}

// ==========================================================================
// 폼 공통 처리: 에디터 툴바 & 첨부파일 관리
// ==========================================================================
function setupFormEditorAndFiles(prefix) {
  const editorEl = containerEl.querySelector(`#${prefix}-editor`);
  const counterEl = containerEl.querySelector(`#${prefix}-char-counter`);
  const fileListEl = containerEl.querySelector(`#${prefix}-file-list`);
  const fileInputEl = containerEl.querySelector(`#${prefix}-file-input`);
  const formEl = containerEl.querySelector(`#notice-${prefix}-form`);

  // 1. 브레드크럼 목록 이동
  containerEl.querySelector('#breadcrumb-list')?.addEventListener('click', (e) => {
    e.preventDefault();
    goToList();
  });

  // 2. 글자수 카운터 갱신
  function updateCounter() {
    const textLength = editorEl.innerText.trim().length;
    counterEl.textContent = `${textLength.toLocaleString()} / 5,000`;
    if (textLength > 5000) {
      counterEl.style.color = '#e0245e';
    } else {
      counterEl.style.color = '#888888';
    }
  }

  editorEl.addEventListener('input', updateCounter);
  updateCounter();

  // 3. 리치 에디터 툴바 명령 바인딩
  const toolbarEl = containerEl.querySelector(`#${prefix}-editor-container .editor-toolbar`);
  toolbarEl.querySelectorAll('[data-cmd]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      document.execCommand(cmd, false, null);
      editorEl.focus();
    });
  });

  // 서식 스타일 (h3, h4, p, blockquote)
  const formatSelect = containerEl.querySelector(`#${prefix}-format-select`);
  formatSelect?.addEventListener('change', () => {
    const val = formatSelect.value;
    document.execCommand('formatBlock', false, `<${val}>`);
    editorEl.focus();
  });

  // 커스텀 버튼 (링크, 이미지, 동영상)
  toolbarEl.querySelector('[data-custom="link"]')?.addEventListener('click', () => {
    const url = prompt('삽입할 링크 URL을 입력하세요:', 'https://');
    if (url) {
      document.execCommand('createLink', false, url);
    }
    editorEl.focus();
  });

  toolbarEl.querySelector('[data-custom="image"]')?.addEventListener('click', () => {
    const imgUrl = prompt('이미지 URL을 입력하세요:', 'https://');
    if (imgUrl) {
      document.execCommand('insertImage', false, imgUrl);
    }
    editorEl.focus();
  });

  toolbarEl.querySelector('[data-custom="video"]')?.addEventListener('click', () => {
    const videoUrl = prompt('동영상 링크(유튜브 등)를 입력하세요:', 'https://');
    if (videoUrl) {
      const p = document.createElement('p');
      p.innerHTML = `<a href="${videoUrl}" target="_blank" rel="noopener noreferrer">▶ 동영상 보기: ${videoUrl}</a>`;
      editorEl.append(p);
    }
    editorEl.focus();
  });

  // 4. 첨부파일 UI 렌더링
  function renderAttachments() {
    fileListEl.innerHTML = state.tempAttachments.map((file, idx) => `
      <span class="file-chip">
        <span>📄 ${escapeHtml(file.name)} (${formatFileSize(file.size)})</span>
        <button class="file-chip__remove" type="button" data-remove-index="${idx}" aria-label="${file.name} 삭제">×</button>
      </span>
    `).join('');

    fileListEl.querySelectorAll('[data-remove-index]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.removeIndex, 10);
        state.tempAttachments.splice(idx, 1);
        renderAttachments();
      });
    });
  }
  renderAttachments();

  // 5. 파일 추가 처리
  function handleFiles(files) {
    const validExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'zip'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const maxCount = 5;

    for (let i = 0; i < files.length; i++) {
      if (state.tempAttachments.length >= maxCount) {
        alert('첨부파일은 최대 5개까지만 등록할 수 있습니다.');
        break;
      }

      const file = files[i];
      const ext = file.name.split('.').pop().toLowerCase();

      if (!validExtensions.includes(ext)) {
        alert(`${file.name}: 지원하지 않는 파일 형식입니다. (JPG, PNG, PDF, ZIP만 허용)`);
        continue;
      }

      if (file.size > maxSizeBytes) {
        alert(`${file.name}: 파일 크기가 10MB를 초과합니다.`);
        continue;
      }

      // LocalStorage 용량 한계 고려 메타데이터 생성 및 가상 URL 생성
      // [Firebase Storage 연동 시 rawFile을 전달하여 업로드]
      const fileMeta = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `file-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // 로컬 세션 내 임시 미리보기 URL
        rawFile: file // Firebase 업로드용
      };

      state.tempAttachments.push(fileMeta);
    }
    renderAttachments();
  }

  // 드롭존 또는 파일 추가 트리거
  const dropzone = containerEl.querySelector(`#${prefix}-dropzone`);
  if (dropzone) {
    dropzone.addEventListener('click', () => fileInputEl.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
      if (e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    });
  }

  containerEl.querySelector(`#${prefix}-file-add-trigger`)?.addEventListener('click', () => {
    fileInputEl.click();
  });

  fileInputEl.addEventListener('change', () => {
    if (fileInputEl.files) {
      handleFiles(fileInputEl.files);
      fileInputEl.value = '';
    }
  });

  // 취소 버튼
  containerEl.querySelector(`#${prefix}-cancel-btn`)?.addEventListener('click', () => {
    if (prefix === 'edit') {
      state.mode = 'view';
      updateUrl();
      renderDetailView(state.currentId);
    } else {
      goToList();
    }
  });

  // 목록으로 버튼 (수정 화면)
  containerEl.querySelector(`#${prefix}-list-btn`)?.addEventListener('click', goToList);

  // 6. 폼 제출 (등록 또는 수정)
  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titleInput = containerEl.querySelector(`#${prefix}-title`);
    const title = titleInput.value.trim();
    if (!title) {
      alert('제목을 입력해주세요.');
      titleInput.focus();
      return;
    }

    const contentHtml = editorEl.innerHTML.trim();
    const contentText = editorEl.innerText.trim();
    if (!contentText && !editorEl.querySelector('img')) {
      alert('내용을 입력해주세요.');
      editorEl.focus();
      return;
    }

    if (contentText.length > 5000) {
      alert('내용은 최대 5,000자까지 작성할 수 있습니다.');
      editorEl.focus();
      return;
    }

    const selectedCategoryRadio = containerEl.querySelector(`input[name="${prefix}-category"]:checked`);
    const category = selectedCategoryRadio ? selectedCategoryRadio.value : '공지';
    const isNotice = containerEl.querySelector(`#${prefix}-is-notice`)?.checked || false;

    const submitBtn = containerEl.querySelector(`#${prefix}-submit-btn`);
    submitBtn.disabled = true;
    submitBtn.textContent = '저장 중...';

    try {
      if (prefix === 'write') {
        const newNotice = await noticeService.create({
          title,
          category,
          isNotice,
          isNew: true,
          content: contentHtml,
          author: 'VLAST',
          attachments: state.tempAttachments.map(att => ({
            id: att.id,
            name: att.name,
            size: att.size,
            type: att.type,
            url: att.url
          }))
        });

        alert('공지사항이 성공적으로 등록되었습니다.');
        state.currentId = newNotice.id;
        state.mode = 'view';
        updateUrl();
        renderDetailView(newNotice.id);
      } else {
        const updateDateToNow = containerEl.querySelector('#edit-update-date')?.checked || false;
        await noticeService.update(state.currentId, {
          title,
          category,
          isNotice,
          content: contentHtml,
          updateDateToNow,
          attachments: state.tempAttachments.map(att => ({
            id: att.id,
            name: att.name,
            size: att.size,
            type: att.type,
            url: att.url
          }))
        });

        alert('공지사항이 성공적으로 수정되었습니다.');
        state.mode = 'view';
        updateUrl();
        renderDetailView(state.currentId);
      }
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
      submitBtn.disabled = false;
      submitBtn.textContent = prefix === 'write' ? '등록하기' : '수정 완료';
    }
  });
}

function goToList() {
  state.mode = 'list';
  state.currentId = null;
  updateUrl();
  renderListView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 게시판 초기화 엔트리포인트
 * @param {HTMLElement} mountElement
 */
export function initNoticeBoard(mountElement) {
  containerEl = mountElement;
  syncStateFromUrl();

  // 브라우저 뒤로가기 / 앞으로가기 처리
  window.addEventListener('popstate', () => {
    syncStateFromUrl();
    route();
  });

  route();
}

function route() {
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (state.mode === 'view' && state.currentId) {
    renderDetailView(state.currentId);
  } else if (state.mode === 'write') {
    renderWriteView();
  } else if (state.mode === 'edit' && state.currentId) {
    renderEditView(state.currentId);
  } else {
    state.mode = 'list';
    renderListView();
  }
}

