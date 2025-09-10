document.addEventListener("DOMContentLoaded", () => {
  // Create lightbox
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
        ? Object.assign(document.createElement("img"), { src: current.dataset.src || current.src })
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
  document.querySelector(".portfolio").addEventListener("click", (e) => {
    if (e.target.matches(".image-row img, .image-row video")) {
      const row = e.target.closest(".image-row");
      currentGroup = [...row.querySelectorAll("img, video")];
      currentIndex = currentGroup.indexOf(e.target);
      showMedia(currentIndex);
      lightbox.style.display = "flex";
    }
  });

  // Carousel scroll arrows
  document.querySelectorAll(".image-row-wrapper").forEach((wrapper) => {
    const row = wrapper.querySelector(".image-row");
    wrapper.querySelector(".image-nav.left").addEventListener("click", () =>
      row.scrollBy({ left: -row.clientWidth / 1.2, behavior: "smooth" })
    );
    wrapper.querySelector(".image-nav.right").addEventListener("click", () =>
      row.scrollBy({ left: row.clientWidth / 1.2, behavior: "smooth" })
    );
  });

  // Lazy load images + videos with IntersectionObserver
  const lazyMedia = document.querySelectorAll("img[loading='lazy'], video[preload='none']");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const media = entry.target;
        if (media.dataset.src) media.src = media.dataset.src;
        if (media.tagName.toLowerCase() === "video" && media.dataset.poster) {
          media.poster = media.dataset.poster;
        }
        obs.unobserve(media);
      }
    });
  });

  lazyMedia.forEach((el) => observer.observe(el));
});