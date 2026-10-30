/* STONKZ-forsiden: velg opptil ti aksjer, se delingen, fortsett til lanseringen.
   Aksjelisten er assets/stocks/_list.json (alle aksjeparene StonkFun har, `py stonkz/tools/pairs.py`).
   Valget er mint-adresser, fordi samme ticker kan finnes hos flere utstedere (OPENAI, KALSHI).
   Ringen oeverst er ring.js og lytter paa 'stonkz:change'. */

const LAUNCH = './create.html';
const MAX = 10;
let CA = '';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 1400);
}

/* ------------------------------------------------------------- aksjene */
let STOCKS = [];
const byMint = (m) => STOCKS.find((x) => x.mint === m);
const logo = (s) => (s && s.logo ? s.logo.replace(/^\//, './') : '');
const nice = (s) => String(s.name || s.symbol).replace(/^SP500$/, 'the S&P 500').replace(/^Nasdaq$/, 'the Nasdaq 100');
const CATS = [['all', 'All'], ['xstock', 'xStock'], ['prestock', 'PreStock'], ['backpack', 'Sunrise'], ['tessera', 'Tessera']];
const inCat = (s, c) => c === 'all' || s.cat === c;
const hit = (s, term) => (s.symbol + ' ' + nice(s) + ' ' + s.label).toLowerCase().includes(term);
const short = (m) => m.slice(0, 4) + '…' + m.slice(-4);

/* ------------------------------------------------------------- valget */
let sel = [];
try { sel = JSON.parse(sessionStorage.getItem('stonkz.sel2') || '[]'); } catch (e) { sel = []; }

const STONKZ = window.STONKZ = {
  get stocks() { return STOCKS; },
  get sel() { return sel; },
  has: (m) => sel.includes(m),
  toggle(m) {
    if (!byMint(m)) return;
    if (sel.includes(m)) sel = sel.filter((x) => x !== m);
    else if (sel.length >= MAX) { toast('Maximum basket limit is 10 equities'); return; }
    else sel = sel.concat(m);
    try { sessionStorage.setItem('stonkz.sel2', JSON.stringify(sel)); } catch (e) { /* ingen lagring */ }
    render();
    window.dispatchEvent(new CustomEvent('stonkz:change', { detail: { sel: sel.slice() } }));
  },
};

function words() {
  const names = sel.map((m) => nice(byMint(m)));
  if (!names.length) return '';
  if (names.length === 1) return names[0];
  return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
}
const pct = (n) => (100 / n).toFixed(n > 3 ? 1 : 1).replace(/\.0$/, '') + '%';

/* ------------------------------------------------------------- tegn alt */
let q = '', sq = '', pcat = 'all', scat = 'all', sshow = 36;

function tabs(host, cur, set) {
  host.innerHTML = '';
  CATS.forEach(([id, label]) => {
    const n = STOCKS.filter((s) => inCat(s, id)).length;
    if (!n) return;
    const b = el(`<button class="${id === cur ? 'on' : ''}">${esc(label)}<span class="n">${n}</span></button>`);
    b.onclick = () => set(id);
    host.append(b);
  });
}
function render() {
  const n = sel.length;
  $('heron').textContent = `${n} of ${MAX} titan equities selected`;
  $('count').textContent = `${n} / ${MAX}`;
  $('count').classList.toggle('full', n >= MAX);

  // listen
  const term = q.trim().toLowerCase();
  const grid = $('sgrid');
  grid.innerHTML = '';
  tabs($('pcats'), term ? '' : pcat, (id) => { pcat = id; q = ''; $('q').value = ''; render(); });
  const rows = STOCKS.filter((s) => (term ? hit(s, term) : inCat(s, pcat)));
  if (!rows.length) grid.append(el('<span class="none">No stock matches that.</span>'));
  rows.forEach((s) => {
    const on = sel.includes(s.mint);
    const b = el(`<button class="${on ? 'on' : n >= MAX ? 'dim' : ''}" title="${esc(nice(s))} · ${esc(s.label)}">
      <img src="${logo(s)}" alt="" loading="lazy"><span><b>${esc(nice(s))}</b><small>${esc(s.symbol)} · ${esc(s.label)}</small></span><i>✓</i></button>`);
    b.onclick = () => STONKZ.toggle(s.mint);
    grid.append(b);
  });

  // slippen
  const sentence = $('sentence');
  if (!n) sentence.innerHTML = 'No equities selected yet. Choose your first titan above.';
  else sentence.innerHTML = `A TITAN index coin streaming automated dividends in <em>${esc(words())}</em>. Configure quote liquidity on the next step.`;
  const bar = $('bar');
  bar.innerHTML = '';
  sel.forEach((m) => bar.append(el(`<span><img src="${logo(byMint(m))}" alt=""></span>`)));
  for (let i = n; i < MAX; i++) bar.append(el('<span class="ghost"></span>'));
  const legs = $('legs');
  legs.innerHTML = '';
  if (!n) legs.append(el('<li class="hint">Holders receive continuous dividend streams in each selected equity.</li>'));
  sel.forEach((m, i) => {
    const s = byMint(m);
    const li = el(`<li><img src="${logo(s)}" alt=""><span class="n">${esc(nice(s))}</span><span class="t">${esc(s.symbol)}</span>
      <span class="p"></span><button class="x" title="Remove">×</button></li>`);
    li.querySelector('.x').onclick = () => STONKZ.toggle(m);
    legs.append(li);
  });
  $('go').href = LAUNCH + (n ? '?payout=' + sel.join(',') : '');
  $('go').classList.toggle('off', !n);

  drawFlow();
  drawTable();
}

/* ------------------------------------------------------------- flytskjemaet */
function drawFlow() {
  const svg = $('flow');
  const W = 1000, H = 420, cx = 110, cy = H / 2;
  const list = sel.length ? sel.map(byMint) : null;
  const n = list ? list.length : MAX;
  const gap = Math.min(40, (H - 40) / n);
  const y0 = cy - ((n - 1) * gap) / 2;
  let out = `<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#52b9e2" stop-opacity=".9"/><stop offset="1" stop-color="#8fd4f1" stop-opacity=".25"/></linearGradient>
    <clipPath id="cc"><circle cx="${cx}" cy="${cy}" r="46"/></clipPath></defs>`;
  // kurvene
  for (let i = 0; i < n; i++) {
    const y = y0 + i * gap;
    const x1 = cx + 60, x2 = 560, x3 = 890;
    out += `<path d="M${x1} ${cy} C ${x1 + 120} ${cy}, ${x2 - 160} ${y}, ${x2} ${y} L ${x3 - 40} ${y}" fill="none" stroke="${list ? 'url(#g)' : 'rgba(143,212,241,.14)'}" stroke-width="${list ? 2 : 1.5}" ${list ? '' : 'stroke-dasharray="4 6"'}/>`;
    // gebyr-prikk som gaar tilbake
    if (list) out += `<circle r="3.5" fill="#ccedf9"><animateMotion dur="${(3 + (i % 4) * .7).toFixed(1)}s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear" path="M${x1} ${cy} C ${x1 + 120} ${cy}, ${x2 - 160} ${y}, ${x2} ${y} L ${x3 - 40} ${y}"/></circle>`;
  }
  // mynten
  out += `<circle cx="${cx}" cy="${cy}" r="56" fill="#0a171f" stroke="rgba(143,212,241,.3)"/>
    <circle cx="${cx}" cy="${cy}" r="46" fill="#10222c"/>
    <image href="/img/mark-128.png" x="${cx - 30}" y="${cy - 30}" width="60" height="60"/>
    <text x="${cx}" y="${cy + 84}" text-anchor="middle" font-size="12" letter-spacing="2">YOUR COIN</text>`;
  // aksjene
  for (let i = 0; i < n; i++) {
    const y = y0 + i * gap, x = 890;
    if (list) {
      const s = list[i];
      out += `<clipPath id="p${i}"><circle cx="${x}" cy="${y}" r="15"/></clipPath>
        <image href="${logo(s)}" x="${x - 15}" y="${y - 15}" width="30" height="30" clip-path="url(#p${i})"/>
        <circle cx="${x}" cy="${y}" r="15.5" fill="none" stroke="rgba(143,212,241,.4)"/>
        <text x="${x + 24}" y="${y + 4}" font-size="11" fill="#ccedf9">${esc(s.symbol)}</text>`;
    } else {
      out += `<circle cx="${x}" cy="${y}" r="15" fill="none" stroke="rgba(143,212,241,.18)" stroke-dasharray="3 4"/>`;
    }
  }
  // tekst paa midten
  out += `<text x="560" y="${H - 14}" text-anchor="middle" font-size="11.5" letter-spacing="1.5">${list ? 'HOLDERS PAID IN ' + n + (n === 1 ? ' STOCK' : ' STOCKS') : 'HOLDERS STREAM UP TO 10 TITAN EQUITIES'}</text>
    <text x="${cx}" y="${cy - 72}" text-anchor="middle" font-size="11" letter-spacing="1.5">${list ? 'PAYS ' + n + (n === 1 ? ' STOCK' : ' STOCKS') : 'SELECT EQUITIES ABOVE'}</text>`;
  svg.innerHTML = out;
}

/* ------------------------------------------------------------- tabellen */
function drawTable() {
  const host = $('stable');
  host.innerHTML = '';
  const term = sq.trim().toLowerCase();
  tabs($('scats'), term ? '' : scat, (id) => { scat = id; sq = ''; $('sq').value = ''; sshow = 36; drawTable(); });
  const rows = STOCKS.filter((s) => (term ? hit(s, term) : inCat(s, scat)));
  const c = (id) => STOCKS.filter((s) => s.cat === id).length;
  $('scount').textContent = `${STOCKS.length} stocks: ${c('xstock')} xStocks, ${c('backpack')} from Sunrise, ${c('prestock')} PreStocks and ${c('tessera')} from Tessera. Tap one to add it to the coin.`;
  rows.slice(0, term ? rows.length : sshow).forEach((s) => {
    const on = sel.includes(s.mint);
    const r = el(`<div class="srow ${on ? 'on' : ''}"><img src="${logo(s)}" alt="" loading="lazy">
      <div><b>${esc(nice(s))}</b><small>${esc(s.symbol)} · ${esc(s.label)}</small></div><span class="m">${on ? 'paired' : short(s.mint)}</span></div>`);
    r.onclick = () => STONKZ.toggle(s.mint);
    host.append(r);
  });
  const more = $('smore');
  const left = term ? 0 : rows.length - sshow;
  more.hidden = left <= 0;
  more.textContent = `Show ${left} more`;
  more.onclick = () => { sshow = rows.length; drawTable(); };
}

/* ------------------------------------------------------------- coins */
async function loadCoins() {
  // Samme API som STONKY: /api/coins gir name, ticker, image, mint, quoteSymbol, payout [{symbol, mint}], feesSol, createdAt.
  const dep = $('dep');
  const ago = (ts) => { const x = Math.max(0, Date.now() / 1000 - ts); return x < 3600 ? Math.floor(x / 60) + 'm' : x < 86400 ? Math.floor(x / 3600) + 'h' : Math.floor(x / 86400) + 'd'; };
  try {
    const res = await fetch('api/coins.json').catch(() => fetch('./api/coins.json'));
    const data = await res.json();
    if (!data.ok || !data.coins || !data.coins.length) throw new Error('none');
    dep.innerHTML = '<div class="hdr"><span>Coin</span><span>Pays holders in</span><span>Fees</span><span>Age</span></div>';
    data.coins.forEach((c) => {
      const pays = (c.payout || []).map((a) => { const s = byMint(a.mint) || {}; return `<img src="${esc(s.logo || '')}" alt="" title="${esc(a.symbol || s.symbol || '')}">`; }).join('') || '<span class="mono">SOL</span>';
      dep.append(el(`<a class="r" href="/coin?mint=${encodeURIComponent(c.mint)}"><div class="cn"><img class="cimg" src="${esc(c.image || '')}" alt=""><div><b>${esc(c.name)}</b><small>${esc(c.ticker)} · ${esc(c.quoteSymbol || 'SOL')}</small></div></div>
        <div class="stk">${pays}</div><span class="mono">${Number(c.feesSol || 0).toFixed(4)} SOL</span><span class="age">${c.createdAt ? ago(c.createdAt) : ''}</span></a>`));
    });
  } catch (e) {
    dep.innerHTML = '<div class="empty">No indexes deployed yet. The first deployment will be featured here.</div>';
  }
}

/* ------------------------------------------------------------- CA */
// Settes med `py stonkz/set_ca.py <CA>` (Upstash), saa siden spoer hvert 4. sekund og pillen dukker opp uten deploy.
async function loadCA() {
  // Foerst Upstash via /api/ca; svarer den ikke (ingen noekler paa Vercel), brukes /ca.json fra siste deploy.
  let got = false;
  try {
    const res = await fetch('ca.json').catch(() => fetch('./api/ca.json'));
    const data = await res.json();
    if (data.ok) { CA = data.ca || ''; got = true; }
  } catch (e) { /* faller tilbake */ }
  if (!got || !CA) {
    try {
      const data = await fetch('./ca.json', { cache: 'no-store' }).then((r) => r.json());
      if (data.ca) CA = data.ca;
    } catch (e) { /* proev igjen om litt */ }
  }
  const b = $('ca');
  if (!CA) b.hidden = true;
  else {
    $('cav').textContent = CA.slice(0, 4) + '…' + CA.slice(-4);
    b.hidden = false;
    b.onclick = () => { navigator.clipboard.writeText(CA).then(() => toast('Titan Contract Address Copied')); };
  }
  setTimeout(loadCA, CA ? 60000 : 4000);
}

/* ------------------------------------------------------------- start */
(async () => {
  STOCKS = await fetch('./assets/stocks/_list.json').then((r) => r.json());
  sel = sel.filter(byMint);
  $('q').oninput = (e) => { q = e.target.value; render(); };
  $('sq').oninput = (e) => { sq = e.target.value; drawTable(); };
  render();
  window.dispatchEvent(new CustomEvent('stonkz:ready', { detail: { stocks: STOCKS, sel: sel.slice() } }));
  loadCoins();
  loadCA();
})();
