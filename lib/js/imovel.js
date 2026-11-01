const gallery = document.querySelector('.photo-gallery');
if (gallery) {
  const mainImage = document.querySelector('#gallery-main-image');
  const dialog = document.querySelector('#photo-dialog');
  const dialogImage = document.querySelector('#dialog-image');
  const counter = document.querySelector('#gallery-counter');
  const dialogCounter = document.querySelector('#dialog-counter');
  const rail = document.querySelector('#gallery-thumbnails');
  const scrollUp = document.querySelector('#gallery-scroll-up');
  const scrollDown = document.querySelector('#gallery-scroll-down');
  const thumbs = [...rail.querySelectorAll('.gallery-thumb')];
  let activePhoto = Math.max(0, thumbs.findIndex((thumb) => thumb.getAttribute('aria-current') === 'true'));

  function updateGallery() {
    const selected = thumbs[activePhoto];
    const image = selected.querySelector('img');
    const source = new URL(image.src);
    source.searchParams.set('w', '1500');
    mainImage.src = source.href;
    mainImage.alt = `Apartamento em Jardins, São Paulo — foto ${activePhoto + 1}`;
    source.searchParams.set('w', '2000');
    dialogImage.src = source.href;
    dialogImage.alt = mainImage.alt;
    counter.textContent = `${activePhoto + 1} / ${thumbs.length}`;
    dialogCounter.textContent = counter.textContent;
    thumbs.forEach((thumb, index) => thumb.setAttribute('aria-current', String(index === activePhoto)));
  }
  function updateScrollButtons() {
    const vertical = window.matchMedia('(min-width: 681px)').matches;
    scrollUp.setAttribute('aria-label', vertical ? 'Rolar fotos para cima' : 'Rolar fotos para a esquerda');
    scrollDown.setAttribute('aria-label', vertical ? 'Rolar fotos para baixo' : 'Rolar fotos para a direita');
    scrollUp.querySelector('.bi').className = `bi ${vertical ? 'bi-chevron-up' : 'bi-chevron-left'}`;
    scrollDown.querySelector('.bi').className = `bi ${vertical ? 'bi-chevron-down' : 'bi-chevron-right'}`;
    const current = vertical ? rail.scrollTop : rail.scrollLeft;
    const visible = vertical ? rail.clientHeight : rail.clientWidth;
    const total = vertical ? rail.scrollHeight : rail.scrollWidth;
    scrollUp.disabled = current <= 1;
    scrollDown.disabled = current + visible >= total - 1;
  }
  document.querySelectorAll('[data-step]').forEach((button) => button.addEventListener('click', () => {
    activePhoto = (activePhoto + Number(button.dataset.step) + thumbs.length) % thumbs.length;
    updateGallery();
  }));
  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => { activePhoto = index; updateGallery(); }));
  scrollUp.addEventListener('click', () => {
    const vertical = window.matchMedia('(min-width: 681px)').matches;
    rail.scrollBy(vertical ? { top: -rail.clientHeight * 0.75, behavior: 'smooth' } : { left: -rail.clientWidth * 0.75, behavior: 'smooth' });
  });
  scrollDown.addEventListener('click', () => {
    const vertical = window.matchMedia('(min-width: 681px)').matches;
    rail.scrollBy(vertical ? { top: rail.clientHeight * 0.75, behavior: 'smooth' } : { left: rail.clientWidth * 0.75, behavior: 'smooth' });
  });
  rail.addEventListener('scroll', updateScrollButtons, { passive: true });
  window.addEventListener('resize', updateScrollButtons);
  window.addEventListener('load', updateScrollButtons, { once: true });
  new ResizeObserver(updateScrollButtons).observe(rail);
  document.querySelector('#gallery-open').addEventListener('click', () => dialog.showModal());
  document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  updateGallery();
  requestAnimationFrame(updateScrollButtons);
}
