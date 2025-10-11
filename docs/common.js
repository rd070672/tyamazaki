// // js/include.js
// document.addEventListener("DOMContentLoaded", () => {
//   /* --- ヘッダー・フッター読み込み --- */
//   fetch("header.html")
//     .then(res => res.text())
//     .then(html => { document.getElementById("header").innerHTML = html; })
//     .then(() => initScripts()); // ← 読み込み後にUI機能を初期化

//   fetch("footer.html")
//     .then(res => res.text())
//     .then(html => { document.getElementById("footer").innerHTML = html; });
// });

// /* ======================
//    UIスクリプト群
// ====================== */
// function initScripts() {
//   /* --- テーマ切替 --- */
//   const themeBtn = document.getElementById('btn-theme')?.closest('button') || document.getElementById('btn-theme');
//   themeBtn?.addEventListener('click', () => {
//     document.body.classList.toggle('dark');
//   });

//   /* --- ハンバーガーメニュー --- */
//   const hamBtn = document.querySelector('.nav__hamburger');
//   const navList = document.querySelector('.nav__list');
//   hamBtn?.addEventListener('click', () => {
//     navList?.classList.toggle('is-open');
//   });

//   /* --- ヒーロースライダー --- */
//   const hero = document.querySelector('.hero');
//   if (hero) {
//     const slides = Array.from(hero.querySelectorAll('.hero__slide'));
//     const prevBtn = hero.querySelector('.hero__nav.prev');
//     const nextBtn = hero.querySelector('.hero__nav.next');
//     const dotsWrap = hero.querySelector('.hero__dots');

//     let idx = 0;
//     let timer = null;
//     const INTERVAL_MS = 5000;

//     slides.forEach((_, i) => {
//       const b = document.createElement('button');
//       b.type = 'button';
//       b.setAttribute('aria-label', `Go to slide ${i+1}`);
//       b.addEventListener('click', () => show(i, true));
//       dotsWrap.appendChild(b);
//     });

//     function show(i, user = false) {
//       slides[idx].classList.remove('is-active');
//       idx = (i + slides.length) % slides.length;
//       slides[idx].classList.add('is-active');
//       dotsWrap.querySelectorAll('button').forEach((b, j) =>
//         b.setAttribute('aria-current', j === idx ? 'true' : 'false')
//       );
//       if (user) restart();
//     }
//     function next() { show(idx + 1); }
//     function prev() { show(idx - 1); }
//     function start() { timer = setInterval(next, INTERVAL_MS); }
//     function stop()  { clearInterval(timer); timer = null; }
//     function restart(){ stop(); start(); }

//     nextBtn?.addEventListener('click', next);
//     prevBtn?.addEventListener('click', prev);
//     hero.addEventListener('mouseenter', stop);
//     hero.addEventListener('mouseleave', start);

//     show(0);
//     start();
//   }

//   /* --- トップへ戻るボタン --- */
//   const toTop = document.querySelector('[data-to-top]');
//   if (toTop) {
//     const THRESHOLD = 300;
//     const toggle = () => {
//       if (window.scrollY > THRESHOLD) toTop.classList.add('show');
//       else toTop.classList.remove('show');
//     };
//     toggle();
//     window.addEventListener('scroll', toggle, { passive: true });
//     toTop.addEventListener('click', (e) => {
//       e.preventDefault();
//       const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//       window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
//     });
//   }
// }

/* =========================================================
   common.js  ―  どの階層のHTMLからでも動く共通読込 & 初期化
   使い方：
     ルート   : <script src="./common.js"></script>
     1階層下 : <script src="../common.js"></script>
     2階層下 : <script src="../../common.js"></script>
   必要な要素：
     <div id="header"></div>
     <div id="footer"></div>
   前提：
     common.js / header.html / footer.html は同じフォルダ（PARTIALS_DIRで変更可）
   ========================================================= */

// (() => {
//   // --- このスクリプト(common.js)のURLから“同じフォルダ”を基準にする ---
//   const thisScript =
//     document.currentScript ||
//     Array.from(document.getElementsByTagName('script')).find(s => s.src && /common\.js(?:\?.*)?$/i.test(s.src));

//   // common.js が読み込まれた実URLのディレクトリ
//   const BASE_URL = thisScript ? new URL('.', thisScript.src) : new URL('./', location.href);

