const cardsData = [
  {
    logo: "/tech-icons/html-logo.svg",
    title: "HTML",
    description: `
      <p>Уверенно создаю структуру сайтов с помощью HTML5.</p>
      <p>Хорошо разбираюсь в семантике, понимаю, как правильно организовать контент и сделать страницу удобной и доступной.</p>
    `,
  },
  {
    logo: "/tech-icons/sass-logo.svg",
    title: "SASS",
    description: `
      <p>Использую SCSS, чтобы писать удобные и понятные стили.</p>
      <p>Работаю с переменными, миксинами, вложенностью, функциями и разделением стилей на отдельные модули.</p>
    `,
  },
  {
    logo: "/tech-icons/react-logo.svg",
    title: "React",
    description: `
      <p>❌ Еще не знаю, но планирую изучить.</p>
    `,
  },
  {
    logo: "/tech-icons/js-logo.svg",
    title: "JavaScript",
    description: `
      <p>Уверенно использую JavaScript для создания интерактивности на сайтах.</p>
      <p>Работаю с DOM, событиями, API, асинхронным кодом, массивами и объектами.</p>
    `,
  },
  {
    logo: "/tech-icons/ts-logo.svg",
    title: "TypeScript",
    description: `
      <p>❌ Еще не знаю, но планирую изучить.</p>
    `,
  },
  {
    logo: "/tech-icons/vite-logo.svg",
    title: "Vite",
    description: `
      <p>Знаком с основами Vite и использую его для разработки фронтенд-проектов.</p>
      <p>Умею запускать проект, подключать зависимости и собирать готовую версию для публикации.</p>
    `,
  },
  {
    logo: "/tech-icons/git-logo.svg",
    title: "Git",
    description: `
      <p>Знаю основные команды Git и использую его для работы над проектами.</p>
      <p>Умею работать с репозиториями, коммитами, ветками и загружать проекты на GitHub.</p>
    `,
  },
  {
    logo: "/tech-icons/tailwind-logo.svg",
    title: "Tailwind",
    description: `
      <p>❌ Еще не знаю, но планирую изучить.</p>
    `,
  },
];

const CLONES_COUNT = 3;
const ORIGINAL_START = CLONES_COUNT;

