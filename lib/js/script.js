const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mainNav.classList.toggle('is-open', !isOpen);
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  });
});

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

document.querySelector('#property-grid').innerHTML = window.HORIZONTE_PROPERTIES.slice(0, 3).map(propertyCard).join('');

let selectedPurpose = 'venda';
document.querySelectorAll('.search-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    selectedPurpose = tab.dataset.purpose;
    document.querySelectorAll('.search-tab').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  });
});

document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const params = new URLSearchParams({
    location: document.querySelector('#location-input').value.trim(),
    type: document.querySelector('#type-select').value,
    purpose: selectedPurpose,
    rooms: document.querySelector('#rooms-select').value,
    bathrooms: document.querySelector('#bathrooms-select').value,
    areaMin: document.querySelector('#area-min-input').value,
    areaMax: document.querySelector('#area-max-input').value,
    price: document.querySelector('#price-max-input').value,
  });
  for (const [key, value] of [...params]) {
    if (!value || ['todos', '0'].includes(value)) params.delete(key);
  }
  window.location.href = `imoveis.html?${params.toString()}#catalog-title`;
});

document.querySelectorAll('.favorite-button').forEach((button) => {
  button.addEventListener('click', () => {
    const saved = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!saved));
  });
});
