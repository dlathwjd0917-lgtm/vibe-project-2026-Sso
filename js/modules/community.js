/**
 * @file community.js
 * @description 커뮤니티(답변형 Q&A) 게시판 UI 컴포넌트 & 라우팅 컨트롤러
 * - 6개 카테고리 질문유형 선택 ('배송문의', '교환/환불', '계정문의', '시스템오류', '굿즈리뷰', '기타')
 * - 비공개 설정(isSecret): 리스트 제목 아래 비공개 표출, 본인/관리자만 상세 본문 열람
 * - 답변형 게시판: 답변완료/대기 뱃지, 관리자 전용 답변 작성/수정/삭제
 * - 이모티콘 3종 반응: 웃음(smile), 슬픔(sad), 좋아요(like)
 */

import { communityService, QUESTION_TYPES } from '../services/communityService.js';
import { authService } from '../services/authService.js';

// 상태 관리
const state = {
  mode: 'list', // 'list' | 'view' | 'write' | 'edit'
  currentId: null,
  category: '전체',
  period: '전체',
  keyword: '',
  page: 1,
  pageSize: 10,
  loading: false,
  posts: [],
  selectedPost: null,
  prevPost: null,
  nextPost: null,
  isEditingAnswer: false
};

let containerEl = null;

/**
 * URL 파라미터 동기화
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
 * URL 업데이트
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

// ==========================================================================
// 1. 목록 화면 (List View)
// ==========================================================================
async function renderListView() {
  containerEl.innerHTML = `
    <header class="board-header">
      <div class="board-header__top">
        <nav class="board-header__breadcrumb" aria-label="브레드크럼">
          <a href="index.html">HOME</a>
          <span>&gt;</span>
          <strong>COMMUNITY</strong>
        </nav>
      </div>
      <h1 class="board-header__title">COMMUNITY</h1>
    </header>

    <!-- 카테고리 탭 (질문 유형 필터) -->
    <nav class="community-category-tabs" aria-label="질문유형 카테고리">
      <button type="button" class="community-tab-btn ${state.category === '전체' ? 'is-active' : ''}" data-cat="전체">전체보기</button>
      ${QUESTION_TYPES.map(cat => `
        <button type="button" class="community-tab-btn ${state.category === cat ? 'is-active' : ''}" data-cat="${cat}">${cat}</button>
      `).join('')}
    </nav>

    <div class="notice-loading" id="community-loading" style="padding: 3rem 0; text-align: center; color: #888;">
      커뮤니티 글 목록을 불러오는 중입니다...
    </div>

    <div class="notice-table-wrap" id="community-table-wrap" style="display: none;"></div>
    <div id="community-pagination-wrap"></div>
    <div id="community-search-toolbar"></div>
  `;

  // 카테고리 탭 이벤트
  containerEl.querySelectorAll('.community-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.getAttribute('data-cat');
      state.page = 1;
      updateUrl();
      renderListView();
    });
  });

  try {
    const result = await communityService.getPosts({
      category: state.category,
      period: state.period,
      keyword: state.keyword,
      page: state.page,
      pageSize: state.pageSize
    });

    const loadingEl = document.getElementById('community-loading');
    const tableWrap = document.getElementById('community-table-wrap');
    if (loadingEl) loadingEl.style.display = 'none';
    if (tableWrap) tableWrap.style.display = 'block';

    const currentUser = authService.getCurrentUser();
    const canWrite = !!currentUser;

    // 테이블 렌더링
    tableWrap.innerHTML = `
      <table class="notice-table" aria-label="커뮤니티 Q&A 목록">
        <colgroup>
          <col style="width: 70px;">
          <col style="width: 110px;">
          <col style="width: auto;">
          <col style="width: 120px;">
          <col style="width: 100px;">
          <col style="width: 70px;">
          <col style="width: 100px;">
        </colgroup>
        <thead>
          <tr>
            <th scope="col">NO</th>
            <th scope="col">유형</th>
            <th scope="col">SUBJECT</th>
            <th scope="col">NAME</th>
            <th scope="col">DATE</th>
            <th scope="col">HIT</th>
            <th scope="col">STATUS</th>
          </tr>
        </thead>
        <tbody>
          ${result.posts.length === 0 ? `
            <tr>
              <td colspan="7" class="notice-table__empty">
                등록된 커뮤니티 게시글이 없습니다.
              </td>
            </tr>
          ` : result.posts.map((post, idx) => {
            const no = result.total - ((result.page - 1) * result.pageSize) - idx;
            const isAnswered = post.status === '답변완료' || !!post.answer;
            const statusBadge = isAnswered 
              ? `<span class="community-badge community-badge--answered">답변완료</span>`
              : `<span class="community-badge community-badge--waiting">답변대기</span>`;

            return `
              <tr class="notice-row" data-id="${post.id}">
                <td class="notice-table__no">${no}</td>
                <td class="notice-table__category">
                  <span class="community-badge community-badge--category">${post.category || '기타'}</span>
                </td>
                <td class="notice-table__title">
                  <div class="community-title-cell">
                    <a href="community.html?mode=view&id=${post.id}" class="community-title-link" data-id="${post.id}">
                      ${post.isSecret ? '<span aria-hidden="true">🔒</span>' : ''}
                      <span>${escapeHtml(post.title)}</span>
                    </a>
                    ${post.isSecret ? `
                      <span class="community-badge community-badge--secret" title="비공개 글입니다.">
                        🔒 비공개
                      </span>
                    ` : ''}
                  </div>
                </td>
                <td class="notice-table__author">${escapeHtml(post.author || '익명')}</td>
                <td class="notice-table__date">${formatDate(post.createdAt)}</td>
                <td class="notice-table__views">${post.views || 0}</td>
                <td class="notice-table__status">${statusBadge}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    // 행 클릭 이벤트
    tableWrap.querySelectorAll('.community-title-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('data-id');
        navigateTo('view', id);
      });
    });

    // 페이지네이션 렌더링
    renderPagination(result.totalPages, result.page);

    // 하단 검색 툴바 렌더링 (글쓰기 버튼 포함)
    renderSearchToolbar(canWrite);

  } catch (err) {
    console.error('[Community] 목록 렌더링 실패:', err);
    const loadingEl = document.getElementById('community-loading');
    if (loadingEl) {
      loadingEl.innerHTML = `<p style="color: #e0245e;">목록을 불러오는 중 오류가 발생했습니다.<br>${err.message}</p>`;
    }
  }
}

/**
 * 페이지네이션 렌더링
 */
