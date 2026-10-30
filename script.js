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

const propertyCards = [...document.querySelectorAll('.property-card')];
const emptyState = document.querySelector('#empty-state');

document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const location = document.querySelector('#location-input').value.trim().toLocaleLowerCase('pt-BR');
  const type = document.querySelector('#type-select').value;
  let visibleCount = 0;

  propertyCards.forEach((card) => {
    const matchesLocation = !location || card.dataset.location.includes(location);
    const matchesType = type === 'todos' || card.dataset.type === type;
    const matchesPurpose = card.dataset.purpose === selectedPurpose;
    const visible = matchesLocation && matchesType && matchesPurpose;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount > 0;
  document.querySelector('#imoveis').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('.favorite-button').forEach((button) => {
  button.addEventListener('click', () => {
    const saved = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!saved));
  });
});
