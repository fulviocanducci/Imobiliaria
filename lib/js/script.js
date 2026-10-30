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

document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const params = new URLSearchParams({
    location: document.querySelector('#location-input').value.trim(),
    type: document.querySelector('#type-select').value,
    purpose: selectedPurpose,
  });
  window.location.href = `imoveis.html?${params.toString()}#catalog-title`;
});

document.querySelectorAll('.favorite-button').forEach((button) => {
  button.addEventListener('click', () => {
    const saved = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!saved));
  });
});