function renderPagination(totalPages, currentPage) {
  const wrap = document.getElementById('community-pagination-wrap');
  if (!wrap) return;

  if (totalPages <= 1) {
    wrap.innerHTML = '';
    return;
  }

  const pages = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let p = startPage; p <= endPage; p++) {
    pages.push(p);
  }

  wrap.innerHTML = `
    <nav class="notice-pagination" aria-label="커뮤니티 페이지 이동">
      <button type="button" class="pagination-btn pagination-btn--first" ${currentPage === 1 ? 'disabled' : ''} data-page="1" aria-label="첫 페이지">&laquo;</button>
      <button type="button" class="pagination-btn pagination-btn--prev" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}" aria-label="이전 페이지">&lt;</button>
      <div class="pagination-numbers">
        ${pages.map(p => `
          <button type="button" class="pagination-number ${p === currentPage ? 'is-active' : ''}" data-page="${p}" aria-current="${p === currentPage ? 'page' : 'false'}">${p}</button>
        `).join('')}
      </div>
      <button type="button" class="pagination-btn pagination-btn--next" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}" aria-label="다음 페이지">&gt;</button>
      <button type="button" class="pagination-btn pagination-btn--last" ${currentPage === totalPages ? 'disabled' : ''} data-page="${totalPages}" aria-label="마지막 페이지">&raquo;</button>
    </nav>
  `;

  wrap.querySelectorAll('button[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = parseInt(btn.getAttribute('data-page'), 10);
      if (!isNaN(p) && p !== state.page) {
        state.page = p;
        updateUrl();
        renderListView();
      }
    });
  });
}

