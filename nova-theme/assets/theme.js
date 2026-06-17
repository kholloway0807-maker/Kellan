(function () {
  'use strict';

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Mobile nav */
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Product gallery thumbs */
  var mainImg = document.getElementById('ProductMainImage');
  var thumbs = document.querySelectorAll('.product-gallery__thumb');
  thumbs.forEach(function (t) {
    t.addEventListener('click', function () {
      if (mainImg) mainImg.src = t.getAttribute('data-thumb');
      thumbs.forEach(function (x) { x.classList.remove('is-active'); });
      t.classList.add('is-active');
    });
  });

  /* Variant selection */
  var form = document.getElementById('ProductForm');
  var dataEl = document.querySelector('[data-product-json]');
  if (form && dataEl) {
    var variants = JSON.parse(dataEl.textContent || '[]');
    var idInput = form.querySelector('[data-variant-id]');
    var priceEl = document.querySelector('[data-price]');
    var submit = form.querySelector('.product-form__submit');

    function money(cents) {
      return '$' + (cents / 100).toFixed(2);
    }
    function selectedOptions() {
      var groups = form.querySelectorAll('.product-option');
      return Array.prototype.map.call(groups, function (g) {
        var checked = g.querySelector('input[data-option]:checked');
        return checked ? checked.value : null;
      });
    }
    function update() {
      var opts = selectedOptions();
      var match = variants.find(function (v) {
        return v.options.every(function (o, i) { return opts[i] == null || opts[i] === o; });
      });
      if (!match) return;
      if (idInput) idInput.value = match.id;
      if (priceEl) priceEl.textContent = money(match.price);
      if (submit) {
        submit.disabled = !match.available;
        submit.textContent = match.available ? 'Add to cart' : 'Sold out';
      }
    }
    form.querySelectorAll('input[data-option]').forEach(function (i) {
      i.addEventListener('change', update);
    });
  }
})();
