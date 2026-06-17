/* NOVA theme — minimal interactions */
(function () {
  'use strict';

  // PDP: thumbnail -> main image swap
  document.addEventListener('click', function (e) {
    var thumb = e.target.closest('[data-thumb]');
    if (thumb) {
      var main = document.getElementById('pdp-main');
      if (main) main.src = thumb.getAttribute('data-thumb');
    }
  });

  // PDP: sync option selects -> hidden variant id
  var optionSelects = document.querySelectorAll('[data-option-index]');
  var variantSelect = document.getElementById('variant-id');
  if (optionSelects.length && variantSelect) {
    var variants = Array.prototype.map.call(variantSelect.options, function (o) {
      return { id: o.value, title: o.textContent.split(' - ')[0].trim() };
    });
    function updateVariant() {
      var chosen = [];
      optionSelects.forEach(function (s) { chosen.push(s.value.trim()); });
      var match = variants.find(function (v) {
        return chosen.every(function (c) { return v.title.indexOf(c) !== -1; });
      });
      if (match) variantSelect.value = match.id;
    }
    optionSelects.forEach(function (s) { s.addEventListener('change', updateVariant); });
    updateVariant();
  }

  // Mobile nav toggle
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.style.display === 'flex';
      nav.style.display = open ? 'none' : 'flex';
    });
  }
})();
