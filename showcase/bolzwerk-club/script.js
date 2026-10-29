/**
 * BOLZWERK — Social Football & Craft Club
 * Sixes-Engineered Interactivity & Sound Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  initDrawer();
  initBookingBar();
  initModesTerminal();
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
   2. Horizontal Booking Bar (Sixes Signature)
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

  // Date default to today
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }

  // Stepper logic
  let playerCount = 6;
  const minusBtn = document.getElementById('stepMinus');
  const plusBtn = document.getElementById('stepPlus');
  const display = document.getElementById('playerCountDisplay');
  const priceDisplay = document.getElementById('barPrice');
  const perPlayerDisplay = document.getElementById('barPerPlayer');

  function updatePrice() {
    // 90 Min standard cage: 99€ up to 8 players, +6€ per additional player
    let total = 99;
    if (playerCount > 8) {
      total += (playerCount - 8) * 6;
    }
    const perPlayer = (total / playerCount).toFixed(2).replace('.', ',');
    if (display) display.textContent = `${playerCount} Spieler`;
    if (priceDisplay) priceDisplay.textContent = `${total.toFixed(2).replace('.', ',')} €`;
    if (perPlayerDisplay) perPlayerDisplay.textContent = `(${perPlayer} € / Kicker)`;
  }

  if (minusBtn && plusBtn) {
    minusBtn.addEventListener('click', () => {
      if (playerCount > 2) {
        playerCount--;
        updatePrice();
        playClickSound();
      }
    });

    plusBtn.addEventListener('click', () => {
      if (playerCount < 16) {
        playerCount++;
        updatePrice();
        playClickSound();
      }
    });
  }

  updatePrice();

  // Submission actions
  const submitQuick = document.getElementById('submitQuick');
  if (submitQuick) {
    submitQuick.addEventListener('click', () => {
      playKickSound();
      const loc = document.getElementById('bookVenue').value;
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;
      alert(`⚽ Leiwand! Dein Käfig in ${loc.toUpperCase()} am ${date} um ${time} Uhr für ${playerCount} Kicker ist vorgemerkt.\n\n(Showcase-Demonstration: Buchungssystem voll einsatzbereit)`);
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
      alert(`🎉 Vielen Dank! Dein Gruppenangebot wurde an ${email} versendet.`);
    });
  }
}

/* ==========================================================================
   3. Interactive Modes Terminal
   ========================================================================== */
const modeTerminalData = {
  speedball: {
    title: 'Radar Speedball',
    desc: 'Jeder Spieler hat 5 Schüsse auf das Tor. Unser Doppler-Radar erfasst Anlauf, Schusswinkel und Geschwindigkeit auf die Dezimale genau. Wer holt den Tagessieg an der Bar?',
    speed: '104 KM/H',
    event: 'VOLLTREFFER! RECHTES KREUZ'
  },
  precision: {
    title: 'Kreuz-Präzision',
    desc: 'Auf der Torwand leuchten digitale Ziele in den vier Ecken auf. Wer trifft die Winkel, während die Uhr rückwärts tickt? Präzision schlägt reine Hufkraft.',
    speed: '82 KM/H',
    event: 'KREUZECK OBEN LINKS! +750 PKT'
  },
  penalty: {
    title: 'Elfer-Krimi',
    desc: 'Simuliertes Elfmeterschießen unter vollem Stadionlärm. Eine reaktive Torwand versucht deinen Schuss zu parieren. Verwandle oder trage den Spott deiner Freunde.',
    speed: '96 KM/H',
    event: 'TOR! FLACH INS ECK'
  },
  team: {
    title: 'Team-Staffel',
    desc: 'Zwei Teams treten im direkten Stafetten-Modus an. Bälle müssen mit Direktabnahmen in vorgegebene Zonen gekickt werden. Tempo und Absprache entscheiden.',
    speed: '68 KM/H',
    event: 'TEAM ROT IN FÜHRUNG!'
  }
};

function initModesTerminal() {
  const tabs = document.querySelectorAll('.mode-tab-item');
  const title = document.getElementById('terminalTitle');
  const desc = document.getElementById('terminalDesc');
  const speed = document.getElementById('radarSpeed');
  const eventText = document.getElementById('radarEvent');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const data = modeTerminalData[tab.dataset.modename];
      if (data) {
        if (title) title.textContent = data.title;
        if (desc) desc.textContent = data.desc;
        if (speed) speed.textContent = data.speed;
        if (eventText) eventText.textContent = data.event;

        // Toggle random active target
        const targets = document.querySelectorAll('.radar-target');
        targets.forEach(t => t.classList.remove('active'));
        const pick = targets[Math.floor(Math.random() * targets.length)];
        if (pick) pick.classList.add('active');

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
    // Occasionally bump the last digit
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
  const icon = document.getElementById('soundIcon');

  if (toggle && icon) {
    toggle.addEventListener('click', () => {
      soundOn = !soundOn;
      icon.textContent = soundOn ? '🔊' : '🔇';
      if (soundOn) playClickSound();
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
        <p><strong>BOLZWERK Österreich Entertainment GmbH</strong><br>Waldsteingartenstraße 135, 1020 Wien</p>
        <p><strong>Firmenbuch:</strong> FN 582194 x | Handelsgericht Wien<br><strong>UID:</strong> ATU78923412<br><strong>Kammer:</strong> WKO Wien (Gastronomie & Freizeit)</p>
        <p><strong>Showcase:</strong> Demonstration des Digitalstudios AnonymCreator.</p>
      `);
    });
  }

  if (linkDat) {
    linkDat.addEventListener('click', (e) => {
      e.preventDefault();
      show('Datenschutzerklärung (DSGVO)', `
        <p>Wir verarbeiten deine Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2021). Bei Reservierungen werden Daten ausschließlich zur Terminkoordination genutzt.</p>
      `);
    });
  }

  if (linkAgb) {
    linkAgb.addEventListener('click', (e) => {
      e.preventDefault();
      show('Hausordnung & Spielregeln', `
        <p>1. Schuhe: Nur normale Turnschuhe oder Sneaker. Stollen- und Nockenschuhe sind verboten.</p>
        <p>2. Stornierung: Kostenfrei bis 24 Stunden vor Spielbeginn.</p>
      `);
    });
  }

  if (btnMenu) {
    btnMenu.addEventListener('click', () => {
      show('Speise- & Getränkekarte (Auszug)', `
        <h4>Burger & Schmankerl</h4>
        <p>• <strong>Der Bolzer Smash Burger:</strong> Bio-Rind, Vorarlberger Bergkäse, Haus-Sauce — 14,90 €</p>
        <p>• <strong>Schnitzel-Bites im Korb:</strong> Kaisersemmel-Panier, Preiselbeeren & Steirischer Kren — 9,90 €</p>
        <p>• <strong>Kross-Erdäpfel Wedges:</strong> Rosmarin-Salz & Schnittlauch-Sauerrahm — 6,80 €</p>
        <h4 style="margin-top:1rem;">Bier & Spritzer</h4>
        <p>• <strong>Gezapftes Stiegl / Trumer (Krügerl 0,5l):</strong> 4,90 €</p>
        <p>• <strong>Kaiserspritzer (0,5l):</strong> Grüner Veltliner, Holler, Soda — 5,40 €</p>
      `);
    });
  }
}
