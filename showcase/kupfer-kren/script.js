/**
 * KUPFER & KREN — Alpine Tapas & Bar Wien
 * Master JavaScript Architecture (Reverse-Engineered from TÒPAS bar-topas.ch)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. MOBILE DRAWER TOGGLE WITH BODY OVERFLOW LOCK
     ========================================================================== */
  const burgerToggle = document.getElementById('burgerToggle');
  const drawerClose = document.getElementById('drawerClose');
  const drawerMenu = document.getElementById('drawerMenu');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerItems = document.querySelectorAll('.drawer-item');

  function openDrawer() {
    drawerMenu.classList.add('is-active');
    drawerOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawerMenu.classList.remove('is-active');
    drawerOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (burgerToggle) burgerToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  drawerItems.forEach(item => item.addEventListener('click', closeDrawer));

  /* ==========================================================================
     2. S-BUILD STEP HIGHLIGHT & DISH MORPHING
     ========================================================================== */
  const buildSteps = document.querySelectorAll('.s-build__step');
  const buildDishImg = document.querySelector('.build-dish-img');
  const buildDishBadgeSpan = document.querySelector('.build-dish-badge span');
  const buildDishBadgeStrong = document.querySelector('.build-dish-badge strong');

  const buildData = [
    { name: 'DAS SAUERTEIGBROT', price: '2,20 €', img: 'assets/bruschetta.jpg' },
    { name: 'ALTAUSSEER SAIBLING', price: '5,80 €', img: 'assets/tapas_board.jpg' },
    { name: 'ALMENLAND-BRIE GESCHMOLZEN', price: '4,90 €', img: 'assets/tapas_beef.jpg' },
    { name: 'FRISCHER WURZELKREN', price: '1,20 €', img: 'assets/bruschetta.jpg' },
    { name: 'KÜRBISKERNÖL & SALZ', price: '5,40 €', img: 'assets/tapas_board.jpg' }
  ];

  buildSteps.forEach((step, idx) => {
    step.addEventListener('click', () => {
      buildSteps.forEach(s => s.classList.remove('is-active'));
      step.classList.add('is-active');

      if (buildData[idx]) {
        if (buildDishImg) buildDishImg.src = buildData[idx].img;
        if (buildDishBadgeSpan) buildDishBadgeSpan.textContent = buildData[idx].name;
        if (buildDishBadgeStrong) buildDishBadgeStrong.textContent = buildData[idx].price;
      }
    });
  });

  /* ==========================================================================
     3. S-GALLERY TAB SWITCHING ("MUCHO DÉLICIEUSE")
     ========================================================================== */
  const galleryTabs = document.querySelectorAll('.s-gallery__tab');
  const galleryMainImg = document.getElementById('galleryMainImg');
  const galleryTitle = document.getElementById('galleryTitle');
  const galleryDesc = document.getElementById('galleryDesc');
  const galleryPrice = document.getElementById('galleryPrice');

  const galleryItems = [
    {
      title: '01 Alpenrind-Carpaccio & Kren',
      desc: 'Hauchdünnes heimisches Weiderind, eingelegte Rote Rüben, steirischer Wurzelkren und Mohnöl.',
      price: '6,80 €',
      img: 'assets/tapas_beef.jpg'
    },
    {
      title: '02 Saibling-Brettl zum Teilen',
      desc: 'Drei saisonale Brote: Gebeizter Saibling, geräucherte Hirschbirne mit Speck und Almenland-Brie.',
      price: '12,50 €',
      img: 'assets/tapas_board.jpg'
    },
    {
      title: '03 Kupfer-Bruschetta mit Kürbis',
      desc: 'In Butterschmalz geröstetes Sauerteigbrot mit Hokkaidokürbis, Ziegenfrischkäse und Bergsalbei.',
      price: '5,20 €',
      img: 'assets/bruschetta.jpg'
    },
    {
      title: '04 Mini-Pfandl Kaiserschmarrn',
      desc: 'Frisch karamellisiert mit hausgemachtem Zwetschkenröster und Bourbon-Vanille-Staub.',
      price: '6,40 €',
      img: 'assets/kaiserschmarrn.jpg'
    },
    {
      title: '05 Zirben-Mule im Kupferbecher',
      desc: 'Tiroler Zirbengeist, scharfes Ginger Beer, frischer Limettensaft und Rosmarinzweig.',
      price: '11,50 €',
      img: 'assets/cocktail_bar.jpg'
    },
    {
      title: '06 Kren-Spritzer & Natur-Veltliner',
      desc: 'Grüner Veltliner unfiltriert aus der Wachau, prickelndes Soda und ein Hauch frischer Kren.',
      price: '4,90 €',
      img: 'assets/spritz_wein.jpg'
    }
  ];

  galleryTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const data = galleryItems[index];
      if (data) {
        galleryMainImg.style.opacity = '0.4';
        setTimeout(() => {
          galleryMainImg.src = data.img;
          galleryTitle.textContent = data.title;
          galleryDesc.textContent = data.desc;
          galleryPrice.textContent = data.price;
          galleryMainImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  /* ==========================================================================
     4. RESERVATION MODAL
     ========================================================================== */
  const reserveModal = document.getElementById('reserveModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const reserveForm = document.getElementById('reserveForm');
  const modalSuccess = document.getElementById('modalSuccess');
  const successSummary = document.getElementById('successSummary');
  const btnSuccessOk = document.getElementById('btnSuccessOk');

  const triggerButtons = [
    document.getElementById('btnOpenReserve'),
    document.getElementById('btnDrawerReserve'),
    document.getElementById('btnGalleryReserve'),
    document.getElementById('btnNamesReserve'),
    document.getElementById('btnVisitReserve')
  ].filter(Boolean);

  function openReservationModal() {
    reserveModal.classList.add('is-active');
    reserveModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const resDate = document.getElementById('resDate');
    if (resDate && !resDate.value) {
      const today = new Date().toISOString().split('T')[0];
      resDate.min = today;
      resDate.value = today;
    }
  }

  function closeReservationModal() {
    reserveModal.classList.remove('is-active');
    reserveModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (reserveForm) reserveForm.style.display = 'flex';
      if (modalSuccess) modalSuccess.style.display = 'none';
    }, 300);
  }

  triggerButtons.forEach(btn => btn.addEventListener('click', openReservationModal));
  if (modalClose) modalClose.addEventListener('click', closeReservationModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeReservationModal);
  if (btnSuccessOk) btnSuccessOk.addEventListener('click', closeReservationModal);

  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('resName').value || 'Gast';
      const guests = document.getElementById('resGuests').value || '4';
      const time = document.getElementById('resTime').value || '19:30';
      const date = document.getElementById('resDate').value;

      let formattedDate = date;
      try {
        const d = new Date(date);
        formattedDate = d.toLocaleDateString('de-AT', { weekday: 'long', day: '2-digit', month: 'long' });
      } catch (err) {}

      if (successSummary) {
        successSummary.innerHTML = `Servus <strong>${name}</strong>!<br>Dein Tisch für <strong>${guests} Personen</strong> am <strong>${formattedDate} um ${time} Uhr</strong> ist reserviert. Eine Bestätigung wurde versendet.`;
      }

      reserveForm.style.display = 'none';
      modalSuccess.style.display = 'block';
    });
  }

  /* ==========================================================================
     5. LEGAL NOTICE MODAL (IMPRESSUM & DATENSCHUTZ AT)
     ========================================================================== */
  const legalModal = document.getElementById('legalModal');
  const legalBackdrop = document.getElementById('legalBackdrop');
  const legalClose = document.getElementById('legalClose');
  const legalContent = document.getElementById('legalContent');
  const linkImpressum = document.getElementById('linkImpressum');
  const linkDatenschutz = document.getElementById('linkDatenschutz');

  function openLegal(html) {
    legalContent.innerHTML = html;
    legalModal.classList.add('is-active');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLegal() {
    legalModal.classList.remove('is-active');
    legalModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (legalClose) legalClose.addEventListener('click', closeLegal);
  if (legalBackdrop) legalBackdrop.addEventListener('click', closeLegal);

  if (linkImpressum) {
    linkImpressum.addEventListener('click', (e) => {
      e.preventDefault();
      openLegal(`
        <span class="modal__tag">RECHTLICHE INFORMATION</span>
        <h3 class="modal__title">IMPRESSUM (§ 5 ECG)</h3>
        <p style="margin-bottom:1rem;line-height:1.6;">
          <strong>Kupfer &amp; Kren Gastronomie GmbH</strong><br>
          Neubaugasse 42, 1070 Wien, Österreich<br>
          Telefon: +43 (0) 1 522 88 34<br>
          E-Mail: servus@kupferundkren.at
        </p>
        <p style="font-size:0.9rem;line-height:1.6;color:var(--brun);">
          Firmenbuchnummer: FN 612849 x<br>
          Firmenbuchgericht: Handelsgericht Wien<br>
          Kammer: Wirtschaftskammer Wien, Fachgruppe Gastronomie<br>
          Aufsichtsbehörde: Magistratisches Bezirksamt 7. Bezirk
        </p>
      `);
    });
  }

  if (linkDatenschutz) {
    linkDatenschutz.addEventListener('click', (e) => {
      e.preventDefault();
      openLegal(`
        <span class="modal__tag">DATENSCHUTZ</span>
        <h3 class="modal__title">DATENSCHUTZ (DSGVO)</h3>
        <p style="margin-bottom:1rem;line-height:1.6;">
          Wir verarbeiten deine Daten (Name, Telefon, E-Mail) ausschließlich für die Tischreservierung gemäß Art. 6 Abs. 1 lit. b DSGVO. Keine unberechtigte Weitergabe an Dritte.
        </p>
      `);
    });
  }

  // Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeReservationModal();
      closeLegal();
      closeDrawer();
    }
  });

});
