/* ============================================================
   LA TORRE TOURS — 4-Day Trip Tupiza to Uyuni
   script.js — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. DYNAMIC YEAR ──────────────────────────────────────── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ── 2. STICKY HEADER + BOOK NOW BUTTON ──────────────────── */
  const header     = document.getElementById('site-header');
  const bookBtn    = document.getElementById('header-book-btn');
  const SCROLL_THRESHOLD = 120;

  function onHeaderScroll() {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    header.classList.toggle('scrolled', scrolled);
    if (bookBtn) bookBtn.classList.toggle('visible', scrolled);
  }
  window.addEventListener('scroll', onHeaderScroll, { passive: true });
  onHeaderScroll(); // run once on load


  /* ── 3. MOBILE HAMBURGER MENU ─────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMain   = document.getElementById('nav-main');

  if (hamburger && navMain) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMain.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav on outside click
    document.addEventListener('click', e => {
      if (!header.contains(e.target)) {
        navMain.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close nav when a link is clicked
    navMain.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMain.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ── 4. SMOOTH SCROLL for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = window.innerWidth < 768 ? 64 : 72; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── 5. PHOTO CAROUSEL ────────────────────────────────────── */
  const track       = document.getElementById('carousel-track');
  const prevBtn     = document.getElementById('carousel-prev');
  const nextBtn     = document.getElementById('carousel-next');
  const dotsWrap    = document.getElementById('carousel-dots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    const slides    = Array.from(track.querySelectorAll('.carousel-slide'));
    let current     = 0;
    let autoTimer   = null;
    const AUTOPLAY  = 5000;

    // Build dot buttons
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Photo ${i + 1}`);
      dot.setAttribute('aria-selected', String(i === 0));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('.carousel-dot'));

    function goTo(index) {
      // Wrap around
      if (index < 0)             index = slides.length - 1;
      if (index >= slides.length) index = 0;

      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;

      dots.forEach((d, i) => {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', String(i === current));
      });

      // Update slide aria-labels for screen readers
      slides.forEach((s, i) => {
        s.setAttribute('aria-hidden', String(i !== current));
      });
    }

    function startAutoplay() {
      stopAutoplay();
      autoTimer = setInterval(() => goTo(current + 1), AUTOPLAY);
    }
    function stopAutoplay() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); startAutoplay(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); startAutoplay(); });

    // Pause on hover
    const wrapper = track.closest('.carousel-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAutoplay);
      wrapper.addEventListener('mouseleave', startAutoplay);
      wrapper.addEventListener('focusin',    stopAutoplay);
      wrapper.addEventListener('focusout',   startAutoplay);
    }

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
        startAutoplay();
      }
    }, { passive: true });

    // Keyboard support
    wrapper && wrapper.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Init
    goTo(0);
    startAutoplay();
  }


  /* ── 6. ITINERARY ACCORDIONS (open by default) ───────────── */
  const itineraryAccordions = document.querySelectorAll('.accordion');
  const expandAllBtn        = document.getElementById('expand-all-btn');
  let allExpanded = true; // start expanded

  function setAccordionState(accordion, open) {
    const btn     = accordion.querySelector('.accordion-header');
    const content = accordion.querySelector('.accordion-content');
    if (!btn || !content) return;

    accordion.classList.toggle('accordion--open', open);
    btn.setAttribute('aria-expanded', String(open));
    content.style.maxHeight = open ? content.scrollHeight + 'px' : '0';
  }

  // Ensure heights are set for all open ones
  itineraryAccordions.forEach(acc => {
    if (acc.classList.contains('accordion--open')) {
      const content = acc.querySelector('.accordion-content');
      if (content) content.style.maxHeight = content.scrollHeight + 'px';
    }

    const btn = acc.querySelector('.accordion-header');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = acc.classList.contains('accordion--open');
      setAccordionState(acc, !isOpen);

      // Update expand-all button label
      const anyOpen = Array.from(itineraryAccordions).some(a => a.classList.contains('accordion--open'));
      if (expandAllBtn) {
        allExpanded = anyOpen;
        expandAllBtn.textContent = anyOpen ? 'Collapse All ▲' : 'Expand All ▼';
      }
    });
  });

  // Expand / Collapse All
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      allExpanded = !allExpanded;
      itineraryAccordions.forEach(acc => setAccordionState(acc, allExpanded));
      expandAllBtn.textContent = allExpanded ? 'Collapse All ▲' : 'Expand All ▼';
    });
  }


  /* ── 7. PRICING TABS (Shared / Private) ──────────────────── */
  const pricingTabs   = document.querySelectorAll('.pricing-tab');
  const pricingPanels = document.querySelectorAll('.pricing-panel');

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      pricingTabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      pricingPanels.forEach(p => {
        const show = p.id === `pricing-${target}`;
        p.classList.toggle('hidden', !show);
      });
    });
  });

  /* ── 7b. GROUP SIZE TABS (Private: 2/3/4 people) ─────────── */
  const groupTabs   = document.querySelectorAll('.group-tab');
  const groupPanels = document.querySelectorAll('.group-panel');

  groupTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.group;

      groupTabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      groupPanels.forEach(p => {
        const show = p.id === `group-${target}`;
        p.classList.toggle('hidden', !show);
      });
    });
  });


  /* ── 8. FAQ ACCORDIONS (closed by default, one at a time) ─── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      faqItems.forEach(fi => {
        fi.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        fi.querySelector('.faq-answer').classList.remove('open');
        fi.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open this one if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  /* ── 9. CONTACT FORM ─────────────────────────────────────── */
  const form        = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const successEmail = document.getElementById('form-success-email');

  if (form && formSuccess) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const emailInput = form.querySelector('#f-email');
      const nameInput  = form.querySelector('#f-name');
      let valid = true;

      // Basic validation
      [nameInput, emailInput].forEach(input => {
        if (!input) return;
        if (!input.value.trim()) {
          input.classList.add('invalid');
          valid = false;
        } else {
          input.classList.remove('invalid');
        }
      });
      if (emailInput && emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        emailInput.classList.add('invalid');
        valid = false;
      }

      if (!valid) return;

      // Show success
      form.hidden = true;
      formSuccess.hidden = false;
      if (successEmail && emailInput) successEmail.textContent = emailInput.value;

      // Scroll to success message
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Remove invalid state on input
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => el.classList.remove('invalid'));
    });
  }


  /* ── 10. BACK TO TOP ─────────────────────────────────────── */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    function toggleBackToTop() {
      const show = window.scrollY > 300;
      backToTopBtn.classList.toggle('visible', show);
      backToTopBtn.hidden = !show;
    }
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ── 11. INTERSECTION OBSERVER — fade-in sections ────────── */
  const fadeEls = document.querySelectorAll('.fade-in-section');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    fadeEls.forEach(el => el.classList.add('visible'));
  }


  /* ── 12. LANGUAGE BUTTONS (visual feedback only) ─────────── */
  function initLangBtns(container) {
    if (!container) return;
    const btns = container.querySelectorAll('.lang-btn, .footer-lang-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        btns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      });
    });
  }

  initLangBtns(document.querySelector('.lang-selector'));
  initLangBtns(document.querySelector('.footer-lang'));

});