/**
 * 검색 툴바 & 글쓰기 버튼 렌더링
 */
function renderSearchToolbar(canWrite) {
  const wrap = document.getElementById('community-search-toolbar');
  if (!wrap) return;

  wrap.innerHTML = `
    <div class="notice-toolbar">
      <form class="notice-search-form" id="community-search-form" role="search">
        <label for="comm-search-period" class="visually-hidden">검색 기간</label>
        <select id="comm-search-period" class="search-select">
          <option value="전체" ${state.period === '전체' ? 'selected' : ''}>일주일</option>
          <option value="한달" ${state.period === '한달' ? 'selected' : ''}>한달</option>
          <option value="세달" ${state.period === '세달' ? 'selected' : ''}>세달</option>
          <option value="전체" ${state.period === '전체' ? 'selected' : ''}>전체</option>
        </select>

        <label for="comm-search-keyword" class="visually-hidden">검색어 입력</label>
        <div class="search-input-wrap">
          <input type="text" id="comm-search-keyword" class="search-input" placeholder="검색어를 입력하세요" value="${escapeHtml(state.keyword)}">
          <button type="submit" class="search-submit-btn">찾기</button>
        </div>
      </form>

      <div class="notice-toolbar__actions">
        <button type="button" class="notice-btn notice-btn--primary" id="btn-community-write">
          글쓰기
        </button>
      </div>
    </div>
  `;

  // 검색 폼 서밋
  const form = document.getElementById('community-search-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const periodEl = document.getElementById('comm-search-period');
      const keywordEl = document.getElementById('comm-search-keyword');
      state.period = periodEl ? periodEl.value : '전체';
      state.keyword = keywordEl ? keywordEl.value.trim() : '';
      state.page = 1;
      updateUrl();
      renderListView();
    });
  }

  // 글쓰기 버튼
  const writeBtn = document.getElementById('btn-community-write');
  if (writeBtn) {
    writeBtn.addEventListener('click', () => {
      const user = authService.getCurrentUser();
      if (!user) {
        if (confirm('커뮤니티 글쓰기는 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?')) {
          window.location.href = 'login.html';
        }
        return;
      }
      navigateTo('write');
    });
  }
}

