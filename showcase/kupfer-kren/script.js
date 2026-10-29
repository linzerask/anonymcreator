/**
 * KUPFER & KREN — Alpine Tapas & Sharing Bar Wien
 * Master JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. MOBILE DRAWER WITH ACCESSIBILITY & BODY OVERFLOW LOCK
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('active');
    drawerBackdrop.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ==========================================================================
     2. PROCEDURAL AMBIENT BAR VINYL (WEB AUDIO API - NO EXTERNAL MP3 NEEDED)
     ========================================================================== */
  const soundToggle = document.getElementById('soundToggle');
  const soundIconOn = document.getElementById('soundIconOn');
  const soundIconOff = document.getElementById('soundIconOff');
  let audioCtx = null;
  let isPlaying = false;
  let noiseNode = null;
  let gainNode = null;

  function initVinylAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Procedural warm vinyl crackle + subtle warm low-pass room drone
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Pink noise formula + random vinyl ticks
      const white = Math.random() * 2 - 1;
      const isTick = Math.random() < 0.0008;
      output[i] = (white * 0.05) + (isTick ? (Math.random() > 0.5 ? 0.4 : -0.4) : 0);
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    // Filter to warm vinyl frequencies
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseNode.start();
  }

  function stopVinylAudio() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (noiseNode) {
          try { noiseNode.stop(); } catch(e) {}
        }
      }, 500);
    }
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (!isPlaying) {
        initVinylAudio();
        isPlaying = true;
        soundIconOn.style.display = 'inline-block';
        soundIconOff.style.display = 'none';
        soundToggle.style.borderColor = 'var(--c-copper)';
        soundToggle.style.color = 'var(--c-copper-light)';
      } else {
        stopVinylAudio();
        isPlaying = false;
        soundIconOn.style.display = 'none';
        soundIconOff.style.display = 'inline-block';
        soundToggle.style.borderColor = 'rgba(247, 244, 235, 0.2)';
        soundToggle.style.color = 'var(--c-cream)';
      }
    });
  }

  /* ==========================================================================
     3. INTERACTIVE SCHMANKERL-BAUKASTEN (TÒPAS RE-ENGINEERED)
     ========================================================================== */
  const stepButtons = document.querySelectorAll('.step-btn');
  const stepPanels = document.querySelectorAll('.step-panel');
  const previewTitle = document.getElementById('previewTitle');
  const previewBreakdown = document.getElementById('previewBreakdown');
  const previewPairing = document.getElementById('previewPairing');
  const previewPrice = document.getElementById('previewPrice');

  const combinations = {
    'sauerteig': { name: 'Waldviertler Sauerteigbrot', price: 1.50 },
    'roesti': { name: 'Knuspriger Erdäpfel-Rösti', price: 1.80 },
    'polenta': { name: 'Kräuter-Polenta-Cracker', price: 1.60 },

    'saibling': { name: 'Gebeizter Saibling', price: 2.80, pairing: 'Grüner Veltliner Smaragd (Wachau) oder Zirben-Spritz' },
    'ochse': { name: '14-Std. Ochsenbrust', price: 3.20, pairing: 'Blaufränkisch Reserve (Mittelburgenland) oder Freistädter Bio-Zwickl' },
    'kuerbis': { name: 'Ofenkürbis & Bio-Ziegenkäse', price: 2.40, pairing: 'Sauvignon Blanc (Südsteiermark) oder hausgemachter Holunder-Spritz' },

    'kren': { name: 'Frisch gerissener Kren', price: 0.60, titleSuffix: 'mit Steirischem Kren' },
    'pesto': { name: 'Kürbiskern-Pesto', price: 0.80, titleSuffix: 'mit Kernöl-Pesto' },
    'preiselbeer': { name: 'Preiselbeer-Lack', price: 0.70, titleSuffix: 'mit Preiselbeer-Pfeffer' }
  };

  // Switch builder tabs
  stepButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.getAttribute('data-step');
      stepButtons.forEach(b => b.classList.remove('active'));
      stepPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`stepPanel${step}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Handle radio select
  const allRadios = document.querySelectorAll('.option-card input');
  function updateSchmankerlPreview() {
    const selectedBase = document.querySelector('input[name="base"]:checked')?.value || 'sauerteig';
    const selectedTopping = document.querySelector('input[name="topping"]:checked')?.value || 'saibling';
    const selectedFinish = document.querySelector('input[name="finish"]:checked')?.value || 'kren';

    // Update active label styles
    document.querySelectorAll('.option-card').forEach(c => {
      const inp = c.querySelector('input');
      if (inp && inp.checked) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    const b = combinations[selectedBase];
    const t = combinations[selectedTopping];
    const f = combinations[selectedFinish];

    let title = '';
    if (selectedTopping === 'saibling') title = 'Der Steirische Saibling-Gupf';
    else if (selectedTopping === 'ochse') title = 'Der Geschmorte Ochsen-Gupf';
    else title = 'Der Almenland Kürbis-Bissen';

    title += ` ${f.titleSuffix}`;

    const total = b.price + t.price + f.price;

    if (previewTitle) previewTitle.textContent = title;
    if (previewBreakdown) previewBreakdown.textContent = `${b.name} + ${t.name} + ${f.name}`;
    if (previewPairing) previewPairing.innerHTML = `<strong>${t.pairing}</strong>`;
    if (previewPrice) previewPrice.textContent = `${total.toFixed(2).replace('.', ',')} €`;
  }

  allRadios.forEach(r => {
    r.addEventListener('change', updateSchmankerlPreview);
  });
  updateSchmankerlPreview();

  /* ==========================================================================
     4. TASTE LIST (STICKY WISHLIST / ROUND CALCULATOR)
     ========================================================================== */
  let tasteCount = 0;
  let tasteTotalVal = 0.0;
  const tasteCountEl = document.getElementById('tasteCount');
  const tasteTotalEl = document.getElementById('tasteTotal');
  const btnAddTaste = document.getElementById('btnAddTaste');

  function addTasteItem(name, price) {
    tasteCount++;
    tasteTotalVal += price;
    if (tasteCountEl) tasteCountEl.textContent = `${tasteCount} Schmankerl`;
    if (tasteTotalEl) tasteTotalEl.textContent = `${tasteTotalVal.toFixed(2).replace('.', ',')} €`;

    // Visual button bounce
    const listBar = document.getElementById('tasteListBar');
    if (listBar) {
      listBar.style.transform = 'scale(1.02)';
      listBar.style.borderColor = 'var(--c-gold)';
      setTimeout(() => {
        listBar.style.transform = '';
        listBar.style.borderColor = 'var(--c-copper)';
      }, 300);
    }
  }

  if (btnAddTaste) {
    btnAddTaste.addEventListener('click', () => {
      const priceText = previewPrice.textContent.replace('€', '').trim().replace(',', '.');
      const price = parseFloat(priceText) || 5.20;
      addTasteItem(previewTitle.textContent, price);
      btnAddTaste.textContent = 'Gemerkt! ✓';
      setTimeout(() => {
        btnAddTaste.textContent = 'Auf Kostprobe-Liste Merken';
      }, 1500);
    });
  }

  document.querySelectorAll('.btn-card-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-item') || 'Schmankerl';
      const price = parseFloat(btn.getAttribute('data-price')) || 5.0;
      addTasteItem(name, price);
      const originalText = btn.textContent;
      btn.textContent = 'Gemerkt! ✓';
      btn.style.backgroundColor = 'var(--c-copper)';
      btn.style.color = 'var(--c-cream)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 1200);
    });
  });

  /* ==========================================================================
     5. MENU FILTER TABS
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const menuCards = document.querySelectorAll('.menu-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      menuCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  /* ==========================================================================
     6. RESERVATION MODAL LOGIC
     ========================================================================== */
  const reserveModal = document.getElementById('reserveModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const reserveForm = document.getElementById('reserveForm');
  const modalSuccess = document.getElementById('modalSuccess');
  const successSummaryText = document.getElementById('successSummaryText');
  const btnSuccessClose = document.getElementById('btnSuccessClose');

  const triggerButtons = [
    document.getElementById('btnOpenReserve'),
    document.getElementById('btnHeroReserve'),
    document.getElementById('btnDrawerReserve'),
    document.getElementById('btnTasteToReserve'),
    document.getElementById('btnVisitReserve')
  ].filter(Boolean);

  function openModal() {
    reserveModal.classList.add('active');
    reserveModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Set minimum date to today
    const resDateInput = document.getElementById('resDate');
    if (resDateInput && !resDateInput.value) {
      const today = new Date().toISOString().split('T')[0];
      resDateInput.min = today;
      resDateInput.value = today;
    }
  }

  function closeModal() {
    reserveModal.classList.remove('active');
    reserveModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Reset state after transition
    setTimeout(() => {
      if (reserveForm) reserveForm.style.display = 'flex';
      if (modalSuccess) modalSuccess.style.display = 'none';
    }, 400);
  }

  triggerButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (btnSuccessClose) btnSuccessClose.addEventListener('click', closeModal);

  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('resName').value || 'Gast';
      const guests = document.getElementById('resGuests').value || '4';
      const time = document.getElementById('resTime').value || '19:30';
      const date = document.getElementById('resDate').value;
      const area = document.getElementById('resArea').value;

      let areaText = 'in der Kupfer-Stube';
      if (area === 'schanigarten') areaText = 'im Schanigarten unter den Kastanien';
      else if (area === 'bar') areaText = 'am Kupfertresen';

      let formattedDate = date;
      try {
        const d = new Date(date);
        formattedDate = d.toLocaleDateString('de-AT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
      } catch(err) {}

      if (successSummaryText) {
        successSummaryText.innerHTML = `Servus <strong>${name}</strong>!<br>Dein Tisch für <strong>${guests} Personen</strong> ist für <strong>${formattedDate} um ${time} Uhr</strong> (${areaText}) vorgemerkt. Wir halten den Tisch 15 Minuten für euch frei.`;
      }

      reserveForm.style.display = 'none';
      modalSuccess.style.display = 'block';
    });
  }

  /* ==========================================================================
     7. LEGAL NOTICE MODAL (IMPRESSUM & DATENSCHUTZ AUSTRIAN COMPLIANCE)
     ========================================================================== */
  const legalModal = document.getElementById('legalModal');
  const legalBackdrop = document.getElementById('legalBackdrop');
  const legalClose = document.getElementById('legalClose');
  const legalBody = document.getElementById('legalBody');

  const linkImpressum = document.getElementById('linkImpressum');
  const linkDatenschutz = document.getElementById('linkDatenschutz');
  const linkAllergene = document.getElementById('linkAllergene');

  function openLegalModal(htmlContent) {
    legalBody.innerHTML = htmlContent;
    legalModal.classList.add('active');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLegalModal() {
    legalModal.classList.remove('active');
    legalModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (legalClose) legalClose.addEventListener('click', closeLegalModal);
  if (legalBackdrop) legalBackdrop.addEventListener('click', closeLegalModal);

  if (linkImpressum) {
    linkImpressum.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal(`
        <span class="modal-eyebrow">RECHTLICHE ANGABEN</span>
        <h3 class="modal-title">IMPRESSUM</h3>
        <p style="margin-bottom:1rem;font-size:0.95rem;line-height:1.6;">
          <strong>Kupfer &amp; Kren Gastronomie GmbH</strong><br>
          Neubaugasse 42, 1070 Wien, Österreich<br>
          Telefon: +43 (0) 1 522 88 34<br>
          E-Mail: servus@kupferundkren.at<br>
          Web: https://anonymcreator.online/showcase/kupfer-kren/
        </p>
        <p style="margin-bottom:1rem;font-size:0.9rem;line-height:1.6;color:#8A929A;">
          Firmenbuchnummer: FN 612849 x<br>
          Firmenbuchgericht: Handelsgericht Wien<br>
          UID-Nummer: ATU79482915<br>
          Kammerzugehörigkeit: Wirtschaftskammer Wien, Fachgruppe Gastronomie &amp; Bar<br>
          Aufsichtsbehörde: Magistratisches Bezirksamt des 7. Bezirkes<br>
          Gewerbeordnung: www.ris.bka.gv.at
        </p>
      `);
    });
  }

  if (linkDatenschutz) {
    linkDatenschutz.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal(`
        <span class="modal-eyebrow">DATENSCHUTZINFORMATION</span>
        <h3 class="modal-title">DATENSCHUTZ (DSGVO)</h3>
        <p style="margin-bottom:1rem;font-size:0.95rem;line-height:1.6;">
          Wir verarbeiten personenbezogene Daten (Name, Telefonnummer, E-Mail-Adresse) ausschließlich zur Bearbeitung und Abwicklung deiner Tischreservierung gemäß Art. 6 Abs. 1 lit. b DSGVO.
        </p>
        <p style="margin-bottom:1rem;font-size:0.9rem;line-height:1.6;color:#8A929A;">
          Es erfolgt keine Weitergabe an unberechtigte Dritte. Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner gespeicherten Daten.
        </p>
      `);
    });
  }

  if (linkAllergene) {
    linkAllergene.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal(`
        <span class="modal-eyebrow">INFORMATION GEMÄSS LMIV</span>
        <h3 class="modal-title">ALLERGEN-KENNZEICHNUNG</h3>
        <p style="margin-bottom:1rem;font-size:0.95rem;line-height:1.6;">
          Unsere Schauküche verarbeitet regionale österreichische Rohstoffe. Bitte informiere unser Servicepersonal bei schweren Allergien vor der Bestellung.
        </p>
        <div style="font-size:0.85rem;line-height:1.7;color:#D8D2C2;">
          <strong>A</strong> Glutenhaltiges Getreide (Sauerteigbrot) • 
          <strong>B</strong> Krebstiere • 
          <strong>C</strong> Ei • 
          <strong>D</strong> Fisch (Saibling) • 
          <strong>E</strong> Erdnuss • 
          <strong>F</strong> Soja • 
          <strong>G</strong> Milch/Laktose (Ziegenkäse, Butterschmalz) • 
          <strong>H</strong> Schalenfrüchte • 
          <strong>L</strong> Sellerie • 
          <strong>M</strong> Senf • 
          <strong>N</strong> Sesamsamen • 
          <strong>O</strong> Schwefeldioxid/Sulfite (Naturweine) • 
          <strong>P</strong> Lupinen • 
          <strong>R</strong> Weichtiere
        </div>
      `);
    });
  }

  // Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLegalModal();
      closeDrawer();
    }
  });

});