//   // もし header/footer をサブフォルダに置くなら 'partials/' などに変更（末尾スラッシュ必須）
//   const PARTIALS_DIR = ''; // 例: 'partials/'

//   // 失敗時の代替表示を出すかどうか
//   const SHOW_FALLBACK = true;

//   // キャッシュ制御（開発中に更新が反映されない場合は 'no-cache'）
//   const FETCH_OPTIONS = { cache: 'no-cache' };

//   // --- DOM 準備ができたらヘッダー→UI初期化→フッターの順に処理 ---
//   document.addEventListener('DOMContentLoaded', async () => {
//     log(`[common.js] BASE_URL = ${BASE_URL.href} / PARTIALS_DIR = "${PARTIALS_DIR}"`);

//     // 1) ヘッダー読込（ヘッダー内の要素に依存するUIがあるため、読込後に初期化）
//     await safeInclude('#header', new URL(PARTIALS_DIR + 'header.html', BASE_URL));

//     // 2) 共通UI初期化（ナビ、テーマ切替、スライダー等）
//     initUI();

//     // 3) フッター読込（UI依存がなければ並列でも可。ここでは見通し優先で順次）
//     await safeInclude('#footer', new URL(PARTIALS_DIR + 'footer.html', BASE_URL));

//     // 4) すべてのパーシャルが揃った合図（必要なページ側があればlistening可能）
//     document.dispatchEvent(new CustomEvent('partials:ready'));
//   });

//   // =========================================================
//   //  ヘルパー：要素 selector に url のHTMLを挿入（エラー処理つき）
//   // =========================================================
//   async function safeInclude(selector, url) {
//     const host = document.querySelector(selector);
//     if (!host) {
//       warn(`[common.js] "${selector}" が見つかりません。挿入をスキップします。`);
//       return;
//     }
//     try {
//       log(`[common.js] fetch => ${url.href}`);
//       const res = await fetch(url, FETCH_OPTIONS);
//       if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
//       host.innerHTML = await res.text();
//       log(`[common.js] injected => ${selector}`);
//     } catch (e) {
//       error(`[common.js] include失敗: ${url.href}`, e);
//       if (SHOW_FALLBACK) {
//         if (selector === '#header') {
//           host.innerHTML = '<header style="padding:12px;background:#eee">Header failed to load</header>';
//         } else if (selector === '#footer') {
//           host.innerHTML = '<footer style="padding:12px;background:#eee">Footer failed to load</footer>';
//         }
//       }
//     }
//   }

//   // =========================================================
//   //  共通 UI 初期化（必要に応じて調整）
//   // =========================================================
//   function initUI() {
//     // 二重初期化防止
//     if (window.__uiInited) return;
//     window.__uiInited = true;

//     // --- テーマ切替 ---
//     const themeBtn = document.getElementById('btn-theme')?.closest('button') || document.getElementById('btn-theme');
//     themeBtn?.addEventListener('click', () => {
//       document.body.classList.toggle('dark');
//     });

//     // --- ハンバーガーメニュー ---
//     const hamBtn = document.querySelector('.nav__hamburger');
//     const navList = document.querySelector('.nav__list');
//     hamBtn?.addEventListener('click', () => {
//       navList?.classList.toggle('is-open');
//     });

//     // --- ヒーロースライダー ---
//     const hero = document.querySelector('.hero');
//     if (hero) {
//       const slides   = Array.from(hero.querySelectorAll('.hero__slide'));
//       const prevBtn  = hero.querySelector('.hero__nav.prev');
//       const nextBtn  = hero.querySelector('.hero__nav.next');
//       const dotsWrap = hero.querySelector('.hero__dots');

//       let idx = 0;
//       let timer = null;
//       const INTERVAL_MS = 5000;

//       // ドット生成
//       if (dotsWrap) {
//         slides.forEach((_, i) => {
//           const b = document.createElement('button');
//           b.type = 'button';
//           b.setAttribute('aria-label', `Go to slide ${i + 1}`);
//           b.addEventListener('click', () => show(i, true));
//           dotsWrap.appendChild(b);
//         });
//       }

