/* ═══════════════════════════════════════════════════════════
   LA TORRE TOURS — 4 Day Trip Page
   script.js — Vanilla JS, no dependencies
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     1. STICKY HEADER
  ────────────────────────────────────────────────────────── */
  const header = document.getElementById('header');

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 80);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* Hero bg load trigger */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 100);

  /* ──────────────────────────────────────────────────────────
     2. SMOOTH SCROLL (offset-aware)
  ────────────────────────────────────────────────────────── */
  function getScrollOffset() {
    const headerH   = header ? header.offsetHeight : 72;
    const sectionNav = document.getElementById('sectionNav');
    const navH = (sectionNav && sectionNav.classList.contains('visible'))
      ? sectionNav.offsetHeight : 0;
    return headerH + navH + 12;
  }

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    window.scrollTo({ top, behavior: 'smooth' });
    closeMobileMenu();
  });

  /* ──────────────────────────────────────────────────────────
     3. SECTION NAV — VISIBILITY & ACTIVE STATE
  ────────────────────────────────────────────────────────── */
  const sectionNav  = document.getElementById('sectionNav');
  const heroSection = document.getElementById('hero');
  const navLinks    = document.querySelectorAll('.section-nav-link');
  const sections    = ['route', 'itinerary', 'gallery', 'prices', 'faq']
    .map(id => document.getElementById(id)).filter(Boolean);

  if (heroSection && sectionNav) {
    new IntersectionObserver(([entry]) => {
      sectionNav.classList.toggle('visible', !entry.isIntersecting);
    }, { threshold: 0 }).observe(heroSection);
  }

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === entry.target.id);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(s => navObserver.observe(s));
  }

  /* ──────────────────────────────────────────────────────────
     4. MOBILE MENU
  ────────────────────────────────────────────────────────── */
  const hamburger     = document.getElementById('hamburger');
  const mobileMenu    = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openMobileMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!hamburger) return;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });

  /* ──────────────────────────────────────────────────────────
     5. LANGUAGE SELECTOR DROPDOWN
  ────────────────────────────────────────────────────────── */
  const langSelector = document.getElementById('langSelector');
  if (langSelector) {
    const langBtn = langSelector.querySelector('.lang-btn');
    langBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = langSelector.classList.contains('open');
      langSelector.classList.toggle('open', !isOpen);
      langBtn.setAttribute('aria-expanded', String(!isOpen));
    });
    document.addEventListener('click', () => {
      langSelector.classList.remove('open');
      langBtn.setAttribute('aria-expanded', 'false');
    });
  }

  /* ──────────────────────────────────────────────────────────
     6. PRICING TABS (Shared / Private)
  ────────────────────────────────────────────────────────── */
  const pricingTabs   = document.querySelectorAll('.pricing-tab');
  const pricingPanels = document.querySelectorAll('.pricing-panel');

  const bookConfig = {
    shared:  { label: 'Book Shared Tour',  url: 'https://book.latorretours-tupiza.com/4d-s' },
    private: { label: 'Book Private Tour', url: 'https://book.latorretours-tupiza.com/4d-p' }
  };

  function updateNavBook(tourType) {
    const btn   = document.getElementById('navBookBtn');
    const label = document.getElementById('navBookLabel');
    const cfg   = bookConfig[tourType];
    if (!btn || !label || !cfg) return;
    label.textContent = cfg.label;
    btn.href = cfg.url;
  }

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tour;
      pricingTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      pricingPanels.forEach(p => { p.classList.remove('active'); p.hidden = true; });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('panel-' + target);
      if (panel) { panel.classList.add('active'); panel.hidden = false; }
      updateNavBook(target);
    });
  });

  /* ──────────────────────────────────────────────────────────
     7. PRIVATE TOUR GROUP SIZE SELECTOR
     Uses event delegation so it works with dynamically rendered content.
  ────────────────────────────────────────────────────────── */
  const privatePanel = document.getElementById('panel-private');

  if (privatePanel) {
    privatePanel.addEventListener('click', e => {
      const btn = e.target.closest('.group-btn');
      if (!btn) return;

      const group = btn.dataset.group;
      const allBtns   = privatePanel.querySelectorAll('.group-btn');
      const allGroups = privatePanel.querySelectorAll('.private-group');

      allBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      allGroups.forEach(g => { g.classList.remove('active'); g.hidden = true; });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = privatePanel.querySelector(`[data-group-panel="${group}"]`);
      if (panel) { panel.classList.add('active'); panel.hidden = false; }
    });
  }

  /* ──────────────────────────────────────────────────────────
     8. FAQ ACCORDION
  ────────────────────────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');
      faqItems.forEach(i => {
        i.classList.remove('faq-item--open');
        const b = i.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('faq-item--open');
        btn.setAttribute('aria-expanded', 'true');
        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          if (rect.bottom > window.innerHeight) {
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }, 350);
      }
    });
  });

  /* ──────────────────────────────────────────────────────────
     9. GALLERY LIGHTBOX
  ────────────────────────────────────────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightbox-img');
  const lbCaption    = document.getElementById('lightbox-caption');
  const lbCounter    = document.getElementById('lightbox-counter');
  const lbClose      = lightbox?.querySelector('.lightbox-close');
  const lbPrev       = lightbox?.querySelector('.lightbox-prev');
  const lbNext       = lightbox?.querySelector('.lightbox-next');
  const lbBackdrop   = lightbox?.querySelector('.lightbox-backdrop');

  const galleryData = Array.from(galleryItems).map(item => ({
    src:     item.querySelector('img').src,
    alt:     item.querySelector('img').alt,
    caption: item.dataset.caption || item.querySelector('img').alt
  }));

  let currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox) return;
    currentIndex = index;
    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    galleryItems[currentIndex]?.focus();
  }
  function renderLightbox() {
    const data = galleryData[currentIndex];
    if (!data) return;
    lbImg.src = data.src;
    lbImg.alt = data.alt;
    lbCaption.textContent = data.caption;
    lbCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;
  }
  function prevImage() { currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length; renderLightbox(); }
  function nextImage() { currentIndex = (currentIndex + 1) % galleryData.length; renderLightbox(); }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index, 10)));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(parseInt(item.dataset.index, 10)); }
    });
  });
  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', prevImage);
  lbNext?.addEventListener('click', nextImage);
  lbBackdrop?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  /* ──────────────────────────────────────────────────────────
     10. BACK TO TOP
  ────────────────────────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ──────────────────────────────────────────────────────────
     11. SCROLL ANIMATIONS
  ────────────────────────────────────────────────────────── */
  const animateTargets = document.querySelectorAll(
    '.route-day-card, .testimonial-card, .faq-item, .gallery-item'
  );
  if (animateTargets.length && 'IntersectionObserver' in window) {
    document.head.insertAdjacentHTML('beforeend',
      '<style>.is-visible { opacity: 1 !important; transform: translateY(0) !important; }</style>'
    );
    const animObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          animObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animateTargets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.08}s, transform 0.5s ease ${(i % 4) * 0.08}s`;
      animObs.observe(el);
    });
  }

  /* ──────────────────────────────────────────────────────────
     12. PRICES FROM GOOGLE SHEETS
     To update prices: edit the Google Sheet only.
     Prices in the HTML are fallback values shown instantly.
     The sheet overrides them when it loads.
  ────────────────────────────────────────────────────────── */

  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRba5ShjL2izTcH7Bl1-WMDDu1MIfzi6AXNQEVvp1L_9MtZzZuBX9TKPnQSL5ebaVwKHu9Zw5UJWTq-/pub?gid=0&single=true&output=csv';

  /**
   * Parses published Google Sheets CSV.
   * Columns: tour, plan_key, price, badge
   * Returns { plan_key: { price, badge } } filtered by tourId.
   */
  function parseSheetCSV(csv, tourId) {
    const lines = csv.trim().split('\n');
    const map = {};
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols[0] === tourId && cols[1] && !isNaN(parseFloat(cols[2]))) {
        map[cols[1]] = { price: parseFloat(cols[2]), badge: cols[3] || null };
      }
    }
    return map;
  }

  /** Fetches sheet and updates [data-plan-key] price spans in the DOM */
  async function loadPrices() {
    const pricesSection = document.getElementById('prices');
    const tourId = pricesSection ? pricesSection.dataset.tour : null;
    if (!tourId) return;

    try {
      const res = await fetch(SHEET_CSV_URL);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const csv = await res.text();
      const priceMap = parseSheetCSV(csv, tourId);

      if (!Object.keys(priceMap).length) {
        console.warn('[La Torre Tours] Sheet loaded but no rows found for tour "' + tourId + '". Check column A.');
        return;
      }

      document.querySelectorAll('[data-plan-key]').forEach(el => {
        const data = priceMap[el.dataset.planKey];
        if (data) el.textContent = '$' + Number(data.price).toLocaleString('en-US');
      });

      console.log('[La Torre Tours] Prices updated from Google Sheets (tour: ' + tourId + ').');
    } catch (err) {
      console.warn('[La Torre Tours] Could not load prices from Google Sheets:', err.message);
    }
  }

  loadPrices();

  /* ──────────────────────────────────────────────────────────
     INIT COMPLETE
  ────────────────────────────────────────────────────────── */
  console.log('[La Torre Tours] Page ready.');

})();
