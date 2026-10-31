const params = new URLSearchParams(window.location.search);
const property = window.HORIZONTE_PROPERTIES.find((item) => item.id === params.get('id'));
const detail = document.querySelector('#property-detail');
const notFound = document.querySelector('#property-not-found');

if (!property) {
  detail.hidden = true;
  notFound.hidden = false;
  document.title = 'Imóvel não encontrado | Horizonte Imóveis';
} else {
  const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  const imageUrl = (image, width = 1400) => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=88`;
  const galleryImages = property.photos?.length ? property.photos : [property.image];
  let activePhoto = 0;

  document.title = `${property.title} | Horizonte Imóveis`;
  document.querySelector('#detail-tag').textContent = `${property.type} · ${property.purpose === 'aluguel' ? 'Para alugar' : 'À venda'}`;
  document.querySelector('#property-title').textContent = property.title;
  document.querySelector('#property-place').textContent = `⌖ ${property.place}`;
  document.querySelector('#breadcrumb-place').textContent = property.place;
  document.querySelector('#price-label').textContent = property.purpose === 'aluguel' ? 'Aluguel mensal' : 'Valor do imóvel';
  document.querySelector('#property-price').textContent = property.purpose === 'aluguel' ? `${money(property.price)} / mês` : money(property.price);
  document.querySelector('#property-code').textContent = `Código ${property.code}`;
  document.querySelector('#property-description').textContent = property.description;
  document.querySelector('#property-contact').href = `contato.html?imovel=${encodeURIComponent(property.id)}`;

  const highlights = [
    ['⌂', `${property.area} m²`, 'Área útil'],
    ['♧', property.rooms, 'Dormitórios'],
    ['♨', property.bathrooms, 'Banheiros'],
    ['▧', property.parking, 'Vagas'],
  ];
  document.querySelector('#detail-highlights').innerHTML = highlights.map(([icon, value, label]) => `<div><span>${icon}</span><strong>${value}</strong><small>${label}</small></div>`).join('');
  document.querySelector('#property-features').innerHTML = property.features.map((feature) => `<li>${feature}</li>`).join('');

  const condo = property.condominium ? `${money(property.condominium)} / mês` : 'Não se aplica';
  const specs = [
    ['Tipo', property.type], ['Finalidade', property.purpose === 'aluguel' ? 'Aluguel' : 'Venda'],
    ['Área útil', `${property.area} m²`], ['Área total', `${property.totalArea} m²`],
    ['Dormitórios', property.rooms], ['Suítes', property.suites], ['Banheiros', property.bathrooms],
    ['Vagas de garagem', property.parking], ['Condomínio', condo], ['IPTU mensal', `${money(property.propertyTax)} / mês`],
    ['Localização', property.place], ['Código do anúncio', property.code],
  ];
  document.querySelector('#property-specs').innerHTML = specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');

  const mainImage = document.querySelector('#gallery-main-image');
  const dialog = document.querySelector('#photo-dialog');
  const dialogImage = document.querySelector('#dialog-image');
  const thumbnailRail = document.querySelector('#gallery-thumbnails');
  const scrollUp = document.querySelector('#gallery-scroll-up');
  const scrollDown = document.querySelector('#gallery-scroll-down');
  const updateGallery = () => {
    const current = galleryImages[activePhoto];
    const alt = `${property.type} em ${property.place} — foto ${activePhoto + 1}`;
    mainImage.src = imageUrl(current, 1500);
    mainImage.alt = alt;
    dialogImage.src = imageUrl(current, 2000);
    dialogImage.alt = alt;
    document.querySelector('#gallery-counter').textContent = `${activePhoto + 1} / ${galleryImages.length}`;
    document.querySelector('#dialog-counter').textContent = `${activePhoto + 1} / ${galleryImages.length}`;
    thumbnailRail.querySelectorAll('.gallery-thumb').forEach((button, index) => {
      button.setAttribute('aria-current', String(index === activePhoto));
    });
  };
  const updateScrollButtons = () => {
    const vertical = window.matchMedia('(min-width: 681px)').matches;
    scrollUp.setAttribute('aria-label', vertical ? 'Rolar fotos para cima' : 'Rolar fotos para a esquerda');
    scrollDown.setAttribute('aria-label', vertical ? 'Rolar fotos para baixo' : 'Rolar fotos para a direita');
    const current = vertical ? thumbnailRail.scrollTop : thumbnailRail.scrollLeft;
    const visible = vertical ? thumbnailRail.clientHeight : thumbnailRail.clientWidth;
    const total = vertical ? thumbnailRail.scrollHeight : thumbnailRail.scrollWidth;
    scrollUp.disabled = current <= 1;
    scrollDown.disabled = current + visible >= total - 1;
  };
  thumbnailRail.innerHTML = galleryImages.map((image, index) => `<button class="gallery-thumb" type="button" data-photo="${index}" aria-label="Ver foto ${index + 1} de ${galleryImages.length}" aria-current="${index === 0}"><img src="${imageUrl(image, 360)}" alt="" loading="lazy"></button>`).join('');
  document.querySelectorAll('[data-step]').forEach((button) => button.addEventListener('click', () => {
    activePhoto = (activePhoto + Number(button.dataset.step) + galleryImages.length) % galleryImages.length;
    updateGallery();
  }));
  thumbnailRail.querySelectorAll('.gallery-thumb').forEach((button) => button.addEventListener('click', () => {
    activePhoto = Number(button.dataset.photo);
    updateGallery();
  }));
  scrollUp.addEventListener('click', () => {
    const vertical = window.matchMedia('(min-width: 681px)').matches;
    thumbnailRail.scrollBy(vertical ? { top: -thumbnailRail.clientHeight * 0.75, behavior: 'smooth' } : { left: -thumbnailRail.clientWidth * 0.75, behavior: 'smooth' });
  });
  scrollDown.addEventListener('click', () => {
    const vertical = window.matchMedia('(min-width: 681px)').matches;
    thumbnailRail.scrollBy(vertical ? { top: thumbnailRail.clientHeight * 0.75, behavior: 'smooth' } : { left: thumbnailRail.clientWidth * 0.75, behavior: 'smooth' });
  });
  thumbnailRail.addEventListener('scroll', updateScrollButtons, { passive: true });
  window.addEventListener('resize', updateScrollButtons);
  window.addEventListener('load', updateScrollButtons, { once: true });
  new ResizeObserver(updateScrollButtons).observe(thumbnailRail);
  document.querySelector('#gallery-open').addEventListener('click', () => dialog.showModal());
  document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  updateGallery();
  requestAnimationFrame(updateScrollButtons);
}
