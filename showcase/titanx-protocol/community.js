/* Community-siden: logg inn ved aa signere én melding, post oensker og stem. Samme oppsett som Clump.
   Innloggingen er et token i localStorage som sendes som Authorization-header. */
(() => {
  const $ = (s) => document.querySelector(s);
  let token = null, me = null, wishes = [];
  try { token = localStorage.getItem('stonkz.token'); } catch (e) { /* lagring av */ }

  async function call(path, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch(path, body ? { method: 'POST', headers, body: JSON.stringify(body) } : { cache: 'no-store', headers });
    let d; try { d = await r.json(); } catch (e) { d = { ok: false, error: 'The server did not answer. Try again in a moment.' }; }
    return { status: r.status, ...d };
  }
  const fmtDate = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); };

  function setMe(w) {
    me = w;
    $('#wishSubmit').hidden = !w; $('#wishSignIn').hidden = !!w; $('#wishSignOut').hidden = !w;
    $('#wishWho').textContent = w ? 'Posting and voting as ' + shortAddr(w) + '.' : 'Sign in with your wallet to post and vote.';
    document.querySelectorAll('#wishForm input, #wishForm textarea').forEach((i) => { i.disabled = !w; });
  }
  function dropToken() { token = null; try { localStorage.removeItem('stonkz.token'); } catch (e) { /* lagring av */ } setMe(null); }

  async function signIn() {
    const err = $('#wishError'); err.textContent = '';
    try {
      const wallet = await Wallet.ensure();
      const n = await call('/api/auth/nonce', { wallet });
      if (!n.ok) throw new Error(n.error || 'The server did not answer.');
      const signature = await Wallet.signMessage(n.message);
      const v = await call('/api/auth/verify', { wallet, signature, nonce: n.nonce });
      if (!v.ok) throw new Error(v.error || 'The signature did not match.');
      token = v.token; try { localStorage.setItem('stonkz.token', token); } catch (e) { /* lagring av */ }
      setMe(wallet); load();
    } catch (e) { err.textContent = (e && e.message) || 'The wallet did not sign.'; }
  }

  function node(w, i) {
    const li = document.createElement('li');
    const lead = i === 0 && w.score > 0;
    li.className = 'wish' + (lead ? ' lead' : ''); li.dataset.id = w.id;
    li.innerHTML = `<span class="rank">${i + 1}</span><div class="body"><b>${esc(w.title)}</b>${w.text ? `<p>${esc(w.text)}</p>` : ''}` +
      `<span class="by"><span>${esc(w.wallet)}</span><span>${esc(fmtDate(w.created))}</span>${lead ? '<span class="tag ok">most wanted</span>' : ''}</span></div>` +
      `<div class="votes"><button class="vote up${w.mine === 1 ? ' on' : ''}" type="button" data-dir="1" aria-label="Thumbs up"><svg viewBox="0 0 12 12"><path fill="currentColor" d="M6 1l5 6H8v4H4V7H1z"/></svg><span>${w.up}</span></button>` +
      `<button class="vote down${w.mine === -1 ? ' on' : ''}" type="button" data-dir="-1" aria-label="Thumbs down"><svg viewBox="0 0 12 12"><path fill="currentColor" d="M6 11L1 5h3V1h4v4h3z"/></svg><span>${w.down}</span></button>` +
      `<span class="score${w.score > 0 ? ' pos' : w.score < 0 ? ' neg' : ''}">${w.score > 0 ? '+' : ''}${w.score}</span></div>`;
    return li;
  }
  const sort = () => wishes.sort((a, b) => (b.score - a.score) || (b.up - a.up) || (a.created < b.created ? -1 : 1));
  function render() {
    const el = $('#wishes'); el.innerHTML = '';
    wishes.forEach((w, i) => el.appendChild(node(w, i)));
    $('#wishesEmpty').hidden = wishes.length > 0;
    $('#wishCount').textContent = wishes.length ? `${wishes.length} wish${wishes.length === 1 ? '' : 'es'}, sorted by votes` : '';
  }
  async function load() {
    const d = await call('/api/wishes?limit=60');
    if (!d.ok) return;
    if (token && !d.me) dropToken(); else if (d.me && !me) setMe(d.me);
    const sig = JSON.stringify(d.wishes);
    if (sig === load.last) return;
    load.last = sig; wishes = d.wishes; render();
  }

  $('#wishes').addEventListener('click', async (e) => {
    const b = e.target.closest('.vote'); if (!b) return;
    if (!me) { signIn(); return; }
    const id = +b.closest('.wish').dataset.id, cur = wishes.find((w) => w.id === id);
    const dir = +b.dataset.dir, next = cur && cur.mine === dir ? 0 : dir;
    const d = await call('/api/wishes/vote', { id, dir: next });
    if (!d.ok) { if (d.status === 401) { dropToken(); signIn(); } else $('#wishError').textContent = d.error || 'The vote did not land. Try again.'; return; }
    wishes[wishes.findIndex((w) => w.id === id)] = d.wish; sort(); load.last = null; render();
  });
  $('#wishForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!me) { signIn(); return; }
    const f = new FormData(e.target), title = (f.get('title') || '').trim(), text = (f.get('text') || '').trim(), err = $('#wishError');
    if (title.length < 4) { err.textContent = 'Give the wish a title of at least four characters.'; return; }
    const btn = $('#wishSubmit'); btn.disabled = true;
    const d = await call('/api/wishes', { title, text });
    btn.disabled = false;
    if (!d.ok) { if (d.status === 401) dropToken(); err.textContent = d.error || 'Something went wrong. Try again.'; return; }
    err.textContent = ''; e.target.reset();
    wishes.push(d.wish); sort(); load.last = null; render();
  });
  $('#wishSignIn').addEventListener('click', signIn);
  $('#wishSignOut').addEventListener('click', dropToken);

  setMe(null);
  load(); setInterval(load, 10000);
})();
