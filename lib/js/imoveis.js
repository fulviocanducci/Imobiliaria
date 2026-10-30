const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  mainNav.classList.toggle('is-open', !open);
});

const properties = window.HORIZONTE_PROPERTIES;

const pageSize = 3;
let currentPage = 1;
const grid = document.querySelector('#catalog-grid');
const pagination = document.querySelector('#pagination');
const count = document.querySelector('#results-count');
const noResults = document.querySelector('#no-results');
const filterForm = document.querySelector('#filter-form');
const filterFields = {
  location: document.querySelector('#filter-location'),
  purpose: document.querySelector('#filter-purpose'),
  type: document.querySelector('#filter-type'),
  rooms: document.querySelector('#filter-rooms'),
  bathrooms: document.querySelector('#filter-bathrooms'),
  areaMin: document.querySelector('#filter-area-min'),
  areaMax: document.querySelector('#filter-area-max'),
  price: document.querySelector('#filter-price'),
};

function normalize(value) {
  return value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function readFilters() {
  return {
    location: normalize(filterFields.location.value.trim()),
    purpose: filterFields.purpose.value,
    type: filterFields.type.value,
    rooms: Number(filterFields.rooms.value) || 0,
    bathrooms: Number(filterFields.bathrooms.value) || 0,
    areaMin: Number(filterFields.areaMin.value) || 0,
    areaMax: Number(filterFields.areaMax.value) || Infinity,
    price: Number(filterFields.price.value) || Infinity,
  };
}

function getFilteredProperties() {
  const filters = readFilters();
  return properties.filter((property) =>
    (!filters.location || normalize(property.place).includes(filters.location)) &&
    (filters.purpose === 'todas' || property.purpose === filters.purpose) &&
    (filters.type === 'todos' || property.type === filters.type) &&
    property.rooms >= filters.rooms && property.bathrooms >= filters.bathrooms &&
    property.area >= filters.areaMin && property.area <= filters.areaMax && property.price <= filters.price
  );
}

function formatPrice(property) {
  const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(property.price);
  return property.purpose === 'aluguel' ? `${formatted} / mês` : formatted;
}

function propertyCard(property) {
  return `<article class="property-card">
    <div class="property-photo"><a class="property-image-link" href="imovel.html?id=${property.id}" aria-label="Ver detalhes de ${property.title}"><img src="https://images.unsplash.com/${property.image}?auto=format&fit=crop&w=900&q=85" alt="${property.type} em ${property.place}" loading="lazy"></a><span class="property-tag">${property.tag}</span><button class="favorite-button" type="button" aria-label="Salvar ${property.type.toLowerCase()} em ${property.place}" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none"><path d="M20.8 8.8c0 4.5-8.8 10-8.8 10s-8.8-5.5-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button></div>
    <div class="property-body"><div class="property-location"><span class="pin">⌖</span> ${property.place}</div><h3><a class="property-title-link" href="imovel.html?id=${property.id}">${property.title}</a></h3><div class="property-features"><span>⌂ ${property.area} m²</span><span>♧ ${property.rooms} quartos</span><span>♨ ${property.bathrooms} banheiros</span><span>▧ ${property.parking} vagas</span></div><div class="property-bottom"><div><small>${property.purpose === 'aluguel' ? 'Aluguel mensal' : 'A partir de'}</small><strong>${formatPrice(property)}</strong></div><a href="imovel.html?id=${property.id}" aria-label="Ver detalhes de ${property.title}">↗</a></div></div>
  </article>`;
}

function renderPage(page = 1) {
  const filtered = getFilteredProperties();
  const pageCount = Math.ceil(filtered.length / pageSize);
  currentPage = Math.min(Math.max(1, page), Math.max(1, pageCount));
  const start = (currentPage - 1) * pageSize;
  const pageProperties = filtered.slice(start, start + pageSize);
  grid.innerHTML = pageProperties.map(propertyCard).join('');
  grid.hidden = filtered.length === 0;
  noResults.hidden = filtered.length > 0;
  count.innerHTML = filtered.length
    ? `Exibindo <strong>${start + 1}–${start + pageProperties.length}</strong> de <strong>${filtered.length} ${filtered.length === 1 ? 'imóvel' : 'imóveis'}</strong>`
    : '<strong>0 imóveis</strong> encontrados';

  if (pageCount < 2) {
    pagination.innerHTML = '';
    pagination.hidden = true;
  } else {
    pagination.hidden = false;
    const pageButtons = Array.from({ length: pageCount }, (_, i) => {
      const number = i + 1;
      return `<button class="page-number${number === currentPage ? ' is-current' : ''}" type="button" data-page="${number}" aria-label="Página ${number}"${number === currentPage ? ' aria-current="page"' : ''}>${number}</button>`;
    }).join('');
    pagination.innerHTML = `<button class="page-arrow" type="button" data-page="${currentPage - 1}" aria-label="Página anterior"${currentPage === 1 ? ' disabled' : ''}>← <span>Anterior</span></button><div class="page-numbers">${pageButtons}</div><button class="page-arrow" type="button" data-page="${currentPage + 1}" aria-label="Próxima página"${currentPage === pageCount ? ' disabled' : ''}><span>Próxima</span> →</button>`;
  }

  grid.querySelectorAll('.favorite-button').forEach((button) => button.addEventListener('click', () => {
    const saved = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!saved));
  }));
  pagination.querySelectorAll('button:not(:disabled)').forEach((button) => button.addEventListener('click', () => {
    renderPage(Number(button.dataset.page));
    document.querySelector('#catalog-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

const params = new URLSearchParams(window.location.search);
filterFields.location.value = params.get('location') || '';
filterFields.purpose.value = ['venda', 'aluguel'].includes(params.get('purpose')) ? params.get('purpose') : 'todas';
filterFields.type.value = ['Casa', 'Apartamento'].includes(params.get('type')) ? params.get('type') : 'todos';

filterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = new URLSearchParams(new FormData(filterForm));
  for (const [key, value] of query) if (!value || ['todas', 'todos', '0'].includes(value)) query.delete(key);
  history.replaceState(null, '', `${window.location.pathname}${query.size ? `?${query}` : ''}#catalog-title`);
  renderPage(1);
});

filterForm.addEventListener('reset', () => {
  requestAnimationFrame(() => {
    history.replaceState(null, '', `${window.location.pathname}#catalog-title`);
    renderPage(1);
  });
});

renderPage(1);
