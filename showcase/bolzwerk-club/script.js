/**
 * BOLZWERK — Social Football & Craft Club
 * Interactive Engine & UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initBookingWidget();
  initGameModes();
  initMenuTabs();
  initStandorteSelect();
  initFaqAccordion();
  initLegalModals();
  initAudioSynthesizer();
});

/* ==========================================================================
   1. Mobile Drawer Navigation (Touch Safe & Body Scroll Lock)
   ========================================================================== */
function initMobileDrawer() {
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!mobileToggle || !mobileDrawer || !drawerCloseBtn) return;

  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', openDrawer);
  drawerCloseBtn.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on outside touch
  document.addEventListener('click', (e) => {
    if (mobileDrawer.classList.contains('open') && 
        !mobileDrawer.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. Booking Engine (Dynamic Calculation & Stepper)
   ========================================================================== */
function initBookingWidget() {
  // Tabs
  const bookingTabs = document.querySelectorAll('.booking-tab');
  const quickForm = document.getElementById('quickBookingForm');
  const groupForm = document.getElementById('groupBookingForm');

  bookingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      bookingTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      if (tab.dataset.tab === 'quick') {
        quickForm.classList.add('active');
        groupForm.classList.remove('active');
      } else {
        groupForm.classList.add('active');
        quickForm.classList.remove('active');
      }
      playKickSound();
    });
  });

  // Stepper for Players
  const playersInput = document.getElementById('bookPlayers');
  const decBtn = document.getElementById('decPlayers');
  const incBtn = document.getElementById('incPlayers');
  const durationSelect = document.getElementById('bookDuration');
  const totalPriceDisplay = document.getElementById('totalPriceDisplay');
  const perPlayerDisplay = document.getElementById('perPlayerDisplay');

  // Set default date to today
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }

  function calculatePrice() {
    if (!playersInput || !durationSelect || !totalPriceDisplay || !perPlayerDisplay) return;
    const players = parseInt(playersInput.value, 10) || 6;
    const duration = parseInt(durationSelect.value, 10) || 90;

    // Base cage rates: 60m = 70€, 90m = 99€, 120m = 125€
    let basePrice = 99;
    if (duration === 60) basePrice = 70;
    else if (duration === 90) basePrice = 99;
    else if (duration === 120) basePrice = 125;

    // Above 8 players: small surcharge per additional player (5€)
    let finalTotal = basePrice;
    if (players > 8) {
      finalTotal += (players - 8) * 5;
    }

    const perPlayer = (finalTotal / players).toFixed(2).replace('.', ',');
    totalPriceDisplay.textContent = `${finalTotal.toFixed(2).replace('.', ',')} €`;
    perPlayerDisplay.textContent = `Nur ${perPlayer} € pro Kicker`;
  }

  if (decBtn && incBtn && playersInput) {
    decBtn.addEventListener('click', () => {
      let current = parseInt(playersInput.value, 10) || 6;
      if (current > 2) {
        playersInput.value = current - 1;
        calculatePrice();
        playClickSound();
      }
    });

    incBtn.addEventListener('click', () => {
      let current = parseInt(playersInput.value, 10) || 6;
      if (current < 16) {
        playersInput.value = current + 1;
        calculatePrice();
        playClickSound();
      }
    });
  }

  if (durationSelect) {
    durationSelect.addEventListener('change', () => {
      calculatePrice();
      playClickSound();
    });
  }

  calculatePrice();

  // Submission Mock Actions
  const submitQuick = document.getElementById('submitQuickBook');
  if (submitQuick) {
    submitQuick.addEventListener('click', () => {
      playKickSound();
      const loc = document.getElementById('bookLocation').value;
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;
      const count = document.getElementById('bookPlayers').value;
      
      alert(`⚽ Leiwand! Dein Käfig in ${loc.toUpperCase()} am ${date} um ${time} Uhr für ${count} Kicker ist vorgemerkt.\n\n(Showcase-Demonstration: Buchungssystem voll einsatzbereit)`);
    });
  }

  const submitGroup = document.getElementById('submitGroupBook');
  if (submitGroup) {
    submitGroup.addEventListener('click', () => {
      playWhistleSound();
      const email = document.getElementById('groupEmail').value;
      if (!email || !email.includes('@')) {
        alert('Bitte gib eine gültige E-Mail-Adresse ein.');
        return;
      }
      alert(`🎉 Vielen Dank! Dein Gruppenangebot wurde an ${email} versendet. Unser Event-Team meldet sich innerhalb von 2 Stunden.`);
    });
  }
}