//       function show(i, byUser = false) {
//         if (!slides.length) return;
//         slides[idx]?.classList.remove('is-active');
//         idx = (i + slides.length) % slides.length;
//         slides[idx]?.classList.add('is-active');
//         dotsWrap?.querySelectorAll('button').forEach((b, j) =>
//           b.setAttribute('aria-current', j === idx ? 'true' : 'false')
//         );
//         if (byUser) restart();
//       }
//       function next()    { show(idx + 1); }
//       function prev()    { show(idx - 1); }
//       function start()   { timer = setInterval(next, INTERVAL_MS); }
//       function stop()    { if (timer) { clearInterval(timer); timer = null; } }
//       function restart() { stop(); start(); }

//       nextBtn?.addEventListener('click', next);
//       prevBtn?.addEventListener('click', prev);
//       hero.addEventListener('mouseenter', stop);
//       hero.addEventListener('mouseleave', start);

//       show(0);
//       start();
//     }

//     // --- トップへ戻るボタン ---
//     const toTop = document.querySelector('[data-to-top]');
//     if (toTop) {
//       const THRESHOLD = 300;
//       const toggle = () => {
//         toTop.classList.toggle('show', window.scrollY > THRESHOLD);
//       };
//       toggle();
//       window.addEventListener('scroll', toggle, { passive: true });
//       toTop.addEventListener('click', (e) => {
//         e.preventDefault();
//         const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//         window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
//       });
//     }
//   }

//   // =========================================================
//   //  ログ（必要なければ log/warn/error を空関数にして無効化可）
//   // =========================================================
//   function log(...args)  { console.log(...args); }
//   function warn(...args) { console.warn(...args); }
//   function error(...args){ console.error(...args); }

// })();

/* =========================================================
   common.js  —  ヘッダー/フッター読み込み + 共通UI初期化
   前提：common.js / header.html / footer.html は同じフォルダ
   ページ側：<script src="./common.js"></script> もしくは ../, ../../ など
   ========================================================= */