// ==========================================================================
// 2. 상세 화면 (View Mode)
// ==========================================================================
async function renderViewMode() {
  containerEl.innerHTML = `
    <div class="notice-loading" style="padding: 4rem 0; text-align: center; color: #888;">
      게시글을 불러오는 중입니다...
    </div>
  `;

  try {
    const post = await communityService.getPostById(state.currentId, { incrementView: true });
    if (!post) {
      alert('존재하지 않거나 삭제된 게시글입니다.');
      navigateTo('list');
      return;
    }

    state.selectedPost = post;
    const currentUser = authService.getCurrentUser();
    const isAdmin = authService.isAdmin();
    const isAuthor = currentUser && (currentUser.id === post.authorId || currentUser.username === post.authorId);
    const canModify = isAuthor || isAdmin;

    // 비공개 글 열람 권한 판별
    // 비공개 글은 오직 작성자 본인과 관리자만 열람 가능
    const isLockedSecret = post.isSecret && !isAuthor && !isAdmin;

    const navData = await communityService.getPrevNextPosts(post.id);
    state.prevPost = navData.prev;
    state.nextPost = navData.next;

    // 반응 정보
    const reactions = post.reactions || { smile: 0, sad: 0, like: 0 };
    const isAnswered = post.status === '답변완료' || !!post.answer;

    containerEl.innerHTML = `
      <header class="board-header board-header--detail">
        <div class="board-header__top">
          <h1 class="board-header__title">COMMUNITY</h1>
          <nav class="board-header__breadcrumb" aria-label="브레드크럼">
            <a href="index.html">HOME</a>
            <span>&gt;</span>
            <a href="community.html">COMMUNITY</a>
            <span>&gt;</span>
            <strong>${escapeHtml(post.category || 'Q&A')}</strong>
          </nav>
        </div>
      </header>

      <article class="notice-detail" aria-labelledby="post-title">
        <header class="notice-detail__header">
          <div class="community-detail-meta-box">
            <span class="community-badge community-badge--category">${post.category || '기타'}</span>
            ${post.isSecret ? '<span class="community-badge community-badge--secret">🔒 비공개</span>' : ''}
            <span class="community-badge ${isAnswered ? 'community-badge--answered' : 'community-badge--waiting'}">
              ${isAnswered ? '답변완료' : '답변대기'}
            </span>
          </div>

          <h2 class="notice-detail__title" id="post-title">
            ${post.isSecret ? '<span aria-hidden="true">🔒</span> ' : ''}${escapeHtml(post.title)}
          </h2>

          <div class="notice-detail__meta">
            <span class="meta-item">
              <span class="meta-label">작성자:</span>
              <span class="meta-value">${escapeHtml(post.author || '익명')}</span>
            </span>
            <span class="meta-divider" aria-hidden="true">|</span>
            <span class="meta-item">
              <span class="meta-label">작성일:</span>
              <span class="meta-value">${formatDate(post.createdAt)}</span>
            </span>
            <span class="meta-divider" aria-hidden="true">|</span>
            <span class="meta-item">
              <span class="meta-label">조회수:</span>
              <span class="meta-value">${post.views || 0}</span>
            </span>
          </div>
        </header>

        <!-- 본문 내용 or 비공개 잠금 화면 -->
        ${isLockedSecret ? `
          <div class="community-locked-box" role="alert">
            <div class="community-locked-icon">🔒</div>
            <h3 class="community-locked-title">비밀글로 보호된 게시글입니다.</h3>
            <p class="community-locked-desc">
              작성자 본인과 관리자만 내용을 확인하실 수 있습니다.<br>
              로그인 상태를 확인해 주세요.
            </p>
            ${!currentUser ? `
              <a href="login.html" class="notice-btn notice-btn--primary" style="display: inline-block;">
                로그인 하러가기
              </a>
            ` : ''}
          </div>
        ` : `
          ${post.isSecret ? `
            <div class="community-secret-alert">
              <span>🔒 <strong>비밀글 안내:</strong> 이 글은 비공개로 등록되어 작성자 본인과 관리자만 볼 수 있습니다.</span>
            </div>
          ` : ''}

          <div class="notice-detail__content">
            ${post.content || ''}
          </div>

          <!-- 누구나 남길 수 있는 이모티콘 3종 반응 영역 (웃음, 슬픔, 좋아요) -->
          <div class="community-reaction-section">
            <span class="community-reaction-heading">이 글에 대한 여러분의 반응을 남겨주세요!</span>
            <div class="community-reaction-buttons" role="group" aria-label="이모티콘 반응">
              <button type="button" class="reaction-btn reaction-btn--smile" data-reaction="smile" title="웃음">
                <span class="reaction-btn__icon" aria-hidden="true">😄</span>
                <span>웃음</span>
                <span class="reaction-btn__count" id="count-smile">${reactions.smile || 0}</span>
              </button>
              <button type="button" class="reaction-btn reaction-btn--sad" data-reaction="sad" title="슬픔">
                <span class="reaction-btn__icon" aria-hidden="true">😢</span>
                <span>슬픔</span>
                <span class="reaction-btn__count" id="count-sad">${reactions.sad || 0}</span>
              </button>
              <button type="button" class="reaction-btn reaction-btn--like" data-reaction="like" title="좋아요">
                <span class="reaction-btn__icon" aria-hidden="true">❤️</span>
                <span>좋아요</span>
                <span class="reaction-btn__count" id="count-like">${reactions.like || 0}</span>
              </button>
            </div>
          </div>

          <!-- 질문 아래 관리자 답변 영역 -->
          ${renderAnswerSection(post, isAdmin)}
        `}

        <!-- 하단 액션 버튼 (수정/삭제/목록) -->
        <footer class="notice-detail__actions">
          <div class="actions-left">
            <button type="button" class="notice-btn notice-btn--secondary" id="btn-back-to-list">
              목록
            </button>
          </div>
          <div class="actions-right">
            ${canModify ? `
              <button type="button" class="notice-btn notice-btn--default" id="btn-edit-post">
                수정
              </button>
              <button type="button" class="notice-btn notice-btn--danger" id="btn-delete-post">
                삭제
              </button>
            ` : ''}
          </div>
        </footer>

        <!-- 이전글 / 다음글 이동 -->
        <nav class="notice-nav" aria-label="이전글 다음글 탐색">
          <div class="notice-nav__row notice-nav__row--prev">
            <span class="notice-nav__label">이전글 &and;</span>
            ${state.prevPost ? `
              <a href="community.html?mode=view&id=${state.prevPost.id}" class="notice-nav__link" data-id="${state.prevPost.id}">
                ${state.prevPost.isSecret ? '🔒 ' : ''}${escapeHtml(state.prevPost.title)}
              </a>
            ` : '<span class="notice-nav__empty">이전글이 없습니다.</span>'}
          </div>
          <div class="notice-nav__row notice-nav__row--next">
            <span class="notice-nav__label">다음글 &or;</span>
            ${state.nextPost ? `
              <a href="community.html?mode=view&id=${state.nextPost.id}" class="notice-nav__link" data-id="${state.nextPost.id}">
                ${state.nextPost.isSecret ? '🔒 ' : ''}${escapeHtml(state.nextPost.title)}
              </a>
            ` : '<span class="notice-nav__empty">다음글이 없습니다.</span>'}
          </div>
        </nav>
      </article>
    `;

    // 이벤트 리스너 바인딩
    // 1. 목록 버튼
    const backBtn = document.getElementById('btn-back-to-list');
    if (backBtn) backBtn.addEventListener('click', () => navigateTo('list'));

    // 2. 수정/삭제 버튼
    const editBtn = document.getElementById('btn-edit-post');
    if (editBtn) editBtn.addEventListener('click', () => navigateTo('edit', post.id));

    const deleteBtn = document.getElementById('btn-delete-post');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
        try {
          await communityService.deletePost(post.id);
          alert('게시글이 삭제되었습니다.');
          navigateTo('list');
        } catch (e) {
          alert(`삭제 실패: ${e.message}`);
        }
      });
    }

    // 3. 이전글/다음글 링크
    containerEl.querySelectorAll('.notice-nav__link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('data-id');
        navigateTo('view', id);
      });
    });

    // 4. 이모티콘 3종 반응 이벤트
    if (!isLockedSecret) {
      containerEl.querySelectorAll('.reaction-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const type = btn.getAttribute('data-reaction');
          try {
            const newCount = await communityService.addReaction(post.id, type);
            const countEl = document.getElementById(`count-${type}`);
            if (countEl) countEl.textContent = newCount;
            btn.classList.add('is-reacted');
          } catch (e) {
            console.error('리액션 반영 실패:', e);
          }
        });
      });

      // 5. 관리자 답변 이벤트 연결
      setupAnswerEvents(post, isAdmin);
    }

  } catch (err) {
    console.error('[Community] 상세 조회 실패:', err);
    containerEl.innerHTML = `<p style="padding: 4rem; text-align: center; color: #e0245e;">글을 불러오지 못했습니다.<br>${err.message}</p>`;
  }
}

