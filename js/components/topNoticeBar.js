/**
 * @file topNoticeBar.js
 * @description 사이트 상단 고정 주요 공지 롤링 띠배너 컴포넌트
 * (요구사항: 상위 3개 게시글 한줄 출력, 순서대로 롤링, 멈춤, 플레이, 닫기 버튼 포함)
 */

import { noticeService } from '../services/noticeService.js';

const STORAGE_CLOSED_KEY = 'vlast_top_notice_closed';
const ROLL_INTERVAL = 3500; // 3.5초 간격 롤링

/**
 * HTML 특수문자 이스케이프
 * @param {string} str
 * @returns {string}
 */
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
 * 상단 공지 롤링 띠배너 초기화
 */
export async function initTopNoticeBar() {
  // index 페이지(메인 화면)에서만 노출하도록 제한 (notice, login 등 다른 페이지에서는 동작 안 함)
  const pathname = (window.location.pathname || '').toLowerCase();
  const isNoticeOrLogin = pathname.includes('notice') || pathname.includes('login');
  if (isNoticeOrLogin) {
    return;
  }

  // 사용자가 이번 세션에 이미 닫았는지 확인
  if (sessionStorage.getItem(STORAGE_CLOSED_KEY) === 'true') {
    return;
  }

  // 1. 공지사항 데이터 조회 (상위 3개 추출)
  let topNotices = [];
  try {
    const list = await noticeService.getAll();
    topNotices = list.slice(0, 3);
  } catch (error) {
    console.error('상단 공지 데이터 로드 실패:', error);
    return;
  }

  if (!topNotices || topNotices.length === 0) {
    return;
  }

  // 2. DOM 마운트 포인트 탐색 또는 동적 생성
  let barEl = document.getElementById('top-notice-bar');
  if (!barEl) {
    barEl = document.createElement('aside');
    barEl.id = 'top-notice-bar';
    barEl.className = 'top-notice-bar';
    barEl.setAttribute('role', 'region');
    barEl.setAttribute('aria-label', '주요 공지사항');

    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
      siteHeader.insertBefore(barEl, siteHeader.firstChild);
    } else {
      document.body.insertBefore(barEl, document.body.firstChild);
    }
  }

  // 3. 내부 템플릿 마크업 렌더링
  const itemsHtml = topNotices.map((item, idx) => `
    <li class="top-notice-bar__item" data-index="${idx}">
      <a class="top-notice-bar__link" href="notice.html?mode=view&id=${encodeURIComponent(item.id)}" title="${escapeHtml(item.title)}">
        ${escapeHtml(item.title)}
      </a>
    </li>
  `).join('');

  barEl.innerHTML = `
    <div class="inner-box top-notice-bar__inner">
      <div class="top-notice-bar__badge-wrap">
        <span class="top-notice-bar__badge">NOTICE</span>
      </div>

      <div class="top-notice-bar__ticker" id="top-notice-ticker">
        <ul class="top-notice-bar__list" id="top-notice-list">
          ${itemsHtml}
        </ul>
      </div>

      <div class="top-notice-bar__controls">
        <span class="top-notice-bar__counter" aria-label="공지 순환 순서">
          <strong class="top-notice-bar__curr" id="top-notice-current">1</strong><span class="top-notice-bar__sep">/</span><span class="top-notice-bar__total" id="top-notice-total">${topNotices.length}</span>
        </span>
        <button type="button" class="top-notice-bar__btn" id="top-notice-play-btn" aria-label="공지사항 롤링 플레이" title="플레이">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </button>
        <button type="button" class="top-notice-bar__btn is-active" id="top-notice-pause-btn" aria-label="공지사항 롤링 멈춤" title="멈춤">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        </button>
        <span class="top-notice-bar__divider" aria-hidden="true"></span>
        <button type="button" class="top-notice-bar__btn top-notice-bar__btn--close" id="top-notice-close-btn" aria-label="상단 공지 배너 닫기" title="닫기">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // 4. 롤링 동작 제어 상태
  let currentIndex = 0;
  let isPlaying = true;
  let timerId = null;

  const listEl = barEl.querySelector('#top-notice-list');
  const currentEl = barEl.querySelector('#top-notice-current');
  const tickerEl = barEl.querySelector('#top-notice-ticker');
  const playBtn = barEl.querySelector('#top-notice-play-btn');
  const pauseBtn = barEl.querySelector('#top-notice-pause-btn');
  const closeBtn = barEl.querySelector('#top-notice-close-btn');

  // 버튼 활성화 상태 동기화
  function updateButtons() {
    if (isPlaying) {
      pauseBtn.classList.add('is-active');
      playBtn.classList.remove('is-active');
    } else {
      pauseBtn.classList.remove('is-active');
      playBtn.classList.add('is-active');
    }
  }

  // 슬라이드 이동 (Y축 롤링 애니메이션)
  function goToSlide(index) {
    currentIndex = (index + topNotices.length) % topNotices.length;
    listEl.style.transform = `translateY(-${currentIndex * 2.375}rem)`;
    if (currentEl) {
      currentEl.textContent = String(currentIndex + 1);
    }
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  // 자동 롤링 시작
  function startRolling() {
    if (timerId) clearInterval(timerId);
    isPlaying = true;
    updateButtons();
    timerId = setInterval(nextSlide, ROLL_INTERVAL);
  }

  // 롤링 멈춤
  function stopRolling() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    isPlaying = false;
    updateButtons();
  }

  // 5. 이벤트 리스너 바인딩
  // 멈춤 버튼
  pauseBtn.addEventListener('click', () => {
    stopRolling();
  });

  // 플레이 버튼
  playBtn.addEventListener('click', () => {
    startRolling();
  });

  // 닫기 버튼
  closeBtn.addEventListener('click', () => {
    stopRolling();
    barEl.classList.add('is-closed');
    try {
      sessionStorage.setItem(STORAGE_CLOSED_KEY, 'true');
    } catch (e) {
      // 스토리지 제한 시 무시
    }
    setTimeout(() => {
      barEl.style.display = 'none';
    }, 380);
  });

  // 마우스 호버 시 일시 정지 및 마우스 아웃 시 재개
  tickerEl.addEventListener('mouseenter', () => {
    if (isPlaying && timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  });

  tickerEl.addEventListener('mouseleave', () => {
    if (isPlaying && !timerId) {
      timerId = setInterval(nextSlide, ROLL_INTERVAL);
    }
  });

  // 키보드 포커스 시 일시정지 (접근성)
  tickerEl.addEventListener('focusin', () => {
    if (isPlaying && timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  });

  tickerEl.addEventListener('focusout', () => {
    if (isPlaying && !timerId) {
      timerId = setInterval(nextSlide, ROLL_INTERVAL);
    }
  });

  // 초기 자동 롤링 시작
  startRolling();
}

