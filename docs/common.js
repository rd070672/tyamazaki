// js/include.js
document.addEventListener("DOMContentLoaded", () => {
  /* --- ヘッダー・フッター読み込み --- */
  fetch("header.html")
    .then(res => res.text())
    .then(html => { document.getElementById("header").innerHTML = html; })
    .then(() => initScripts()); // ← 読み込み後にUI機能を初期化

  fetch("footer.html")
    .then(res => res.text())
    .then(html => { document.getElementById("footer").innerHTML = html; });
});

/* ======================
   UIスクリプト群
====================== */
function initScripts() {
  /* --- テーマ切替 --- */
  const themeBtn = document.getElementById('btn-theme')?.closest('button') || document.getElementById('btn-theme');
  themeBtn?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });

  /* --- ハンバーガーメニュー --- */
  const hamBtn = document.querySelector('.nav__hamburger');
  const navList = document.querySelector('.nav__list');
  hamBtn?.addEventListener('click', () => {
    navList?.classList.toggle('is-open');
  });

  /* --- ヒーロースライダー --- */
  const hero = document.querySelector('.hero');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero__slide'));
    const prevBtn = hero.querySelector('.hero__nav.prev');
    const nextBtn = hero.querySelector('.hero__nav.next');
    const dotsWrap = hero.querySelector('.hero__dots');

    let idx = 0;
    let timer = null;
    const INTERVAL_MS = 5000;

    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to slide ${i+1}`);
      b.addEventListener('click', () => show(i, true));
      dotsWrap.appendChild(b);
    });

    function show(i, user = false) {
      slides[idx].classList.remove('is-active');
      idx = (i + slides.length) % slides.length;
      slides[idx].classList.add('is-active');
      dotsWrap.querySelectorAll('button').forEach((b, j) =>
        b.setAttribute('aria-current', j === idx ? 'true' : 'false')
      );
      if (user) restart();
    }
    function next() { show(idx + 1); }
    function prev() { show(idx - 1); }
    function start() { timer = setInterval(next, INTERVAL_MS); }
    function stop()  { clearInterval(timer); timer = null; }
    function restart(){ stop(); start(); }

    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);

    show(0);
    start();
  }

  /* --- トップへ戻るボタン --- */
  const toTop = document.querySelector('[data-to-top]');
  if (toTop) {
    const THRESHOLD = 300;
    const toggle = () => {
      if (window.scrollY > THRESHOLD) toTop.classList.add('show');
      else toTop.classList.remove('show');
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }
}