const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  mainNav.classList.toggle('is-open', !open);
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  });
});

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const propertyId = new URLSearchParams(window.location.search).get('imovel');
  const property = window.HORIZONTE_PROPERTIES?.find((item) => item.id === propertyId);
  if (property) {
    const subjectSelect = contactForm.querySelector('[name="subject"]');
    const subjectOption = [...subjectSelect.options].find((option) => option.textContent.toLowerCase().includes(property.purpose === 'aluguel' ? 'alugar' : 'comprar'));
    if (subjectOption) subjectSelect.value = subjectOption.value;
    contactForm.querySelector('[name="message"]').value = `Tenho interesse no imóvel ${property.code}: ${property.title}, em ${property.place}. Gostaria de receber mais informações e saber sobre a disponibilidade.`;
  }
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = `Contato pelo site — ${data.get('subject')}`;
    const body = [
      `Nome: ${data.get('name')}`,
      `E-mail: ${data.get('email')}`,
      `Telefone: ${data.get('phone') || 'Não informado'}`,
      `Assunto: ${data.get('subject')}`,
      '',
      'Mensagem:',
      data.get('message'),
    ].join('\n');
    document.querySelector('#form-status').textContent = 'Abrindo seu aplicativo de e-mail com os dados preenchidos…';
    window.location.href = `mailto:oi@horizonteimoveis.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
