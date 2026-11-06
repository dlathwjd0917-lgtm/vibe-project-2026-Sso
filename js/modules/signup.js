/**
 * @file signup.js
 * @description 전용 회원가입 페이지 인터랙션 모듈
 * - 이름, 아이디, 비밀번호, 비밀번호 확인, 이메일 유효성 검사
 * - 아이디 중복 확인 기능 (authService.checkIdDuplicate)
 * - 회원가입 성공 시 완료 안내 후 로그인 페이지(login.html)로 자동 이동
 */

import { authService } from '../services/authService.js';
import { initAuthHeader } from '../components/authHeader.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. 헤더 인증 상태 초기화
  initAuthHeader();

  const signupForm = document.getElementById('signup-form');
  const signupStatusMsg = document.getElementById('signup-status-msg');
  const checkIdBtn = document.getElementById('check-id-btn');
  const signupIdInput = document.getElementById('signup-id');
  const signupIdNote = document.getElementById('signup-id-note');
  const signupPwInput = document.getElementById('signup-password');
  const signupPwConfirmInput = document.getElementById('signup-password-confirm');
  const signupPwNote = document.getElementById('signup-pw-note');

  let isIdChecked = false;
  let checkedIdValue = '';

  // 2. 이미 로그인되어 있는 상태라면 안내문 표시
  const currentUser = authService.getCurrentUser();
  if (currentUser) {
    if (signupStatusMsg) {
      signupStatusMsg.className = 'auth-status-message is-success';
      signupStatusMsg.innerHTML = `현재 <strong>${currentUser.name}</strong> 계정으로 로그인되어 있습니다. <a href="index.html" style="text-decoration: underline; font-weight: bold; margin-left: 0.5rem; color: #059669;">쇼핑몰 홈으로 가기</a>`;
    }
  }

  // 3. 아이디 입력 변경 시 중복확인 상태 리셋
  if (signupIdInput) {
    signupIdInput.addEventListener('input', () => {
      if (signupIdInput.value.trim() !== checkedIdValue) {
        isIdChecked = false;
        if (signupIdNote) {
          signupIdNote.className = 'auth-field-note';
          signupIdNote.textContent = '아이디 변경 시 다시 중복확인을 진행해 주세요.';
        }
      }
    });
  }

  // 4. 아이디 중복확인 버튼 클릭
  if (checkIdBtn && signupIdInput) {
    checkIdBtn.addEventListener('click', async () => {
      const val = signupIdInput.value.trim();
      if (!val) {
        showNote(signupIdNote, '아이디를 입력해 주세요.', 'invalid');
        signupIdInput.focus();
        return;
      }
      if (val.length < 3) {
        showNote(signupIdNote, '아이디는 3자 이상이어야 합니다.', 'invalid');
        signupIdInput.focus();
        return;
      }

      checkIdBtn.disabled = true;
      checkIdBtn.textContent = '확인 중...';

      try {
        const isDuplicate = await authService.checkIdDuplicate(val);
        if (isDuplicate) {
          isIdChecked = false;
          showNote(signupIdNote, '이미 사용 중인 아이디입니다. 다른 아이디를 입력해 주세요.', 'invalid');
        } else {
          isIdChecked = true;
          checkedIdValue = val;
          showNote(signupIdNote, '사용 가능한 아이디입니다!', 'valid');
        }
      } catch (err) {
        console.error('중복 확인 오류:', err);
        showNote(signupIdNote, '중복 확인 중 오류가 발생했습니다.', 'invalid');
      } finally {
        checkIdBtn.disabled = false;
        checkIdBtn.textContent = '중복확인';
      }
    });
  }

  // 5. 비밀번호 확인 실시간 일치 검사
  function checkPasswordMatch() {
    if (!signupPwNote || !signupPwInput || !signupPwConfirmInput) return;
    const pw = signupPwInput.value;
    const confirm = signupPwConfirmInput.value;

    if (!confirm) {
      signupPwNote.textContent = '';
      signupPwNote.className = 'auth-field-note';
      return;
    }

    if (pw !== confirm) {
      showNote(signupPwNote, '비밀번호가 일치하지 않습니다.', 'invalid');
    } else {
      showNote(signupPwNote, '비밀번호가 일치합니다.', 'valid');
    }
  }

  signupPwInput?.addEventListener('input', checkPasswordMatch);
  signupPwConfirmInput?.addEventListener('input', checkPasswordMatch);

  // 6. 회원가입 폼 제출 처리
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name')?.value.trim();
      const id = signupIdInput?.value.trim();
      const password = signupPwInput?.value.trim();
      const passwordConfirm = signupPwConfirmInput?.value.trim();
      const email = document.getElementById('signup-email')?.value.trim();
      const submitBtn = document.getElementById('signup-submit-btn');

      // 유효성 검사
      if (!name) {
        showStatus(signupStatusMsg, '이름을 입력해 주세요.', 'error');
        document.getElementById('signup-name')?.focus();
        return;
      }
      if (!id) {
        showStatus(signupStatusMsg, '아이디를 입력해 주세요.', 'error');
        signupIdInput?.focus();
        return;
      }
      if (id.length < 3) {
        showStatus(signupStatusMsg, '아이디는 3자 이상이어야 합니다.', 'error');
        signupIdInput?.focus();
        return;
      }
      if (!isIdChecked || checkedIdValue !== id) {
        showStatus(signupStatusMsg, '아이디 중복확인을 완료해 주세요.', 'error');
        signupIdInput?.focus();
        return;
      }
      if (!password) {
        showStatus(signupStatusMsg, '비밀번호를 입력해 주세요.', 'error');
        signupPwInput?.focus();
        return;
      }
      if (password.length < 4) {
        showStatus(signupStatusMsg, '비밀번호는 4자 이상이어야 합니다.', 'error');
        signupPwInput?.focus();
        return;
      }
      if (password !== passwordConfirm) {
        showStatus(signupStatusMsg, '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.', 'error');
        signupPwConfirmInput?.focus();
        return;
      }
      if (!email) {
        showStatus(signupStatusMsg, '이메일을 입력해 주세요.', 'error');
        document.getElementById('signup-email')?.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '가입 처리 중...';
      }

      try {
        // 등록 실행 (Firebase Firestore 및 LocalStorage에 동시 저장)
        const res = await authService.register({ name, id, password, email });
        if (!res.success) {
          showStatus(signupStatusMsg, res.message, 'error');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '회원가입 완료';
          }
        } else {
          showStatus(
            signupStatusMsg,
            `${res.message} 잠시 후 로그인 페이지로 이동합니다...`,
            'success'
          );

          // 1초 후 로그인 페이지로 이동 (가입한 아이디 쿼리스트링 전달)
          setTimeout(() => {
            window.location.href = `login.html?registered=true&id=${encodeURIComponent(id)}`;
          }, 900);
        }
      } catch (err) {
        console.error('회원가입 처리 실패:', err);
        showStatus(signupStatusMsg, '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.', 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '회원가입 완료';
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

  // 도우미 함수: 인풋 하단 가이드 노트 표출
  function showNote(element, text, type) {
    if (!element) return;
    element.className = `auth-field-note is-${type}`;
    element.textContent = text;
  }
});

