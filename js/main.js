const contactConfig = [
  {
    label: "Endereço demonstrativo",
    value: "Rua Exemplo Pet, 000 - Bairro Demonstrativo",
  },
  {
    label: "Horário demonstrativo",
    value: "Segunda a sábado, das 9h às 18h",
  },
  {
    label: "Telefone e WhatsApp",
    value: "Campo preparado para número autorizado",
  },
  {
    label: "Instagram",
    value: "Campo preparado para perfil oficial",
  },
];

const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const menuLinks = menu ? menu.querySelectorAll("a") : [];

function syncMenuAccessibility(isOpen) {
  if (!menu) return;

  const isDesktop = window.innerWidth > 980;
  menu.setAttribute("aria-hidden", String(!isDesktop && !isOpen));
  menuLinks.forEach((link) => {
    if (isDesktop || isOpen) {
      link.removeAttribute("tabindex");
    } else {
      link.setAttribute("tabindex", "-1");
    }
  });
}

function setMenuState(isOpen) {
  if (!menuToggle || !menu) return;

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
  );
  menu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  syncMenuAccessibility(isOpen);
}

if (menuToggle && menu) {
  syncMenuAccessibility(false);

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
}

const contactList = document.querySelector("#contact-data");

if (contactList) {
  contactList.innerHTML = contactConfig
    .map(
      (item) => `
        <div>
          <dt>${item.label}</dt>
          <dd>${item.value}</dd>
        </div>
      `
    )
    .join("");
}

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 6, 4) * 70}ms`;
    observer.observe(element);
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    setMenuState(false);
  } else {
    syncMenuAccessibility(menuToggle?.getAttribute("aria-expanded") === "true");
  }
});
