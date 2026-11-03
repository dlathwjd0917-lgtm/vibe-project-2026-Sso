export function initCarousel(root = document) {
  const carousel = root.querySelector('[data-js="carousel"]');

  if (!carousel) {
    return;
  }

  const controls = root.querySelector('[data-js="carousel-controls"]');
  const slides = [...carousel.querySelectorAll("[data-slide]")];
  const dots = controls ? [...controls.querySelectorAll("[data-carousel-dot]")] : [];
  const previousButton = carousel.querySelector("[data-carousel-previous]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const toggleButton = controls?.querySelector("[data-carousel-toggle]");

  if (
    !controls ||
    slides.length === 0 ||
    dots.length !== slides.length ||
    !previousButton ||
    !nextButton ||
    !toggleButton
  ) {
    throw new Error("Carousel markup is incomplete.");
  }

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const autoplayInterval = Number.parseInt(
    window.getComputedStyle(carousel).getPropertyValue("--slider-pause"),
    10
  );

  if (!Number.isFinite(autoplayInterval) || autoplayInterval <= 0) {
    throw new Error("Carousel autoplay interval must be a positive number.");
  }

  let activeIndex = 0;
  let isPaused = motionPreference.matches;
  let intervalId;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      dots[slideIndex].classList.toggle("is-active", isActive);

      if (isActive) {
        dots[slideIndex].setAttribute("aria-current", "true");
      } else {
        dots[slideIndex].removeAttribute("aria-current");
      }
    });
  }

  function stopAutoplay() {
    window.clearInterval(intervalId);
    intervalId = undefined;
  }

  function startAutoplay() {
    stopAutoplay();

    if (!isPaused) {
      intervalId = window.setInterval(() => {
        showSlide(activeIndex + 1);
      }, autoplayInterval);
    }
  }

  function updateToggle() {
    const label = isPaused ? "자동 재생 시작" : "자동 재생 정지";
    toggleButton.setAttribute("aria-label", label);
    toggleButton.textContent = isPaused ? "재생" : "정지";
  }

  previousButton.addEventListener("click", () => {
    showSlide(activeIndex - 1);
  });
  nextButton.addEventListener("click", () => {
    showSlide(activeIndex + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  toggleButton.addEventListener("click", () => {
    isPaused = !isPaused;
    updateToggle();
    startAutoplay();
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });
  controls.addEventListener("mouseenter", stopAutoplay);
  controls.addEventListener("mouseleave", startAutoplay);
  controls.addEventListener("focusin", stopAutoplay);
  controls.addEventListener("focusout", (event) => {
    if (!controls.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  motionPreference.addEventListener("change", (event) => {
    if (event.matches) {
      isPaused = true;
      updateToggle();
    }

    startAutoplay();
  });

  updateToggle();
  showSlide(0);
  startAutoplay();
}
