/* Felles hjelpere for undersidene. Ingen rammeverk, ingen bygg: sidene henter JSON
   fra /api og skriver ut det de faar. */

const api = async (path, body) => {
  const res = await fetch(path, body ? {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  } : undefined);
  const data = await res.json().catch(() => ({ ok: false, error: res.status >= 500
    ? 'The server took too long to answer. Check the coin list before you try again, the coin may already be live.'
    : 'The server sent something unreadable.' }));
  if (!data.ok) throw new Error(data.error || 'unknown error');
  return data;
};

const usd = (n, d) => {
  if (n === null || n === undefined || isNaN(n)) return '-';
  const abs = Math.abs(n);
  const dec = d !== undefined ? d : (abs >= 1000 ? 0 : abs >= 1 ? 2 : 4);
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
};
const sol = (n, d = 4) => (n === null || n === undefined || isNaN(n)) ? '-'
  : Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) + ' SOL';
const ago = (ts) => {
  const s = Math.max(0, Date.now() / 1000 - ts);
  if (s < 3600) return Math.floor(s / 60) + 'm';
  if (s < 86400) return Math.floor(s / 3600) + 'h';
  return Math.floor(s / 86400) + 'd';
};
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shortAddr = (a) => (a ? a.slice(0, 4) + '…' + a.slice(-4) : '');
const SOL_MINT = 'So11111111111111111111111111111111111111112';

/* ---------------------------------------------------------- lommebok
   Wallet Standard, uten web3.js: utvidelsene melder seg selv inn, vi ber om en
   signatur paa raa bytes, og nettsiden ser aldri en noekkel. */
const wallets = [];
try {
  const reg = { register: (...ws) => ws.forEach((w) => { if (!wallets.includes(w)) wallets.push(w); }) };
  addEventListener('wallet-standard:register-wallet', (e) => { try { e.detail(reg); } catch (x) {} });
  dispatchEvent(new CustomEvent('wallet-standard:app-ready', { detail: reg }));
} catch (e) {}

const BLOCKED = /metamask/i;
const okWallet = (w) => !!(w && w.features && w.features['standard:connect']
  && w.features['solana:signTransaction'] && Array.isArray(w.chains)
  && w.chains.some((c) => String(c).startsWith('solana:')) && !BLOCKED.test(w.name || ''));
const b64bytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const bytesB64 = (b) => btoa(String.fromCharCode(...new Uint8Array(b)));

const Wallet = {
  address: (() => { try { return sessionStorage.getItem('stonkz.wallet') || null; } catch (e) { return null; } })(),
  list: () => wallets.filter(okWallet),
  async connect() {
    const found = Wallet.list();
    if (!found.length) throw new Error('No Solana wallet found in this browser. Phantom, Solflare and Backpack all work.');
    const w = found.find((x) => x.name === 'Phantom') || found[0];
    await w.features['standard:connect'].connect();
    const pk = (w.accounts[0] || {}).address;
    if (!pk) throw new Error('The wallet did not hand over an account.');
    Wallet.address = pk;
    try { sessionStorage.setItem('stonkz.wallet', pk); } catch (e) {}
    Wallet.paint();
    return pk;
  },
  disconnect() {
    Wallet.address = null;
    try { sessionStorage.removeItem('stonkz.wallet'); } catch (e) {}
    Wallet.paint();
  },
  _pick() {
    for (const w of Wallet.list()) {
      const acc = (w.accounts || []).find((a) => a.address === Wallet.address);
      if (acc) return { w, acc };
    }
    return null;
  },
  async account(interactive = false) {
    if (!Wallet.address) return null;
    let sa = Wallet._pick();
    if (sa) return sa;
    for (const w of Wallet.list()) {
      try { await w.features['standard:connect'].connect({ silent: true }); } catch (e) {}
    }
    sa = Wallet._pick();
    if (sa || !interactive) return sa;
    for (const w of Wallet.list()) {
      try { await w.features['standard:connect'].connect(); } catch (e) {}
      sa = Wallet._pick();
      if (sa) return sa;
    }
    return null;
  },
  async ensure() {
    const sa = await Wallet.account(true);
    if (sa) {
      if (Wallet.address !== sa.acc.address) {
        Wallet.address = sa.acc.address;
        try { sessionStorage.setItem('stonkz.wallet', Wallet.address); } catch (e) {}
        Wallet.paint();
      }
      return Wallet.address;
    }
    const live = Wallet.list().flatMap((w) => (w.accounts || []).map((a) => a.address));
    if (live.length) {
      Wallet.address = live[0];
      try { sessionStorage.setItem('stonkz.wallet', Wallet.address); } catch (e) {}
      Wallet.paint();
      return Wallet.address;
    }
    Wallet.disconnect();
    return await Wallet.connect();
  },
  async sign(txB64) {
    const sa = await Wallet.account(true);
    if (!sa) throw new Error('The wallet is not handing out the account '
      + shortAddr(Wallet.address) + '. Open the wallet, make sure that account is selected, '
      + 'then press Connect wallet and try again.');
    const f = sa.w.features['solana:signTransaction'];
    const [out] = await f.signTransaction({ transaction: b64bytes(txB64), account: sa.acc, chain: 'solana:mainnet' });
    return bytesB64(out.signedTransaction);
  },
  async signMessage(text) {
    const sa = await Wallet.account(true);
    if (!sa) throw new Error('The wallet is not handing out the account ' + shortAddr(Wallet.address) + '.');
    const f = sa.w.features['solana:signMessage'];
    if (!f) throw new Error(sa.w.name + ' cannot sign a message. Phantom, Solflare and Backpack all can.');
    const [out] = await f.signMessage({ account: sa.acc, message: new TextEncoder().encode(text) });
    return bytesB64(out.signature);
  },
  paint() {
    const b = document.getElementById('walletbtn');
    if (!b) return;
    b.textContent = Wallet.address ? shortAddr(Wallet.address) : 'Connect wallet';
    b.title = Wallet.address ? 'Click to disconnect' : 'Connect a Solana wallet';
  },
};

