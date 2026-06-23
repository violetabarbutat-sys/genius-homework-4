(() => {
  if (window.__beautyZoneAppInitialized) {
    return;
  }

  window.__beautyZoneAppInitialized = true;

  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector("[data-modal]");
    const modalBtnOpen = document.querySelector("[data-modal-open]");
    const modalBtnClose = document.querySelector("[data-modal-close]");

    if (modal && modalBtnOpen && modalBtnClose) {
      const setModalState = (isOpen) => {
        modal.classList.toggle("backdrop--hidden", !isOpen);
        modal.setAttribute("aria-hidden", String(!isOpen));
        modalBtnOpen.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("page--scroll-locked", isOpen);
      };

      modalBtnOpen.addEventListener("click", () => setModalState(true));
      modalBtnClose.addEventListener("click", () => setModalState(false));

      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          setModalState(false);
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.classList.contains("backdrop--hidden")) {
          setModalState(false);
        }
      });
    }

    const serviceDots = document.querySelectorAll(".services__dot");
    const cards = document.querySelectorAll(".services-card");
    const prevButton = document.querySelector(".services__button--prev");
    const nextButton = document.querySelector(".services__button--next");
    const servicesSlider = document.querySelector(".services__slider");

    if (serviceDots.length && cards.length && prevButton && nextButton && servicesSlider) {
      let currentCardIndex = 0;
      let selectedProcedureIndex = 0;
      let desktopCardOffset = 0;
      const serviceSlides = document.querySelectorAll(".services__slider .swiper-slide");
      const desktopMediaQuery = window.matchMedia("(min-width: 1280px)");

      [prevButton, nextButton].forEach((button) => {
        button.disabled = false;
        button.classList.remove("swiper-button-disabled", "swiper-button-lock");
      });

      const swiper = window.Swiper
        ? new Swiper(".services__slider", {
            loop: false,
            watchOverflow: false,
            slidesPerView: 1,
            spaceBetween: 32,
            grabCursor: true,
            keyboard: {
              enabled: true,
            },
            breakpoints: {
              768: {
                slidesPerView: 2,
                spaceBetween: 32,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            },
          })
        : null;

      const updateProcedures = () => {
        serviceDots.forEach((serviceDot, index) => {
          serviceDot.classList.toggle("services__dot--active", index === selectedProcedureIndex);
        });

        cards.forEach((card, index) => {
          card.classList.toggle("services-card--current", index === currentCardIndex);
          if (index !== currentCardIndex) {
            card.classList.remove("services-card--active", "services-card--flipping");
          }

          card.querySelectorAll(".services-card__item").forEach((procedure, procedureIndex) => {
            procedure.classList.toggle(
              "services-card__item--active",
              procedureIndex === selectedProcedureIndex
            );
          });
        });
      };

      const resetCardsFlip = () => {
        cards.forEach((card) => {
          card.classList.remove("services-card--active", "services-card--flipping");
        });
      };

      const blinkCurrentCard = () => {
        const currentCard = cards[currentCardIndex];

        currentCard.classList.remove("services-card--blinking");
        currentCard.querySelector(".services-card__inner").offsetWidth;
        currentCard.classList.add("services-card--blinking");

        window.setTimeout(() => {
          currentCard.classList.remove("services-card--blinking");
        }, 2200);
      };

      const blinkCardByDirection = (direction) => {
        const nextCardIndex = Math.min(
          Math.max(currentCardIndex + direction, 0),
          cards.length - 1
        );

        if (nextCardIndex === currentCardIndex) {
          blinkCurrentCard();
          return;
        }

        currentCardIndex = nextCardIndex;
        resetCardsFlip();
        updateProcedures();
        blinkCurrentCard();
      };

      const updateDesktopCardsOrder = () => {
        serviceSlides.forEach((slide, index) => {
          slide.style.order = String((index - desktopCardOffset + serviceSlides.length) % serviceSlides.length);
        });
      };

      const rotateDesktopCards = (direction) => {
        const animationClass =
          direction > 0 ? "services__slider--shift-next" : "services__slider--shift-prev";

        desktopCardOffset =
          (desktopCardOffset + direction + serviceSlides.length) % serviceSlides.length;
        currentCardIndex = desktopCardOffset;
        resetCardsFlip();
        updateProcedures();
        updateDesktopCardsOrder();

        servicesSlider.classList.remove("services__slider--shift-next", "services__slider--shift-prev");
        servicesSlider.offsetWidth;
        servicesSlider.classList.add(animationClass);
        blinkCurrentCard();

        window.setTimeout(() => {
          servicesSlider.classList.remove(animationClass);
        }, 450);
      };

      const replayCurrentCardFlip = () => {
        const currentCard = cards[currentCardIndex];

        resetCardsFlip();
        updateProcedures();
        currentCard.querySelector(".services-card__inner").offsetWidth;

        requestAnimationFrame(() => {
          currentCard.classList.add("services-card--active", "services-card--flipping");
        });
      };

      serviceDots.forEach((serviceDot, index) => {
        serviceDot.addEventListener("click", () => {
          selectedProcedureIndex = index;
          replayCurrentCardFlip();
        });
      });

      if (swiper) {
        swiper.on("slideChange", () => {
          currentCardIndex = swiper.activeIndex;
          resetCardsFlip();
          updateProcedures();
          blinkCurrentCard();
        });

        prevButton.addEventListener("click", () => {
          if (desktopMediaQuery.matches) {
            rotateDesktopCards(-1);
            return;
          }

          swiper.slidePrev();
        });

        nextButton.addEventListener("click", () => {
          if (desktopMediaQuery.matches) {
            rotateDesktopCards(1);
            return;
          }

          swiper.slideNext();
        });
      } else {
        prevButton.addEventListener("click", () => {
          currentCardIndex = Math.max(currentCardIndex - 1, 0);
          resetCardsFlip();
          updateProcedures();
          blinkCurrentCard();
        });

        nextButton.addEventListener("click", () => {
          currentCardIndex = Math.min(currentCardIndex + 1, cards.length - 1);
          resetCardsFlip();
          updateProcedures();
          blinkCurrentCard();
        });
      }

      updateDesktopCardsOrder();
      updateProcedures();
    }

    const fullNamePattern = /^[\p{L}'’`-]+\s+[\p{L}'’`-]+$/u;
    const phonePattern = /^\+380\d{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateForm = (form) => {
      const fullName = form.querySelector('input[type="text"]');
      const phone = form.querySelector('input[type="tel"]');
      const email = form.querySelector('input[type="email"]');

      if (!fullName || !phone || !email) {
        return true;
      }

      fullName.setCustomValidity("");
      phone.setCustomValidity("");
      email.setCustomValidity("");

      if (!fullNamePattern.test(fullName.value.trim())) {
        fullName.setCustomValidity("Enter first and last name as two words.");
      }

      if (!phonePattern.test(phone.value.trim())) {
        phone.setCustomValidity("Enter phone number in the format +380XXXXXXXXX.");
      }

      if (!emailPattern.test(email.value.trim())) {
        email.setCustomValidity("Enter a valid email address containing @.");
      }

      return form.checkValidity();
    };

    document.querySelectorAll(".form").forEach((form) => {
      form.addEventListener("input", () => {
        validateForm(form);
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateForm(event.currentTarget) || !event.currentTarget.reportValidity()) {
          return;
        }

        event.currentTarget.reset();
      });
    });
  });
})();
