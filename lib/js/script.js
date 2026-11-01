const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  mainNav?.classList.toggle('is-open', !open);
});

mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menu');
}));

document.querySelectorAll('.search-tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.search-tab').forEach((item) => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
}));

document.querySelector('#search-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const params = new URLSearchParams();
  const values = {
    location: document.querySelector('#location-input').value.trim(),
    purpose: document.querySelector('.search-tab.is-active')?.dataset.purpose || 'venda',
    type: document.querySelector('#type-select').value,
    rooms: document.querySelector('#rooms-select').value,
    bathrooms: document.querySelector('#bathrooms-select').value,
    areaMin: document.querySelector('#area-min-input').value,
    areaMax: document.querySelector('#area-max-input').value,
    price: document.querySelector('#price-max-input').value,
  };
  Object.entries(values).forEach(([key, value]) => {
    if (value && !['todos', '0'].includes(value)) params.set(key, value);
  });
  window.location.href = `imoveis.html?${params.toString()}#catalog-title`;
});
