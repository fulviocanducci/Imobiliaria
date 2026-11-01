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

const cards = [...document.querySelectorAll('#catalog-grid .property-card')];
const pageSize = 3;
const filterForm = document.querySelector('#filter-form');
const pagination = document.querySelector('#pagination');
const count = document.querySelector('#results-count');
const noResults = document.querySelector('#no-results');
const fields = {
  location: document.querySelector('#filter-location'), purpose: document.querySelector('#filter-purpose'),
  type: document.querySelector('#filter-type'), rooms: document.querySelector('#filter-rooms'),
  bathrooms: document.querySelector('#filter-bathrooms'), areaMin: document.querySelector('#filter-area-min'),
  areaMax: document.querySelector('#filter-area-max'), price: document.querySelector('#filter-price'),
};
const normalize = (value) => value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function filteredCards() {
  const f = { location: normalize(fields.location.value.trim()), purpose: fields.purpose.value, type: fields.type.value,
    rooms: Number(fields.rooms.value) || 0, bathrooms: Number(fields.bathrooms.value) || 0,
    areaMin: Number(fields.areaMin.value) || 0, areaMax: Number(fields.areaMax.value) || Infinity,
    price: Number(fields.price.value) || Infinity };
  return cards.filter((card) => (!f.location || normalize(card.dataset.location).includes(f.location)) &&
    (f.purpose === 'todas' || card.dataset.purpose === f.purpose) &&
    (f.type === 'todos' || card.dataset.type === f.type) && Number(card.dataset.rooms) >= f.rooms &&
    Number(card.dataset.bathrooms) >= f.bathrooms && Number(card.dataset.area) >= f.areaMin &&
    Number(card.dataset.area) <= f.areaMax && Number(card.dataset.price) <= f.price);
}
function renderPagination(page, pageCount) {
  if (pageCount < 2) { pagination.replaceChildren(); pagination.hidden = true; return; }
  pagination.hidden = false;
  const previous = document.createElement('button');
  previous.className = 'page-arrow'; previous.type = 'button'; previous.dataset.page = String(page - 1);
  previous.setAttribute('aria-label', 'Página anterior'); previous.disabled = page === 1;
  previous.innerHTML = '<i class="bi bi-arrow-left" aria-hidden="true"></i> <span>Anterior</span>';
  const numbers = document.createElement('div'); numbers.className = 'page-numbers';
  for (let number = 1; number <= pageCount; number += 1) {
    const button = document.createElement('button'); button.className = `page-number${number === page ? ' is-current' : ''}`;
    button.type = 'button'; button.dataset.page = String(number); button.textContent = String(number);
    button.setAttribute('aria-label', `Página ${number}`); if (number === page) button.setAttribute('aria-current', 'page');
    numbers.append(button);
  }
  const next = document.createElement('button');
  next.className = 'page-arrow'; next.type = 'button'; next.dataset.page = String(page + 1);
  next.setAttribute('aria-label', 'Próxima página'); next.disabled = page === pageCount;
  next.innerHTML = '<span>Próxima</span> <i class="bi bi-arrow-right" aria-hidden="true"></i>';
  pagination.replaceChildren(previous, numbers, next);
}
let currentPage = 1;
function renderPage(requestedPage = 1) {
  const results = filteredCards(); const pageCount = Math.ceil(results.length / pageSize);
  currentPage = Math.min(Math.max(1, requestedPage), Math.max(1, pageCount));
  const start = (currentPage - 1) * pageSize;
  cards.forEach((card) => { card.hidden = !results.slice(start, start + pageSize).includes(card); });
  noResults.hidden = results.length > 0;
  count.innerHTML = results.length ? `Exibindo <strong>${start + 1}–${Math.min(start + pageSize, results.length)}</strong> de <strong>${results.length} ${results.length === 1 ? 'imóvel' : 'imóveis'}</strong>` : '<strong>0 imóveis</strong> encontrados';
  renderPagination(currentPage, pageCount);
}
const params = new URLSearchParams(window.location.search);
Object.entries(fields).forEach(([key, field]) => { if (params.has(key)) field.value = params.get(key); });
filterForm.addEventListener('submit', (event) => {
  event.preventDefault(); const query = new URLSearchParams(new FormData(filterForm));
  for (const [key, value] of query) if (!value || ['todas', 'todos', '0'].includes(value)) query.delete(key);
  history.replaceState(null, '', `${window.location.pathname}${query.size ? `?${query}` : ''}#catalog-title`);
  renderPage(1);
});
filterForm.addEventListener('reset', () => requestAnimationFrame(() => {
  history.replaceState(null, '', `${window.location.pathname}#catalog-title`); renderPage(1);
}));
pagination.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-page]:not(:disabled)'); if (!button) return;
  renderPage(Number(button.dataset.page)); document.querySelector('#catalog-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.querySelectorAll('.favorite-button').forEach((button) => button.addEventListener('click', () => {
  button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
}));
renderPage(1);
