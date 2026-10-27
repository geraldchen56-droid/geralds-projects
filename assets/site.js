/* Shared behaviour for the home page and the project pages. */
(function () {
  var root = document.documentElement;
  var P = window.PROJECTS || [];
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var UTM = 'utm_source=projects-page';

  function withUtm(u) { return u + (u.indexOf('?') > -1 ? '&' : '?') + UTM; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hostOf(u) { try { return new URL(u).host; } catch (e) { return u; } }

  /* Footage: a still poster, with a short muted clip that plays on hover
     (or while in view on touch screens). Clips are free Mixkit footage. */
  function mediaHtml(p, loading, autoplay) {
    return '<figure class="media' + (autoplay ? ' auto' : '') + '">' +
      '<img src="/media/' + esc(p.slug) + '.jpg" alt="" width="864" height="1080" loading="' + loading + '" draggable="false">' +
      (reduce ? '' : '<video muted loop playsinline preload="' + (autoplay ? 'auto' : 'none') + '" poster="/media/' + esc(p.slug) + '.jpg" aria-hidden="true"' + (autoplay ? ' autoplay' : '') + '><source src="/media/' + esc(p.slug) + '.mp4" type="video/mp4"></video>') +
      '</figure>';
  }
  function play(fig) {
    var v = fig && fig.querySelector('video');
    if (!v) return;
    var pr = v.play();
    if (pr && pr.then) pr.then(function () { fig.classList.add('playing'); }).catch(function () {});
    else fig.classList.add('playing');
  }
  function stop(fig) {
    var v = fig && fig.querySelector('video');
    if (!v) return;
    fig.classList.remove('playing');
    v.pause();
    setTimeout(function () { if (!fig.classList.contains('playing')) { try { v.currentTime = 0; } catch (e) {} } }, 500);
  }
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function wireHover(scope) {
    if (reduce) return;
    var cards = scope.querySelectorAll('.card, a.next');
    if (canHover) {
      Array.prototype.forEach.call(cards, function (c) {
        var fig = c.querySelector('.media');
        c.addEventListener('pointerenter', function () { play(fig); });
        c.addEventListener('pointerleave', function () { stop(fig); });
        c.addEventListener('focus', function () { play(fig); });
        c.addEventListener('blur', function () { stop(fig); });
      });
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var fig = e.target.querySelector('.media');
          if (e.isIntersecting && e.intersectionRatio > 0.6) play(fig); else stop(fig);
        });
      }, { threshold: [0, 0.6, 1] });
      Array.prototype.forEach.call(cards, function (c) { io.observe(c); });
    }
  }

  /* Theme: the circle in the corner. Remembered on this device when storage allows. */
  var meta = document.querySelector('meta[name="theme-color"]');
  function paintTheme() {
    var light = root.getAttribute('data-theme') === 'light';
    var b = document.getElementById('theme');
    if (b) {
      b.setAttribute('aria-pressed', light ? 'true' : 'false');
      b.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
      b.title = light ? 'Dark mode' : 'Light mode';
    }
    if (meta) meta.setAttribute('content', light ? '#ECE6DF' : '#46441C');
  }
  var themeBtn = document.getElementById('theme');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('gp-theme', next); } catch (e) {}
    paintTheme();
  });
  paintTheme();

  /* Live Shanghai time */
  var clock = document.getElementById('clock');
  function tick() {
    if (!clock) return;
    var parts = {};
    try {
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    } catch (e) {
      var d = new Date(Date.now() + 8 * 3600e3);
      parts.hour = pad(d.getUTCHours()); parts.minute = pad(d.getUTCMinutes());
    }
    clock.innerHTML = esc(parts.hour) + '<span class="sep">:</span>' + esc(parts.minute);
    clock.setAttribute('datetime', parts.hour + ':' + parts.minute);
  }
  tick(); setInterval(tick, 15000);

  /* About panel */
  var about = document.getElementById('about');
  var opener = null;
  Array.prototype.forEach.call(document.querySelectorAll('[data-about-open]'), function (b) {
    b.addEventListener('click', function () {
      if (!about) return;
      opener = b;
      if (about.showModal) about.showModal(); else about.setAttribute('open', '');
      var c = about.querySelector('[data-about-close]'); if (c) c.focus();
    });
  });
  if (about) {
    Array.prototype.forEach.call(about.querySelectorAll('[data-about-close]'), function (b) {
      b.addEventListener('click', function () { if (about.close) about.close(); else about.removeAttribute('open'); });
    });
    about.addEventListener('close', function () { if (opener) opener.focus(); });
  }

  /* Home: the strip of covers */
  var strip = document.getElementById('strip');
  if (strip) {
    strip.innerHTML = P.map(function (p, i) {
      return '<a class="card" href="/' + esc(p.slug) + '" aria-label="' + esc(p.name) + ', ' + esc(p.kind) + '">' +
        '<p class="lbl">' + esc(p.name) + '</p>' +
        mediaHtml(p, i < 5 ? 'eager' : 'lazy', false) +
        '</a>';
    }).join('');

    var prev = document.getElementById('prev');
    var next = document.getElementById('next');

    function step() {
      var c = strip.querySelector('.card');
      if (!c) return 1;
      return c.getBoundingClientRect().width + parseFloat(getComputedStyle(strip).columnGap || 16);
    }
    function sync() {
      var max = strip.scrollWidth - strip.clientWidth;
      if (prev) prev.disabled = strip.scrollLeft <= 2;
      if (next) next.disabled = strip.scrollLeft >= max - 2;
    }
    function go(dir) {
      strip.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    strip.addEventListener('scroll', function () { window.requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener('resize', sync);
    document.addEventListener('keydown', function (e) {
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (about && about.open) return;
      if (e.key === 'ArrowRight') { go(1); }
      if (e.key === 'ArrowLeft') { go(-1); }
    });

    /* Drag to scroll with a mouse; touch and trackpads scroll natively. */
    var down = false, moved = false, sx = 0, sl = 0;
    strip.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = strip.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 5) { moved = true; strip.classList.add('dragging'); }
      if (moved) strip.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      setTimeout(function () { strip.classList.remove('dragging'); }, 0);
    });
    strip.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    sync();
    wireHover(strip);
  }

  /* Project page */
  var caseRoot = document.getElementById('case');
  if (caseRoot) {
    var slug = (new URLSearchParams(location.search).get('p') ||
      location.pathname.replace(/\/+$/, '').split('/').pop() || '').replace(/\.html$/, '').toLowerCase();
    var idx = -1;
    for (var i = 0; i < P.length; i++) if (P[i].slug === slug) { idx = i; break; }

    if (idx === -1) {
      document.title = 'Not found: Gerald Chen';
      caseRoot.innerHTML =
        '<section class="missing grid">' +
        '<h1 class="reveal">nothing here yet</h1>' +
        '<p class="reveal" style="--d:1">There is no project at this address. It may have been renamed.</p>' +
        '<a class="pill reveal" style="--d:2" href="/">See all projects</a>' +
        '</section>';
    } else {
      var p = P[idx], n = P[(idx + 1) % P.length];
      document.title = p.name + ': Gerald Chen';
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', p.what);

      var links = '<a class="pill solid" href="' + esc(withUtm(p.url)) + '" target="_blank" rel="noopener">Open ' + esc(p.name) + ' <span aria-hidden="true">↗</span></a>';
      if (p.code) links += '<a class="pill" href="' + esc(p.code) + '" target="_blank" rel="noopener">Code on GitHub <span aria-hidden="true">↗</span></a>';

      caseRoot.innerHTML =
        '<section class="case-top grid">' +
          '<div class="left">' +
            '<h1 class="case-title reveal" id="ctitle">' + esc(p.title) + '</h1>' +
            '<div class="case-meta reveal" style="--d:2">' +
              '<p class="lbl"><span>' + esc(p.name) + '</span><span>' + esc(p.year) + '</span></p>' +
              '<p class="lbl"><span>' + esc(p.kind) + '</span><a href="' + esc(withUtm(p.url)) + '" target="_blank" rel="noopener">' + esc(hostOf(p.url)) + '</a></p>' +
            '</div>' +
          '</div>' +
          mediaHtml(p, 'eager', true).replace('class="media auto"', 'class="media auto shot reveal" style="--d:1"') +
        '</section>' +
        '<section class="case-what grid"><p>' + esc(p.what) + '</p></section>' +
        '<section class="case-why grid">' +
          '<p class="lbl">Why I built it</p>' +
          '<p>' + esc(p.why) + '</p>' +
          '<div class="links">' + links + '</div>' +
        '</section>' +
        '<section class="case-wide">' +
          '<div class="panel"><div class="frame">' +
            '<div class="bar" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(hostOf(p.url)) + '</span></div>' +
            '<img src="/covers/' + esc(p.slug) + '-wide.jpg" alt="' + esc(p.name) + ' at full width" width="2200" height="1375" loading="lazy">' +
          '</div></div>' +
          '<p class="lbl caption">The live site, as it looks today</p>' +
        '</section>' +
        '<section class="case-next grid">' +
          '<p class="lbl">Next project</p>' +
          '<a class="next" href="/' + esc(n.slug) + '">' +
            '<span class="n">' + esc(n.title) + '</span>' +
            '<figure><img src="/media/' + esc(n.slug) + '.jpg" alt="" width="864" height="1080" loading="lazy"></figure>' +
          '</a>' +
        '</section>';

      /* Size the title so its longest word always fits the left half. */
      var t = document.getElementById('ctitle');
      var longest = p.title.split(/\s+/).reduce(function (a, w) { return Math.max(a, w.length); }, 0);
      function fit() {
        var w = t.parentNode.getBoundingClientRect().width;
        var size = Math.min(168, w / (longest * 0.5 + 0.4));
        if (window.innerWidth <= 640) size = Math.min(size, 96);
        t.style.setProperty('--tsize', Math.max(44, size) + 'px');
      }
      fit(); window.addEventListener('resize', fit);
      var top = caseRoot.querySelector('.shot');
      var tv = top && top.querySelector('video');
      if (tv) {
        tv.addEventListener('playing', function () { top.classList.add('playing'); });
        play(top);
      }
    }
  }

  /* Gentle fade out when moving between pages on this site */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || reduce || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    if (a.origin !== location.origin || a.getAttribute('href').charAt(0) === '#') return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(function () { location.href = a.href; }, 260);
  });
  window.addEventListener('pageshow', function () { document.body.classList.remove('leaving'); });

  /* The one load moment */
  requestAnimationFrame(function () { requestAnimationFrame(function () { document.body.classList.add('ready'); }); });
})();
