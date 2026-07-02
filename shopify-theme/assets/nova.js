// NOVA Shopify Theme JS

// Sticky nav shadow on scroll
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// FAQ accordion
(function () {
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('open');
    });
  });
})();

// Email capture
(function () {
  const form = document.getElementById('nova-email-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    const wrapper = document.getElementById('nova-email-wrapper');
    if (!form.querySelector('input[type=email]').value) return;
    e.preventDefault();
    if (wrapper) {
      wrapper.innerHTML = '<span class="email-success">You\'re on the list — welcome to NOVA. ✦</span>';
    }
  });
})();
