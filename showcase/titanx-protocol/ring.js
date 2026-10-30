/* Ringen: canvas 2D, ingen biblioteker. De 24 xStocks gaar sakte rundt paa en ytre bane
   (alle 120 ville blitt et kaos); en valgt aksje fra de andre kategoriene glir inn fra banen.
   De som er valgt trekkes inn paa en indre ring og knyttes til mynten i midten med en streng
   som gebyrene vandrer langs. Klikk paa en skive for aa velge eller fjerne den. */
(() => {
  const host = document.getElementById('ring');
  const cv = document.getElementById('rc');
  const ctx = cv.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0, t0 = performance.now(), visible = true, raf = 0;
  let stocks = [], sel = [], nodes = [], hover = null;
  const img = {};
  const mark = new Image();
  mark.src = '/img/mark.png';

  function size() {
    W = host.clientWidth; H = host.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', size);
  size();

  function load(s) { if (!img[s.mint]) { const im = new Image(); im.src = s.logo; img[s.mint] = im; } }

  function setup(list, chosen) {
    stocks = list;
    sel = chosen;
    nodes = list.map((s, i) => {
      const feat = s.cat === 'xstock';
      if (feat || chosen.includes(s.mint)) load(s);
      const a = (i / list.length) * Math.PI * 2;
      return { s, feat, x: 0, y: 0, a, sc: 1, first: true };
    });
  }
  window.addEventListener('stonkz:ready', (e) => setup(e.detail.stocks, e.detail.sel));
  window.addEventListener('stonkz:change', (e) => { sel = e.detail.sel; nodes.forEach((nd) => { if (sel.includes(nd.s.mint)) load(nd.s); }); });
  // Aksjelisten kan vaere klar foer dette skriptet kjoerer; da kom hendelsen aldri.
  if (window.STONKZ && window.STONKZ.stocks.length) setup(window.STONKZ.stocks, window.STONKZ.sel.slice());

  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); });
  io.observe(host);

  function geometry() {
    const m = Math.min(W, H);
    const wide = W > 900;
    const R = wide ? Math.min(W * .3, H * .4) : Math.min(W * .4, H * .36);
    return { cx: wide ? W * .58 : W / 2, cy: wide ? H * .5 : H * .46, R, r: R * .55, cr: R * .2, dr: Math.max(16, Math.min(26, R * .085)), sr: Math.max(13, Math.min(22, R * .075)) };
  }

  function frame(now) {
    raf = 0;
    if (!visible) return;
    const t = (now - t0) / 1000;
    const g = geometry();
    const n = sel.length;
    const outer = nodes.filter((nd) => nd.feat && !sel.includes(nd.s.mint));
    const shown = nodes.filter((nd) => nd.feat || sel.includes(nd.s.mint));
    nodes.forEach((nd) => { if (!nd.feat && !sel.includes(nd.s.mint)) { nd.on = false; nd.first = true; } });
    ctx.clearRect(0, 0, W, H);

    // banene
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 245, 155,.08)';
    ctx.beginPath(); ctx.arc(g.cx, g.cy, g.R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = n ? 'rgba(0, 245, 155,.16)' : 'rgba(0, 245, 155,.06)';
    ctx.setLineDash(n ? [] : [3, 7]);
    ctx.beginPath(); ctx.arc(g.cx, g.cy, g.r, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // maalposisjoner
    outer.forEach((nd, i) => {
      const a = (i / outer.length) * Math.PI * 2 + t * .05;
      nd.tx = g.cx + Math.cos(a) * g.R; nd.ty = g.cy + Math.sin(a) * g.R; nd.on = false;
    });
    sel.forEach((m, i) => {
      const nd = nodes.find((x) => x.s.mint === m);
      if (!nd) return;
      const a = (i / n) * Math.PI * 2 - Math.PI / 2 - t * .08;
      nd.tx = g.cx + Math.cos(a) * g.r; nd.ty = g.cy + Math.sin(a) * g.r; nd.on = true;
    });
    shown.forEach((nd) => {
      if (nd.first && nd.feat) { nd.x = nd.tx; nd.y = nd.ty; }
      if (nd.first && !nd.feat) { const a = Math.atan2(nd.ty - g.cy, nd.tx - g.cx); nd.x = g.cx + Math.cos(a) * g.R * 1.15; nd.y = g.cy + Math.sin(a) * g.R * 1.15; }
      nd.first = false;
      nd.x += (nd.tx - nd.x) * .08; nd.y += (nd.ty - nd.y) * .08;
      const want = nd.on ? 1.25 : (hover === nd ? 1.12 : 1);
      nd.sc += (want - nd.sc) * .15;
    });

    // strengene fra de valgte til mynten, med gebyr-prikker som gaar innover
    shown.filter((nd) => nd.on).forEach((nd, i) => {
      const grad = ctx.createLinearGradient(nd.x, nd.y, g.cx, g.cy);
      grad.addColorStop(0, 'rgba(0, 245, 155,.55)'); grad.addColorStop(1, 'rgba(0, 245, 155,.12)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(nd.x, nd.y); ctx.lineTo(g.cx, g.cy); ctx.stroke();
      for (let k = 0; k < 2; k++) {
        const p = ((t * .35 + i * .13 + k * .5) % 1);
        const px = nd.x + (g.cx - nd.x) * p, py = nd.y + (g.cy - nd.y) * p;
        ctx.fillStyle = 'rgba(167, 243, 208,' + (1 - p) * .9 + ')';
        ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2); ctx.fill();
      }
    });

    // mynten i midten
    const pulse = 1 + Math.sin(t * 1.6) * .012;
    const cr = g.cr * pulse;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 245, 155,' + (n ? .35 : .18) + ')'; ctx.shadowBlur = 40;
    const cg = ctx.createRadialGradient(g.cx - cr * .3, g.cy - cr * .35, cr * .1, g.cx, g.cy, cr);
    cg.addColorStop(0, '#0e3828'); cg.addColorStop(1, '#04140d');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(g.cx, g.cy, cr, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = 'rgba(0, 245, 155,.45)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(g.cx, g.cy, cr, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(0, 245, 155,.14)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(g.cx, g.cy, cr * .82, 0, Math.PI * 2); ctx.stroke();
    if (mark.complete && mark.naturalWidth) { const s = cr * 1.3; ctx.drawImage(mark, g.cx - s / 2, g.cy - s / 2, s, s); }
    ctx.fillStyle = 'rgba(148, 163, 184, .9)'; ctx.font = '500 11px "Geist Mono", monospace'; ctx.textAlign = 'center';
    ctx.fillText(n ? n + ' OF 10' : 'TITAN INDEX', g.cx, g.cy + cr + 20);

    // skivene, ytre foerst saa de valgte ligger oeverst
    const draw = (nd) => {
      const r = (nd.on ? g.sr * 1.25 : g.dr) * (nd.sc / (nd.on ? 1.25 : 1));
      const im = img[nd.s.mint];
      ctx.save();
      ctx.globalAlpha = nd.on ? 1 : (n >= 10 ? .3 : .62);
      ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#0a1c14';
      ctx.beginPath(); ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = nd.on ? 1 : (n >= 10 ? .3 : .62);
      ctx.beginPath(); ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2); ctx.clip();
      if (im && im.complete && im.naturalWidth) ctx.drawImage(im, nd.x - r, nd.y - r, r * 2, r * 2);
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = nd.on ? 'rgba(0, 245, 155,.85)' : (hover === nd ? 'rgba(0, 245, 155,.6)' : 'rgba(0, 245, 155,.2)');
      ctx.lineWidth = nd.on ? 1.8 : 1;
      ctx.beginPath(); ctx.arc(nd.x, nd.y, r + 1, 0, Math.PI * 2); ctx.stroke();
      if (nd.on || hover === nd) {
        ctx.fillStyle = nd.on ? '#a7f3d0' : 'rgba(167, 243, 208,.8)'; ctx.font = '600 10.5px "Geist Mono", monospace'; ctx.textAlign = 'center';
        ctx.fillText(nd.s.symbol, nd.x, nd.y + r + 15);
      }
      nd.rr = r;
    };
    shown.filter((nd) => !nd.on).forEach(draw);
    shown.filter((nd) => nd.on).forEach(draw);

    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  // pekeren
  function at(e) {
    const b = cv.getBoundingClientRect();
    const x = e.clientX - b.left, y = e.clientY - b.top;
    let best = null;
    nodes.forEach((nd) => { if (!nd.feat && !sel.includes(nd.s.mint)) return; const d = Math.hypot(nd.x - x, nd.y - y); if (d <= (nd.rr || 20) + 4 && (!best || d < best.d)) best = { nd, d }; });
    return best ? best.nd : null;
  }
  cv.addEventListener('pointermove', (e) => { hover = at(e); host.classList.toggle('hit', !!hover); });
  cv.addEventListener('pointerleave', () => { hover = null; host.classList.remove('hit'); });
  cv.addEventListener('click', (e) => { const nd = at(e); if (nd && window.STONKZ) window.STONKZ.toggle(nd.s.mint); });
})();
