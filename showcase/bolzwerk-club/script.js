/**
 * BOLZWERK — Hallenfußball & Sportbar Österreich
 * Interactivity & Audio Synthesis (Zero Emojis, Pure SVG & Text)
 */

document.addEventListener('DOMContentLoaded', () => {
  initDrawer();
  initBookingBar();
  initCourtsTerminal();
  initVenuesButtons();
  initScoreboardTicker();
  initSoundEngine();
  initModals();
});

/* ==========================================================================
   1. Off-Canvas Mobile Drawer
   ========================================================================== */
function initDrawer() {
  const toggleBtn = document.getElementById('navToggle');
  const closeBtn = document.getElementById('drawerClose');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const links = document.querySelectorAll('.drawer-item, .btn-drawer-cta');

  if (!toggleBtn || !drawer || !closeBtn || !overlay) return;

  function open() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function close() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  links.forEach(l => l.addEventListener('click', close));
}

/* ==========================================================================
   2. Horizontal Booking Bar (Classic Hallenfußball)
   ========================================================================== */
function initBookingBar() {
  const tabs = document.querySelectorAll('.booking-type-tab');
  const quickForm = document.getElementById('quickForm');
  const eventForm = document.getElementById('eventForm');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (tab.dataset.type === 'quick') {
        quickForm.style.display = 'grid';
        eventForm.style.display = 'none';
      } else {
        quickForm.style.display = 'none';
        eventForm.style.display = 'grid';
      }
      playClickSound();
    });
  });

  // Set default date to today
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }

  // Stepper logic (5v5 = 10 Spieler default)
  let playerCount = 10;
  const minusBtn = document.getElementById('stepMinus');
  const plusBtn = document.getElementById('stepPlus');
  const display = document.getElementById('playerCountDisplay');
  const priceDisplay = document.getElementById('barPrice');
  const perPlayerDisplay = document.getElementById('barPerPlayer');

  function updatePrice() {
    // 90 Min Hallenplatz standard = 90,00 €
    const total = 90;
    const perPlayer = (total / playerCount).toFixed(2).replace('.', ',');
    if (display) {
      if (playerCount === 10) display.textContent = '10 Spieler (5v5)';
      else if (playerCount === 8) display.textContent = '8 Spieler (4v4)';
      else if (playerCount === 12) display.textContent = '12 Spieler (6v6)';
      else display.textContent = `${playerCount} Spieler`;
    }
    if (priceDisplay) priceDisplay.textContent = `${total.toFixed(2).replace('.', ',')} €`;
    if (perPlayerDisplay) perPlayerDisplay.textContent = `(${perPlayer} € / Kicker für 90 Min.)`;
  }

  if (minusBtn && plusBtn) {
    minusBtn.addEventListener('click', () => {
      if (playerCount > 6) {
        playerCount -= 2;
        updatePrice();
        playClickSound();
      }
    });

    plusBtn.addEventListener('click', () => {
      if (playerCount < 16) {
        playerCount += 2;
        updatePrice();
        playClickSound();
      }
    });
  }

  updatePrice();

  // Submission actions (ZERO EMOJIS)
  const submitQuick = document.getElementById('submitQuick');
  if (submitQuick) {
    submitQuick.addEventListener('click', () => {
      playKickSound();
      const loc = document.getElementById('bookVenue').value;
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;
      alert(`Servus! Dein Hallenplatz in ${loc.toUpperCase()} am ${date} um ${time} Uhr für ${playerCount} Kicker ist vorgemerkt.\n\n(Showcase-Demonstration: Buchungssystem voll einsatzbereit)`);
    });
  }

  const submitEvent = document.getElementById('submitEvent');
  if (submitEvent) {
    submitEvent.addEventListener('click', () => {
      playWhistleSound();
      const email = document.getElementById('eventEmail').value;
      if (!email || !email.includes('@')) {
        alert('Bitte gib eine gültige E-Mail-Adresse ein.');
        return;
      }
      alert(`Vielen Dank! Dein Firmenturnier-Angebot wurde an ${email} versendet.`);
    });
  }
}

