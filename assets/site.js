/* Shared behaviour for the home page and the project pages. */
(function () {
  var root = document.documentElement;
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

  /* Everything below comes from /projects.json: order, sections and card settings. */
  function build(D) {
    var S = D.settings || {};
    var all = D.projects || [];
    var bySlug = {};
    all.forEach(function (p) { bySlug[p.slug] = p; });

    /* Sections in file order; each lists its projects in file order.
       Anything not placed in a section lands in "More" so nothing disappears. */
    var placed = {};
    var groups = (D.sections || []).map(function (s) {
      var items = (s.projects || []).map(function (slug) {
        if (!bySlug[slug]) { if (window.console) console.warn('projects.json: no project called "' + slug + '"'); return null; }
        placed[slug] = true;
        return bySlug[slug];
      }).filter(Boolean);
      return { id: s.id || '', title: s.title || '', note: s.note || '', items: items };
    });
    var rest = all.filter(function (p) { return !placed[p.slug]; });
    if (rest.length) groups.push({ id: 'more', title: 'More', note: '', items: rest });
    groups.forEach(function (g) { g.items = g.items.filter(function (p) { return !p.hidden; }); });
    groups = groups.filter(function (g) { return g.items.length; });
    groups.forEach(function (g, i) { g.num = pad(i + 1); if (!g.id) g.id = 'section-' + g.num; });

    var order = [];
    groups.forEach(function (g) { g.items.forEach(function (p) { order.push({ p: p, g: g }); }); });

    function cardHtml(p, i) {
      return '<a class="card' + (p.featured ? ' wide' : '') + '" href="/' + esc(p.slug) + '" aria-label="' + esc(p.name) + ', ' + esc(p.kind) + '">' +
        '<div class="card-lbl lbl"><span>' + esc(p.name) + '</span>' +
          (S.showKind !== false ? '<span class="kind">' + esc(p.kind) + '</span>' : '') +
          (p.status ? '<span class="tag">' + esc(p.status) + '</span>' : '') +
        '</div>' +
        mediaHtml(p, i < 5 ? 'eager' : 'lazy', false) +
        '</a>';
    }

    /* Home */
    var home = document.getElementById('home');
    if (home) {
      var per = Math.max(2, Math.min(4, parseInt(S.cardsPerRow, 10) || 4));
      home.style.setProperty('--per', per);
      var html = '';

      if (S.outline !== false) {
        html += '<nav class="outline grid reveal" style="--d:2" aria-label="Contents">' +
          '<p class="lbl">Contents</p>' +
          '<ol>' + groups.map(function (g) {
            return '<li><a class="o-head" href="#' + esc(g.id) + '">' +
                '<span class="lbl o-num">' + g.num + '</span>' +
                '<span class="o-title">' + esc(g.title) + '</span>' +
                '<span class="lbl o-count">' + g.items.length + '</span>' +
              '</a>' +
              '<p class="o-items lbl">' + g.items.map(function (p) {
                return '<a href="/' + esc(p.slug) + '">' + esc(p.name) + '</a>';
              }).join('') + '</p></li>';
          }).join('') + '</ol>' +
          '</nav>';
      }

      if (S.homeLayout === 'strip') {
        html += '<section class="strip-wrap reveal" style="--d:3" aria-label="Projects">' +
          '<div class="strip" id="strip" tabindex="0" aria-label="Projects, scroll sideways">' +
            order.map(function (o, i) { return cardHtml(o.p, i); }).join('') +
          '</div>' +
          '<div class="strip-foot grid"><div class="ctrl">' +
            '<button class="btn-round" id="prev" type="button" aria-label="Previous projects">&larr;</button>' +
            '<button class="btn-round" id="next" type="button" aria-label="Next projects">&rarr;</button>' +
          '</div></div></section>';
      } else {
        var n = 0;
        html += groups.map(function (g) {
          return '<section class="group" id="' + esc(g.id) + '" aria-labelledby="h-' + esc(g.id) + '">' +
            '<header class="group-head grid">' +
              '<p class="lbl">' + g.num + '</p>' +
              '<h2 id="h-' + esc(g.id) + '">' + esc(g.title) + '</h2>' +
              (g.note ? '<p class="note">' + esc(g.note) + '</p>' : '') +
            '</header>' +
            '<div class="cards">' + g.items.map(function (p) { return cardHtml(p, n++); }).join('') + '</div>' +
            '</section>';
        }).join('');
      }

      home.innerHTML = html;
      var strip = document.getElementById('strip');
      if (strip) wireStrip(strip);
      wireHover(home);
      if (location.hash) {
        var target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView();
      }
    }

    /* Project page */
    var caseRoot = document.getElementById('case');
    if (caseRoot) {
      var slug = (new URLSearchParams(location.search).get('p') ||
        location.pathname.replace(/\/+$/, '').split('/').pop() || '').replace(/\.html$/, '').toLowerCase();
      var p = bySlug[slug];

      if (!p) {
        document.title = 'Not found: Gerald Chen';
        caseRoot.innerHTML =
          '<section class="missing grid">' +
          '<h1 class="reveal">nothing here yet</h1>' +
          '<p class="reveal" style="--d:1">There is no project at this address. It may have been renamed.</p>' +
          '<a class="pill reveal" style="--d:2" href="/">See all projects</a>' +
          '</section>';
        return;
      }

      var pos = -1;
      for (var i = 0; i < order.length; i++) if (order[i].p.slug === slug) { pos = i; break; }
      var here = pos > -1 ? order[pos] : null;
      var nxt = order.length ? order[(pos + 1) % order.length].p : p;
      var crumb = '';
      if (here) {
        var k = here.g.items.indexOf(p) + 1;
        crumb = '<p class="lbl crumb reveal"><a href="/#' + esc(here.g.id) + '">' +
          here.g.num + ' &mdash; ' + esc(here.g.title) + '</a><span>' + pad(k) + ' / ' + pad(here.g.items.length) + '</span></p>';
      }

      document.title = p.name + ': Gerald Chen';
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', p.what);

      var links = '<a class="pill solid" href="' + esc(withUtm(p.url)) + '" target="_blank" rel="noopener">Open ' + esc(p.name) + ' <span aria-hidden="true">↗</span></a>';
      if (p.code) links += '<a class="pill" href="' + esc(p.code) + '" target="_blank" rel="noopener">Code on GitHub <span aria-hidden="true">↗</span></a>';

      caseRoot.innerHTML =
        '<section class="case-top grid">' +
          '<div class="left">' +
            crumb +
            '<h1 class="case-title reveal" id="ctitle">' + esc(p.title) + '</h1>' +
            '<div class="case-meta reveal" style="--d:2">' +
              '<p class="lbl"><span>' + esc(p.name) + '</span><span>' + esc(p.year) + (p.status ? ' &middot; ' + esc(p.status) : '') + '</span></p>' +
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
          '<a class="next" href="/' + esc(nxt.slug) + '">' +
            '<span class="n">' + esc(nxt.title) + '</span>' +
            '<figure><img src="/media/' + esc(nxt.slug) + '.jpg" alt="" width="864" height="1080" loading="lazy"></figure>' +
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

  /* The sideways strip (homeLayout "strip") */
  function wireStrip(strip) {
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
    function go(dir) { strip.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' }); }
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
  }

  fetch('/projects.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(build)
    .catch(function (e) {
      var where = document.getElementById('home') || document.getElementById('case');
      if (where) where.innerHTML = '<p class="lbl load-err grid"><span>Projects could not load. If you just edited projects.json, check it for a missing comma or quote.</span></p>';
      if (window.console) console.error('projects.json', e);
    });

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