let CA = '';

/* Navigasjon og bunn er like paa alle sidene. */
function chrome(active) {
  const links = [['/#pair', 'Basket'], ['/#stocks', 'Equities'], ['/#coins', 'Live Indexes'], ['/community', 'Governance'], ['/how', 'Docs']];
  document.body.prepend(el(`<header class="nav"><div class="wrap nav-in">
      <a class="brand" href="/"><img class="mark" src="./img/mark-128.png" alt=""><span>TITANX</span></a>
      <nav class="nav-links">${links.map(([h, t]) =>
        `<a href="${h}" class="${h === active ? 'on' : ''}">${t}</a>`).join('')}</nav>
      <div class="nav-right"><a class="xlink" href="https://x.com/StonkzTech" target="_blank" rel="noopener" aria-label="STONKZ on X" title="STONKZ on X"><img src="./assets/x.svg" alt="" width="16" height="16"></a><button class="ca" id="cabtn" title="Copy the contract address" hidden>
          <span class="k">CA</span><span class="v"></span></button>
        <button class="btn ghost" id="walletbtn">Connect wallet</button>
        <a class="btn" href="./create.html">Deploy Index</a></div>
    </div></header>`));
  document.body.append(el(`<footer class="wrap foot">
      <span>TITANX</span><a href="/#coins">Coins</a><a href="/#pairs">Pairs</a><a href="./create.html">Launch</a><a href="./how.html">Docs</a>
      <p class="disclaim">Coins launch on StonkFun's LaunchLab curve. The pair and the payout stocks are set at launch and
      cannot be changed. The fees are paid to whoever holds the coin at the time of each payout.</p>
    </footer>`));
  const b = document.getElementById('walletbtn');
  b.onclick = async () => {
    if (Wallet.address) return Wallet.disconnect();
    try { await Wallet.connect(); } catch (e) { alert(e.message); }
  };
  Wallet.paint();
  const ca = document.getElementById('cabtn');
  ca.onclick = async () => {
    const shown = ca.querySelector('.v');
    const was = shown.textContent;
    try { await navigator.clipboard.writeText(CA); } catch (e) {}
    shown.textContent = 'Copied';
    ca.classList.add('on');
    setTimeout(() => { shown.textContent = was; ca.classList.remove('on'); }, 1400);
  };
  const run = async () => {
    try {
      const v = ((await (await fetch('./api/ca.json', { cache: 'no-store' })).json()).ca || '').trim();
      if (v && v !== CA) { CA = v; ca.querySelector('.v').textContent = CA.slice(0, 4) + '…' + CA.slice(-5); ca.hidden = false; }
      if (!v && CA) { CA = ''; ca.hidden = true; }
    } catch (e) { /* proever igjen */ }
  };
  setTimeout(run, 200);
  setInterval(run, 4000);
}

function coinImg(c, size = 44) {
  return c.image ? `<img class="cimg" src="${esc(c.image)}" alt="" width="${size}" height="${size}" loading="lazy">`
    : `<div class="avatar">${esc(c.ticker.slice(0, 3))}</div>`;
}
const payoutLabel = (c) => ((c.payout || []).length ? c.payout.map((a) => a.symbol).join(' · ') : 'SOL');