/* ==========================================================================
   3. Interactive Game Mode Switcher
   ========================================================================== */
const gameModeData = {
  radar: {
    tag: 'BELIEBTESTER MODUS',
    title: 'Radar Speedball',
    desc: 'Jeder Spieler hat 5 Versuche. Hochpräzise Doppler-Radarsensoren messen Abschlagwinkel und Schussgeschwindigkeit auf den Zehntelkilometer genau. Am Ende kürt das System den Scharfschützen der Runde.',
    speed: '104 KM/H',
    status: 'VOLLEY-TREFFER!',
    specs: [
      '<span>Schwierigkeitsgrad:</span> Für jeden machbar — reine Schusskraft',
      '<span>Spieldauer:</span> ca. 10–15 Minuten pro Durchgang',
      '<span>Highlight:</span> Slow-Motion-Wiederholung auf dem Monitor'
    ]
  },
  precision: {
    tag: 'PRÄZISIONS-CHALLENGE',
    title: 'Kreuz-Präzision',
    desc: 'In den vier Ecken des Tors leuchten digitale LED-Ziele auf. Wer trifft die Winkel, während die Uhr rückwärts tickt? Geschicklichkeit schlägt rohe Gewalt.',
    speed: '78 KM/H',
    status: 'KREUZECK! +750 PKT',
    specs: [
      '<span>Schwierigkeitsgrad:</span> Mittel — Feingefühl & Technik gefragt',
      '<span>Spieldauer:</span> 60 Sekunden Non-Stop Action pro Spieler',
      '<span>Highlight:</span> Akustisches Torwand-Feedback bei Treffern'
    ]
  },
  penalty: {
    tag: 'NERVENSCHLACHT',
    title: 'Elfer-Krimi',
    desc: 'Simuliertes Elfmeterschießen unter vollem Stadionlärm. Eine reaktive Projektions-Torwand versucht deinen Schuss zu parieren. Verwandle oder ertrage das Raunen der Menge.',
    speed: '89 KM/H',
    status: 'TOR! UNTEN RECHTS',
    specs: [
      '<span>Schwierigkeitsgrad:</span> Variabel (3 Torwart-Schwierigkeitsstufen)',
      '<span>Spieldauer:</span> 5 Schüsse im direkten K.O.-Duell',
      '<span>Highlight:</span> Echter Stadionkommentar über die Soundanlage'
    ]
  },
  team: {
    tag: 'PERFEKT FÜR GRUPPEN',
    title: 'Team-Staffel',
    desc: 'Zwei Teams treten gegeneinander an. Der Ball muss im Stafetten-Modus mit Direktabnahmen in markierte Zielzonen gespielt werden. Teamgeist und schneller Antritt entscheiden.',
    speed: '65 KM/H',
    status: 'TEAM ROT FÜHRT!',
    specs: [
      '<span>Schwierigkeitsgrad:</span> Leicht bis Hoch — Teamplay zählt',
      '<span>Spieldauer:</span> 20 Minuten Turnierspiel',
      '<span>Highlight:</span> Automatische Tabelle auf dem Hauptbildschirm'
    ]
  }
};

function initGameModes() {
  const modeButtons = document.querySelectorAll('.mode-nav-btn');
  const modeTag = document.getElementById('modeTag');
  const modeTitle = document.getElementById('modeTitle');
  const modeDesc = document.getElementById('modeDesc');
  const modeSpecs = document.getElementById('modeSpecs');
  const hudSpeed = document.getElementById('hudSpeedVal');
  const hudStatus = document.getElementById('hudStatusVal');

  if (!modeButtons.length || !modeTitle) return;

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modeKey = btn.dataset.mode;
      const data = gameModeData[modeKey];
      if (!data) return;

      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      modeTag.textContent = data.tag;
      modeTitle.textContent = data.title;
      modeDesc.textContent = data.desc;
      hudSpeed.textContent = data.speed;
      hudStatus.textContent = data.status;

      modeSpecs.innerHTML = data.specs.map(s => `<li>${s}</li>`).join('');

      // Random target highlight in pitch mockup
      const targets = document.querySelectorAll('.goal-target');
      targets.forEach(t => t.classList.remove('active'));
      const randomTarget = targets[Math.floor(Math.random() * targets.length)];
      if (randomTarget) randomTarget.classList.add('active');

      playKickSound();
    });
  });
}