export default function initSkillsSlider() {
  const slider = document.querySelector(".skills__slider");

  if (!slider) {
    return;
  }

  const viewport = slider.querySelector(".skills__viewport");
  const track = slider.querySelector("[data-skills-track]");
  const prevButton = slider.querySelector("[data-skills-prev]");
  const nextButton = slider.querySelector("[data-skills-next]");

  if (!viewport || !track) {
    return;
  }

  function createCard(data, originalIndex) {
    const card = document.createElement("article");

    card.className = "skills__card";
    card.dataset.originalIndex = originalIndex;

    card.innerHTML = `
      <div class="skills__card-logo">
        <img
          src="${data.logo}"
          alt="${data.title}"
          draggable="false"
        />

        <h3 class="skills__card-title">
          ${data.title}
        </h3>
      </div>

      <div class="skills__card-description">
        ${data.description}
      </div>
    `;

    return card;
  }

  function buildTrack() {
    const fragment = document.createDocumentFragment();

    for (
      let i = cardsData.length - CLONES_COUNT;
      i < cardsData.length;
      i++
    ) {
      const card = createCard(cardsData[i], i);

      card.dataset.clone = "left";

      fragment.appendChild(card);
    }

    cardsData.forEach((data, index) => {
      const card = createCard(data, index);

      card.dataset.clone = "original";

      fragment.appendChild(card);
    });

    for (let i = 0; i < CLONES_COUNT; i++) {
      const card = createCard(cardsData[i], i);

      card.dataset.clone = "right";

      fragment.appendChild(card);
    }

    track.appendChild(fragment);
  }

  buildTrack();

  const cards = Array.from(
    track.querySelectorAll(".skills__card")
  );

  let physicalIndex = ORIGINAL_START;
  let isAnimating = false;

  function getStep() {
    if (cards.length < 2) {
      return 0;
    }

    const first = cards[0].getBoundingClientRect();
    const second = cards[1].getBoundingClientRect();

    return second.left - first.left;
  }

  function getTranslateX(index) {
    const card = cards[index];

    const viewportWidth = viewport.clientWidth;
    const cardWidth = card.getBoundingClientRect().width;
    const step = getStep();

    return (
      viewportWidth / 2 -
      cardWidth / 2 -
      index * step
    );
  }

  function updateCardStates() {
    cards.forEach((card, index) => {
      const distance = Math.abs(index - physicalIndex);

      card.classList.toggle(
        "is-active",
        distance === 0
      );
    });
  }

  function moveTrack(animate = true) {
    if (!animate) {
      track.classList.add("no-transition");
    }

    const x = getTranslateX(physicalIndex);

    track.style.transform = `translate3d(${x}px, 0, 0)`;

    updateCardStates();

    if (!animate) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.classList.remove("no-transition");
        });
      });
    }
  }

  function next() {
    if (isAnimating) {
      return;
    }

    isAnimating = true;

    physicalIndex++;

    moveTrack(true);
  }

  function previous() {
    if (isAnimating) {
      return;
    }

    isAnimating = true;

    physicalIndex--;

    moveTrack(true);
  }

  track.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "transform") {
      return;
    }

    if (
      physicalIndex >=
      ORIGINAL_START + cardsData.length
    ) {
      physicalIndex -= cardsData.length;

      moveTrack(false);
    } else if (physicalIndex < ORIGINAL_START) {
      physicalIndex += cardsData.length;

      moveTrack(false);
    }

    isAnimating = false;
  });

  if (nextButton) {
    nextButton.addEventListener("click", next);
  }

  if (prevButton) {
    prevButton.addEventListener("click", previous);
  }

  document.addEventListener("keydown", (event) => {
    const tag = event.target.tagName;

    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT"
    ) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();

      next();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      previous();
    }
  });

  let isDragging = false;
  let dragStartX = 0;
  let dragStartTranslate = 0;
  let currentDragX = 0;
  let dragMoved = false;

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") {
      return;
    }

    if (isAnimating) {
      return;
    }

    isDragging = true;
    dragMoved = false;

    dragStartX = event.clientX;
    currentDragX = event.clientX;

    dragStartTranslate =
      getTranslateX(physicalIndex);

    viewport.classList.add("is-dragging");
    track.classList.add("no-transition");

    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }

    currentDragX = event.clientX;

    const deltaX =
      currentDragX - dragStartX;

    if (Math.abs(deltaX) > 3) {
      dragMoved = true;
    }

    const x =
      dragStartTranslate + deltaX;

    track.style.transform =
      `translate3d(${x}px, 0, 0)`;
  });

  viewport.addEventListener(
    "pointerup",
    finishDrag
  );

  viewport.addEventListener(
    "pointercancel",
    finishDrag
  );

  function finishDrag() {
    if (!isDragging) {
      return;
    }

    isDragging = false;

    viewport.classList.remove("is-dragging");

    if (!dragMoved) {
      track.classList.remove("no-transition");

      moveTrack(true);

      return;
    }

    const deltaX =
      currentDragX - dragStartX;

    const step = getStep();

    if (!step) {
      track.classList.remove("no-transition");

      moveTrack(false);

      return;
    }

    const movedCards = Math.round(
      Math.abs(deltaX) / step
    );

    const count = Math.max(
      1,
      movedCards
    );

    if (deltaX < 0) {
      physicalIndex += count;
    } else {
      physicalIndex -= count;
    }

    track.classList.remove("no-transition");

    isAnimating = true;

    moveTrack(true);
  }

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      track.classList.add("no-transition");

      moveTrack(false);

      requestAnimationFrame(() => {
        track.classList.remove("no-transition");
      });
    }, 100);
  });

  requestAnimationFrame(() => {
    moveTrack(false);
  });
}