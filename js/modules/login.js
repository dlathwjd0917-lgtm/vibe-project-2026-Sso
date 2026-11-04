document.querySelectorAll("[data-login-form], [data-guest-order-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-login-status]");
    status.textContent = form.matches("[data-guest-order-form]")
      ? "주문조회 서비스가 아직 연결되지 않았습니다."
      : "로그인 서비스가 아직 연결되지 않았습니다.";
  });
});

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-login-action]");
  if (!action) {
    return;
  }

  const status = action.closest("[data-login-feedback]")?.querySelector("[data-login-status]")
    ?? document.querySelector("[data-login-status]");
  if (status) {
    status.textContent = `${action.dataset.loginAction} 서비스가 아직 연결되지 않았습니다.`;
  }
});