/**
 * 답변 섹션 HTML 생성 (질문글 바로 아래)
 */
function renderAnswerSection(post, isAdmin) {
  const answer = post.answer;

  if (answer && !state.isEditingAnswer) {
    // 답변이 이미 존재하는 경우
    return `
      <section class="community-answer-card" aria-label="관리자 공식 답변">
        <div class="community-answer-card__header">
          <div class="community-answer-card__admin">
            <span class="community-answer-card__badge">관리자 답변</span>
            <span class="community-answer-card__author">${escapeHtml(answer.author || '뚝스(관리자)')}</span>
            <span class="community-answer-card__date">${formatDate(answer.createdAt)}</span>
          </div>
          ${isAdmin ? `
            <div class="community-answer-card__actions">
              <button type="button" class="notice-btn notice-btn--default" id="btn-edit-answer" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">답변수정</button>
              <button type="button" class="notice-btn notice-btn--danger" id="btn-delete-answer" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">답변삭제</button>
            </div>
          ` : ''}
        </div>
        <div class="community-answer-card__body">
          ${answer.content || ''}
        </div>
      </section>
    `;
  }

  // 관리자에게만 노출되는 답변 작성 / 수정 폼
  if (isAdmin) {
    const existingContent = answer ? stripHtml(answer.content) : '';
    return `
      <section class="community-admin-form" aria-label="관리자 답변 작성 영역">
        <h3 class="community-admin-form__title">
          <span>👑 관리자 공식 답변 ${answer ? '수정' : '작성'}</span>
        </h3>
        <textarea id="admin-answer-text" class="community-admin-form__textarea" placeholder="고객님의 질문에 친절하고 상세한 답변을 작성해 주세요.">${escapeHtml(existingContent)}</textarea>
        <div class="community-admin-form__footer">
          ${state.isEditingAnswer ? `
            <button type="button" class="notice-btn notice-btn--secondary" id="btn-cancel-answer">취소</button>
          ` : ''}
          <button type="button" class="notice-btn notice-btn--primary" id="btn-save-answer">
            ${answer ? '답변 수정 완료' : '답변 등록'}
          </button>
        </div>
      </section>
    `;
  }

  // 관리자가 아니고 아직 미답변인 경우
  return `
    <div style="margin-top: 2rem; padding: 1.5rem; text-align: center; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; color: #64748b; font-size: 0.9rem;">
      관리자가 고객님의 문의를 확인하고 있습니다. 신속하게 답변해 드리겠습니다.
    </div>
  `;
}

