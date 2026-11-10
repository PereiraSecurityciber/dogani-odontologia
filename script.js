(function () {
  'use strict';
  var WHATSAPP = '5511996848349';

  // WhatsApp links with a prefilled message per button (data-wa holds the text).
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(a.getAttribute('data-wa') || '');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Header: transparent over the hero, solid once the page scrolls.
  var topbar = document.getElementById('topo');
  var heroLogo = document.querySelector('.hero-logo');
  function onScroll() {
    var gone = heroLogo ? heroLogo.getBoundingClientRect().bottom < 90 : window.scrollY > 24;
    topbar.classList.toggle('is-solid', gone);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Treatments: one open at a time on desktop (side panel); toggles freely on mobile (accordion).
  var mqDesktop = window.matchMedia('(min-width: 901px)');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-tr] .tr-item'));
  function setOpen(item, open) {
    item.classList.toggle('is-open', open);
    item.querySelector('.tr-tab').setAttribute('aria-expanded', String(open));
  }
  items.forEach(function (item) {
    item.querySelector('.tr-tab').addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      if (mqDesktop.matches) {
        items.forEach(function (i) { setOpen(i, i === item); });
      } else {
        items.forEach(function (i) { if (i !== item) setOpen(i, false); });
        setOpen(item, !wasOpen);
        if (!wasOpen) {
          var top = item.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });
  mqDesktop.addEventListener('change', function (e) {
    if (e.matches && !items.some(function (i) { return i.classList.contains('is-open'); })) setOpen(items[0], true);
  });

  // Instagram rail arrows.
  var track = document.querySelector('[data-rail-track]');
  var prev = document.querySelector('[data-rail="prev"]');
  var next = document.querySelector('[data-rail="next"]');
  if (track && prev && next) {
    function step() { var li = track.querySelector('li'); return li ? li.getBoundingClientRect().width + 20 : 300; }
    function update() {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Highlight the nav link of the section in view.
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  if ('IntersectionObserver' in window && links.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.setAttribute('aria-current', String(l.getAttribute('href') === '#' + en.target.id)); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = document.querySelector(l.getAttribute('href')); if (s) io.observe(s); });
  }

  // Clinic photos: open the full-size image in a dialog.
  var lb = document.getElementById('lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('figcaption');
    var opener = null;
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        lbImg.src = btn.getAttribute('data-full');
        lbImg.alt = btn.querySelector('img').alt;
        lbCap.textContent = btn.getAttribute('data-cap') || '';
        lb.showModal();
      });
    });
    lb.querySelector('.lightbox-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', function () { if (opener) opener.focus(); });
  }

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
