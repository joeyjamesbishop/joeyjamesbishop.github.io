document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');
  document.body.appendChild(lightbox);

  let lightboxMedia = null;

  const closeBtn = document.createElement('span');
  closeBtn.classList.add('lightbox-close');
  closeBtn.innerHTML = '&times;';
  lightbox.appendChild(closeBtn);

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('lightbox-nav', 'left');
  prevBtn.innerHTML = '&#8592;';
  lightbox.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('lightbox-nav', 'right');
  nextBtn.innerHTML = '&#8594;';
  lightbox.appendChild(nextBtn);

  let currentGroup = [];
  let currentIndex = 0;

  const mediaElements = document.querySelectorAll('.image-row img, .image-row video');
  mediaElements.forEach((media) => {
    media.addEventListener('click', () => {
      const group = Array.from(media.closest('.image-row').querySelectorAll('img, video'));
      currentGroup = group;
      currentIndex = group.indexOf(media);
      showMedia(currentIndex);
      lightbox.style.display = 'flex';
    });
  });

  function showMedia(index) {
    if (!currentGroup.length) return;
    currentIndex = (index + currentGroup.length) % currentGroup.length;

    // Remove previous media
    if (lightboxMedia) {
      lightbox.removeChild(lightboxMedia);
      lightboxMedia = null;
    }

    const current = currentGroup[currentIndex];
    if (current.tagName.toLowerCase() === 'img') {
      lightboxMedia = document.createElement('img');
      lightboxMedia.src = current.src;
    } else if (current.tagName.toLowerCase() === 'video') {
      lightboxMedia = document.createElement('video');
      lightboxMedia.src = current.src;
      lightboxMedia.autoplay = true;
      lightboxMedia.controls = true;
      lightboxMedia.loop = true;
      lightboxMedia.muted = false; // unmute in lightbox
      lightboxMedia.style.maxHeight = "90vh";
    }

    lightbox.insertBefore(lightboxMedia, closeBtn);
  }

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showMedia(currentIndex - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showMedia(currentIndex + 1);
  });

  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
    if (lightboxMedia && lightboxMedia.tagName.toLowerCase() === 'video') {
      lightboxMedia.pause();
    }
  });

  lightbox.addEventListener('click', (e) => {
    if (![lightboxMedia, closeBtn, prevBtn, nextBtn].includes(e.target)) {
      lightbox.style.display = 'none';
      if (lightboxMedia && lightboxMedia.tagName.toLowerCase() === 'video') {
        lightboxMedia.pause();
      }
    }
  });

  // Carousel scroll arrows
  document.querySelectorAll('.image-row-wrapper').forEach(wrapper => {
    const row = wrapper.querySelector('.image-row');
    const leftArrow = wrapper.querySelector('.image-nav.left');
    const rightArrow = wrapper.querySelector('.image-nav.right');

    leftArrow.addEventListener('click', () => {
      row.scrollBy({ left: -row.clientWidth / 1.2, behavior: 'smooth' });
    });

    rightArrow.addEventListener('click', () => {
      row.scrollBy({ left: row.clientWidth / 1.2, behavior: 'smooth' });
    });
  });
});