/**
 * 답변 작성/수정/삭제 이벤트 리스너 설정
 */
function setupAnswerEvents(post, isAdmin) {
  if (!isAdmin) return;

  // 답변 수정 모드 전환
  const editAnswerBtn = document.getElementById('btn-edit-answer');
  if (editAnswerBtn) {
    editAnswerBtn.addEventListener('click', () => {
      state.isEditingAnswer = true;
      renderViewMode();
    });
  }

  // 답변 수정 취소
  const cancelAnswerBtn = document.getElementById('btn-cancel-answer');
  if (cancelAnswerBtn) {
    cancelAnswerBtn.addEventListener('click', () => {
      state.isEditingAnswer = false;
      renderViewMode();
    });
  }

  // 답변 삭제
  const deleteAnswerBtn = document.getElementById('btn-delete-answer');
  if (deleteAnswerBtn) {
    deleteAnswerBtn.addEventListener('click', async () => {
      if (!confirm('답변을 삭제하시겠습니까?\n답변 상태는 [답변대기]로 변경됩니다.')) return;
      try {
        await communityService.deleteAnswer(post.id);
        alert('답변이 삭제되었습니다.');
        state.isEditingAnswer = false;
        renderViewMode();
      } catch (err) {
        alert(`답변 삭제 실패: ${err.message}`);
      }
    });
  }

  // 답변 저장/수정 실행
  const saveAnswerBtn = document.getElementById('btn-save-answer');
  if (saveAnswerBtn) {
    saveAnswerBtn.addEventListener('click', async () => {
      const textarea = document.getElementById('admin-answer-text');
      const content = textarea ? textarea.value.trim() : '';
      if (!content) {
        alert('답변 내용을 입력해 주세요.');
        textarea && textarea.focus();
        return;
      }

      try {
        saveAnswerBtn.disabled = true;
        saveAnswerBtn.textContent = '저장 중...';

        const currentUser = authService.getCurrentUser();
        await communityService.saveAnswer(post.id, {
          content: `<p>${content.replace(/\n/g, '<br>')}</p>`,
          author: (currentUser && currentUser.name) ? `${currentUser.name}(관리자)` : '뚝스(관리자)',
          authorId: (currentUser && currentUser.id) || 'admin'
        });

        alert('답변이 성공적으로 등록되었습니다.');
        state.isEditingAnswer = false;
        renderViewMode();
      } catch (err) {
        alert(`답변 등록 실패: ${err.message}`);
        saveAnswerBtn.disabled = false;
        saveAnswerBtn.textContent = '답변 등록';
      }
    });
  }
}