(() => {
  // ========= 設定 =========
  const ENABLE_LOG   = true;          // false にするとログ抑制
  const SHOW_FALLBACK = true;         // 読込失敗時に簡易表示を入れる
  const FETCH_OPTIONS = { cache: 'no-cache' };
  const PARTIALS_DIR  = "";           // 例: "partials/"（末尾スラッシュ必須）
  const SITE_BASE     = "/";          // 例: "/" または "/your-project/"

  // ========= 参照パス（common.js の場所基準） =========
  const thisScript =
    document.currentScript ||
    Array.from(document.scripts).find(s => s.src && /common\.js(?:\?.*)?$/i.test(s.src));
  const BASE_URL = thisScript ? new URL(".", thisScript.src) : new URL("./", location.href);

  // ========= Main =========
  document.addEventListener("DOMContentLoaded", async () => {
    log(`[common.js] BASE_URL=${BASE_URL} PARTIALS_DIR="${PARTIALS_DIR}" SITE_BASE="${SITE_BASE}"`);

    // 1) ヘッダー読込 → 初期化 → active付与（ヘッダーDOMに依存するため await）
    await include("#header", new URL(PARTIALS_DIR + "header.html", BASE_URL));
    initUIOnce();
    fixHeaderLinks(SITE_BASE);
    setActiveNav(SITE_BASE);

    // 2) フッターは並列でもOK（ここでは順次で見通し重視）
    await include("#footer", new URL(PARTIALS_DIR + "footer.html", BASE_URL));

    // 3) 完了イベント（必要ならページ側で listen 可能）
    document.dispatchEvent(new CustomEvent("partials:ready"));
  });

  // ========= include helper =========
  async function include(selector, url) {
    const host = document.querySelector(selector);
    if (!host) {
      warn(`[common.js] "${selector}" が見つかりません。スキップ`);
      return;
    }
    try {
      log("[common.js] fetch =>", url.href);
      const res = await fetch(url, FETCH_OPTIONS);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      host.innerHTML = await res.text();
      log("[common.js] injected =>", selector);
    } catch (e) {
      error(`[common.js] include失敗: ${url.href}`, e);
      if (SHOW_FALLBACK) {
        host.innerHTML =
          selector === "#header"
            ? '<header style="padding:12px;background:#eee">Header failed to load</header>'
            : '<footer style="padding:12px;background:#eee">Footer failed to load</footer>';
      }
    }
  }

  // ========= active を自動付与 =========
  function setActiveNav(base = "/") {
    const header = document.querySelector("header");
    if (!header) return;

    // 現在パス（末尾スラッシュ揃え、index.html 除去）
    let now = normalizePath(location.pathname, base);

    const links = header.querySelectorAll(".nav__list a.link--nav");
    links.forEach(a => a.classList.remove("active"));

    let best = null;
    let bestLen = -1;
    links.forEach(a => {
      const raw = a.getAttribute("href");
      if (!raw || /^(https?:|mailto:|tel:|#)/i.test(raw)) return;
      const p = normalizePath(raw.startsWith("/") ? raw : base + raw, base);
      if (now.startsWith(p) && p.length > bestLen) {
        best = a;
        bestLen = p.length;
      }
    });

    // 最後に候補がなければ HOME を active
    if (!best) {
      best = Array.from(links).find(a => {
        const p = normalizePath(a.getAttribute("href") || "/", base);
        return p === normalizePath(base, base);
      });
    }
    best?.classList.add("active");
  }

  // ヘッダー内の相対リンクをベース付きの絶対パスに補正（任意）
  function fixHeaderLinks(base = "/") {
    const header = document.querySelector("header");
    if (!header) return;
    header.querySelectorAll("a[href]").forEach(a => {
      const href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return;
      if (!href.startsWith("/")) {
        a.setAttribute("href", (base.endsWith("/") ? base : base + "/") + href.replace(/^\.\//, ""));
      }
    });
  }

  function normalizePath(path, base = "/") {
    // 絶対化
    let p = path;
    if (!p.startsWith("/")) p = (base.endsWith("/") ? base : base + "/") + p;
    // index.html を除去、末尾スラッシュ付与
    p = p.replace(/index\.html$/i, "");
    if (!p.endsWith("/")) p += "/";
    return p;
  }

  // ========= UI 初期化（1回だけ） =========
  function initUIOnce() {
    if (window.__uiInited) return;
    window.__uiInited = true;

    // テーマ切替
    const themeBtn = document.getElementById("btn-theme")?.closest("button") || document.getElementById("btn-theme");
    themeBtn?.addEventListener("click", () => document.body.classList.toggle("dark"));

    // ハンバーガー
    const hamBtn = document.querySelector(".nav__hamburger");
    const navList = document.querySelector(".nav__list");
    hamBtn?.addEventListener("click", () => navList?.classList.toggle("is-open"));
    // メニューのリンクを押したら閉じる
    navList?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navList.classList.remove("is-open")));
    // ESCで閉じる
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") navList?.classList.remove("is-open");
    }, { passive: true });

    // ヒーロースライダー
    const hero = document.querySelector(".hero");
    if (hero) initHero(hero);

    // トップへ戻る
    const toTop = document.querySelector("[data-to-top]");
    if (toTop) {
      const THRESHOLD = 300;
      const toggle = () => toTop.classList.toggle("show", window.scrollY > THRESHOLD);
      toggle();
      window.addEventListener("scroll", toggle, { passive: true });
      toTop.addEventListener("click", e => {
        e.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      });
    }
  }

  function initHero(hero) {
    const slides   = Array.from(hero.querySelectorAll(".hero__slide"));
    const prevBtn  = hero.querySelector(".hero__nav.prev");
    const nextBtn  = hero.querySelector(".hero__nav.next");
    const dotsWrap = hero.querySelector(".hero__dots");

    let idx = 0, timer = null;
    const INTERVAL_MS = 5000;

    if (dotsWrap) {
      slides.forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `Go to slide ${i + 1}`);
        b.addEventListener("click", () => show(i, true));
        dotsWrap.appendChild(b);
      });
    }

    function show(i, byUser = false) {
      if (!slides.length) return;
      slides[idx]?.classList.remove("is-active");
      idx = (i + slides.length) % slides.length;
      slides[idx]?.classList.add("is-active");
      dotsWrap?.querySelectorAll("button").forEach((b, j) =>
        b.setAttribute("aria-current", j === idx ? "true" : "false")
      );
      if (byUser) { stop(); start(); }
    }
    function next()   { show(idx + 1); }
    function start()  { timer = setInterval(next, INTERVAL_MS); }
    function stop()   { if (timer) { clearInterval(timer); timer = null; } }

    nextBtn?.addEventListener("click", next);
    prevBtn?.addEventListener("click", () => show(idx - 1));
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start, { passive: true });

    show(0);
    start();
  }

  // ========= logs =========
  function log(...a){ if (ENABLE_LOG) console.log(...a); }
  function warn(...a){ if (ENABLE_LOG) console.warn(...a); }
  function error(...a){ console.error(...a); }
})();