/* ==========================================================================
   4. Menu Category Tabs (Speis & Trank)
   ========================================================================== */
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab-btn');
  const cards = document.querySelectorAll('.menu-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.cat;
      cards.forEach(card => {
        if (card.dataset.category === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      playClickSound();
    });
  });
}

/* ==========================================================================
   5. Standorte Selector Sync
   ========================================================================== */
function initStandorteSelect() {
  const cards = document.querySelectorAll('.standort-card');
  const bookSelect = document.getElementById('bookLocation');

  cards.forEach(card => {
    const btn = card.querySelector('.btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const city = card.dataset.city;
        if (bookSelect && city) {
          bookSelect.value = city;
          const widget = document.getElementById('booking');
          if (widget) {
            widget.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  });
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
        playClickSound();
      }
    });
  });
}

/* ==========================================================================
   7. Legal Modals (Impressum, Datenschutz, AGB)
   ========================================================================== */
function initLegalModals() {
  const modal = document.getElementById('legalModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const openImpressum = document.getElementById('openImpressum');
  const openDatenschutz = document.getElementById('openDatenschutz');
  const openAgb = document.getElementById('openAgb');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (!modal || !closeBtn) return;

  function showModal(title, content) {
    if (modalTitle) modalTitle.textContent = title;
    if (content && modalBody) modalBody.innerHTML = content;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      hideModal();
    }
  });

  if (openImpressum) {
    openImpressum.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('Impressum & Offenlegung (§ 5 ECG)', `
        <h4>Angaben gemäß § 5 ECG und § 25 Mediengesetz:</h4>
        <p><strong>BOLZWERK Österreich Entertainment GmbH</strong><br>
        Waldsteingartenstraße 135, 1020 Wien, Österreich</p>
        <p><strong>Firmenbuchnummer:</strong> FN 582194 x<br>
        <strong>Firmenbuchgericht:</strong> Handelsgericht Wien<br>
        <strong>UID-Nummer:</strong> ATU78923412<br>
        <strong>Kammer:</strong> Wirtschaftskammer Wien (Gastronomie & Freizeit)</p>
        <p><strong>Showcase-Status:</strong> Dies ist eine fiktive Demonstration des Digitalstudios AnonymCreator zur Demonstration moderner Sport- und Gastronomie-Websites in Österreich.</p>
      `);
    });
  }

  if (openDatenschutz) {
    openDatenschutz.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('Datenschutzerklärung (DSGVO)', `
        <h4>1. Datenschutz auf einen Blick</h4>
        <p>Wir verarbeiten deine Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2021). Bei Reservierungen werden Name, Telefonnummer und E-Mail ausschließlich zur Terminkoordination gespeichert.</p>
        <h4>2. Deine Rechte</h4>
        <p>Dir stehen bezüglich deiner bei uns gespeicherten Daten die Rechte auf Auskunft, Berichtigung, Löschung und Einschränkung zu. Kontaktiere uns dazu unter servus@bolzwerk-club.at.</p>
      `);
    });
  }

  if (openAgb) {
    openAgb.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('AGB & Hausordnung', `
        <h4>1. Spielberechtigung & Schuhwerk</h4>
        <p>Das Betreten der Kunstrasen-Käfige ist ausschließlich mit flachen Turnschuhen, Hallenschuhen oder normalen Sneakern gestattet. Stollen- und Nockenschuhe sind zum Schutz der Radartechnik und Böden verboten.</p>
        <h4>2. Stornierung</h4>
        <p>Termine können bis 24 Stunden vor Spielbeginn kostenlos storniert oder verschoben werden.</p>
      `);
    });
  }
}

/* ==========================================================================
   8. Web Audio API Procedural Synthesizer (Zero External MP3s Needed)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSynthesizer() {
  const soundToggle = document.getElementById('soundToggle');
  if (!soundToggle) return;

  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const label = soundToggle.querySelector('.sound-label');
    const icon = soundToggle.querySelector('.sound-icon');
    if (label && icon) {
      if (soundEnabled) {
        label.textContent = 'Audio';
        icon.textContent = '🔊';
        playClickSound();
      } else {
        label.textContent = 'Stumm';
        icon.textContent = '🔇';
      }
    }
  });
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playKickSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency drops rapidly like a thumping kick on a football
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.19);
  } catch (e) {
    // Graceful fallback
  }
}

function playClickSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch (e) {}
}

function playWhistleSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.setValueAtTime(2800, ctx.currentTime + 0.06);
    osc.frequency.setValueAtTime(2600, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  } catch (e) {}
}
