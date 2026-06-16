(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector("[data-mobile-menu-open]");
    const closeButton = document.querySelector("[data-mobile-menu-close]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");

    if (!menuButton || !closeButton || !mobileMenu) {
      return;
    }

    const mobileMenuLinks = mobileMenu.querySelectorAll("a");

    const setMenuState = (isOpen) => {
      mobileMenu.classList.toggle("mobile-menu--open", isOpen);
      document.body.classList.toggle("page--scroll-locked", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
      mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    };

    menuButton.addEventListener("click", () => {
      setMenuState(!mobileMenu.classList.contains("mobile-menu--open"));
    });

    closeButton.addEventListener("click", () => setMenuState(false));
    mobileMenuLinks.forEach((link) => link.addEventListener("click", () => setMenuState(false)));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileMenu.classList.contains("mobile-menu--open")) {
        setMenuState(false);
      }
    });
  });
})();
