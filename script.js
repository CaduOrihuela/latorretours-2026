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
    shared:  { label: 'Book Shared Tour',        mobileLabel: 'Book Shared Tour Now',  url: 'https://book.latorretours-tupiza.com/4d-s' },
    private: { label: 'Book Private Tour',       mobileLabel: 'Book Private Tour Now', url: 'https://book.latorretours-tupiza.com/4d-p' }
  };

  function updateNavBook(tourType) {
    const cfg = bookConfig[tourType];
    if (!cfg) return;
    const btn   = document.getElementById('navBookBtn');
    const label = document.getElementById('navBookLabel');
    if (btn && label) { label.textContent = cfg.label; btn.href = cfg.url; }
    const mobileBar   = document.getElementById('mobileBookBtn');
    const mobileLabel = document.getElementById('mobileBookLabel');
    if (mobileBar) mobileBar.href = cfg.url;
    if (mobileLabel) mobileLabel.textContent = cfg.mobileLabel;
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
     15. INTERACTIVE ROUTE MAP (Leaflet.js)
  ────────────────────────────────────────────────────────── */
  function initRouteMap() {
    const mapEl = document.getElementById('route-map');
    if (!mapEl || typeof L === 'undefined') return;

    const map = L.map('route-map', {
      zoomControl: true,
      scrollWheelZoom: false
    });

    // CartoDB Voyager — clean, terrain-friendly
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19
    }).addTo(map);

    // ── Day definitions ────────────────────────────────────
    const days = [
      {
        key: 'day1',
        label: 'Day 1',
        color: '#3498db',
        stops: [
          { name: 'La Torre Tours (Tupiza)',      latlng: [-21.44566, -65.71886], dir: 'top', labelOffset: [0, -38] },
          { name: 'El Sillar',                    latlng: [-21.45060, -65.81769], dir: 'bottom' },
          { name: 'Ciudad del Encanto',           latlng: [-21.44271, -66.60851], dir: 'top'    },
          { name: 'San Pablo de Lípez',           latlng: [-21.63487, -66.64057], dir: 'right'  },
          { name: 'San Antonio de Lípez',         latlng: [-21.77386, -66.88633], dir: 'right'  },
          { name: 'Quetena Chico',                latlng: [-22.19730, -67.35393], dir: 'right'  }
        ]
      },
      {
        key: 'day2',
        label: 'Day 2',
        color: '#e67e22',
        stops: [
          { name: 'Quetena Chico',                latlng: [-22.19730, -67.35393], dir: 'right'  },
          { name: 'Laguna Hedionda Sur',          latlng: [-22.45945, -67.38521], dir: 'right'  },
          { name: 'Salar de Chalviri',            latlng: [-22.47374, -67.55934], dir: 'right', labelOffset: [5, 20] },
          { name: 'Desierto Salvador Dalí',       latlng: [-22.62157, -67.66798], dir: 'right', labelOffset: [9, 22] },
          { name: 'Laguna Verde',                 latlng: [-22.79534, -67.83611], dir: 'bottom' },
          { name: 'Sol de Mañana',                latlng: [-22.45342, -67.76826], dir: 'left'   },
          { name: 'Laguna Colorada',              latlng: [-22.20493, -67.75493], dir: 'left'   }
        ]
      },
      {
        key: 'day3',
        label: 'Day 3',
        color: '#f1c40f',
        stops: [
          { name: 'Laguna Colorada',              latlng: [-22.20493, -67.75493], dir: 'left'   },
          { name: 'Rock Tree (Árbol de Piedra)',  latlng: [-22.04154, -67.89435], dir: 'left'   },
          { name: "Laguna Q'ara",                 latlng: [-21.89979, -67.86765], dir: 'left'   },
          { name: 'Julaca',                       latlng: [-20.84897, -67.59607], noLabel: true },
          { name: 'Villa Candelaria',             latlng: [-20.63805, -67.60644], dir: 'left'   }
        ]
      },
      {
        key: 'day4',
        label: 'Day 4',
        color: '#2ecc71',
        stops: [
          { name: 'Villa Candelaria',             latlng: [-20.63805, -67.60644], dir: 'left'   },
          { name: 'Isla Incahuasi',               latlng: [-20.24203, -67.62524], dir: 'top'    },
          { name: 'Uyuni',                        latlng: [-20.46182, -66.82160], dir: 'top'    }
        ]
      }
    ];

    // ── Draw polylines ─────────────────────────────────────
    const polylines = {};
    days.forEach(day => {
      polylines[day.key] = L.polyline(
        day.stops.map(s => s.latlng),
        { color: day.color, weight: 4, opacity: 0.8, lineJoin: 'round' }
      ).addTo(map);
    });

    // ── Draw markers ───────────────────────────────────────
    // Track drawn coords to avoid exact duplicate pins (shared stops between days)
    const drawn = new Set();

    days.forEach(day => {
      day.stops.forEach((stop, idx) => {
        const key = stop.latlng.join(',');
        const isFirst = idx === 0;
        const isLast  = idx === day.stops.length - 1;

        // Show marker: always for first/last of each day; skip inner shared ones already drawn
        const skipShared = drawn.has(key) && !isFirst && !isLast;
        if (skipShared) return;
        drawn.add(key);

        const size = (isFirst && day.key === 'day1') || (isLast && day.key === 'day4') ? 14 : 10;
        const border = size === 14 ? 3 : 2;

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:${size}px; height:${size}px;
            background:${day.color};
            border:${border}px solid #fff;
            border-radius:50%;
            box-shadow:0 1px 4px rgba(0,0,0,.4);
          "></div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });

        const marker = L.marker(stop.latlng, { icon })
          .addTo(map)
          .bindPopup(
            `<div class="popup-inner">
              <div class="popup-day" style="color:${day.color}">${day.label}</div>
              <div class="popup-name">${stop.name}</div>
            </div>`,
            { className: 'map-popup', maxWidth: 200 }
          );

        if (!stop.noLabel) {
          const defaultOffset = stop.dir === 'top'    ? [0, -(size / 2 + 4)] :
                                stop.dir === 'bottom' ? [0,  (size / 2 + 4)] :
                                stop.dir === 'left'   ? [-(size / 2 + 4), 0] :
                                                       [size / 2 + 4, 0];
          marker.bindTooltip(stop.name, {
            permanent: true,
            direction: stop.dir || 'right',
            offset: stop.labelOffset || defaultOffset,
            className: 'map-label'
          });
        }
      });
    });

    // ── Overnight markers ─────────────────────────────────
    // anchor: point of the icon [x,y] that sits on the latlng
    // upper-left of dot  → [iconW + gap, iconH + gap]
    // right of dot       → [-gap, iconH/2]
    const overnights = [
      { latlng: [-22.19730, -67.35393], label: 'Night 1 — Quetena Chico',   anchor: [28, 28] },
      { latlng: [-22.20493, -67.75493], label: 'Night 2 — Laguna Colorada', anchor: [-6, 11] },
      { latlng: [-20.63805, -67.60644], label: 'Night 3 — Villa Candelaria', anchor: [-6, 11] }
    ];

    const bedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="white">
      <path d="M22 9V7c0-1.1-.9-2-2-2H4C2.9 5 2 5.9 2 7v2H0v11h2v2h2v-2h16v2h2v-2h2V9h-2zM4 7h16v2H4V7zM2 18V11h20v7H2z"/>
      <rect x="6" y="13" width="4" height="3" rx="1"/>
      <rect x="14" y="13" width="4" height="3" rx="1"/>
    </svg>`;

    overnights.forEach(o => {
      L.marker(o.latlng, {
        icon: L.divIcon({
          className: '',
          html: `<div style="
            width: 22px; height: 22px;
            background: #34495e;
            border: 2px solid #fff;
            border-radius: 5px;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 1px 4px rgba(0,0,0,.4);
          ">${bedSvg}</div>`,
          iconSize: [22, 22],
          iconAnchor: o.anchor
        })
      })
      .addTo(map)
      .bindPopup(
        `<div class="popup-inner">
          <div class="popup-day" style="color:#34495e">🛏 Overnight</div>
          <div class="popup-name">${o.label.split(' — ')[1]}</div>
        </div>`,
        { className: 'map-popup', maxWidth: 200 }
      );
    });

    // ── Jeep 4x4 icon at Tupiza ───────────────────────────
    const jeep4x4Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="54" height="27">
      <rect x="3" y="13" width="52" height="10" rx="1" fill="#2c3e50"/>
      <rect x="7" y="4" width="41" height="11" rx="2" fill="#2c3e50"/>
      <path d="M9 5 L7 13 L20 13 L20 5 Z" fill="#aed6f1" opacity="0.85"/>
      <rect x="22" y="5" width="11" height="8" rx="1" fill="#aed6f1" opacity="0.85"/>
      <rect x="35" y="5" width="11" height="8" rx="1" fill="#aed6f1" opacity="0.85"/>
      <rect x="53" y="15" width="4" height="5" rx="1" fill="#1a252f"/>
      <rect x="3" y="15" width="3" height="5" rx="1" fill="#1a252f"/>
      <line x1="8" y1="4" x2="47" y2="4" stroke="#ecf0f1" stroke-width="1" opacity="0.5"/>
      <circle cx="14" cy="23" r="6" fill="#1a252f" stroke="#ecf0f1" stroke-width="1.5"/>
      <circle cx="14" cy="23" r="2.5" fill="#7f8c8d"/>
      <circle cx="44" cy="23" r="6" fill="#1a252f" stroke="#ecf0f1" stroke-width="1.5"/>
      <circle cx="44" cy="23" r="2.5" fill="#7f8c8d"/>
    </svg>`;

    L.marker([-21.44566, -65.71886], {
      icon: L.divIcon({
        className: '',
        html: `<div style="transform:scaleX(-1)">${jeep4x4Svg}</div>`,
        iconSize: [54, 30],
        iconAnchor: [27, 38]   // centered horizontally, floats above the dot
      })
    })
    .addTo(map)
    .bindPopup(
      `<div class="popup-inner">
        <div class="popup-day" style="color:#2c3e50">🚙 Departure point</div>
        <div class="popup-name">La Torre Tours — Tupiza</div>
      </div>`,
      { className: 'map-popup', maxWidth: 200 }
    );

    // ── Fit map to show all points ─────────────────────────
    const allCoords = days.flatMap(d => d.stops.map(s => s.latlng));
    map.fitBounds(L.latLngBounds(allCoords), { padding: [32, 48] });

    // ── Legend toggle ──────────────────────────────────────
    const legendItems = document.querySelectorAll('.legend-item[data-day]');
    legendItems.forEach(item => {
      item.addEventListener('click', () => {
        const pl = polylines['day' + item.dataset.day];
        if (!pl) return;
        if (map.hasLayer(pl)) {
          map.removeLayer(pl);
          item.classList.add('faded');
        } else {
          pl.addTo(map);
          item.classList.remove('faded');
        }
      });
    });
  }

  initRouteMap();

  /* ──────────────────────────────────────────────────────────
     13. ITINERARY ACCORDION
  ────────────────────────────────────────────────────────── */
  const dayTriggers = document.querySelectorAll('.day-trigger');

  const expandAllBtn = document.getElementById('itineraryExpandAll');
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      const allExpanded = expandAllBtn.dataset.expanded === 'true';
      dayTriggers.forEach(t => {
        const panel = t.closest('.itinerary-day').querySelector('.day-panel');
        t.setAttribute('aria-expanded', allExpanded ? 'false' : 'true');
        panel.hidden = allExpanded;
      });
      expandAllBtn.dataset.expanded = allExpanded ? 'false' : 'true';
      expandAllBtn.querySelector('span').textContent = allExpanded ? 'Expand All Days' : 'Collapse All Days';
      expandAllBtn.querySelector('i').className = allExpanded ? 'fas fa-expand-alt' : 'fas fa-compress-alt';
    });
  }

  dayTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const article = trigger.closest('.itinerary-day');
      const panel   = article.querySelector('.day-panel');
      const isOpen  = trigger.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      } else {
        // Close all others
        dayTriggers.forEach(t => {
          if (t !== trigger) {
            t.setAttribute('aria-expanded', 'false');
            t.closest('.itinerary-day').querySelector('.day-panel').hidden = true;
          }
        });
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });

  /* ──────────────────────────────────────────────────────────
     MOBILE BOOK BAR — show when hero CTA scrolls out of view
  ────────────────────────────────────────────────────────── */
  const mobileBookBar = document.getElementById('mobileBookBtn');
  const heroCta       = document.getElementById('heroCta');

  if (mobileBookBar && heroCta) {
    new IntersectionObserver(([entry]) => {
      mobileBookBar.classList.toggle('mobile-book-bar--visible', !entry.isIntersecting);
    }, { threshold: 0 }).observe(heroCta);
  }

  /* ──────────────────────────────────────────────────────────
     INIT COMPLETE
  ────────────────────────────────────────────────────────── */
  console.log('[La Torre Tours] Page ready.');

})();
