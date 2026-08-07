document.addEventListener("DOMContentLoaded", () => {
  // --- Hero parallax: each grid image at its own reduced speed for premium feel ---
  const heroSection = document.querySelector('.hero-section');
  const heroImgs = document.querySelectorAll('.hero-img');
  // Slower, smoother rates give a more cinematic, editorial feel
  const heroRates = [0.10, 0.05, 0.08, 0.07];
  if (heroSection && heroImgs.length) {
    let rafPending = false;
    const updateHeroParallax = () => {
      const scrolled = window.scrollY;
      if (scrolled <= heroSection.offsetHeight * 1.5) {
        heroImgs.forEach((img, i) => {
          img.style.transform = `translateY(${scrolled * (heroRates[i] ?? 0.08)}px)`;
        });
      }
      rafPending = false;
    };
    window.addEventListener('scroll', () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateHeroParallax);
      }
    }, { passive: true });
  }

  // --- Bio parallax: each .bio-parallax-section moves at ~20% of scroll speed with subtle scale-in ---
  document.querySelectorAll('.bio-parallax-section').forEach((section) => {
    const img = section.querySelector('.parallax-image');
    if (!img) return;
    let bioRafPending = false;
    const updateBioParallax = () => {
      const sectionTop = section.offsetTop;
      const sectionH = section.offsetHeight;
      const offset = (window.scrollY - sectionTop) * 0.20;
      // Scale from 1.05 to 1.0 as user scrolls through the section
      const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop + window.innerHeight) / (sectionH + window.innerHeight)));
      const scale = 1.05 - 0.05 * progress;
      img.style.transform = `translateY(${offset}px) scale(${scale})`;
      bioRafPending = false;
    };
    updateBioParallax();
    window.addEventListener('scroll', () => {
      if (!bioRafPending) {
        bioRafPending = true;
        requestAnimationFrame(updateBioParallax);
      }
    }, { passive: true });
  });

  // --- Feature section parallax (full-height sections) ---
  document.querySelectorAll('.feature-section').forEach((section) => {
    const img = section.querySelector('.feature-img');
    if (!img) return;
    const sectionTop = section.offsetTop;
    let rafPending = false;
    const update = () => {
      const offset = (window.scrollY - sectionTop) * 0.12;
      img.style.transform = `translateY(${offset}px)`;
      rafPending = false;
    };
    update();
    window.addEventListener('scroll', () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
  });

  // --- Site header: add .scrolled class after user scrolls past hero ---
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    const onHeaderScroll = () => {
      if (window.scrollY > 60) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll();
  }

  // --- Scroll-reveal: fade-in elements with .reveal class ---
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // --- Create lightbox ---
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <button class="lightbox-nav left">&#8592;</button>
    <button class="lightbox-nav right">&#8594;</button>
  `;
  document.body.appendChild(lightbox);

  let lightboxMedia = null;
  let currentGroup = [];
  let currentIndex = 0;

  // Show media inside lightbox
  function showMedia(index) {
    if (!currentGroup.length) return;
    currentIndex = (index + currentGroup.length) % currentGroup.length;

    if (lightboxMedia) lightboxMedia.remove();

    const current = currentGroup[currentIndex];
    lightboxMedia =
      current.tagName.toLowerCase() === "img"
        ? Object.assign(document.createElement("img"), { src: current.src })
        : Object.assign(document.createElement("video"), {
            src: current.dataset.src || current.src,
            autoplay: true,
            controls: true,
            loop: true,
            muted: false,
            style: "max-height:90vh",
          });

    lightbox.insertBefore(lightboxMedia, lightbox.querySelector(".lightbox-close"));
  }

  // Lightbox navigation
  lightbox.addEventListener("click", (e) => {
    if (e.target.classList.contains("lightbox-close")) {
      lightbox.style.display = "none";
      if (lightboxMedia?.tagName.toLowerCase() === "video") lightboxMedia.pause();
    } else if (e.target.classList.contains("lightbox-nav")) {
      showMedia(currentIndex + (e.target.classList.contains("left") ? -1 : 1));
    } else if (e.target === lightbox) {
      lightbox.style.display = "none";
      if (lightboxMedia?.tagName.toLowerCase() === "video") lightboxMedia.pause();
    }
  });

  // Event delegation for opening lightbox
  const portfolioEl = document.querySelector(".portfolio");
  if (portfolioEl) {
    portfolioEl.addEventListener("click", (e) => {
      if (e.target.matches(".image-row img, .image-row video")) {
        const row = e.target.closest(".image-row");
        currentGroup = [...row.querySelectorAll("img, video")];
        currentIndex = currentGroup.indexOf(e.target);
        showMedia(currentIndex);
        lightbox.style.display = "flex";
      }
    });
  }

  // Carousel scroll arrows + touch swipe
  document.querySelectorAll(".image-row-wrapper").forEach((wrapper) => {
    const row = wrapper.querySelector(".image-row");
    const scrollAmount = () => {
      const firstItem = row.querySelector("img, video");
      return firstItem ? firstItem.offsetWidth + 8 : row.clientWidth * 0.8;
    };
    wrapper.querySelector(".image-nav.left").addEventListener("click", () =>
      row.scrollBy({ left: -scrollAmount(), behavior: "smooth" })
    );
    wrapper.querySelector(".image-nav.right").addEventListener("click", () =>
      row.scrollBy({ left: scrollAmount(), behavior: "smooth" })
    );

    // Touch swipe support for carousel rows
    let swipeStartX = 0;
    row.addEventListener("touchstart", (e) => {
      swipeStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    row.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - swipeStartX;
      if (Math.abs(dx) > 30) {
        row.scrollBy({ left: dx < 0 ? scrollAmount() : -scrollAmount(), behavior: "smooth" });
      }
    }, { passive: true });
  });

  // Lazy load videos with IntersectionObserver
  const lazyVideos = document.querySelectorAll("video[preload='none']");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const media = entry.target;
        if (media.tagName.toLowerCase() === "video" && media.dataset.poster) {
          media.poster = media.dataset.poster;
        }
        obs.unobserve(media);
      }
    });
  });
  lazyVideos.forEach((el) => observer.observe(el));

  // --- Accessibility & performance enhancements (AFTER lightbox setup) ---
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  });

  document.querySelectorAll('.image-row').forEach(row => {
    const first = row.querySelector('img');
    if (first) {
      first.setAttribute('loading', 'eager');
      first.setAttribute('fetchpriority', 'high');
    }
  });

  // Keyboard support for lightbox
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') {
        lightbox.style.display = 'none';
        if (lightboxMedia?.tagName.toLowerCase() === 'video') lightboxMedia.pause();
      } else if (e.key === 'ArrowLeft') {
        showMedia(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        showMedia(currentIndex + 1);
      }
    }
  });

  // Swipe navigation on touch devices
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      showMedia(currentIndex + (dx < 0 ? 1 : -1));
    }
  });
});