// ==========================================================================
// 3. 글쓰기 & 글수정 화면 (Write / Edit Mode)
// ==========================================================================
async function renderFormMode(isEdit = false) {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    alert('로그인한 회원만 글을 작성하거나 수정할 수 있습니다.');
    window.location.href = 'login.html';
    return;
  }

  let post = null;
  if (isEdit) {
    post = await communityService.getPostById(state.currentId, { incrementView: false });
    if (!post) {
      alert('게시글을 찾을 수 없습니다.');
      navigateTo('list');
      return;
    }
    const isAdmin = authService.isAdmin();
    const isAuthor = currentUser.id === post.authorId || currentUser.username === post.authorId;
    if (!isAdmin && !isAuthor) {
      alert('본인이 작성한 글만 수정할 수 있습니다.');
      navigateTo('view', post.id);
      return;
    }
  }

  containerEl.innerHTML = `
    <header class="board-header board-header--detail">
      <div class="board-header__top">
        <h1 class="board-header__title">COMMUNITY</h1>
        <nav class="board-header__breadcrumb" aria-label="브레드크럼">
          <a href="index.html">HOME</a>
          <span>&gt;</span>
          <a href="community.html">COMMUNITY</a>
          <span>&gt;</span>
          <strong>${isEdit ? '글수정' : '질문작성'}</strong>
        </nav>
      </div>
    </header>

    <div class="notice-form-wrap">
      <form id="community-form" class="notice-form">
        <!-- 질문유형 선택 및 비밀글 설정 옵션 바 -->
        <div class="community-form-options">
          <div>
            <label for="comm-category-select" style="font-weight: 700; margin-right: 0.5rem; color: #1e293b;">
              질문 유형 <span style="color: #e0245e;">*</span>
            </label>
            <select id="comm-category-select" class="community-select" required>
              ${QUESTION_TYPES.map(cat => `
                <option value="${cat}" ${post && post.category === cat ? 'selected' : ''}>${cat}</option>
              `).join('')}
            </select>
          </div>

          <label class="community-secret-checkbox">
            <input type="checkbox" id="comm-secret-check" ${post && post.isSecret ? 'checked' : ''}>
            <span>🔒 비공개로 등록 (본인과 관리자만 열람 가능)</span>
          </label>
        </div>

        <div class="form-group">
          <label for="comm-title-input" class="form-label">
            제목 <span class="required">*</span>
          </label>
          <input type="text" id="comm-title-input" class="form-input" placeholder="제목을 입력하세요" required maxlength="100" value="${post ? escapeHtml(post.title) : ''}">
        </div>

        <div class="form-group">
          <label for="comm-author-input" class="form-label">작성자</label>
          <input type="text" id="comm-author-input" class="form-input" value="${currentUser.name || currentUser.username}" readonly style="background-color: #f8fafc; color: #64748b;">
        </div>

        <div class="form-group">
          <label for="comm-content-input" class="form-label">
            내용 <span class="required">*</span>
          </label>
          <textarea id="comm-content-input" class="form-textarea" placeholder="문의 및 나누고 싶은 이야기를 상세히 작성해 주세요." required style="min-height: 250px;">${post ? stripHtml(post.content) : ''}</textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="notice-btn notice-btn--secondary" id="btn-cancel-form">
            취소
          </button>
          <button type="submit" class="notice-btn notice-btn--primary" id="btn-submit-form">
            ${isEdit ? '수정 완료' : '등록'}
          </button>
        </div>
      </form>
    </div>
  `;

  // 취소 버튼
  document.getElementById('btn-cancel-form').addEventListener('click', () => {
    if (confirm('작성을 취소하시겠습니까? 작성 중인 내용은 저장되지 않습니다.')) {
      if (isEdit && post) {
        navigateTo('view', post.id);
      } else {
        navigateTo('list');
      }
    }
  });

  // 폼 제출
  const form = document.getElementById('community-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const category = document.getElementById('comm-category-select').value;
    const isSecret = document.getElementById('comm-secret-check').checked;
    const title = document.getElementById('comm-title-input').value.trim();
    const rawContent = document.getElementById('comm-content-input').value.trim();

    if (!title || !rawContent) {
      alert('제목과 내용을 모두 입력해 주세요.');
      return;
    }

    const formattedContent = `<p>${rawContent.replace(/\n/g, '<br>')}</p>`;
    const submitBtn = document.getElementById('btn-submit-form');

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = '처리 중...';

      if (isEdit && post) {
        await communityService.updatePost(post.id, {
          title,
          category,
          isSecret,
          content: formattedContent
        });
        alert('게시글이 성공적으로 수정되었습니다.');
        navigateTo('view', post.id);
      } else {
        const newPost = await communityService.createPost({
          title,
          category,
          isSecret,
          content: formattedContent,
          author: currentUser.name || currentUser.username,
          authorId: currentUser.id || currentUser.username
        });
        alert('게시글이 성공적으로 등록되었습니다.');
        navigateTo('view', newPost.id);
      }
    } catch (err) {
      console.error('글 저장 실패:', err);
      alert(`오류가 발생했습니다: ${err.message}`);
      submitBtn.disabled = false;
      submitBtn.textContent = isEdit ? '수정 완료' : '등록';
    }
  });
}