/* ==========================================================================
   3. Interactive Courts Terminal (Hallenplätze Details)
   ========================================================================== */
const courtTerminalData = {
  standard: {
    title: 'Court 5 vs 5 (Standard)',
    desc: 'Ideal für 10 bis 12 Spieler. Die Rundumbande und Fangnetze bis unter die Hallendecke sorgen dafür, dass der Ball permanent im Spiel bleibt. Höchste Intensität ohne Pause.',
    dim: '30 x 15 M',
    sub: '4G KUNSTRASEN • 1,20M RUNDUMBANDE'
  },
  pro: {
    title: 'Court 7 vs 7 (Großfeld)',
    desc: 'Perfekt für größere Teams und Vereine. Ausreichend Raum für taktische Kombinationen, weite Pässe und schnelle Konter. Gelenkschonend gefedert.',
    dim: '42 x 22 M',
    sub: 'GROSSFELD-COURT • OFFIZIELLE HALLENFUSSBALL-TORE'
  },
  turnier: {
    title: 'Turnier-Modus',
    desc: 'Bucht zwei oder drei Courts parallel mit zentraler Spielzeituhr, Hallensprecher-Anlage und Live-Ergebnisanzeige in der Sportbar.',
    dim: 'BIS ZU 4 COURTS',
    sub: 'PARALLEL-SPIELBETRIEB FÜR FIRMEN & VEREINE'
  },
  ausruestung: {
    title: 'Schuhe, Leibchen & Bälle',
    desc: 'Zu jeder Platzbuchung stellen wir frische Leibchen in zwei Teamfarben und offizielle Hallenfußbälle bereit. Schuhe: Hallensohle oder Multinocken (TF).',
    dim: 'INKLUSIVE',
    sub: 'LEIBCHEN, BÄLLE & DUSCHEN IM PREIS ENTHALTEN'
  }
};

function initCourtsTerminal() {
  const tabs = document.querySelectorAll('.mode-tab-item');
  const title = document.getElementById('terminalTitle');
  const desc = document.getElementById('terminalDesc');
  const speed = document.getElementById('radarSpeed');
  const eventText = document.getElementById('radarEvent');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const data = courtTerminalData[tab.dataset.modename];
      if (data) {
        if (title) title.textContent = data.title;
        if (desc) desc.textContent = data.desc;
        if (speed) speed.textContent = data.dim;
        if (eventText) eventText.textContent = data.sub;

        playKickSound();
      }
    });
  });
}

/* ==========================================================================
   4. Venues Card Action
   ========================================================================== */
function initVenuesButtons() {
  const btns = document.querySelectorAll('.btn-tile-book');
  const venueSelect = document.getElementById('bookVenue');
  const bookingSec = document.getElementById('booking');

  btns.forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      const v = b.dataset.venue;
      if (venueSelect && v) {
        venueSelect.value = v;
      }
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
      }
      playClickSound();
    });
  });
}

/* ==========================================================================
   5. Scoreboard Live Counter Bump
   ========================================================================== */
function initScoreboardTicker() {
  const digits = document.querySelectorAll('#scoreboardDigits .digit-box');
  if (!digits.length) return;

  setInterval(() => {
    const last = digits[digits.length - 1];
    let val = parseInt(last.textContent, 10) || 0;
    val = (val + 1) % 10;
    last.textContent = val;
  }, 4000);
}

/* ==========================================================================
   6. Sound Engine (Procedural Web Audio API)
   ========================================================================== */
let audioCtx = null;
let soundOn = true;

function initSoundEngine() {
  const toggle = document.getElementById('soundToggle');
  const iconOn = document.getElementById('soundIconOn');
  const iconOff = document.getElementById('soundIconOff');

  if (toggle && iconOn && iconOff) {
    toggle.addEventListener('click', () => {
      soundOn = !soundOn;
      if (soundOn) {
        iconOn.style.display = 'inline-block';
        iconOff.style.display = 'none';
        playClickSound();
      } else {
        iconOn.style.display = 'none';
        iconOff.style.display = 'inline-block';
      }
    });
  }
}

