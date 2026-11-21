/* Lead Base Pro — interactions (GSAP 3 + ScrollTrigger + Lenis, all local in js/vendor) */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const fine = matchMedia('(pointer: fine)').matches;

  /* ---------- split hero lines into letters (words stay unbroken) ---------- */
  $$('.split').forEach(el => {
    el.innerHTML = el.textContent.split(' ').map(w =>
      `<span class="wd">${[...w].map(c => `<span class="ch">${c}</span>`).join('')}</span>`).join(' ');
  });
  /* ---------- split section headings into words (keeps <em>) ---------- */
  $$('.split-lines').forEach(h => {
    const wrapWords = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(' '));
            const o = document.createElement('span'); o.className = 'wmask';
            o.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em';
            const i = document.createElement('span'); i.className = 'wi'; i.style.display = 'inline-block'; i.textContent = part;
            o.appendChild(i); frag.appendChild(o);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrapWords(n);
      });
    };
    wrapWords(h);
  });

  /* ---------- industries → form options ---------- */
  const biz = $('#bizSelect');
  $$('.ind__you').forEach(s => { const o = document.createElement('option'); o.textContent = s.textContent; biz.appendChild(o); });
  biz.appendChild(Object.assign(document.createElement('option'), { textContent: 'Something else' }));

  /* ==================== LOADER: liquid fill ==================== */
  const w1 = $('#wave1'), w2 = $('#wave2'), level = $('#liquidLevel'), lPct = $('#lPct');
  const wavePath = (t, amp, len, phase) => {
    let d = `M -20 ${Math.sin(phase + t) * amp}`;
    for (let x = -20; x <= 1020; x += 20) d += ` L ${x} ${Math.sin((x / len) * Math.PI * 2 + phase + t) * amp}`;
    return d + ' L 1020 280 L -20 280 Z';
  };
  const critical = $$('img').filter(i => i.loading !== 'lazy');
  let ready = 0; const total = critical.length + 1;
  const ok = () => ready++;
  critical.forEach(m => (m.complete && m.naturalWidth) ? ok() : m.addEventListener('load', ok, { once: true }));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(ok);

  const t0 = performance.now(), MIN = 2200, MAX = 6500;
  let p = 0, leaving = false;
  (function loop(now) {
    now = now || performance.now();
    const el = now - t0;
    let target = Math.min(ready / total, el / MIN);
    if (el > MAX) target = 1;
    p += (target - p) * .085;
    if (target === 1 && p > .97) p = 1;
    const t = el / 420;
    w1.setAttribute('d', wavePath(t, 10, 260, 0));
    w2.setAttribute('d', wavePath(t * 1.3, 13, 360, 2));
    level.setAttribute('transform', `translate(0, ${245 - p * 245})`);
    lPct.textContent = Math.round(p * 100);
    if (p >= 1 && !leaving) { leaving = true; setTimeout(leave, 250); }
    if (document.getElementById('loader')) requestAnimationFrame(loop);
  })();

  function leave() {
    const loader = $('#loader');
    const finish = () => { if (loader) loader.remove(); };

    // Smoothly kick off hero reveal right as the loader opens
    document.body.classList.remove('is-loading');
    start();

    if (hasGSAP && !reduce) {
      gsap.timeline({ onComplete: finish })
        .to('.loader__meta, .loader__ticker', { y: 20, autoAlpha: 0, duration: .35, ease: 'power2.in' })
        .to('.liquid', { scale: .92, duration: .4, ease: 'power2.in' }, '<')
        .to(loader, { clipPath: 'circle(0% at 50% 50%)', duration: 0.95, ease: 'expo.inOut' }, '-=.1');
    } else { loader.style.transition = 'opacity .5s'; loader.style.opacity = 0; setTimeout(finish, 520); }
  }

  /* ==================== MAIN ==================== */
  let lenis = null;
  const go = target => { const el = $(target); if (!el) return; lenis ? lenis.scrollTo(el, { duration: 1.6, offset: 0 }) : el.scrollIntoView({ behavior: 'smooth' }); };

  let started = false;
  function start() {
    if (started) return;
    started = true;
    setupUI();
    if (!hasGSAP || reduce) { root.classList.add('no-anim'); staticCounters(); return; }
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    const mm = gsap.matchMedia();

    /* ---- Hero intro: 3D letters rise ---- */
    gsap.fromTo('.hero__title .ch',
      { yPercent: 110, rotateX: -65, opacity: 0 },
      { yPercent: 0, rotateX: 0, opacity: 1, transformOrigin: '50% 100%', stagger: 0.015, duration: 1.2, ease: 'power3.out', delay: 0.1 }
    );
    gsap.fromTo('.hero__kicker, .hero__lede, .hero__actions, .hero__scroll, .header > *',
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 1.0, ease: 'power3.out', delay: 0.35 }
    );

    /* ---- Hero 3D deck ---- */
    const cards = $$('.deck__card');
    const rest = [
      { x: 0, y: 0, z: 0, rotationY: -16, rotationX: 6, rotationZ: -2 },
      { x: -150, y: 60, z: -160, rotationY: -22, rotationX: 8, rotationZ: -8 },
      { x: 60, y: 150, z: -280, rotationY: -10, rotationX: 10, rotationZ: 6 },
      { x: -260, y: -60, z: -420, rotationY: -26, rotationX: 4, rotationZ: -12 }
    ];
    cards.forEach((c, i) => gsap.set(c, { ...rest[i], zIndex: 10 - i }));
    gsap.fromTo(cards,
      { yPercent: 120, rotationX: 40, opacity: 0 },
      { yPercent: 0, rotationX: (i) => rest[i].rotationX, opacity: 1, stagger: { each: 0.1, from: 'end' }, duration: 1.4, ease: 'power3.out', delay: 0.15 }
    );

    mm.add('(min-width: 1001px)', () => {
      // scroll: deck explodes towards the viewer while the headline lifts away
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: '+=100%',
          scrub: 1,
          pin: true,
          pinSpacing: true
        }
      });
      const out = [
        { x: -480, y: -40, z: 380, rotationY: 18, rotationZ: -6 },
        { x: -120, y: -340, z: 240, rotationY: -30, rotationZ: 10 },
        { x: 220, y: 300, z: 280, rotationY: 34, rotationZ: -12 },
        { x: 340, y: -240, z: 140, rotationY: -40, rotationZ: 16 }
      ];
      cards.forEach((c, i) => {
        tl.fromTo(c,
          { x: rest[i].x, y: rest[i].y, z: rest[i].z, rotationY: rest[i].rotationY, rotationX: rest[i].rotationX, rotationZ: rest[i].rotationZ, opacity: 1 },
          { x: out[i].x, y: out[i].y, z: out[i].z, rotationY: out[i].rotationY, rotationX: out[i].rotationX, rotationZ: out[i].rotationZ, opacity: 0, ease: 'power2.in', duration: 1 },
          0
        );
      });
      tl.fromTo('.hero__inner',
        { yPercent: 0, opacity: 1 },
        { yPercent: -16, opacity: 0, ease: 'power1.in', duration: 0.65 },
        0.05
      );

      // pointer tilt on the deck stage
      const stage = $('#deckStage') || $('#deck');
      const rx = gsap.quickTo(stage, 'rotationX', { duration: 0.8, ease: 'power3' });
      const ry = gsap.quickTo(stage, 'rotationY', { duration: 0.8, ease: 'power3' });
      const onMove = e => {
        ry((e.clientX / innerWidth - 0.5) * 12);
        rx((e.clientY / innerHeight - 0.5) * -8);
      };
      addEventListener('pointermove', onMove);
      return () => removeEventListener('pointermove', onMove);
    });
    mm.add('(max-width: 1000px)', () => {
      gsap.to(cards, { yPercent: i => -12 - i * 8, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    });

    /* ---- Section headings: words flip up in 3D ---- */
    $$('.split-lines').forEach(h => {
      gsap.from($$('.wi', h), { yPercent: 110, rotationX: -70, transformOrigin: '50% 100%', stagger: .045, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
    });
    $$('.h2:not(.split-lines)').forEach(h => gsap.from(h, { y: 60, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } }));
    $$('.label').forEach(l => gsap.from(l, { x: -30, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: l, start: 'top 90%' } }));

    /* ---- Statement: text fills as you read, photo opens up ---- */
    gsap.to('.fill-text', { backgroundPosition: '0% 0', ease: 'none', scrollTrigger: { trigger: '.fill-text', start: 'top 78%', end: 'bottom 45%', scrub: true } });
    gsap.to('.statement__photo', { clipPath: 'inset(0% 0% 0% 0% round 34px)', ease: 'none', scrollTrigger: { trigger: '.statement__photo', start: 'top 90%', end: 'center 55%', scrub: true } });
    gsap.to('.statement__photo img', { scale: 1, ease: 'none', scrollTrigger: { trigger: '.statement__photo', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.statement__facts div', { x: 80, autoAlpha: 0, stagger: .12, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.statement__facts', start: 'top 85%' } });
    $$('.count').forEach(el => {
      const o = { v: 0 }, to = +el.dataset.to, pre = el.dataset.prefix || '';
      if (!to) { el.textContent = pre + '0'; return; }
      gsap.to(o, { v: to, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => { el.textContent = pre + Math.round(o.v).toLocaleString('en-IN'); } });
    });

    /* ---- Records: pinned horizontal side-scroll with 3D card entry ---- */
    mm.add('(min-width: 701px)', () => {
      const track = $('#recTrack');
      const dist = () => track.scrollWidth - innerWidth;
      const h = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.records', start: 'top top', end: () => '+=' + dist(), pin: '.records__pin', scrub: 1, invalidateOnRefresh: true,
          onUpdate: s => gsap.set('#recProgress', { width: s.progress * 100 + '%' }) }
      });
      $$('.rec').forEach(r => {
        gsap.fromTo(r, { rotationY: -20, z: -100, opacity: .7, transformPerspective: 1200, transformOrigin: '0% 50%' },
          { rotationY: 0, z: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: r, containerAnimation: h, start: 'left 100%', end: 'left 60%', scrub: true } });
        gsap.fromTo($('img', r), { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: r, containerAnimation: h, start: 'left right', end: 'right left', scrub: true } });
      });
    });
    mm.add('(max-width: 700px)', () => {
      gsap.from('.rec', { x: 120, autoAlpha: 0, stagger: .1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.records__track', start: 'top 85%' } });
    });

    /* ---- 3D flip card ---- */
    gsap.timeline({ scrollTrigger: { trigger: '.flip', start: 'top top', end: '+=120%', pin: '.flip__pin', scrub: 1 } })
      .fromTo('#flipCard', { rotationY: 0, rotationX: 12, rotationZ: -4, scale: .86 }, { rotationY: 90, rotationX: 4, rotationZ: 0, scale: 1, ease: 'power1.in', duration: 1 })
      .to('#flipCard', { rotationY: 180, rotationX: -6, rotationZ: 3, ease: 'power1.out', duration: 1 })
      .from('.flip__back dl div', { x: 40, autoAlpha: 0, stagger: .12, duration: .5 }, 1.3)
      .from('.flip__stamp', { scale: 0, rotation: -30, duration: .4, ease: 'back.out(3)' }, 1.8);

    /* ---- Process: image swaps with clip-path as each step takes focus ---- */
    const imgs = $$('.pimg'), num = $('#stepNum');
    $$('.pstep').forEach((s, i) => {
      ScrollTrigger.create({ trigger: s, start: 'top 62%', end: 'bottom 62%', onToggle: self => {
        if (!self.isActive) return;
        $$('.pstep').forEach(x => x.classList.toggle('is-on', x === s));
        imgs.forEach((im, k) => { im.classList.toggle('is-on', k <= i); im.style.zIndex = k; });
        num.textContent = String(i + 1).padStart(2, '0');
      } });
    });
    $$('.pstep')[0].classList.add('is-on');

    /* ---- Industries: rows slide in from the side ---- */
    gsap.from('.ind__row', { x: (i) => (i % 2 ? 120 : -120), autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: .06, scrollTrigger: { trigger: '.ind', start: 'top 80%' } });

    /* ---- Pricing: cards stand up in 3D ---- */
    gsap.from('.plan', { rotationX: -75, y: 140, z: -200, autoAlpha: 0, transformOrigin: '50% 100%', stagger: .1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '#plans', start: 'top 82%' } });

    /* ---- Marquee driven by scroll velocity ---- */
    const row = $('.marquee__row');
    let mx = 0, dir = -1, skew = gsap.quickTo(row, 'skewX', { duration: .5, ease: 'power3' });
    gsap.ticker.add(() => {
      const v = lenis ? lenis.velocity : 0;
      if (v) dir = v > 0 ? -1 : 1;
      mx += (0.6 + Math.min(Math.abs(v) * .35, 14)) * dir;
      const half = row.scrollWidth / 2;
      if (mx <= -half) mx += half; if (mx > 0) mx -= half;
      gsap.set(row, { x: mx });
      skew(gsap.utils.clamp(-12, 12, -v * .6));
    });

    /* ---- Gallery parallax + 3D entry ---- */
    $$('.g').forEach(g => {
      gsap.to(g, { yPercent: +g.dataset.speed * 2, ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from(g, { scale: .7, rotationY: 30, autoAlpha: 0, transformPerspective: 1000, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.gallery', start: 'top 80%' } });
    });

    /* ---- FAQ items slide up ---- */
    gsap.from('.qa', { y: 40, autoAlpha: 0, stagger: .07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.qa-list', start: 'top 85%' } });

    /* ---- Contact: photo opens in a circle ---- */
    gsap.to('#contactBg', { clipPath: 'circle(80% at 50% 50%)', ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top 85%', end: 'top 15%', scrub: true } });
    gsap.from('.form', { y: 80, rotationX: 20, autoAlpha: 0, transformPerspective: 1200, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.form', start: 'top 85%' } });

    /* ---- Footer word ---- */
    gsap.from('.footer__word > *', { yPercent: 100, rotationX: -60, autoAlpha: 0, stagger: .1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.footer__word', start: 'top 92%' } });

    /* ---- Header hide/show ---- */
    const header = $('#header');
    let lastY = 0;
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
      const y = s.scroll();
      header.classList.toggle('is-solid', y > 60);
      header.classList.toggle('is-hidden', y > lastY && y > 500 && !$('#drawer').classList.contains('is-open'));
      lastY = y;
    } });
    $$('.menu a').forEach(a => {
      const sec = $(a.getAttribute('href'));
      if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: s => s.isActive && $$('.menu a').forEach(x => x.classList.toggle('is-active', x === a)) });
    });

    /* ---- Floating image on industry rows ---- */
    if (fine) {
      const fl = $('#indFloat');
      const fx = gsap.quickTo(fl, 'x', { duration: .6, ease: 'power3' }), fy = gsap.quickTo(fl, 'y', { duration: .6, ease: 'power3' });
      const list = $('#indList');
      list.addEventListener('pointermove', e => { fx(e.clientX); fy(e.clientY); });
      $$('.ind__row').forEach(r => r.addEventListener('pointerenter', () => {
        if (innerWidth < 901) return;
        const src = $('img', r);
        const im = document.createElement('img');
        im.src = src.currentSrc || src.src; im.dataset.cdn = src.dataset.cdn; im.alt = '';
        fl.appendChild(im);
        gsap.fromTo(im, { clipPath: 'inset(100% 0 0 0)', scale: 1.3 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: .7, ease: 'expo.out' });
        while (fl.children.length > 3) fl.firstChild.remove();
        gsap.to(fl, { opacity: 1, scale: 1, rotation: gsap.utils.random(-6, 6), duration: .6, ease: 'expo.out' });
      }));
      list.addEventListener('pointerleave', () => gsap.to(fl, { opacity: 0, scale: .6, duration: .5, ease: 'expo.out' }));
      // preload thumbnails once the section is near
      ScrollTrigger.create({ trigger: '#industries', start: 'top bottom', once: true, onEnter: () => $$('.ind__thumb img').forEach(i => { i.loading = 'eager'; }) });
    }

    addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ==================== UI (works with or without GSAP) ==================== */
  function setupUI() {
    // anchor links
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href'); if (id.length < 2) return;
      e.preventDefault(); closeDrawer(); go(id);
    }));
    // drawer
    const burger = $('#burger'), drawer = $('#drawer');
    burger.addEventListener('click', () => { const o = drawer.classList.toggle('is-open'); burger.setAttribute('aria-expanded', o); o ? lenis?.stop() : lenis?.start(); });
    function closeDrawer() { drawer.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); lenis?.start(); }
    // FAQ: one open at a time
    $$('.qa').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.qa').forEach(o => o !== d && (o.open = false)); setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 50); }));
    // plan buttons preselect package
    const pkg = $('#pkgSelect');
    $$('[data-plan]').forEach(b => b.addEventListener('click', () => [...pkg.options].forEach(o => (o.selected = o.textContent === b.dataset.plan))));
    // form
    const form = $('#leadForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      let good = true;
      $$('[required]', form).forEach(f => {
        const bad = !f.value.trim() || (f.type === 'tel' && f.value.replace(/\D/g, '').length < 10);
        f.closest('.f').classList.toggle('bad', bad); if (bad) good = false;
      });
      if (!good) return $('.bad input, .bad select', form)?.focus();
      // TODO: send to your CRM / Google Sheet / WhatsApp here
      $('#formOk').hidden = false; $('button[type="submit"]', form).disabled = true;
    });
    $$('input, select', form).forEach(f => f.addEventListener('input', () => f.closest('.f')?.classList.remove('bad')));
    $('#yr').textContent = new Date().getFullYear();

    if (!fine || reduce) return;
    // custom cursor
    const cur = $('#cursor');
    if (window.gsap) {
      const cx = gsap.quickTo(cur, 'x', { duration: .25, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .25, ease: 'power3' });
      addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); });
    }
    $$('.rec, .deck__card, .g, .flip__card, .statement__photo').forEach(el => {
      el.addEventListener('pointerenter', () => cur.classList.add('is-view'));
      el.addEventListener('pointerleave', () => cur.classList.remove('is-view'));
    });
    $$('a, button, summary, select, input').forEach(el => {
      el.addEventListener('pointerenter', () => cur.classList.add('is-link'));
      el.addEventListener('pointerleave', () => cur.classList.remove('is-link'));
    });
    // magnetic buttons
    $$('[data-magnetic]').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      b.addEventListener('pointerleave', () => { b.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)'; b.style.transform = ''; setTimeout(() => (b.style.transition = ''), 600); });
    });
  }

  function staticCounters() { $$('.count').forEach(el => { el.textContent = (el.dataset.prefix || '') + (+el.dataset.to).toLocaleString('en-IN'); }); }
})();
