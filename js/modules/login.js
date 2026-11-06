/**
 * @file login.js
 * @description 전용 로그인 페이지 인터랙션 모듈
 * - 아이디 및 비밀번호 검증 후 로그인 세션 생성 (authService.login)
 * - 관리자 계정(뚝스/admin/1111) 원클릭 자동 입력 지원
 * - 회원가입 완료 후 유입 시(registered=true) 안내 메시지 및 아이디 자동 세팅
 * - 로그인 성공 시 이전 페이지(Notice, Detail 등) 또는 메인 페이지로 복귀
 */

import { authService } from '../services/authService.js';
import { initAuthHeader } from '../components/authHeader.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. 전역 헤더 인증 상태 초기화
  initAuthHeader();

  const loginForm = document.getElementById('login-form');
  const loginStatusMsg = document.getElementById('login-status-msg');
  const loginIdInput = document.getElementById('login-id');
  const loginPasswordInput = document.getElementById('login-password');
  const quickFillAdminBtn = document.getElementById('quick-fill-admin-btn');

  // 2. URL 파라미터 처리 (방금 회원가입하고 넘어온 경우)
  const params = new URLSearchParams(window.location.search);
  const isRegistered = params.get('registered') === 'true';
  const registeredId = params.get('id');

  if (isRegistered && registeredId) {
    if (loginIdInput) loginIdInput.value = registeredId;
    if (loginStatusMsg) {
      loginStatusMsg.className = 'auth-status-message is-success';
      loginStatusMsg.textContent = '회원가입이 완료되었습니다! 비밀번호를 입력하고 로그인해 주세요.';
    }
    if (loginPasswordInput) loginPasswordInput.focus();
  }

  // 3. 이미 로그인 상태인지 확인
  const currentUser = authService.getCurrentUser();
  if (currentUser) {
    if (loginStatusMsg) {
      loginStatusMsg.className = 'auth-status-message is-success';
      loginStatusMsg.innerHTML = `현재 <strong>${currentUser.name}</strong> 계정으로 로그인되어 있습니다. <button type="button" id="current-logout-btn" style="text-decoration: underline; background: none; border: none; cursor: pointer; font-weight: bold; margin-left: 0.5rem; color: #059669;">로그아웃</button>`;
      document.getElementById('current-logout-btn')?.addEventListener('click', () => {
        authService.logout();
        window.location.reload();
      });
    }
  }

  // 4. 관리자 계정 원클릭 자동입력
  if (quickFillAdminBtn) {
    quickFillAdminBtn.addEventListener('click', () => {
      const adminInfo = authService.getDefaultAdmin();
      if (loginIdInput && loginPasswordInput) {
        loginIdInput.value = adminInfo.id;
        loginPasswordInput.value = adminInfo.password;
        if (loginStatusMsg) {
          loginStatusMsg.className = 'auth-status-message is-success';
          loginStatusMsg.textContent = '관리자 계정 정보가 입력되었습니다. [로그인] 버튼을 눌러주세요.';
        }
      }
    });
  }

  // 5. 로그인 폼 제출 처리
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = loginIdInput?.value.trim();
      const password = loginPasswordInput?.value.trim();
      const submitBtn = document.getElementById('login-submit-btn');

      if (!id) {
        showStatus(loginStatusMsg, '아이디를 입력해 주세요.', 'error');
        loginIdInput?.focus();
        return;
      }
      if (!password) {
        showStatus(loginStatusMsg, '비밀번호를 입력해 주세요.', 'error');
        loginPasswordInput?.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '로그인 중...';
      }

      try {
        const res = await authService.login(id, password);
        if (!res.success) {
          showStatus(loginStatusMsg, res.message, 'error');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '로그인';
          }
        } else {
          showStatus(loginStatusMsg, `${res.user.name}님 환영합니다! 페이지를 이동합니다...`, 'success');

          // 이전 페이지가 있거나 공지사항에서 왔다면 해당 위치로, 없으면 notice.html 또는 index.html로 이동
          const redirectUrl = params.get('redirect')
            || (document.referrer && !document.referrer.includes('login.html') && !document.referrer.includes('signup.html')
              ? document.referrer
              : 'notice.html');

          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 600);
        }
      } catch (err) {
        console.error('로그인 에러:', err);
        showStatus(loginStatusMsg, '로그인 처리 중 오류가 발생했습니다.', 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '로그인';
        }
      }
    });
  }

  // 도우미 함수: 상태 메시지 표출
  function showStatus(element, text, type) {
    if (!element) return;
    element.className = `auth-status-message is-${type}`;
    element.textContent = text;
  }
});