function getCtx() {
  if (!audioCtx) {
    const CtxClass = window.AudioContext || window.webkitAudioContext;
    if (CtxClass) audioCtx = new CtxClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playKickSound() {
  if (!soundOn) return;
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.19);
  } catch (e) {}
}

function playClickSound() {
  if (!soundOn) return;
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {}
}

function playWhistleSound() {
  if (!soundOn) return;
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.setValueAtTime(2800, ctx.currentTime + 0.06);
    osc.frequency.setValueAtTime(2600, ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.23);
  } catch (e) {}
}

/* ==========================================================================
   7. Modals
   ========================================================================== */
function initModals() {
  const modal = document.getElementById('legalModal');
  const close = document.getElementById('modalClose');
  const title = document.getElementById('modalTitleText');
  const content = document.getElementById('modalContentArea');

  const linkImp = document.getElementById('linkImpressum');
  const linkDat = document.getElementById('linkDatenschutz');
  const linkAgb = document.getElementById('linkAgb');
  const btnMenu = document.getElementById('openMenuModal');

  if (!modal || !close) return;

  function show(t, html) {
    if (title) title.textContent = t;
    if (content) content.innerHTML = html;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function hide() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  close.addEventListener('click', hide);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hide();
  });

  if (linkImp) {
    linkImp.addEventListener('click', (e) => {
      e.preventDefault();
      show('Impressum & Offenlegung (§ 5 ECG)', `
        <p><strong>BOLZWERK Österreich Hallenfußball GmbH</strong><br>Waldsteingartenstraße 135, 1020 Wien</p>
        <p><strong>Firmenbuch:</strong> FN 582194 x | Handelsgericht Wien<br><strong>UID:</strong> ATU78923412<br><strong>Kammer:</strong> WKO Wien (Sport- & Freizeitbetriebe)</p>
        <p><strong>Showcase:</strong> Demonstration des Digitalstudios AnonymCreator.</p>
      `);
    });
  }

  if (linkDat) {
    linkDat.addEventListener('click', (e) => {
      e.preventDefault();
      show('Datenschutzerklärung (DSGVO)', `
        <p>Wir verarbeiten deine Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2021). Bei Platzbuchungen werden Daten ausschließlich zur Spielkoordination gespeichert.</p>
      `);
    });
  }

  if (linkAgb) {
    linkAgb.addEventListener('click', (e) => {
      e.preventDefault();
      show('Hallenordnung & Spielregeln', `
        <p>1. Schuhwerk: Nur flache Hallenschuhe, Tausendfüßler (TF) oder normale Turnschuhe. Stollen- und feste FG-Nockenschuhe sind auf dem Kunstrasen verboten.</p>
        <p>2. Stornierung: Kostenlos bis 24 Stunden vor Spielbeginn online möglich.</p>
      `);
    });
  }

  if (btnMenu) {
    btnMenu.addEventListener('click', () => {
      show('Sportbar Speisekarte (Auszug)', `
        <h4>Burger & Schmankerl</h4>
        <p>• <strong>Wiener Schnitzel vom Schwein:</strong> Mit Zitrone, Preiselbeeren & Pommes frites — 13,80 €</p>
        <p>• <strong>Der Bolzer Smash Burger:</strong> Bio-Rind, Vorarlberger Bergkäse, geschmorte Zwiebeln & Pommes — 14,90 €</p>
        <p>• <strong>Kross-Erdäpfel Wedges:</strong> Mit Rosmarin-Salz & Schnittlauch-Dip — 6,50 €</p>
        <h4 style="margin-top:1rem;">Bier vom Fass & Spritzer</h4>
        <p>• <strong>Gezapftes Stiegl Goldbräu (Krügerl 0,5l):</strong> 4,90 €</p>
        <p>• <strong>Trumer Pils / Ottakringer Zwickl (Krügerl 0,5l):</strong> 4,90 €</p>
        <p>• <strong>Kaiserspritzer (0,5l):</strong> Grüner Veltliner, Holler & Soda — 5,40 €</p>
      `);
    });
  }
}