// ==========================================================================
// 라우팅 및 뷰 디스패처
// ==========================================================================
export function navigateTo(mode, id = null) {
  state.mode = mode;
  state.currentId = id;
  state.isEditingAnswer = false;
  updateUrl();
  renderCurrentMode();
}

function renderCurrentMode() {
  switch (state.mode) {
    case 'view':
      if (state.currentId) {
        renderViewMode();
      } else {
        navigateTo('list');
      }
      break;
    case 'write':
      renderFormMode(false);
      break;
    case 'edit':
      if (state.currentId) {
        renderFormMode(true);
      } else {
        navigateTo('list');
      }
      break;
    case 'list':
    default:
      renderListView();
      break;
  }
}

/**
 * 브라우저 뒤로가기 / 앞으로가기 지원
 */
window.addEventListener('popstate', () => {
  syncStateFromUrl();
  renderCurrentMode();
});

/**
 * HTML 특수문자 이스케이프
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * HTML 태그 제거
 */
function stripHtml(html) {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return (div.textContent || div.innerText || '').trim();
}

/**
 * 커뮤니티 게시판 초기화 함수
 */
export function initCommunityBoard(selector = '#community-app') {
  containerEl = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!containerEl) {
    console.error(`[Community] 컨테이너 엘리먼트를 찾을 수 없습니다: ${selector}`);
    return;
  }

  syncStateFromUrl();
  renderCurrentMode();
}

