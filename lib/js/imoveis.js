const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  mainNav.classList.toggle('is-open', !open);
});

const properties = [
  { type: 'Apartamento', place: 'Jardins, São Paulo', title: 'Apartamento com luz e espaço', area: '142 m²', rooms: 3, parking: 2, price: 'R$ 1.280.000', tag: 'Destaque', image: 'photo-1600210492486-724fe5c67fb0' },
  { type: 'Casa', place: 'Vila Madalena, São Paulo', title: 'Casa com jardim para viver leve', area: '218 m²', rooms: 4, parking: 2, price: 'R$ 1.950.000', tag: 'Recém-chegado', image: 'photo-1600607687939-ce8a6c25118c' },
  { type: 'Apartamento', place: 'Pinheiros, São Paulo', title: 'Seu refúgio no coração da cidade', area: '96 m²', rooms: 2, parking: 1, price: 'R$ 7.400 / mês', tag: 'Para alugar', image: 'photo-1600607687920-4e2a09cf159d' },
  { type: 'Casa', place: 'Alto de Pinheiros, São Paulo', title: 'Arquitetura aberta para o jardim', area: '260 m²', rooms: 4, parking: 3, price: 'R$ 2.350.000', tag: 'Destaque', image: 'photo-1600607687644-c7171b42498f' },
  { type: 'Apartamento', place: 'Itaim Bibi, São Paulo', title: 'Design contemporâneo e varanda', area: '118 m²', rooms: 3, parking: 2, price: 'R$ 1.640.000', tag: 'Pronto para morar', image: 'photo-1600607687939-ce8a6c25118c' },
  { type: 'Casa', place: 'Brooklin, São Paulo', title: 'Um refúgio tranquilo na cidade', area: '195 m²', rooms: 3, parking: 2, price: 'R$ 9.800 / mês', tag: 'Para alugar', image: 'photo-1600607687920-4e2a09cf159d' },
  { type: 'Apartamento', place: 'Moema, São Paulo', title: 'Conforto pertinho do parque', area: '105 m²', rooms: 3, parking: 2, price: 'R$ 1.120.000', tag: 'Destaque', image: 'photo-1600210492486-724fe5c67fb0' },
  { type: 'Casa', place: 'Sumaré, São Paulo', title: 'Espaço de sobra para a família', area: '230 m²', rooms: 4, parking: 2, price: 'R$ 2.100.000', tag: 'Recém-chegado', image: 'photo-1600607687644-c7171b42498f' },
  { type: 'Apartamento', place: 'Vila Mariana, São Paulo', title: 'Praticidade com um toque de calma', area: '82 m²', rooms: 2, parking: 1, price: 'R$ 6.200 / mês', tag: 'Para alugar', image: 'photo-1600607687939-ce8a6c25118c' },
];

const pageSize = 3;
const totalPages = Math.ceil(properties.length / pageSize);
let currentPage = 1;
const grid = document.querySelector('#catalog-grid');
const pagination = document.querySelector('#pagination');
const count = document.querySelector('#results-count');

function propertyCard(property, index) {
  return `<article class="property-card">
    <div class="property-photo"><img src="https://images.unsplash.com/${property.image}?auto=format&fit=crop&w=900&q=85" alt="${property.type} em ${property.place}" loading="lazy"><span class="property-tag">${property.tag}</span><button class="favorite-button" type="button" aria-label="Salvar ${property.type.toLowerCase()} em ${property.place}" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none"><path d="M20.8 8.8c0 4.5-8.8 10-8.8 10s-8.8-5.5-8.8-10a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></button></div>
    <div class="property-body"><div class="property-location"><span class="pin">⌖</span> ${property.place}</div><h3>${property.title}</h3><div class="property-features"><span>⌂ ${property.area}</span><span>♧ ${property.rooms} quartos</span><span>▧ ${property.parking} vagas</span></div><div class="property-bottom"><div><small>${property.price.includes('/ mês') ? 'Aluguel mensal' : 'A partir de'}</small><strong>${property.price}</strong></div><a href="index.html#contato" aria-label="Tenho interesse em ${property.title}">↗</a></div></div>
  </article>`;
}

function renderPage(page) {
  currentPage = page;
  const start = (page - 1) * pageSize;
  const pageProperties = properties.slice(start, start + pageSize);
  grid.innerHTML = pageProperties.map(propertyCard).join('');
  count.innerHTML = `Exibindo <strong>${start + 1}–${start + pageProperties.length}</strong> de <strong>${properties.length} imóveis</strong>`;

  const pageButtons = Array.from({ length: totalPages }, (_, i) => {
    const number = i + 1;
    return `<button class="page-number${number === page ? ' is-current' : ''}" type="button" data-page="${number}" aria-label="Página ${number}"${number === page ? ' aria-current="page"' : ''}>${number}</button>`;
  }).join('');
  pagination.innerHTML = `<button class="page-arrow" type="button" data-page="${page - 1}" aria-label="Página anterior"${page === 1 ? ' disabled' : ''}>← <span>Anterior</span></button><div class="page-numbers">${pageButtons}</div><button class="page-arrow" type="button" data-page="${page + 1}" aria-label="Próxima página"${page === totalPages ? ' disabled' : ''}><span>Próxima</span> →</button>`;
  grid.querySelectorAll('.favorite-button').forEach((button) => button.addEventListener('click', () => {
    const saved = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!saved));
  }));
  pagination.querySelectorAll('button:not(:disabled)').forEach((button) => button.addEventListener('click', () => {
    const nextPage = Number(button.dataset.page);
    if (nextPage >= 1 && nextPage <= totalPages) {
      renderPage(nextPage);
      document.querySelector('#catalog-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }));
}

renderPage(currentPage);
